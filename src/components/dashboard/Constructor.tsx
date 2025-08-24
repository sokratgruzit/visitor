import { useState, useEffect } from "react";
import { useConstructorStore } from "../../store/constructorStore";
import { useNotificationStore } from "../../store/notificationStore";
import { useAppStore } from "../../store/useAppStore";

import { CustomSelect } from "../ui/select/CustomSelect";
import { ComponentsSelector } from "./ComponentsSelecrot";
import { checkSlug, addSlug, saveLanding } from "../../api/constructor";

import { Tabs } from "../ui/tabs/Tabs";
import { Svg } from "../svgs/Svg.module";
import Button from "../ui/button/Button";

import styles from "./Constructor.module.css";

const audioOptions = [
	{ label: "Awakening", value: "/audio/awakening.mp3" },
	{ label: "Calm", value: "/audio/calm.mp3" },
	{ label: "Energetic", value: "/audio/energetic.mp3" },
];

export const Constructor = () => {
	const [tab, setTab] = useState<string>("general");
	const [checkingSlug, setCheckingSlug] = useState(false);
	const [slugLocked, setSlugLocked] = useState(false);
	const [saving, setSaving] = useState(false);

	const { setLandingData, landingData } = useAppStore();

	const slug = useConstructorStore((state) => state.slug);

	const setSlug = useConstructorStore((state) => state.setSlug);
	const notify = useNotificationStore((state) => state.showNotification);

	const updateLanding = (newData: any, field: string) => {
		const updated = {
			...landingData,
			[field]: newData
		};

		setLandingData(updated);
	};

	const onChangeInput = (value: string) => {
		const cleanValue = value.toLowerCase().replace(/[^a-z0-9-]/g, "");
		updateLanding(cleanValue, "slug");
	};

	const onAddSlug = async () => {
		if (!landingData.slug) {
			notify({ type: "error", message: "Введите slug" });
			return;
		}

		setCheckingSlug(true);

		try {
			const result = await checkSlug(landingData.slug);
			
			if (!result.success || !result.available) {
				notify({ type: "error", message: result.message || "Этот slug уже занят" });
			} else {
				const added = await addSlug(landingData.slug);

				if (!added.success) {
					notify({ type: "error", message: added.message || "Ошибка при добавлении slug" });
				} else {
					notify({ type: "success", message: added.message || "Slug успешно добавлен" });
					setSlugLocked(true);
					setSlug(landingData.slug);
				}
			}
		} catch {
			notify({ type: "error", message: "Ошибка при добавлении или проверке slug" });
		} finally {
			setCheckingSlug(false);
		}
	};

	const onSave = async () => {
		setSaving(true);
		try {
			const result = await saveLanding(
				{ audio: landingData.audio, introBtn: landingData.introBtn, playMusic: landingData.playMusic, components: landingData.components },
				landingData.slug
			);

			if (!result.success) {
				notify({ type: "error", message: result.message || "Ошибка при сохранении" });
			} else {
				notify({ type: "success", message: result.message || "Сохранено" });
			}
		} catch {
			notify({ type: "error", message: "Ошибка при сохранении лендинга" });
		} finally {
			setSaving(false);
		}
	};

	useEffect(() => {
		if (slug) {
            setSlugLocked(true);
            setSlug(slug);
        }
	}, [slug]);

	return (
		<div className={styles.pageWrapper}>
			<div className={styles.container}>
				<Tabs
					active={tab}
					onChange={setTab}
					tabs={[
						{ key: "general", label: "Общие настройки" },
						{ key: "components", label: "Компоненты", disabled: !slug.trim() }
					]}
				/>

				{tab === "general" && (
					<form className={styles.form} onSubmit={(e) => e.preventDefault()}>
						<div className={styles.helpText}>
							<Svg svgName="Warning" size={{ xs: 24, sm: 24, md: 24, lg: 24 }} color="#d7bb3b" />
							<p>Slug — это уникальный идентификатор вашей презентации в ссылке. Можно использовать только латинские буквы (a–z), цифры и дефис (-). Изменить slug после сохранения невозможно.</p>
						</div>
						<label>
							Slug:
							<div style={{
								display: "flex",
								borderRadius: 30,
								overflow: "hidden",
								width: "100%",
								maxWidth: 600,
								height: 50
							}}>
								<input
									type="text"
									value={landingData?.slug ?? ""}
									onChange={(e) => onChangeInput(e.target.value)}
									className="input"
									disabled={slugLocked || checkingSlug}
									style={{
										border: "none",
										borderRadius: 0,
										flexGrow: 1,
										outline: "none",
										boxSizing: "border-box",
									}}
									placeholder="Введите уникальный slug"
								/>
								{!slugLocked && (
									<button
										type="button"
										onClick={onAddSlug}
										disabled={checkingSlug}
										className={styles.button}
										style={{
											border: "none",
											backgroundColor: "#63C5AB",
											color: "#fff",
											cursor: checkingSlug ? "not-allowed" : "pointer",
											padding: "12px 20px",
											fontSize: 18,
											borderRadius: 0,
											userSelect: "none",
											outline: "none",
											width: 150,
											height: 50,
											display: "flex",
											alignItems: "center",
											justifyContent: "center"
										}}
									>
										{checkingSlug ? "Проверка..." : "Добавить"}
									</button>
								)}
							</div>
						</label>

						<label>
							Аудио:
							<CustomSelect
								value={audioOptions.find((opt) => opt.value === landingData?.audio) ?? audioOptions[0]}
								onChange={(option) => updateLanding(option.value, "audio")}
								options={audioOptions}
							/>
						</label>

						<label>
							Текст кнопки "Начать":
							<input
								type="text"
								value={landingData?.introBtn ?? ""}
								onChange={(e) => updateLanding(e.target.value, "introBtn")}
								className="input"
							/>
						</label>

						<label className={styles.checkboxLabel}>
							Воспроизводить музыку автоматически:
							<input
								type="checkbox"
								checked={landingData?.playMusic ?? false}
								onChange={(e) => updateLanding(e.target.checked, "playMusic")}
								className={styles.checkboxInput}
							/>
						</label>
                        
						<div style={{ height: 50 }}>
							<Button
								text={saving ? "Сохранение..." : "Сохранить изменения"}
								onClick={onSave}
								size="flex"
								delay={.8}
								limiter={window.innerWidth <= 768}
								color="#FFFFFF"
								btnColor="#63C5AB"
							/>
						</div>
					</form>
				)}

				{tab === "components" && <ComponentsSelector />}
			</div>
		</div>
	);
};
