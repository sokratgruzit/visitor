import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useConstructorStore } from "../../../store/constructorStore";
import { useNotificationStore } from "../../../store/notificationStore";
import { useAppStore } from "../../../store/useAppStore";
import { saveLanding, deleteLandingComponent } from "../../../api/constructor";

import { GeneralTab } from "./GeneralTab";
import { AnimationTab } from "./AnimationTab";
import { IconsTab } from "./IconsTab";
import { ImageTab } from "./ImageTab";
import { Svg } from "../../svgs/Svg.module";
import { Tabs } from "../tabs/Tabs";
import Button from "../button/Button";

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
	const [aPoint, setAPoint] = useState<string>("1281");

	const {
		slug,
		activePoint,
		selectedComponentId,
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

	useEffect(() => {
		setActivePoint(Number(aPoint));
	}, [aPoint]);

	useEffect(() => {
		setTab("general");
	}, [selectedComponentId]);

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
					<Tabs
						active={tab}
						onChange={setTab}
						tabs={[
							{ key: "general", label: "общие" },
							{ key: "animation", label: "анимация" },
							{ key: "icons", label: "иконки", disabled: !["iconic", "iconiclist", "links"].includes(component.type) },
							{ key: "image", label: "картинка", disabled: !["image"].includes(component.type) }
						]}
						width="25%"
						height={20}
						padding="0 5px"
						fontSize={14}
					/>
				</div>

				<label>
                    Ширина экрана (px) {activePoint === 1281 ? "> 1280" : `до ${activePoint}`}
                    <div className={styles.toggleButtons}>
						<Tabs
							active={aPoint}
							onChange={setAPoint}
							tabs={[
								{ key: "440", label: "мобильные" },
								{ key: "768", label: "планшеты" },
								{ key: "1150", label: "м-ноут" },
								{ key: "1280", label: "б-ноут" },
								{ key: "1281", label: "дефолт" }
							]}
							width="25%"
							height={20}
							padding="0px 0px"
							fontSize={14}
						/>
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
								<div style={{ height: 40, width: 40 }}>
									<Button
										icon={isPreviewPage ? <Svg svgName="ArrowBack" size={{ xs: 30, sm: 30, md: 30, lg: 30 }} color="#FFFFFF" /> : <Svg svgName="Preview" size={{ xs: 30, sm: 30, md: 30, lg: 30 }} color="#FFFFFF" />}
										onClick={handlePreview}
										size="flex"
										delay={.8}
										limiter={window.innerWidth <= 768}
										color="#FFFFFF"
										btnColor="#63C5AB"
										fontSize=".75rem"
									/>
								</div>
								<div style={{ height: 40, width: 40 }}>
									<Button
										icon={<Svg svgName="Close" size={{ xs: 30, sm: 30, md: 30, lg: 30 }} color="#FFFFFF" />}
										onClick={onClose}
										size="flex"
										delay={1}
										limiter={window.innerWidth <= 768}
										color="#FFFFFF"
										btnColor="#000000"
										fontSize=".75rem"
									/>
								</div>
							</div>
						</div>
						<div className={styles.content}>
							{component.type && renderConfig()}
						</div>
						<div className={styles.btnsWrap}>
							<div style={{ height: 50, width: "50%" }}>
								<Button
									text={saving ? "Сохранение..." : "Сохранить изменения"}
									onClick={onSave}
									size="flex"
									delay={.8}
									limiter={window.innerWidth <= 768}
									color="#FFFFFF"
									btnColor="#63C5AB"
									fontSize="1rem"
									disabled={!slug || saving}
								/>
							</div>
							<div style={{ height: 50, width: "50%" }}>
								<Button
									text={deleting ? "Удаление..." : "Удалить компонент"}
									onClick={onDelete}
									size="flex"
									delay={.8}
									limiter={window.innerWidth <= 768}
									color="#FFFFFF"
									btnColor="#c56363"
									fontSize="1rem"
									disabled={!slug || deleting}
								/>
							</div>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
};
