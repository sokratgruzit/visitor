import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNotificationStore } from "../../store/notificationStore";
import { getMyAnimations, createAnimation, updateAnimation, deleteAnimation } from "../../api/animations";
import { makePayment } from "../../api/payment";
import { useNavigate } from "react-router-dom";
import type { AnimationMeta, PaymentResponse } from "../../types";

import Button from "../ui/button/Button";
import { Svg } from "../svgs/Svg.module";

import styles from "./MyAnimations.module.css";

export const MyAnimations: React.FC = () => {
    const [animations, setAnimations] = useState<AnimationMeta[]>([]);
    const [newName, setNewName] = useState("");
    const [newFile, setNewFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });
    const [editModal, setEditModal] = useState<{ open: boolean; anim: AnimationMeta | null }>({ open: false, anim: null });
    const [editName, setEditName] = useState("");
    const [editFile, setEditFile] = useState<File | null>(null);
    const [editPreview, setEditPreview] = useState<string | null>(null);

    const notify = useNotificationStore((state) => state.showNotification);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAnimations = async () => {
            try {
                const res = await getMyAnimations();
                if (!res.success) {
                    notify({ type: "error", message: res.message || "Не удалось загрузить анимации" });
                    return;
                }

                let filtered = res?.animations?.filter((a: any) => a.userId !== null);

                setAnimations(filtered || []);
            } catch {
                notify({ type: "error", message: "Сетевая ошибка при загрузке анимаций" });
            }
        };

        fetchAnimations();
    }, []);

    const handlePayment = async (targetId: number) => {
        setLoading(true);
        const res: PaymentResponse = await makePayment({ product: "animation", amount: 500, targetId });
        if (res.success && res.confirmationUrl) {
            window.location.href = res.confirmationUrl;
        } else {
            notify({ type: "error", message: res.message || "Не удалось создать платёж" });
        }
        setLoading(false);
    };

    const handleFileChange = (file: File | null, setPreview: (s: string | null) => void, setFile: (f: File | null) => void) => {
        setFile(file);
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    };

    const handleAddAnimation = async () => {
        if (!newName) return notify({ type: "error", message: "Название обязательно" });
        if (!newFile) return notify({ type: "error", message: "Файл обязателен" });

        setLoading(true);
        try {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64 = reader.result as string;
                const res = await createAnimation({ name: newName, fileBase64: base64 });

                if (res.success) {
                    setAnimations([res.animation, ...animations]);
                    setNewName("");
                    setNewFile(null);
                    setPreviewUrl(null);
                    notify({ type: "success", message: "Анимация создана" });
                } else {
                    notify({ type: "error", message: res.message || "Ошибка создания анимации" });
                }
                setLoading(false);
            };
            reader.readAsDataURL(newFile);
        } catch {
            notify({ type: "error", message: "Ошибка при создании анимации" });
            setLoading(false);
        }
    };

    const confirmDelete = async () => {
        if (!deleteModal.id) return;
        setLoading(true);
        try {
            const res = await deleteAnimation(deleteModal.id);
            if (res.success) {
                setAnimations((prev) => prev.filter((a) => a.id !== deleteModal.id));
                notify({ type: "success", message: "Анимация удалена" });
            } else {
                notify({ type: "error", message: res.message || "Ошибка удаления" });
            }
        } finally {
            setLoading(false);
            setDeleteModal({ open: false, id: null });
        }
    };

    const openEdit = (anim: AnimationMeta) => {
        setEditModal({ open: true, anim });
        setEditName(anim.name);
        setEditFile(null);
        setEditPreview(anim.fileUrl || null);
    };

    const confirmEdit = async () => {
        if (!editModal.anim) return;
        if (!editName) return notify({ type: "error", message: "Название обязательно" });

        setLoading(true);
        let fileBase64: string | undefined;
        if (editFile) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                fileBase64 = reader.result as string;
                await sendUpdate(fileBase64);
            };
            reader.readAsDataURL(editFile);
        } else {
            await sendUpdate();
        }
    };

    const sendUpdate = async (fileBase64?: string) => {
        if (!editModal.anim) return;
        const res = await updateAnimation(editModal.anim.id, { name: editName, fileBase64 });
        if (res.success) {
            setAnimations((prev) => prev.map((a) => (a.id === res.animation.id ? res.animation : a)));
            notify({ type: "success", message: "Анимация обновлена" });
        } else {
            notify({ type: "error", message: res.message || "Ошибка обновления" });
        }
        setLoading(false);
        setEditModal({ open: false, anim: null });
    };

    return (
        <div className={styles.container}>
            <h2>Сделать запрос на новую анимацию:</h2>

            <div className={styles.addAnimationForm}>
                <input
                    type="text"
                    placeholder="Название анимации"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="input"
                    style={{ width: "calc(100% - 120px)" }}
                />
                <div className={styles.customFileWrapper}>
                    <Svg svgName="Image" size={{ xs: 30, sm: 30, md: 30, lg: 30 }} color="#FFFFFF" />
                    <input
                        type="file"
                        accept="image/png, image/jpeg"
                        onChange={(e) => handleFileChange(e.target.files?.[0] || null, setPreviewUrl, setNewFile)}
                        className={styles.customFileInput}
                    />
                </div>
                <div style={{ height: 50, width: 50 }}>
                    <Button
                        icon={<Svg svgName="Save" size={{ xs: 30, sm: 30, md: 30, lg: 30 }} color="#FFFFFF" />}
                        onClick={handleAddAnimation}
                        size="flex"
                        delay={1}
                        limiter={window.innerWidth <= 768}
                        color="#FFFFFF"
                        btnColor="#63C5AB"
                        fontSize="1rem"
                        disabled={loading}
                    />
                </div>
            </div>

            {previewUrl && (
                <motion.img transition={{ duration: 1 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} src={previewUrl} alt="Превью" className={styles.previewImage} />
            )}

            <h2>Мои анимации:</h2>
            {animations.length === 0 ? (
                <p className={styles.noAnimations}>Анимации отсутствуют</p>
            ) : (
                <div className={styles.animationsGrid}>
                    {animations.map((a) => (
                        <div key={a.id} className={styles.animationCard}>
                            <p>ИД: {a.id}</p>
                            <p>Название анимации: {a.name}</p>
                            <p>Статус: <span className={styles[a.status]}>{a.status}</span></p>
                            <div className={styles.btns}>
                                {a.status === "moderation" && (
                                    <>
                                        <div style={{ height: 40, width: 40 }}>
                                            <Button icon={<Svg svgName="Edit" size={{ xs: 30, sm: 30, md: 30, lg: 30 }} color="#FFFFFF" />} onClick={() => openEdit(a)} size="flex" delay={1} limiter={window.innerWidth <= 768} color="#FFFFFF" btnColor="#63C5AB" fontSize="1rem" disabled={loading} />
                                        </div>
                                        <div style={{ height: 40, width: 40 }}>
                                            <Button icon={<Svg svgName="Delete" size={{ xs: 30, sm: 30, md: 30, lg: 30 }} color="#FFFFFF" />} onClick={() => setDeleteModal({ open: true, id: a.id })} size="flex" delay={1} limiter={window.innerWidth <= 768} color="#FFFFFF" btnColor="#f87575" fontSize="1rem" disabled={loading} />
                                        </div>
                                    </>
                                )}
                                {a.status === "draft" && (
                                    <div style={{ height: 40, width: 40 }}>
                                        <Button onClick={() => handlePayment(a.id)} icon={<Svg svgName="Money" size={{ xs: 30, sm: 30, md: 30, lg: 30 }} color="#FFFFFF" />} size="flex" delay={1} limiter={window.innerWidth <= 768} color="#FFFFFF" btnColor="#638cc5" fontSize="1rem" disabled={loading} />
                                    </div>
                                )}
                                {a.status === "production" && (
                                    <div style={{ height: 40, width: 40 }}>
                                        <Button icon={<Svg svgName="Preview" size={{ xs: 30, sm: 30, md: 30, lg: 30 }} color="#FFFFFF" />} onClick={() => navigate(`/animation/${a.id}`)} size="flex" delay={1} limiter={window.innerWidth <= 768} color="#FFFFFF" btnColor="#63C5AB" fontSize="1rem" disabled={loading} />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {deleteModal.open && (
                <div className={styles.deleteConfirm}>
                    <div className={styles.deletePopup}>
                        <p>Удалить анимацию?</p>
                        <div className={styles.confirmActions}>
                            <div style={{ height: 50, width: 50 }}>
                                <Button icon={<Svg svgName="Check" size={{ xs: 30, sm: 30, md: 30, lg: 30 }} color="#FFFFFF" />} onClick={confirmDelete} size="flex" delay={1} limiter={window.innerWidth <= 768} color="#FFFFFF" btnColor="#63C5AB" fontSize="1rem" />
                            </div>
                            <div style={{ height: 50, width: 50 }}>
                                <Button icon={<Svg svgName="Cancel" size={{ xs: 30, sm: 30, md: 30, lg: 30 }} color="#FFFFFF" />} onClick={() => setDeleteModal({ open: false, id: null })} size="flex" delay={1} limiter={window.innerWidth <= 768} color="#FFFFFF" btnColor="#000" fontSize="1rem" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {editModal.open && (
                <div className={styles.deleteConfirm}>
                    <div className={styles.deletePopup}>
                        <p>Редактирование анимации</p>
                        <input type="text" className="input" value={editName} onChange={(e) => setEditName(e.target.value)} style={{ marginBottom: 10 }} />
                        {editPreview && <img src={editPreview} alt="preview" className={styles.previewImage} />}
                        <div className={styles.confirmActions}>
                            <div className={styles.customFileWrapper}>
                                <Svg svgName="Image" size={{ xs: 30, sm: 30, md: 30, lg: 30 }} color="#FFFFFF" />
                                <input
                                    type="file"
                                    accept="image/png, image/jpeg"
                                    onChange={(e) => handleFileChange(e.target.files?.[0] || null, setEditPreview, setEditFile)}
                                    className={styles.customFileInput}
                                />
                            </div>
                            <div style={{ height: 50, width: 50 }}>
                                <Button icon={<Svg svgName="Check" size={{ xs: 30, sm: 30, md: 30, lg: 30 }} color="#FFFFFF" />} onClick={confirmEdit} size="flex" delay={1} limiter={window.innerWidth <= 768} color="#FFFFFF" btnColor="#63C5AB" fontSize="1rem" />
                            </div>
                            <div style={{ height: 50, width: 50 }}>
                                <Button icon={<Svg svgName="Cancel" size={{ xs: 30, sm: 30, md: 30, lg: 30 }} color="#FFFFFF" />} onClick={() => setEditModal({ open: false, anim: null })} size="flex" delay={1} limiter={window.innerWidth <= 768} color="#FFFFFF" btnColor="#000" fontSize="1rem" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
