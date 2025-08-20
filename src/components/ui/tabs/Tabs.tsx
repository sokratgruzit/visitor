import type { TabsProps } from "../../../types";

import styles from "./Tabs.module.css";

export const Tabs: React.FC<TabsProps> = ({ tabs, active, onChange, width = 150, height = 50, padding="10px 20px", fontSize = 16 }) => {
    return (
        <div className={styles.tabs}>
            {tabs.map((tab, idx: number) => {
                let borderStyle: {
                    opacity: number;
                    borderTopLeftRadius?: number;
                    borderBottomLeftRadius?: number;
                    borderTopRightRadius?: number;
                    borderBottomRightRadius?: number;
                    width?: string | number;
                    height?: string | number;
                    padding?: string;
                    fontSize?: string | number;
                } = {
                    opacity: tab.disabled ? 0.5 : 1,
                    width,
                    height,
                    padding,
                    fontSize
                };

                if (idx === 0) {
                    borderStyle = {
                        ...borderStyle,
                        borderTopLeftRadius: 30,
                        borderBottomLeftRadius: 30
                    };
                }

                if (idx === tabs.length - 1) {
                    borderStyle = {
                        ...borderStyle,
                        borderTopRightRadius: 30,
                        borderBottomRightRadius: 30
                    }
                }

                return (
                    <button
                        key={tab.key}
                        className={active === tab.key ? styles.activeTab : ""}
                        onClick={() => !tab.disabled && onChange(tab.key)}
                        type="button"
                        disabled={tab.disabled}
                        style={borderStyle}
                    >
                        {tab.label}
                    </button>
                )
            })}
        </div>
    );
};