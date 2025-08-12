import { useState } from "react";

import { useAppStore } from "../../../store/useAppStore";
import type { IconName } from "../../../utils/icons";
import type { ListItemProps } from "../../../types";

import { CustomSelect } from "../select/CustomSelect";
import { IconPicker } from "./IconPicker";

import styles from "./ComponentModal.module.css";

interface Props {
    componentId: string;
    update: (index: number, key: string, value: string | null) => void;
    updateComponent: (newData: any) => void;
}

export const IconsTab = ({ update, componentId, updateComponent }: Props) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [activeLabelIndex, setActiveLabelIndex] = useState<number | null>(null);

    const typeOptions = [
        { label: "Текст", value: "text" },
        { label: "Иконка", value: "icon" },
    ];

    // const classOptions = [
    //     { label: "24", value: "icon24" },
    //     { label: "48", value: "icon48" },
    //     { label: "72", value: "icon72" },
    //     { label: "96", value: "icon96" },
    //     { label: "Гибкий", value: "iconResponsive" },
    // ];

    const { landingData } = useAppStore();

    const component = landingData?.components?.find((c: any) => c.id === componentId) || {};

    return (
        <>
            {component.type === "iconic" && <div className={styles.labelHeader}>
                <p>Лейблы:</p>
                {component?.list?.map((item: ListItemProps, idx: number) => (
                    <div key={idx} className={styles.labelRow}>
                        <p>#{idx + 1}:</p>
                        <div className={styles.delimiter} />
                        <p>Тип иконки:</p>
                        <CustomSelect
                            value={typeOptions.find((opt) => opt.value === item.type) ?? typeOptions[0]}
                            options={typeOptions}
                            onChange={(opt) => update(idx, "type", opt.value)}
                        />

                        <p>Контент: {item.content}</p>
                        {item.type === "text" && item.id === idx ? (
                            <input
                                type="text"
                                value={item.content}
                                onChange={(e) => update(idx, "content", e.target.value)}
                            />
                        ) : (
                            <button
                                className={styles.button}
                                onClick={() => {
                                    setActiveLabelIndex(idx);
                                    setIsPopupOpen(true);
                                }}
                            >
                                Выбрать иконку
                            </button>
                        )}

                        {/* <p>Размер:</p>
                        <CustomSelect
                            value={classOptions.find((opt) => opt.value === label.classId) ?? classOptions[0]}
                            options={classOptions}
                            onChange={(opt) => updateLabel(idx, "classId", opt.value)}
                        /> */}

                        <p>Текст лейбла:</p>
                        <input
                            type="text"
                            value={item.text}
                            onChange={(e) => update(idx, "text", e.target.value)}
                        />
                    </div>
                ))}
            </div>}

            {["iconiclist", "links"].includes(component.type) && <div className={styles.labelHeader}>
                <p>Список:</p>
                {component?.list?.map((item: ListItemProps, idx: number) => (
                    <div key={idx} className={styles.labelRow}>
                        <p>#{idx + 1}:</p>
                        <div className={styles.delimiter} />
                    
                        <p>Иконка: {item.icon}</p>
                        <button
                            className={styles.button}
                            onClick={() => {
                                setActiveLabelIndex(idx);
                                setIsPopupOpen(true);
                            }}
                        >
                            Выбрать иконку
                        </button>

                        <p>Текст пункта:</p>
                        <input
                            type="text"
                            value={item.text}
                            onChange={(e) => update(idx, "text", e.target.value)}
                        />

                        {component.type === "links" && <p>Адрес:</p>}
                        {component.type === "links" && <input
                            type="text"
                            value={item.link}
                            onChange={(e) => update(idx, "link", e.target.value)}
                        />}

                        <button
                            type="button"
                            className={styles.button}
                            onClick={() => {
                                const newList = [...(component.list || [])];
                                newList.splice(idx, 1);
                                updateComponent({ list: newList });
                            }}
                        >
                            Удалить пункт
                        </button>
                    </div>
                ))}
            </div>}

            <button
                type="button"
                className={styles.button}
                onClick={() => {
                    let defaultItem: ListItemProps = { icon: "", classId: "", text: "" };

                    if (component.type === "links") defaultItem = { icon: "", classId: "", text: "", link: "" };

                    updateComponent({ list: [...(component.list || []), defaultItem] });
                }}
            >
                Добавить пункт
            </button>

            <IconPicker
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                onSelect={(iconName: IconName) => {
                    if (activeLabelIndex !== null) {
                        update(activeLabelIndex, component?.type === "iconic" ? "content" : "icon", iconName);
                        setActiveLabelIndex(null);
                    }
                }}
            />
        </>
    );
};
