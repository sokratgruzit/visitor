import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useConstructorStore } from "../../../store/constructorStore";
import { useNotificationStore } from "../../../store/notificationStore";
import { useAppStore } from "../../../store/useAppStore";
import { saveLanding, deleteLandingComponent } from "../../../api/constructor";

import { GeneralTab } from "./GeneralTab";
import { AnimationTab } from "./AnimationTab";
import { IconsTab } from "./IconsTab";
import { ImageTab } from "./ImageTab";

import styles from "./ComponentModal.module.css";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	componentId: string;
}

export const ComponentModal = ({ isOpen, onClose, componentId }: Props) => {
    const [saving, setSaving] = useState<boolean>(false);
	const [deleting, setDeleting] = useState<boolean>(false);
	const [leftMode, setLeftMode] = useState<"half" | "full" | null>(null);
	const [topMode, setTopMode] = useState<"half" | "full" | null>(null);
	const [leftPos, setLeftPos] = useState<number>(0);
	const [topPos, setTopPos] = useState<number>(0);
	const [tab, setTab] = useState<string>("general");

	const {
		slug,
		activePoint,
		setActivePoint,
		setSelectedComponentId
	} = useConstructorStore();

	const { setLandingData, landingData } = useAppStore();
    const notify = useNotificationStore((state) => state.showNotification);
	const navigate = useNavigate();
    const location = useLocation();
    const isPreviewPage = location.pathname.startsWith("/preview");

	const component = landingData?.components?.find((c: any) => c.id === componentId) || {};

	const updateComponent = (newData: any) => {
		const updated = landingData?.components?.map((c: any) =>
			c.id === componentId ? { ...c, ...newData } : c
		);

		setLandingData({ ...landingData, components: updated });
	};

	if (!component) return null;

	const handlePreview = () => {
        if (isPreviewPage) {
            navigate("/dashboard/constructor");
			setSelectedComponentId(null);
        } else {
            navigate(`/preview/${slug}`);
        }
	};

    const onSave = async () => {
        setSaving(true);
        try {
            const result = await saveLanding(
                { audio: landingData.audio, introBtn: landingData.introBtn, playMusic: landingData.playMusic, components: landingData.components },
                slug
            );

            if (!result.success) {
                notify({ type: "error", message: result.message || "Ошибка при сохранении" });
            } else {
                notify({ type: "success", message: result.message || "Сохранено" });
                setLandingData({ slug: landingData.slug, audio: landingData.audio, introBtn: landingData.introBtn, playMusic: landingData.playMusic, components: result.data });
            }
        } catch {
            notify({ type: "error", message: "Ошибка при сохранении лендинга" });
        } finally {
            setSaving(false);
        }
    };

	const onDelete = async () => {
        setDeleting(true);
        try {
            const result = await deleteLandingComponent(componentId);

            if (!result.success) {
                notify({ type: "error", message: result.message || "Ошибка при удалении" });
            } else {
                notify({ type: "success", message: result.message || "Компонент удален" });
                setLandingData({ slug: landingData.slug, audio: landingData.audio, introBtn: landingData.introBtn, playMusic: landingData.playMusic, components: result.data.components });
				navigate("/dashboard/constructor");
				setSelectedComponentId(null);
            }
        } catch {
            notify({ type: "error", message: "Ошибка при сохранении лендинга" });
        } finally {
            setDeleting(false);
        }
    };

	const renderConfig = () => {
		const positionConfig = component.positionConfig || {};
		let breakpoints = positionConfig.breakpoints || [];
		let bp = breakpoints.find((b: any) => b.minWidth === activePoint);

		let circle1Breakpoints = component.circle1 || [];
		let c1bp = circle1Breakpoints.find((b: any) => b.minWidth === activePoint);

		let circle2Breakpoints = component.circle2 || [];
		let c2bp = circle2Breakpoints.find((b: any) => b.minWidth === activePoint);

		let textConfig = component.textConfig || [];
		let tbp = textConfig.find((b: any) => b.minWidth === activePoint);

		// получаем индекс уже после этого
		const bpIndex = breakpoints.findIndex((b: any) => b.minWidth === activePoint);

		const updatePos = (field: "left" | "top", value: number, mode: "half" | "full" | null) => {
			let result: number | string = value;
			if (field === "left") setLeftPos(value);
			if (field === "top") setTopPos(value);

			if (mode !== null) result = `${mode}-${value}`;
			if (mode !== null) result = `${mode}-${value}`;

			bp[field] = result;
			breakpoints[bpIndex] = bp;

			updateComponent({
				positionConfig: {
					...positionConfig,
					breakpoints
				}
			});
		};

		const updateRotate = (value: number) => {
			bp.rotate = value;
			breakpoints[bpIndex] = bp;

			updateComponent({
				positionConfig: {
					...positionConfig,
					breakpoints
				}
			});
		};

		const updateScale = (value: number) => {
			bp.s = value;
			breakpoints[bpIndex] = bp;

			updateComponent({
				positionConfig: {
					...positionConfig,
					breakpoints
				}
			});
		};

		const updateDist = (value: number) => {
			bp.dist = value;
			breakpoints[bpIndex] = bp;

			updateComponent({
				positionConfig: {
					...positionConfig,
					breakpoints
				}
			});
		};

		const updateList = (index: number, key: string, value: string | null) => {
			const updatedList = [...component?.list];
			updatedList[index] = { ...updatedList[index], [key]: value };
			updateComponent({ list: updatedList });
		};

		return (
			<div className={styles.fields}>
				<div className={styles.toggleButtons}>
					<button
						type="button"
						onClick={() => setTab("general")}
						className={`${styles.tabBtn} ${tab === "general" ? styles.activeTab : ""}`}
					>
						общие
					</button>
					<button
						type="button"
						onClick={() => setTab("animation")}
						className={`${styles.tabBtn} ${tab === "animation" ? styles.activeTab : ""}`}
					>
						анимация
					</button>
					{["iconic", "iconiclist", "links"].includes(component.type) && <button
						type="button"
						onClick={() => setTab("icons")}
						className={`${styles.tabBtn} ${tab === "icons" ? styles.activeTab : ""}`}
					>
						иконки
					</button>}
					{["image"].includes(component.type) && <button
						type="button"
						onClick={() => setTab("image")}
						className={`${styles.tabBtn} ${tab === "image" ? styles.activeTab : ""}`}
					>
						картинка
					</button>}
				</div>

				<label>
                    Ширина экрана (px) {activePoint === 1281 ? "> 1280" : `до ${activePoint}`}
                    <div className={styles.toggleButtons}>
                        <button
                            type="button"
                            onClick={() => setActivePoint(440)}
                            className={`${styles.posBtn} ${activePoint === 440 ? styles.active : ""}`}
                        >
                            мобильные
                        </button>
                        <button
                            type="button"
                            onClick={() => setActivePoint(768)}
                            className={`${styles.posBtn} ${activePoint === 768 ? styles.active : ""}`}
                        >
                            планшеты
                        </button>
                        <button
                            type="button"
                            onClick={() => setActivePoint(1150)}
                            className={`${styles.posBtn} ${activePoint === 1150 ? styles.active : ""}`}
                        >
                            м-ноут
                        </button>
                        <button
                            type="button"
                            onClick={() => setActivePoint(1280)}
                            className={`${styles.posBtn} ${activePoint === 1280 ? styles.active : ""}`}
                        >
                            б-ноут
                        </button>
                        <button
                            type="button"
                            onClick={() => setActivePoint(1281)}
                            className={`${styles.posBtn} ${activePoint === 1281 ? styles.active : ""}`}
                        >
                            дефолт
                        </button>
                    </div>
                </label>

				{tab === "general" && <GeneralTab tbp={tbp} updateComponent={updateComponent} componentId={componentId} />}
				{tab === "animation" && <AnimationTab 
					bp={bp}
					c1bp={c1bp}
					c2bp={c2bp}
					updateScale={updateScale}
					updateDist={updateDist}
					leftPos={leftPos}
					updatePos={updatePos}
					leftMode={leftMode}
					setLeftMode={setLeftMode}
					topPos={topPos}
					topMode={topMode}
					setTopMode={setTopMode}
					updateRotate={updateRotate}
					updateComponent={updateComponent}
					componentId={componentId}
				/>}
				{tab === "icons" && ["iconic", "iconiclist", "links"].includes(component.type) && <IconsTab  
					componentId={componentId}
					update={updateList}
					updateComponent={updateComponent}
				/>}
				{tab === "image" && <ImageTab updateComponent={updateComponent} component={component} />}
			</div>
		);
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					<motion.div
						className={styles.overlay}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.25 }}
						onClick={onClose}
					/>
					<motion.div
						className={styles.drawer}
						initial={{ x: "100%" }}
						animate={{ x: 0 }}
						exit={{ x: "100%" }}
						transition={{ type: "tween", duration: 0.3 }}
					>
						<div className={styles.header}>
							<h2 className={styles.title}>Настройка: {component.type}</h2>
							<div className={styles.headerActions}>
								<button
									className={styles.button}
									onClick={handlePreview}
								>
									{isPreviewPage ? "Вернуться" : "Предпросмотр"}
								</button>
								<button
									className={styles.close}
									onClick={onClose}
									aria-label="Закрыть"
								>
									<svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="#000"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
								</button>
							</div>
						</div>
						<div className={styles.content}>
							{component.type && renderConfig()}
						</div>
						<div className={styles.btnsWrap}>
							<button
								type="button"
								onClick={onSave}
								disabled={!slug || saving}
								className={styles.saveButton}
							>
								{saving ? "Сохранение..." : "Сохранить изменения"}
							</button>
							<button
								type="button"
								onClick={onDelete}
								disabled={!slug || deleting}
								className={styles.deleteButton}
							>
								{deleting ? "Удаление..." : "Удалить компонент"}
							</button>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
};
