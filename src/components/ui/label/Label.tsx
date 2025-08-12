import { useState, useEffect, useRef, memo } from "react";

import { useAppStore } from "../../../store/useAppStore";
import type { labelStyles, LabelProps } from "../../../types";

import styles from "./Label.module.css";

const Label: React.FC<LabelProps> = ({ text, color, direction, isHovered, section = 0 }) => {
    const [labelWidth, setLabelWidth] = useState<number>(0);
    const [labelStyles, setLabelStyles] = useState<labelStyles>({
        left: 65, 
        color,
        opacity: 0 
    });

    const labelRef = useRef<HTMLDivElement>(null);
    const { landingData } = useAppStore();

    useEffect(() => {
        if (labelRef.current) setLabelWidth(labelRef.current.clientWidth);
    }, [labelRef.current]);

    useEffect(() => {
        let labelStyles: labelStyles = {
            left: 65,
            top: "calc(50% - 15px)", 
            color,
            opacity: isHovered ? 1 : 0 
        };

        if (direction === "right") {
            labelStyles = {
                right: 65, 
                color,
                top: "calc(50% - 15px)", 
                opacity: isHovered ? 1 : 0 
            };
        }

        if (direction === "right-rotate") {
            labelStyles = {
                top: `${labelWidth * .9}px`, 
                color,
                transform: "rotate(-90deg)",
                opacity: isHovered ? 1 : 1 
            };
        }

        setLabelStyles(labelStyles);
    }, [direction, isHovered]);

    return (
        <div 
            ref={labelRef}
            className={styles.container}
            style={{
                ...labelStyles,
                backgroundColor: landingData?.components[section].btn
            }}
        >
            {text}
        </div>
    )
};

export default memo(Label);