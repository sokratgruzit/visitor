import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import styles from "./CustomSelect.module.css";

interface Option {
    label: string;
    value: string | null | number;
}

interface Props {
    value: Option;
    onChange: (val: Option) => void;
    options: Option[];
}

export const CustomSelect = ({ value, onChange, options }: Props) => {
    const [open, setOpen] = useState(false);

    return (
        <div className={styles.wrapper}>
            <div
                className={styles.selected}
                onClick={() => setOpen((prev) => !prev)}
            >
                {value.label}
                <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#111"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={styles.arrow}
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ marginLeft: 8 }}
                >
                    <polyline points="6 9 12 15 18 9" />
                </motion.svg>
            </div>

            <AnimatePresence>
                {open && (
                    <motion.ul
                        className={styles.dropdown}
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                    >
                        {options.map((option) => (
                            <li
                                key={option.value}
                                className={styles.option}
                                onClick={() => {
                                    onChange(option);
                                    setOpen(false);
                                }}
                            >
                                {option.label}
                            </li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
};
