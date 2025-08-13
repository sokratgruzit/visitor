import { useAppStore } from "../../../store/useAppStore";
import { useConstructorStore } from "../../../store/constructorStore";
import type { Circle } from "../../../types";

import { CustomSelect } from "../select/CustomSelect";

import styles from "./ComponentModal.module.css";

interface Props {
	updateComponent: (newData: any) => void;
	componentId: string;
    tbp: Circle;
}

export const GeneralTab = ({ updateComponent, componentId, tbp }: Props) => {
    const canvasOptions = [
        { label: "sober", value: "sober" },
        { label: "laptop", value: "laptop" },
        { label: "panic", value: "panic" },
        { label: "super", value: "super" },
        { label: "chain", value: "chain" },
        { label: "umbrella", value: "umbrella" },
        { label: "ai", value: "ai" },
        { label: "no animation", value: null }
    ];

    const navPositionOptions = [
        { label: "Сверху", value: "top" },
        { label: "Справа", value: "right" },
        { label: "Снизу", value: "bottom" },
    ];

    const titleOptions = [
        { label: "Светлый", value: "texturedType" },
        { label: "Тёмный", value: "texturedType2" },
    ];

    const titlePosOptions = [
        { label: "Сверху слева", value: "title-top-left" },
        { label: "Сверху в центре", value: "title-top-center" },
        { label: "Сверху справа", value: "title-top-right" },
        { label: "Снизу слева", value: "title-bottom-left" },
        { label: "Снизу в центре", value: "title-bottom-center" },
        { label: "Снизу справа", value: "title-bottom-right" },
    ];

    const { landingData } = useAppStore();
    const { activePoint } = useConstructorStore();

    const component = landingData?.components?.find((c: any) => c.id === componentId) || {};

    return (
        <>
            <div className={styles.toggleButtons}>
                <label className={styles.colorPickerWrapper}>
                    Цвет фона:
                    <input
                        type="color"
                        value={component.color || "#000000"}
                        onChange={(e) => updateComponent({ color: e.target.value })}
                        className={styles.colorInput}
                    />
                    <div
                        className={styles.colorPreview}
                        style={{ backgroundColor: component.color || "#000000" }}
                    />
                </label>

                <label className={styles.colorPickerWrapper}>
                    Цвет текста:
                    <input
                        type="color"
                        value={component.textColor || "#FFFFFF"}
                        onChange={(e) => updateComponent({ textColor: e.target.value })}
                        className={styles.colorInput}
                    />
                    <div
                        className={styles.colorPreview}
                        style={{ backgroundColor: component.textColor || "#FFFFFF" }}
                    />
                </label>

                <label className={styles.colorPickerWrapper}>
                    Цвет кнопок:
                    <input
                        type="color"
                        value={component.btn || "#FFFFFF"}
                        onChange={(e) => updateComponent({ btn: e.target.value })}
                        className={styles.colorInput}
                    />
                    <div
                        className={styles.colorPreview}
                        style={{ backgroundColor: component.btn || "#FFFFFF" }}
                    />
                </label>
            </div>

            <label>
                Цвет заголовка:
                <CustomSelect
                    value={titleOptions.find((opt) => opt.value === component.titleColor) ?? titleOptions[0]}
                    options={titleOptions}
                    onChange={(opt) => updateComponent({ titleColor: opt.value })}
                />
            </label>

            <label>
                Позиция заголовка:
                <CustomSelect
                    value={titlePosOptions.find((opt) => opt.value === component.titlePosition) ?? titlePosOptions[0]}
                    options={titlePosOptions}
                    onChange={(opt) => updateComponent({ titlePosition: opt.value })}
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

            {!["list", "iconiclist", "image"].includes(component.type) && <label>
                Текст 1:
                <input
                    type="text"
                    value={component.text1 || ""}
                    onChange={(e) => updateComponent({ text1: e.target.value })}
                />
            </label>}

            {["multitext", "multitext2", "intro", "text"].includes(component.type) && <label>
                Текст 2:
                <input
                    type="text"
                    value={component.text2 || ""}
                    onChange={(e) => updateComponent({ text2: e.target.value })}
                />
            </label>}

            {["multitext", "multitext2"].includes(component.type) && <label>
                Текст 3:
                <input
                    type="text"
                    value={component.text3 || ""}
                    onChange={(e) => updateComponent({ text3: e.target.value })}
                />
            </label>}

            <div className={styles.animationBlock}>
                <h3 className={styles.title}>Позиция текста:</h3>
                <label>
                    По оси У (px): {tbp?.top}
                    <input
                        type="range"
                        min={-1000}
                        max={1000}
                        step={1}
                        value={tbp?.top}
                        onChange={(e) => {
                            let bps = component?.textConfig;
                            const bpIndex = bps.findIndex((b: any) => b.minWidth === activePoint);

                            bps[bpIndex].top = parseInt(e.target.value);

                            updateComponent({ textConfig: bps });
                        }}
                    />
                </label>
                <label>
                    По оси Х (%): {tbp?.left}
                    <input
                        type="range"
                        min={-100}
                        max={100}
                        step={0.5}
                        value={tbp?.left}
                        onChange={(e) => {
                            let bps = component?.textConfig;
                            const bpIndex = bps.findIndex((b: any) => b.minWidth === activePoint);

                            bps[bpIndex].left = parseInt(e.target.value);

                            updateComponent({ textConfig: bps });
                        }}
                    />
                </label>
                <label>
                    Ширина (px): {tbp?.width}
                    <input
                        type="range"
                        min={-1000}
                        max={1000}
                        step={1}
                        value={tbp?.width}
                        onChange={(e) => {
                            let bps = component?.textConfig;
                            const bpIndex = bps.findIndex((b: any) => b.minWidth === activePoint);

                            bps[bpIndex].width = parseInt(e.target.value);

                            updateComponent({ textConfig: bps });
                        }}
                    />
                </label>
                <label>
                    Высота (px): {tbp?.height}
                    <input
                        type="range"
                        min={-1000}
                        max={1000}
                        step={1}
                        value={tbp?.height}
                        onChange={(e) => {
                            let bps = component?.textConfig;
                            const bpIndex = bps.findIndex((b: any) => b.minWidth === activePoint);

                            bps[bpIndex].height = parseInt(e.target.value);

                            updateComponent({ textConfig: bps });
                        }}
                    />
                </label>
            </div>

            {["list"].includes(component.type) && <label>
                Список:
                {(component?.list || []).map((item: string, index: number) => (
                    <div key={index} style={{ display: "flex", gap: "8px", marginBottom: "4px" }}>
                        <input
                            type="text"
                            value={item}
                            onChange={(e) => {
                                const newList = [...(component.list || [])];
                                newList[index] = e.target.value;
                                updateComponent({ list: newList });
                            }}
                            style={{ flex: 1 }}
                        />
                        <button
                            type="button"
                            className={styles.button}
                            onClick={() => {
                                const newList = [...(component.list || [])];
                                newList.splice(index, 1);
                                updateComponent({ list: newList });
                            }}
                        >
                            Удалить пункт
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    className={styles.button}
                    onClick={() => {
                        updateComponent({ list: [...(component.list || []), ""] });
                    }}
                >
                    Добавить пункт
                </button>
            </label>}

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
        </>
    );
};