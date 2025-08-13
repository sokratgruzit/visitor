import { useState, useEffect } from "react";
import { useConstructorStore } from "../../store/constructorStore";
import { useNotificationStore } from "../../store/notificationStore";
import { useAppStore } from "../../store/useAppStore";

import { CustomSelect } from "../ui/select/CustomSelect";
import { ComponentsSelector } from "./ComponentsSelecrot";

import { checkSlug, addSlug, saveLanding } from "../../api/constructor";

import styles from "./Constructor.module.css";

const audioOptions = [
	{ label: "Awakening", value: "/audio/awakening.mp3" },
	{ label: "Calm", value: "/audio/calm.mp3" },
	{ label: "Energetic", value: "/audio/energetic.mp3" },
];

export const Constructor = () => {
	const [tab, setTab] = useState<"general" | "components">("general");
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
			<h1 className={styles.pageTitle}>Конструктор сайта</h1>
			<div className={styles.container}>
				<div className={styles.tabs}>
					<button
						className={tab === "general" ? styles.activeTab : ""}
						onClick={() => setTab("general")}
						type="button"
					>
						Общие настройки
					</button>
					<button
						className={tab === "components" ? styles.activeTab : ""}
						onClick={() => slug.trim() && setTab("components")}
						disabled={!slug.trim()}
						type="button"
						style={{ opacity: !slug.trim() ? 0.5 : 1 }}
					>
						Компоненты
					</button>
				</div>

				{tab === "general" && (
					<form className={styles.form} onSubmit={(e) => e.preventDefault()}>
						<label>
							Slug:
							<div style={{
								display: "flex",
								border: "1px solid #ccc",
								borderRadius: 8,
								overflow: "hidden",
								width: "100%",
								maxWidth: 600,
								height: 35
							}}>
								<input
									type="text"
									value={landingData?.slug ?? ""}
									onChange={(e) => onChangeInput(e.target.value)}
									className={styles.input}
									disabled={slugLocked || checkingSlug}
									style={{
										border: "none",
										borderRadius: 0,
										flexGrow: 1,
										padding: "12px",
										fontSize: 16,
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
										style={{
											border: "none",
											backgroundColor: "#63C5AB",
											color: "#fff",
											cursor: checkingSlug ? "not-allowed" : "pointer",
											padding: "12px 20px",
											fontSize: 16,
											borderRadius: 0,
											userSelect: "none",
											outline: "none",
											height: 35,
											display: "flex",
											alignItems: "center"
										}}
									>
										{checkingSlug ? "Проверка..." : "Добавить"}
									</button>
								)}
							</div>
							<p className={styles.helpText}>
								Slug — это уникальный идентификатор вашей презентации в ссылке. Можно использовать только
								латинские буквы (a–z), цифры и дефис (-). Изменить slug после сохранения невозможно.
							</p>
						</label>

						<label style={{ marginTop: 20 }}>
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
								className={styles.input}
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
                        
                        <button
                            type="button"
                            onClick={onSave}
                            disabled={!slug || saving}
                            className={styles.saveButton}
                        >
                            {saving ? "Сохранение..." : "Сохранить изменения"}
                        </button>
					</form>
				)}

				{tab === "components" && <ComponentsSelector />}
			</div>
		</div>
	);
};
