import React, { useState, useEffect } from "react";
import { getVotings, createVoting, updateVoting, deleteVoting } from "../../api/voting";
import { makePayment } from "../../api/payment";
import { useNotificationStore } from "../../store/notificationStore";
import { useAuthStore } from "../../store/useAuthStore";
import type { Voting, VotingResponse } from "../../types";
import { Tabs } from "../ui/tabs/Tabs";
import Button from "../ui/button/Button";
import { Svg } from "../svgs/Svg.module";
import styles from "./VotingManager.module.css";

export const VotingManager: React.FC = () => {
    const [tab, setTab] = useState<string>("my");
    const [votings, setVotings] = useState<Voting[]>([]);
    const [loading, setLoading] = useState(false);
    const [newVoting, setNewVoting] = useState({ title: "", description: "" });
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingData, setEditingData] = useState({ title: "", description: "" });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
    const [infoModal, setInfoModal] = useState<{ open: boolean; text: string }>({ open: false, text: "" });
    const [voteModal, setVoteModal] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });
    const [voteAmount, setVoteAmount] = useState<number>(39);

    const notify = useNotificationStore((state) => state.showNotification);
    const { user } = useAuthStore();
    const itemsPerPage = 10;

    const fetchVotings = async (page = 1) => {
        setLoading(true);
        const res: VotingResponse = await getVotings({ page, limit: itemsPerPage, userId: user?.id || undefined });
        if (res.success) {
            const data = tab === "my" ? res.my : res.all;
            if (data) {
                setVotings(data.votings);
                setTotalPages(data.totalPages);
                setCurrentPage(data.currentPage);
            } else {
                setVotings([]);
                setTotalPages(1);
                setCurrentPage(1);
            }
        } else {
            notify({ type: "error", message: res.message || "Не удалось загрузить голосования" });
        }
        setLoading(false);
    };

    useEffect(() => {
        setCurrentPage(1);
        fetchVotings(1);
    }, [tab]);

    const handleCreate = async () => {
        if (!newVoting.title || !newVoting.description) {
            notify({ type: "error", message: "Заполните все поля" });
            return;
        }

        setLoading(true);
        const res = await createVoting({
            title: newVoting.title,
            description: newVoting.description,
            level: 0,
            status: "pending",
            creatorId: user?.id,
        });

        if (res.success) {
            notify({ type: "success", message: "Голосование создано" });
            setNewVoting({ title: "", description: "" });
            fetchVotings(currentPage);
        } else {
            notify({ type: "error", message: res.message || "Ошибка создания голосования" });
        }

        setLoading(false);
    };

    const handleUpdate = async (id: number, data: any) => {
        setLoading(true);
        const res = await updateVoting(id, data);

        if (res.success) {
            notify({ type: "success", message: "Голосование обновлено" });
            setEditingId(null);
            fetchVotings(currentPage);
        } else {
            notify({ type: "error", message: res.message || "Ошибка обновления" });
        }

        setLoading(false);
    };

    const handleDelete = async (id: number) => {
        setDeleteConfirmId(id);
    };

    const confirmDelete = async (id: number) => {
        setLoading(true);
        const res = await deleteVoting(id);
        if (res.success) {
            notify({ type: "success", message: "Голосование удалено" });
            fetchVotings(currentPage);
        } else {
            notify({ type: "error", message: res.message || "Ошибка удаления" });
        }

        setDeleteConfirmId(null);
        setLoading(false);
    };

    const confirmVote = async () => {
        if (!voteModal.id) return;
        setLoading(true);
        const res = await makePayment({ product: "voting", targetId: voteModal.id, amount: voteAmount });
        
        if (res.success && res.confirmationUrl) {
            window.location.href = res.confirmationUrl;
        } else {
            notify({ type: "error", message: res.message || "Ошибка при голосовании" });
        }

        setVoteModal({ open: false, id: null });
        setLoading(false);
    };

    return (
        <div className={styles.container}>
            <Tabs active={tab} onChange={setTab} tabs={[{ key: "my", label: "Мои предложения" }, { key: "all", label: "Все предложения" }]} />

            {tab === "my" && (
                <div className={styles.newVoting}>
                    <input className="input" type="text" placeholder="Название" value={newVoting.title} onChange={(e) => setNewVoting({ ...newVoting, title: e.target.value })} style={{ width: "calc(50% - 31px)" }} />
                    <input className="input" type="text" placeholder="Описание" value={newVoting.description} onChange={(e) => setNewVoting({ ...newVoting, description: e.target.value })} style={{ width: "calc(50% - 31px)" }} />
                    <div style={{ height: 50, width: 50 }}>
                        <Button icon={<Svg svgName="Save" size={{ xs: 30, sm: 30, md: 30, lg: 30 }} color="#FFFFFF" />} onClick={handleCreate} size="flex" delay={1} limiter={window.innerWidth <= 768} color="#FFFFFF" btnColor="#63C5AB" fontSize="1rem" disabled={loading} />
                    </div>
                </div>
            )}

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Название</th>
                            <th>Описание</th>
                            {tab === "all" && <th>Автор</th>}
                            <th>Статус</th>
                            <th>Порог</th>
                            {tab === "all" && <th>Голоса</th>}
                            <th style={{ width: 110 }}>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {votings.length === 0 && (
                            <tr>
                                <td colSpan={5} style={{ textAlign: "center" }}>Нет голосований</td>
                            </tr>
                        )}
                        {votings.map((v) => (
                            <tr key={v.id}>
                                <td>
                                    {editingId === v.id ? (
                                        <input style={{ height: 30 }} className="input" value={editingData.title} onChange={(e) => setEditingData({ ...editingData, title: e.target.value })} />
                                    ) : (
                                        v.title
                                    )}
                                </td>
                                <td>
                                    {editingId === v.id ? (
                                        <input style={{ height: 30 }} className="input" value={editingData.description} onChange={(e) => setEditingData({ ...editingData, description: e.target.value })} />
                                    ) : (
                                        <div style={{ cursor: "pointer" }} onClick={() => setInfoModal({ open: true, text: v.description })}>
                                            <Svg svgName="Info" size={{ xs: 24, sm: 24, md: 24, lg: 24 }} color="#000" />
                                        </div>
                                    )}
                                </td>
                                {tab === "all" && <td>{v.creator.name}</td>}
                                <td className={styles[v.status]}>{v.status}</td>
                                <td>{v.level}</td>
                                {tab === "all" && <td>{v.amount}</td>}
                                <td style={{ display: "flex", gap: 10, width: 110, justifyContent: "flexEnd" }}>
                                    {tab === "my" && v.status === "pending" && (
                                        editingId === v.id ? (
                                            <>
                                                <div style={{ height: 30, width: 30 }}>
                                                    <Button icon={<Svg svgName="Save" size={{ xs: 24, sm: 24, md: 24, lg: 24 }} color="#FFFFFF" />} onClick={() => handleUpdate(v.id, editingData)} size="flex" delay={1} limiter={window.innerWidth <= 768} color="#FFFFFF" btnColor="#63C5AB" fontSize="1rem" />
                                                </div>
                                                <div style={{ height: 30, width: 30 }}>
                                                    <Button icon={<Svg svgName="Cancel" size={{ xs: 24, sm: 24, md: 24, lg: 24 }} color="#FFFFFF" />} onClick={() => setEditingId(null)} size="flex" delay={1} limiter={window.innerWidth <= 768} color="#FFFFFF" btnColor="#ccc" fontSize="1rem" />
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div style={{ height: 30, width: 30 }}>
                                                    <Button icon={<Svg svgName="Edit" size={{ xs: 24, sm: 24, md: 24, lg: 24 }} color="#FFFFFF" />} onClick={() => { setEditingId(v.id); setEditingData({ title: v.title, description: v.description }); }} size="flex" delay={1} limiter={window.innerWidth <= 768} color="#FFFFFF" btnColor="#63C5AB" fontSize="1rem" />
                                                </div>
                                                <div style={{ height: 30, width: 30 }}>
                                                    <Button icon={<Svg svgName="Delete" size={{ xs: 24, sm: 24, md: 24, lg: 24 }} color="#FFFFFF" />} onClick={() => handleDelete(v.id)} size="flex" delay={1} limiter={window.innerWidth <= 768} color="#FFFFFF" btnColor="#E05353" fontSize="1rem" />
                                                </div>
                                            </>
                                        )
                                    )}
                                    {tab === "all" && v.status === "production" && (
                                        <div style={{ height: 30, width: 30 }}>
                                            <Button icon={<Svg svgName="Money" size={{ xs: 24, sm: 24, md: 24, lg: 24 }} color="#FFFFFF" />} onClick={() => setVoteModal({ open: true, id: v.id })} size="flex" delay={1} limiter={window.innerWidth <= 768} color="#FFFFFF" btnColor="#63C5AB" fontSize="1rem" />
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {deleteConfirmId !== null && (
                <div className={styles.deleteConfirm}>
                    <div className={styles.deletePopup}>
                        <p>Вы точно хотите удалить это голосование?</p>
                        <div className={styles.confirmActions}>
                            <div style={{ height: 50, width: 50 }}>
                                <Button icon={<Svg svgName="Delete" size={{ xs: 30, sm: 30, md: 30, lg: 30 }} color="#FFFFFF" />} onClick={() => confirmDelete(deleteConfirmId)} size="flex" delay={1} limiter={window.innerWidth <= 768} color="#FFFFFF" btnColor="#E05353" fontSize="1rem" />
                            </div>
                            <div style={{ height: 50, width: 50 }}>
                                <Button icon={<Svg svgName="Cancel" size={{ xs: 30, sm: 30, md: 30, lg: 30 }} color="#FFFFFF" />} onClick={() => setDeleteConfirmId(null)} size="flex" delay={1} limiter={window.innerWidth <= 768} color="#FFFFFF" btnColor="#ccc" fontSize="1rem" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {infoModal.open && (
                <div className={styles.deleteConfirm}>
                    <div className={styles.deletePopup}>
                        <div style={{ height: 30, width: 30, margin: "0 auto" }}>
                            <Button icon={<Svg svgName="Close" size={{ xs: 30, sm: 30, md: 30, lg: 30 }} color="#FFFFFF" />} onClick={() => setInfoModal({ open: false, text: "" })} size="flex" delay={1} limiter={window.innerWidth <= 768} color="#FFFFFF" btnColor="#000" fontSize="1rem" />
                        </div>
                        <p style={{ marginTop: 16 }}>{infoModal.text}</p>
                    </div>
                </div>
            )}

            {voteModal.open && (
                <div className={styles.deleteConfirm}>
                    <div className={styles.deletePopup}>
                        <p>Введите сумму для голосования</p>
                        <input type="number" className="input" value={voteAmount} onChange={(e) => setVoteAmount(Number(e.target.value))} style={{ marginBottom: 10 }} />
                        <div className={styles.confirmActions}>
                            <div style={{ height: 50, width: 50 }}>
                                <Button icon={<Svg svgName="Check" size={{ xs: 30, sm: 30, md: 30, lg: 30 }} color="#FFFFFF" />} onClick={confirmVote} size="flex" delay={1} limiter={window.innerWidth <= 768} color="#FFFFFF" btnColor="#63C5AB" fontSize="1rem" />
                            </div>
                            <div style={{ height: 50, width: 50 }}>
                                <Button icon={<Svg svgName="Close" size={{ xs: 30, sm: 30, md: 30, lg: 30 }} color="#FFFFFF" />} onClick={() => setVoteModal({ open: false, id: null })} size="flex" delay={1} limiter={window.innerWidth <= 768} color="#FFFFFF" btnColor="#000" fontSize="1rem" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.pagination}>
                <div style={{ height: 30, width: 30 }}>
                    <Button icon={<Svg svgName="ArrowLeft" size={{ xs: 30, sm: 30, md: 30, lg: 30 }} color="#FFFFFF" />} onClick={() => { const prev = currentPage - 1; setCurrentPage(prev); fetchVotings(prev); }} size="flex" delay={1} limiter={window.innerWidth <= 768} color="#FFFFFF" btnColor="#000000" fontSize="1rem" disabled={currentPage === 1} />
                </div>
                <span>Страница {currentPage} из {totalPages}</span>
                <div style={{ height: 30, width: 30 }}>
                    <Button icon={<Svg svgName="ArrowRight" size={{ xs: 30, sm: 30, md: 30, lg: 30 }} color="#FFFFFF" />} onClick={() => { const next = currentPage + 1; setCurrentPage(next); fetchVotings(next); }} size="flex" delay={1} limiter={window.innerWidth <= 768} color="#FFFFFF" btnColor="#000000" fontSize="1rem" disabled={currentPage === totalPages} />
                </div>
            </div>
        </div>
    );
};
