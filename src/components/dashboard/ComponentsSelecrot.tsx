import { useState } from "react";
import { useConstructorStore } from "../../store/constructorStore";
import { useAppStore } from "../../store/useAppStore";
import { CustomSelect } from "../ui/select/CustomSelect";
import type { LandingComponent } from "../../types";
import { saveLanding } from "../../api/constructor";

import styles from "./ComponentsSelector.module.css";

interface selectProps {
    label: string;
    value: string | null | number;
}

const availableComponents: selectProps[] = [
    { label: "Intro", value: "intro" },
	{ label: "Text", value: "text" },
	{ label: "Multitext", value: "multitext" },
	{ label: "Multitext2", value: "multitext2" },
	{ label: "IconicList", value: "iconiclist" },
	{ label: "Iconic", value: "iconic" },
	{ label: "List", value: "list" },
	{ label: "Links", value: "links" },
    { label: "Image", value: "image" },
];

export const ComponentsSelector = () => {
	const [isSelectOpen, setIsSelectOpen] = useState(false);
	const [selected, setSelected] = useState<selectProps>(availableComponents[0]);
	const slug = useConstructorStore((state) => state.slug);
    const { landingData, setLandingData, setSection } = useAppStore();
    const setSelectedComponentId = useConstructorStore((state) => state.setSelectedComponentId);
    const components = landingData.components || [];

	const addComponent = async (option: { label: string; value: string | null | number }) => {
		const newId = slug + components.length;
        const defaultCircle = [
            { minWidth: 440, height: 400, width: 400, left: 0, top: 0, rotate: 0 },
			{ minWidth: 768, height: 400, width: 400, left: 0, top: 0, rotate: 0 },
			{ minWidth: 1150, height: 400, width: 400, left: 0, top: 0, rotate: 0 },
			{ minWidth: 1280, height: 400, width: 400, left: 0, top: 0, rotate: 0 },
			{ minWidth: 1281, height: 400, width: 400, left: 0, top: 0, rotate: 0 }
        ];
		const positionConfig = {};
		let breakpoints = [
            { minWidth: 440, s: .2, dist: 1, left: "half-750", top: "half-750", rotate: 0 },
			{ minWidth: 768, s: .4, dist: 1, left: "half-750", top: "half-750", rotate: 0 },
			{ minWidth: 1150, s: .6, dist: 1, left: "half-750", top: "half-750", rotate: 0 },
			{ minWidth: 1280, s: .7, dist: 1, left: "half-750", top: "half-750", rotate: 0 },
			{ minWidth: 1281, s: .8, dist: 1, left: "half-750", top: "half-750", rotate: 0 }
        ];
        let defaultData: LandingComponent = {
            id: newId,
            type: option.value,
            color: "#000000",
            canvas: "sober",
            titleColor: "texturedType",
            textColor: "#FFFFFF",
            title: "Заголовок",
            titlePosition: "title-top-left",
            text1: "Текст",
            text2: "Текст",
            text3: "Текст",
            showSettings: true,
            showNav: true,
            btn: "#FFFFFF",
            navPosition: "right",
            showCircles: false,
            circle1: defaultCircle,
            circle2: defaultCircle,
            textConfig: defaultCircle,
            list: [],
            positionConfig: {
                ...positionConfig,
                breakpoints
            }
        };

        if (option.value === "image") {
            defaultData = {
                ...defaultData,
                canvas: "super",
                fileUrl: "",
                fileBase64: "",
                imageConfig: defaultCircle
			};
        }

        if (option.value === "iconic") {
			defaultData = {
                ...defaultData,
                canvas: "super",
                list: [
                    { id: 0, type: "text", content: "A", classId: "icon24", text: "Текст" },
                    { id: 1, type: "text", content: "B", classId: "icon24", text: "Текст" },
                    { id: 2, type: "text", content: "C", classId: "icon24", text: "Текст" },
                    { id: 3, type: "text", content: "D", classId: "icon24", text: "Текст" },
                    { id: 4, type: "text", content: "E", classId: "icon24", text: "Текст" },
                    { id: 5, type: "text", content: "F", classId: "icon24", text: "Текст" },
                    { id: 6, type: "text", content: "G", classId: "icon24", text: "Текст" },
                    { id: 7, type: "text", content: "H", classId: "icon24", text: "Текст" },
                ]
			};
		}

		const updatedComponents = [...components, defaultData];
        setLandingData({ ...landingData, components: updatedComponents });
		setIsSelectOpen(false);
		setSelected(availableComponents[0]); 
        await saveLanding(
            { audio: landingData.audio, introBtn: landingData.introBtn, playMusic: landingData.playMusic, components: updatedComponents },
            slug
        );
	};

	return (
        <div className={styles.container}>
            <div className={styles.card}>
                <button
                    type="button"
                    className={styles.addButton}
                    onClick={() => {
                        if (components.length < 10) setIsSelectOpen(!isSelectOpen);
                    }}
                    disabled={components.length >= 10}
                >
                    + Добавить компонент
                </button>
                {isSelectOpen && components.length < 10 && (
                    <div className={styles.selectWrapper}>
                        <CustomSelect
                            value={selected}
                            onChange={(option) => {
                                setSelected(option);
                                addComponent(option);
                            }}
                            options={availableComponents}
                        />
                    </div>
                )}
            </div>

            {components.map((comp: LandingComponent, index: number) => (
                <div 
                    key={index} 
                    className={styles.card}
                    onClick={() => {
                        setSelectedComponentId(comp.id);
                        setSection(index);
                    }}
                >
                    {comp.type}
                </div>
            ))}
        </div>
    );
};
