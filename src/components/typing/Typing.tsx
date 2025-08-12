import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import type { TypingTextProps } from "../../types";

import styles from "./Typing.module.css";

export default function Typing({
    text,
    className = "",
    delayPerChar = 0.05,
    delayPerWord = 0.05,
    showCursor = true,
    color = "#FFFFFF"
}: TypingTextProps) {
    const [visibleText, setVisibleText] = useState("");

    useEffect(() => {
        setVisibleText("");
        
        let currentIndex = 0;
        let cancelled = false;

        const chars = text.split("");
        const timers: ReturnType<typeof setTimeout>[] = [];

        const type = () => {
            if (cancelled || currentIndex >= chars.length) return;

            const char = chars[currentIndex];
            setVisibleText((prev) => prev + char);
            currentIndex++;

            const delay = char === " " ? delayPerWord * 1000 : delayPerChar * 1000;
            timers.push(setTimeout(type, delay));
        };

        timers.push(setTimeout(type, 300)); // initial delay

        return () => {
            cancelled = true;
            timers.forEach(clearTimeout);
        };
    }, [text, delayPerChar, delayPerWord]);

    return (
        <div style={{ color }} className={`${styles.typingWrapper} ${className}`}>
            {visibleText}
            {showCursor && (
                <motion.span
                    className={styles.cursor}
                    style={{ color }}
                    animate={{ opacity: [1, 0] }}
                    transition={{
                        repeat: Infinity,
                        duration: 0.7,
                        ease: "easeInOut",
                    }}
                >
                    |
                </motion.span>
            )}
        </div>
    );
}
