import React from 'react';
import { motion } from 'framer-motion';
import { useState } from 'react';

import type { ButtonProps } from '../../../types';
import Label from '../label/Label';

import styles from './Button.module.css';

const Button: React.FC<ButtonProps> = ({
    text,
    onClick,
    size = 'medium',
    className = '',
    disabled = false,
    type = 'button',
    borderColor = '#ffa600',
    top = "0px",
    left = "0px",
    icon,
    bg = "rgb(37, 37, 37)",
    delay = 0,
    labelColor,
    labelText,
    direction = "left",
    section = 0
}) => {
    const [isHovered, setIsHovered] = useState<boolean>(false);

    const handleClick = () => {
        let timeout = setTimeout(() => {
            if (onClick) onClick();
            clearTimeout(timeout);
        }, 1000);
    };

    const handleTouchStart = () => setIsHovered(true);
    const handleTouchEnd = () => {
        let timeout = setTimeout(() => {
            setIsHovered(false);
            clearTimeout(timeout);
        }, 1000);
    };
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    let lStyle: any = { background: bg, borderColor: borderColor };

    if (section === 6) {
        lStyle = {};
    }

    return (
        <motion.button
            className={`${styles.button} ${styles[size]} ${className}`}
            onClick={handleClick}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            disabled={disabled}
            type={type}
            style={{ 
                color: borderColor,
                top: top,
                left: left
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{
                boxShadow: 'inset 0 0 3px rgba(0,0,0,0.7)',
            }}
            whileTap={{
                boxShadow: 'inset 0 0 8px rgba(0,0,0,1)',
            }}
            transition={{
                boxShadow: {
                    type: 'spring',
                    stiffness: 300,
                    damping: 20,
                    duration: .7
                },
                opacity: {
                    duration: .7,
                    delay: delay
                }
            }}
        >
            {disabled && <div className={styles.disabled} />}
            <motion.div
                className={styles.layer2}
                whileHover={{
                    scale: 0.97,
                    boxShadow: 'inset 0 0 5px rgba(0,0,0,1)',
                }}
                whileTap={{
                    scale: 0.9,
                    boxShadow: 'inset 0 0 12px rgba(0,0,0,1)',
                }}
                transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 20,
                    duration: .7
                }}
                style={lStyle}
            >
                {text && text}
                {icon && icon}
                {!disabled && labelText && <Label isHovered={isHovered} direction={direction} text={labelText} color={labelColor} section={section} />}
            </motion.div>
        </motion.button>
    );
};

export default Button;
