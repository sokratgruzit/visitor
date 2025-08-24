import { useState, useMemo } from "react";
import { icons } from "../../../utils/icons";
import type { IconName } from "../../../utils/icons";

import { Svg } from "../../svgs/Svg.module";
import Button from "../button/Button";

import styles from "./ComponentModal.module.css";

interface IconPickerProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (iconName: IconName) => void;
}

const popularIcons: IconName[] = [
    "Home",
    "Person",
    "Settings",
    "Search",
    "Favorite",
    "ShoppingCart",
    "Info",
    "Close",
    "Menu",
    "CheckCircle",
    "Email",
    "Phone",
    "ArrowForward",
    "Star",
    "CloudQueue",
    "RocketLaunch",
    "MedicalServices",
    "Description",
    "VolumeUp",
    "Lock",
    "LockOpen",
    "PlayArrow",
    "Pause",
    "Download",
    "Upload",
    "ChatBubbleOutline",
    "LocationOn",
    "Event",
    "Group",
    "Psychology",
];

export const IconPicker = ({ isOpen, onClose, onSelect }: IconPickerProps) => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredIcons = useMemo(() => {
        if (!searchTerm.trim()) {
            return popularIcons;
        }
        const lower = searchTerm.toLowerCase();
        
        return icons
        .filter((iconName) => iconName.toLowerCase().includes(lower))
        .slice(0, 100);
    }, [searchTerm]);

    if (!isOpen) return null;

    return (
        <div className={styles.iconPopupOverlay}>
            <div className={styles.iconPopup}>
                <h3 className={styles.title} style={{ textAlign: "center" }}>
                    Выберите иконку
                </h3>
                <input
                    type="text"
                    placeholder="Поиск иконок..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input"
                    autoFocus
                />
                <div className={styles.iconGrid}>
                    {filteredIcons.length === 0 && (
                        <p style={{ width: "100%", textAlign: "center", alignSelf: "center", color: "black" }}>Иконки не найдены</p>
                    )}
                    {filteredIcons.map((iconName) => (
                        <div
                            key={iconName}
                            className={styles.iconItem}
                            onClick={() => {
                                onSelect(iconName);
                                setSearchTerm("");
                                onClose();
                            }}
                            title={iconName}
                        >
                            <Svg
                                svgName={iconName}
                                size={{ xs: 30, sm: 30, md: 30, lg: 30 }}
                                color="#000"
                            />
                        </div>
                    ))}
                </div>
                <div style={{ height: 50, position: "relative" }}>
                    <Button
                        text="Закрыть"
                        onClick={() => { setSearchTerm(""); onClose(); }}
                        size="flex"
                        delay={1}
                        limiter={window.innerWidth <= 768}
                        color="#FFFFFF"
                        btnColor="#000000"
                        fontSize="1rem"
                    />
                </div>
            </div>
        </div>
    );
};
