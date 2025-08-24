import { useNavigate, useParams } from "react-router-dom";
import { useMemo } from "react";

import { Canvas } from "../animation/Canvas";

import styles from "./AnimationPreview.module.css";

export const AnimationPreview = () => {
    const navigate = useNavigate();
    const { id } = useParams();
   
    const conf = useMemo(() => ({
        breakpoints: [
            {
                s: 0.2,
                top: "half-750",
                dist: 1,
                left: "half-750",
                rotate: 0,
                minWidth: 440,
            },
            {
                s: 0.4,
                top: "half-750",
                dist: 1,
                left: "half-750",
                rotate: 0,
                minWidth: 768,
            },
            {
                s: 0.6,
                top: "half-750",
                dist: 1,
                left: "half-750",
                rotate: 0,
                minWidth: 1150,
            },
            {
                s: 0.7,
                top: "half-750",
                dist: 1,
                left: "half-750",
                rotate: 0,
                minWidth: 1280,
            },
            {
                s: 0.8,
                top: "half-750",
                dist: 1,
                left: "half-750",
                rotate: 0,
                minWidth: 1281,
            },
        ],
    }), []);

    return (
        <div className={styles.container}>
            <div onClick={() => navigate(-1)}  className="backButton">
                ← Назад
            </div>
            <Canvas 
                positionConfig={conf || {}} 
                canvas={id}
            />
        </div>
    )
};