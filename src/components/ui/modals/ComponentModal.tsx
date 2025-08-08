import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useConstructorStore } from "../../../store/constructorStore";
import { useNotificationStore } from "../../../store/notificationStore";
import { useAppStore } from "../../../store/useAppStore";
import { CustomSelect } from "../select/CustomSelect";
import { saveLanding } from "../../../api/constructor";

import styles from "./ComponentModal.module.css";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	componentId: string;
}

const canvasOptions = [
	{ label: "sober", value: "sober" },
	{ label: "laptop", value: "laptop" },
	{ label: "panic", value: "panic" },
	{ label: "super", value: "super" },
	{ label: "chain", value: "chain" },
	{ label: "umbrella", value: "umbrella" },
	{ label: "ai", value: "ai" },
];

const navPositionOptions = [
	{ label: "Сверху", value: "top" },
	{ label: "Справа", value: "right" },
	{ label: "Снизу", value: "bottom" },
];

const btnOptions = [
	{ label: "Светлая", value: "light" },
	{ label: "Тёмная", value: "dark" },
];

export const ComponentModal = ({ isOpen, onClose, componentId }: Props) => {
    const [saving, setSaving] = useState<boolean>(false);
	const [leftMode, setLeftMode] = useState<"half" | "full" | null>(null);
	const [topMode, setTopMode] = useState<"half" | "full" | null>(null);
	const [leftPos, setLeftPos] = useState<number>(0);
	const [topPos, setTopPos] = useState<number>(0);

	const {
		slug,
		activePoint,
		setActivePoint
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

	useEffect(() => {
		let defaultData = {};
		const defaultBps = [
			{ minWidth: 440, s: 1, dist: 1, left: "half-750", top: "half-750", rotate: 0 },
			{ minWidth: 768, s: 1, dist: 1, left: "half-750", top: "half-750", rotate: 0 },
			{ minWidth: 1150, s: 1, dist: 1, left: "half-750", top: "half-750", rotate: 0 },
			{ minWidth: 1440, s: 1, dist: 1, left: "half-750", top: "half-750", rotate: 0 },
			{ minWidth: 10000, s: 1, dist: 1, left: "half-750", top: "half-750", rotate: 0 }
		];

		const defaultCircle = {
			left: 0,
            top: 0,
            width: 400,
            height: 400,
            rotate: 0
		};

		const positionConfig = component?.positionConfig || {};
		let breakpoints = positionConfig.breakpoints || [];
		let bp = breakpoints.find((b: any) => b.minWidth === activePoint);

		if (!bp) {
			const defaultBp = defaultBps.find((b: any) => b.minWidth === activePoint);
			if (defaultBp) {
				breakpoints.push(defaultBp);
				bp = defaultBp;
			}
		}
		
		const bpIndex = breakpoints.findIndex((b: any) => b.minWidth === activePoint);
		breakpoints[bpIndex] = bp;
		
		defaultData = {
			circle1: component.circle1 || defaultCircle,
			circle2: component.circle2 || defaultCircle,
			positionConfig: {
				...positionConfig,
				breakpoints
			}
		};

		updateComponent(defaultData);
	}, [componentId, activePoint]);

	if (!component) return null;

	const handlePreview = () => {
        if (isPreviewPage) {
            navigate("/dashboard/constructor");
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
                setLandingData({ slug: landingData.slug, audio: landingData.audio, introBtn: landingData.introBtn, playMusic: landingData.playMusic, components: landingData.components });
            }
        } catch {
            notify({ type: "error", message: "Ошибка при сохранении лендинга" });
        } finally {
            setSaving(false);
        }
    };

	const renderIntroConfig = () => {
		const defaultBps = [
			{ minWidth: 440, s: 1, dist: 1, left: "half-750", top: "half-750", rotate: 0 },
			{ minWidth: 768, s: 1, dist: 1, left: "half-750", top: "half-750", rotate: 0 },
			{ minWidth: 1150, s: 1, dist: 1, left: "half-750", top: "half-750", rotate: 0 },
			{ minWidth: 1440, s: 1, dist: 1, left: "half-750", top: "half-750", rotate: 0 },
			{ minWidth: 10000, s: 1, dist: 1, left: "half-750", top: "half-750", rotate: 0 }
		];
		const positionConfig = component.positionConfig || {};
		let breakpoints = positionConfig.breakpoints || [];
		let bp = breakpoints.find((b: any) => b.minWidth === activePoint);

		if (!bp) {
			const defaultBp = defaultBps.find((b: any) => b.minWidth === activePoint);
			if (defaultBp) {
				breakpoints.push(defaultBp);
				bp = defaultBp;
			}
		}

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

		return (
			<div className={styles.fields}>
				{/* Основные настройки интро */}
				<label className={styles.colorPickerWrapper}>
					Цвет фона:
					<input
						type="color"
						value={component.color || "#111"}
						onChange={(e) => updateComponent({ color: e.target.value })}
						className={styles.colorInput}
					/>
					<div
						className={styles.colorPreview}
						style={{ backgroundColor: component.color || "#111" }}
					/>
				</label>

				<label>
					Анимация:
					<CustomSelect
						value={canvasOptions.find((opt) => opt.value === component.canvas) ?? canvasOptions[0]}
						options={canvasOptions}
						onChange={(opt) => updateComponent({ canvas: opt.value })}
					/>
				</label>

				<label>
					Кнопка:
					<CustomSelect
						value={btnOptions.find((opt) => opt.value === component.btn) ?? btnOptions[0]}
						options={btnOptions}
						onChange={(opt) => updateComponent({ btn: opt.value })}
					/>
				</label>

				<label>
					Положение навигации:
					<CustomSelect
						value={navPositionOptions.find((opt) => opt.value === component.navPosition) ?? navPositionOptions[0]}
						options={navPositionOptions}
						onChange={(opt) => updateComponent({ navPosition: opt.value })}
					/>
				</label>

				<label>
					Заголовок:
					<input
						type="text"
						value={component.title || ""}
						onChange={(e) => updateComponent({ title: e.target.value })}
					/>
				</label>

				<label>
					Текст 1:
					<input
						type="text"
						value={component.text1 || ""}
						onChange={(e) => updateComponent({ text1: e.target.value })}
					/>
				</label>

				<label>
					Текст 2:
					<input
						type="text"
						value={component.text2 || ""}
						onChange={(e) => updateComponent({ text2: e.target.value })}
					/>
				</label>

				<label style={{ flexDirection: "row" }}>
					<input
						type="checkbox"
						checked={component?.showCircles || false}
						onChange={(e) => updateComponent({ showCircles: e.target.checked })}
					/>
					Показать круги
				</label>

				<label style={{ flexDirection: "row" }}>
					<input
						type="checkbox"
						checked={component?.showSettings || false}
						onChange={(e) => updateComponent({ showSettings: e.target.checked })}
					/>
					Показать настройки
				</label>

				<label style={{ flexDirection: "row" }}>
					<input
						type="checkbox"
						checked={component?.showNav || false}
						onChange={(e) => updateComponent({ showNav: e.target.checked })}
					/>
					Показать навигацию
				</label>

				{/* Управление анимацией */}
				<div className={styles.animationBlock}>
					<h3 className={styles.title}>Управление анимацией</h3>

					<label>
						Ширина экрана (px): {activePoint || "дефолт"}
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
								onClick={() => setActivePoint(1440)}
								className={`${styles.posBtn} ${activePoint === 1440 ? styles.active : ""}`}
							>
								б-ноут
							</button>
							<button
								type="button"
								onClick={() => setActivePoint(10000)}
								className={`${styles.posBtn} ${activePoint === 10000 ? styles.active : ""}`}
							>
								дефолт
							</button>
						</div>
					</label>

					<label>
						Масштаб (s): {bp.s ?? 0}
						<input
							type="range"
							min={0}
							max={3}
							step={0.1}
							value={bp.s ?? 0}
							onChange={(e) => updateScale(parseFloat(e.target.value))
							}
						/>
					</label>

					<label>
						Дисторшн (dist): {bp.dist ?? 0}
						<input
							type="range"
							min={0}
							max={10}
							step={0.1}
							value={bp.dist ?? 0}
							onChange={(e) => updateDist(parseFloat(e.target.value))
							}
						/>
					</label>

					<label>
						По оси Х: {bp.left}
						<input
							type="range"
							min={-1000}
							max={1000}
							step={1}
							value={leftPos}
							onChange={(e) => updatePos("left", parseInt(e.target.value), leftMode)}
						/>
						<div className={styles.toggleButtons}>
							<button
								type="button"
								onClick={() => {
									setLeftMode("full");
									updatePos("left", leftPos, "full");
								}}
								className={`${styles.posBtn} ${leftMode === "full" ? styles.active : ""}`}
							>
								full
							</button>
							<button
								type="button"
								onClick={() => {
									setLeftMode("half");
									updatePos("left", leftPos, "half");
								}}
								className={`${styles.posBtn} ${leftMode === "half" ? styles.active : ""}`}
							>
								half
							</button>
							<button
								type="button"
								onClick={() => {
									setLeftMode(null);
									updatePos("left", leftPos, null);
								}}
								className={styles.posBtn} 
							>
								Обнулить
							</button>
						</div>
					</label>

					<label>
						По оси У: {bp.top}
						<input
							type="range"
							min={-1000}
							max={1000}
							step={1}
							value={topPos}
							onChange={(e) => updatePos("top", parseInt(e.target.value), topMode)}
						/>
						<div className={styles.toggleButtons}>
							<button
								type="button"
								onClick={() => {
									setTopMode("full");
									updatePos("top", topPos, "full");
								}}
								className={`${styles.posBtn} ${topMode === "full" ? styles.active : ""}`}
							>
								full
							</button>
							<button
								type="button"
								onClick={() => {
									setTopMode("half");
									updatePos("top", topPos, "half");
								}}
								className={`${styles.posBtn} ${topMode === "half" ? styles.active : ""}`}
							>
								half
							</button>
							<button
								type="button"
								onClick={() => {
									setTopMode(null);
									updatePos("top", topPos, null);
								}}
								className={styles.posBtn}
							>
								Обнулить
							</button>
						</div>
					</label>

					<label>
						Вращение (deg): {bp.rotate ?? 0}
						<input
							type="range"
							min={0}
							max={360}
							step={1}
							value={bp.rotate ?? 0}
							onChange={(e) => updateRotate(parseInt(e.target.value))}
						/>
					</label>
				</div>
				{/* Управление кругами */}
				{component.showCircles && <div className={styles.animationBlock}>
					<h3 className={styles.title}>Круг 1</h3>
					<label>
						По оси У: {component.circle1?.top}
						<input
							type="range"
							min={-1000}
							max={1000}
							step={1}
							value={component.circle1?.top}
							onChange={(e) =>
								updateComponent({ circle1: { ...component.circle1, top: parseInt(e.target.value) } })
							}
						/>
					</label>
					<label>
						По оси Х: {component.circle1?.left}
						<input
							type="range"
							min={-1000}
							max={1000}
							step={1}
							value={component.circle1?.left}
							onChange={(e) =>
								updateComponent({ circle1: { ...component.circle1, left: parseInt(e.target.value) } })
							}
						/>
					</label>
					<label>
						Ширина (px): {component.circle1?.width}
						<input
							type="range"
							min={100}
							max={1000}
							step={1}
							value={component.circle1?.width}
							onChange={(e) =>
								updateComponent({ circle1: { ...component.circle1, width: parseInt(e.target.value) } })
							}
						/>
					</label>
					<label>
						Высота (px): {component.circle1?.height}
						<input
							type="range"
							min={100}
							max={1000}
							step={1}
							value={component.circle1?.height}
							onChange={(e) =>
								updateComponent({ circle1: { ...component.circle1, height: parseInt(e.target.value) } })
							}
						/>
					</label>
					<label>
						Вращение (deg): {component.circle1?.rotate}
						<input
							type="range"
							min={0}
							max={360}
							step={1}
							value={component.circle1?.rotate}
							onChange={(e) =>
								updateComponent({ circle1: { ...component.circle1, rotate: parseInt(e.target.value) } })
							}
						/>
					</label>

					<h3 className={styles.title}>Круг 2</h3>
					<label>
						По оси У: {component.circle2?.top}
						<input
							type="range"
							min={-1000}
							max={1000}
							step={1}
							value={component.circle2?.top}
							onChange={(e) =>
								updateComponent({ circle2: { ...component.circle2, top: parseInt(e.target.value) } })
							}
						/>
					</label>
					<label>
						По оси Х: {component.circle2?.left}
						<input
							type="range"
							min={-1000}
							max={1000}
							step={1}
							value={component.circle2?.left}
							onChange={(e) =>
								updateComponent({ circle2: { ...component.circle2, left: parseInt(e.target.value) } })
							}
						/>
					</label>
					<label>
						Ширина (px): {component.circle2?.width}
						<input
							type="range"
							min={100}
							max={1000}
							step={1}
							value={component.circle2?.width}
							onChange={(e) =>
								updateComponent({ circle2: { ...component.circle2, width: parseInt(e.target.value) } })
							}
						/>
					</label>
					<label>
						Высота (px): {component.circle2?.height}
						<input
							type="range"
							min={100}
							max={1000}
							step={1}
							value={component.circle2?.height}
							onChange={(e) =>
								updateComponent({ circle2: { ...component.circle2, height: parseInt(e.target.value) } })
							}
						/>
					</label>
					<label>
						Вращение (deg): {component.circle2?.rotate}
						<input
							type="range"
							min={0}
							max={360}
							step={1}
							value={component.circle2?.rotate}
							onChange={(e) =>
								updateComponent({ circle2: { ...component.circle2, rotate: parseInt(e.target.value) } })
							}
						/>
					</label>
				</div>}
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
							{component.type && renderIntroConfig()}
						</div>
                        <button
                            type="button"
                            onClick={onSave}
                            disabled={!slug || saving}
                            className={styles.saveButton}
                        >
                            {saving ? "Сохранение..." : "Сохранить изменения"}
                        </button>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
};
