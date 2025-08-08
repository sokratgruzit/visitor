import { useState } from "react";
import { useConstructorStore } from "../../store/constructorStore";
import { useAppStore } from "../../store/useAppStore";
import { CustomSelect } from "../ui/select/CustomSelect";
import type { LandingComponent } from "../../types";
import { saveLanding } from "../../api/constructor";

import styles from "./ComponentsSelector.module.css";

const availableComponents = [
	{ label: "Intro", value: "intro" },
	{ label: "Multitext", value: "multitext" },
	{ label: "Text", value: "text" },
	{ label: "Iconic", value: "iconic" },
	{ label: "List", value: "list" },
	{ label: "Links", value: "links" },
	{ label: "IconicList", value: "iconiclist" },
	{ label: "Multitext2", value: "multitext2" },
];

export const ComponentsSelector = () => {
	const [isSelectOpen, setIsSelectOpen] = useState(false);
	const [selected, setSelected] = useState(availableComponents[0]);
	const slug = useConstructorStore((state) => state.slug);
    const { landingData, setLandingData, setSection } = useAppStore();
    const setSelectedComponentId = useConstructorStore((state) => state.setSelectedComponentId);
    const components = landingData.components || [];

	const addComponent = async (option: { label: string; value: string }) => {
		const newId = slug + components.length;
        const defaultCircle = {
			left: 0,
            top: 0,
            width: 400,
            height: 400,
            rotate: 0
		};
		const positionConfig = {};
		let breakpoints = [{ minWidth: 10000, s: 1, dist: 1, left: "half-750", top: "half-750", rotate: 0 }];
        let defaultData: LandingComponent = {
            id: newId,
            type: option.value,
            color: "#111",
            canvas: "sober",
            showSettings: true,
            showNav: true,
            btn: "light",
            navPosition: "right",
            showCircles: false,
            circle1: defaultCircle,
            circle2: defaultCircle,
            positionConfig: {
                ...positionConfig,
                breakpoints
            }
        };
		
		if (option.value === "intro") {
			defaultData = {
                ...defaultData,
				title: "Заголовок",
				text1: "Текст",
				text2: "Текст",
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
