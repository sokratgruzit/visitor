import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { useAppStore } from "../../store/useAppStore";
import type { ConfProps } from "../../types";

import { Navigation } from "../navigation/Navigation";
import { Settings } from "../settings/Settings";
import { Canvas } from "../animation/Canvas";
import Button from "../ui/button/Button";
import SectionIntro from "../sections/SectionIntro";
import Section0 from "../sections/Section0";
import Section1 from "../sections/Section1";
import Section2 from "../sections/Section2";
import Section3 from "../sections/Section3";
import Section4 from "../sections/Section4";
import Section5 from "../sections/Section5";
import Section6 from "../sections/Section6";
import BackgroundMusic from "../music/BackgroundMusic";

import styles from "./UserLanding.module.css";

export const UserLanding = () => {
    const colors = ["#98BFF6", "#EDB948", "#63C5AB", "#EF9F64", "#F4696B", "#64d6e2", "#FFFFF0"];

    const { 
        explore, 
        windowWidth,
        setExplore, 
        intro, 
        currentSection, 
        setStartMusic,
        setSection
    } = useAppStore();

    const isThrottledRef = useRef(false);
    const currentSectionRef = useRef(currentSection);
    const circle1 = useAnimation();
    const circle2 = useAnimation();
    const [conf, setConf] = useState<ConfProps>({
        circle1: {
            left: 0,
            top: 0,
            width: 400,
            height: 400,
            rotate: 0
        },
        circle2: {
            left: 0,
            top: 0,
            width: 400,
            height: 400,
            rotate: 0
        }
    });

    const handleExplore = () => {
        setExplore(true);
        setStartMusic(true);
    };

    const renderSection = () => {
        if (!explore && !intro) return <SectionIntro key="intro" />;
        if (explore && !intro && currentSection === 0) return <Section0 key="section0" />;
        if (explore && !intro && currentSection === 1) return <Section1 key="section1" />;
        if (explore && !intro && currentSection === 2) return <Section2 key="section2" />;
        if (explore && !intro && currentSection === 3) return <Section3 key="section3" />;
        if (explore && !intro && currentSection === 4) return <Section4 key="section4" />;
        if (explore && !intro && currentSection === 5) return <Section5 key="section5" />;
        if (explore && !intro && currentSection === 6) return <Section6 key="section6" />;
        return null;
    };

    useEffect(() => {
        currentSectionRef.current = currentSection;
    }, [currentSection]);

    useEffect(() => {
        const changeSection = (direction: "up" | "down") => {
            if (isThrottledRef.current) return;
            if (intro && !explore) return;

            isThrottledRef.current = true;

            let timeout = setTimeout(() => {
                isThrottledRef.current = false;
                clearTimeout(timeout);
            }, 1000); 

            if (direction === "up" && currentSection < 6) {
                setSection(currentSection + 1);
            }
            
            if (direction === "down" && currentSection !== 0) {
                setSection(currentSection - 1);
            }
        };

        const handleWheel = (e: WheelEvent) => {
            if (e.deltaY > 0 && explore) changeSection("up");
            else if (e.deltaY < 0 && explore) changeSection("down");
        };

        let touchStartY = 0;
        const handleTouchStart = (e: TouchEvent) => {
            touchStartY = e.touches[0].clientY;
        };

        const handleTouchEnd = (e: TouchEvent) => {
            const touchEndY = e.changedTouches[0].clientY;
            const diffY = touchStartY - touchEndY;

            if (Math.abs(diffY) > 50 && explore) {
                if (diffY > 0) changeSection("up");
                else changeSection("down");
            }
        };

        if (explore) {
            let height2 = 50;
            let height1 = 30;
            let width2 = 650;
            let width1 = 200;
            let left1 = windowWidth / 2 + 470;
            let left2 = windowWidth / 2 + 80;
            let top1 = 550;
            let top2 = 580;
            let rotate = -12;
            let conf = {
                circle1: {
                left: 0,
                top: 0,
                width: 700,
                height: 700,
                rotate: 0
                },
                circle2: {
                left: 0,
                top: 0,
                width: 700,
                height: 700,
                rotate: 0
                }
            };

            if (currentSection === 0) {
                width1 = 700;
                width2 = 700;
                height1 = 700;
                height2 = 700;
                rotate = 0;

                if (windowWidth <= 1150) {
                    width1 = 500;
                    width2 = 500;
                    height1 = 500;
                    height2 = 500;
                }

                if (windowWidth <= 768) {
                    width1 = 300;
                    width2 = 300;
                    height1 = 300;
                    height2 = 300;
                }

                left1 = -width1 / 3;
                top1 = -height1 / 3;
                left2 = 0;
                top2 = 0;
            }

            if (currentSection === 1) {
                height1 = 30;
                height2 = 50;
                width1 = 200;
                width2 = 550;
                left1 = windowWidth - width1;
                left2 = windowWidth - width2;
                top1 = window.innerHeight - 230;
                top2 = window.innerHeight - 200;
                rotate = -12;
                
                if (windowWidth <= 1150) {
                    width1 = 80;
                    width2 = 235;
                    height1 = 15;
                    height2 = 20;
                    left1 = windowWidth - width1;
                    left2 = windowWidth - width2;
                    top1 = window.innerHeight - 175;
                    top2 = window.innerHeight - 160;
                }
            }

            if (currentSection === 2) {
                width1 = 400;
                width2 = 400;
                height1 = 400;
                height2 = 400;
                rotate = 0;

                if (windowWidth <= 1150) {
                    width1 = 300;
                    width2 = 300;
                    height1 = 300;
                    height2 = 300;
                }

                if (windowWidth <= 768) {
                    width1 = 300;
                    width2 = 300;
                    height1 = 300;
                    height2 = 300;
                }

                left1 = windowWidth / 2 - width1 / 2 + 20;
                left2 = windowWidth / 2 - width1 / 2 + 40;
                top1 = window.innerHeight / 2 - height1 / 2;
                top2 = window.innerHeight / 2 - height2 / 2 + 20;
            }

            if (currentSection === 3) {
                height1 = 30;
                height2 = 50;
                width1 = 250;
                width2 = 850;
                left1 = 0;
                left2 = 0;
                top1 = 470;
                top2 = 460;
                rotate = 0;
                
                if (windowWidth <= 1150) {
                    width1 = windowWidth * 0.7;
                    width2 = windowWidth * 0.8;
                    height1 = 15;
                    height2 = 20;
                    top1 = 270;
                    top2 = 270;
                    left1 = windowWidth * 0.15;
                    left2 = windowWidth * 0.1;
                }

                if (windowWidth <= 440) {
                    width1 = windowWidth * 0.9;
                    width2 = windowWidth;
                    height1 = 15;
                    height2 = 20;
                    top1 = 150;
                    top2 = 150;
                    left1 = windowWidth * 0.05;
                    left2 = 0;
                }
            }

            if (currentSection === 4) {
                width1 = 700;
                width2 = 600;
                height1 = 700;
                height2 = 600;
                rotate = 0;

                if (windowWidth <= 1150) {
                    width1 = 650;
                    width2 = 550;
                    height1 = 650;
                    height2 = 550;
                }

                if (windowWidth <= 768) {
                    width1 = 500;
                    width2 = 450;
                    height1 = 500;
                    height2 = 450;
                }

                if (windowWidth <= 448) {
                    width1 = 350;
                    width2 = 300;
                    height1 = 350;
                    height2 = 300;
                }

                left1 = windowWidth - width1 * 0.8;
                top1 = -height1 * 0.2;
                left2 = windowWidth - width2 * 0.8;
                top2 = -height2 * 0.2;
            }

            if (currentSection === 5) {
                width1 = 700;
                width2 = 600;
                height1 = 700;
                height2 = 600;
                rotate = 0;

                if (windowWidth <= 1150) {
                    width1 = 650;
                    width2 = 550;
                    height1 = 650;
                    height2 = 550;
                }

                if (windowWidth <= 768) {
                    width1 = 500;
                    width2 = 450;
                    height1 = 500;
                    height2 = 450;
                }

                if (windowWidth <= 448) {
                    width1 = 350;
                    width2 = 300;
                    height1 = 350;
                    height2 = 300;
                }

                left1 = windowWidth - width1 * 0.8;
                top1 = window.innerHeight - height1 * 0.8;
                left2 = windowWidth - width2 * 0.8;
                top2 = window.innerHeight - height2 * 0.8;
            }

            if (currentSection === 6) {
                width1 = 400;
                width2 = 500;
                height1 = 400;
                height2 = 500;
                rotate = 0;

                left1 = windowWidth - width1 - 10;
                top1 = -height1 * 0.25;
                left2 = windowWidth - width2 + 35;
                top2 = -height2 * 0.3;

                if (windowWidth <= 980) {
                    width1 = 400;
                    width2 = 500;
                    height1 = 400;
                    height2 = 500;

                    left1 = windowWidth / 2 - width1 / 2 - 10;
                    top1 = 10;
                    left2 = windowWidth / 2 - width2 / 2 - 10;
                    top2 = -35;
                }

                if (windowWidth <= 440) {
                    width1 = 350;
                    width2 = 300;
                    height1 = 350;
                    height2 = 300;

                    left1 = windowWidth / 2 - width1 / 2;
                    top1 = -45;
                    left2 = windowWidth / 2 - width2 / 2;
                    top2 = -20;
                }
            }

            conf.circle1.width = width1;
            conf.circle1.height = height1;
            conf.circle1.left = left1;
            conf.circle1.top = top1;
            conf.circle1.rotate = rotate;

            conf.circle2.width = width2;
            conf.circle2.height = height2;
            conf.circle2.left = left2;
            conf.circle2.top = top2;
            conf.circle2.rotate = rotate;

            circle1.start({
                translateX: conf.circle1.left,
                translateY: conf.circle1.top,
                rotate: conf.circle1.rotate,
                transition: {
                duration: .5
                }
            });

            circle2.start({
                translateX: conf.circle2.left,
                translateY: conf.circle2.top,
                rotate: conf.circle2.rotate,
                transition: {
                duration: .5
                }
            });

            setConf(conf);
        }

        window.addEventListener("wheel", handleWheel, { passive: true });
        window.addEventListener("touchstart", handleTouchStart, { passive: true });
        window.addEventListener("touchend", handleTouchEnd, { passive: true });

        return () => {
            window.removeEventListener("wheel", handleWheel);
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchend", handleTouchEnd);
        };
    }, [setSection, currentSection, intro, explore, windowWidth]);

    return (
        <div className={styles.container} style={{ background: !explore ? "#111" : colors[currentSection] }}>
            {explore && <motion.div 
                className={styles.circle1} 
                style={{ width: conf.circle1.width, height: conf.circle1.height }}
                animate={circle1}
            />}
            {explore && <motion.div 
                className={styles.circle2} 
                style={{ width: conf.circle2.width, height: conf.circle2.height }}
                animate={circle2}
            />}
            <BackgroundMusic src="/audio/awakening.mp3" />
            {/* <img src="sober5.webp" alt="proto" className={styles.img} /> */}
            <Canvas />
            {explore && !intro && <Navigation />}
            {explore && !intro && <Settings />}
            <AnimatePresence mode="wait">
                {renderSection() && (
                <motion.div
                    key={currentSection + (explore ? "-explore" : "-intro")} 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    style={{ width: "100%" }}
                >
                    {renderSection()}
                </motion.div>
                )}
            </AnimatePresence>
            {!explore && !intro && (
                <Button
                text="Начать исследование"
                onClick={handleExplore}
                size={window.innerWidth < 768 ? "medium" : "large"}
                borderColor="#D32F2F"
                left={window.innerWidth < 768 ? "calc(50% - 100px)" : "calc(50% - 120px)"}
                top="calc(100% - 100px)"
                delay={11}
                />
            )}
        </div>
    );
}
