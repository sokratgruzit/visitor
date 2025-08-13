import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { useAppStore } from "../../store/useAppStore";
import { useConstructorStore } from "../../store/constructorStore";
import { getPositionConfig, invertHexColor } from "../../utils/utils";

import { Navigation } from "../navigation/Navigation";
import { Settings } from "../settings/Settings";
import { Canvas } from "../animation/Canvas";
import { Svg } from "../svgs/Svg.module";
import SectionIntro from "../sections/SectionIntro";
import Section0 from "../sections/Section0";
import Section1 from "../sections/Section1";
import Section2 from "../sections/Section2";
import Section3 from "../sections/Section3";
import Section4 from "../sections/Section4";
import Section5 from "../sections/Section5";
import Section6 from "../sections/Section6";
import Section7 from "../sections/Section7";
import BackgroundMusic from "../music/BackgroundMusic";

import styles from "./Preview.module.css";

export const Preview = () => {
    const [isHovered, setIsHovered] = useState(false);

    const { 
        explore, 
        windowWidth,
        currentSection, 
        landingData,
        setSection
    } = useAppStore();

    const {
        activePoint,
        selectedComponentId,
        setActivePoint,
        setSelectedComponentId
    } = useConstructorStore();

    const isThrottledRef = useRef(false);
    const currentSectionRef = useRef(currentSection);
    const showCircles = landingData?.components[currentSection]?.showCircles;
    const circleConf1 = landingData?.components[currentSection]?.circle1 || [];
    const circleConf2 = landingData?.components[currentSection]?.circle2 || [];
    const c1Conf = getPositionConfig(activePoint === 1281 ? windowWidth : activePoint, circleConf1, "circle");
    const c2Conf = getPositionConfig(activePoint === 1281 ? windowWidth : activePoint, circleConf2, "circle");
    const circle1 = useAnimation();
    const circle2 = useAnimation();
    const controls = useAnimation();

    const renderSection = (section: number) => {
        let compType = landingData?.components[section]?.type;
        let compKey = landingData?.components[section]?.id;
        let compData = landingData?.components[section];
        
        if (compType === "intro") return <SectionIntro data={compData} key={compKey} />;
        if (compType === "multitext") return <Section0 data={compData} key={compKey} />;
        if (compType === "text") return <Section1 data={compData} key={compKey} />;
        if (compType === "iconic") return <Section2 data={compData} key={compKey} />;
        if (compType === "multitext2") return <Section3 data={compData} key={compKey} />;
        if (compType === "list") return <Section4 data={compData} key={compKey} />;
        if (compType === "iconiclist") return <Section5 data={compData} key={compKey} />;
        if (compType === "links") return <Section6 data={compData} key={compKey} />;
        if (compType === "image") return <Section7 data={compData} key={compKey} />;
        
        return null;
    };

    const handleHoverStart = () => {
        setIsHovered(true);
    };

    const handleHoverEnd = () => {
        setIsHovered(false);
    };

    useEffect(() => {
        currentSectionRef.current = currentSection;
    }, [currentSection]);

    useEffect(() => {
        let opts = { rotate: 0, transition: { duration: 0.3, ease: "easeInOut" }};

        if (isHovered) opts = { rotate: 120, transition: { duration: 0.3, ease: "easeInOut" }};

        controls.start(opts);
    }, [isHovered]);

    useEffect(() => {
        const changeSection = (direction: "up" | "down") => {
            if (isThrottledRef.current) return;
            if (selectedComponentId !== null) return;

            isThrottledRef.current = true;

            let timeout = setTimeout(() => {
                isThrottledRef.current = false;
                clearTimeout(timeout);
            }, 1000); 

            if (direction === "up" && currentSection < landingData?.components?.length - 1) {
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

        if (showCircles) {
            circle1.start({
                translateX: c1Conf?.left,
                translateY: c1Conf?.top,
                rotate: c1Conf?.rotate,
                transition: {
                    duration: .5
                }
            });

            circle2.start({
                translateX: c2Conf?.left,
                translateY: c2Conf?.top,
                rotate: c2Conf?.rotate,
                transition: {
                    duration: .5
                }
            });
        }

        window.addEventListener("wheel", handleWheel, { passive: true });
        window.addEventListener("touchstart", handleTouchStart, { passive: true });
        window.addEventListener("touchend", handleTouchEnd, { passive: true });

        return () => {
            window.removeEventListener("wheel", handleWheel);
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchend", handleTouchEnd);
        };
    }, [
        setSection, 
        currentSection, 
        explore,
        c1Conf.rotate,
        c1Conf.top,
        c1Conf.left,
        c2Conf.rotate,
        c2Conf.top,
        c2Conf.left,
        windowWidth, 
        showCircles,
        selectedComponentId,
        activePoint
    ]);

    useEffect(() => {
        let p = 1281;

		if (windowWidth <= 440) p = 440;
		if (windowWidth > 440 && windowWidth <= 768) p = 768;
		if (windowWidth > 768 && windowWidth <= 1150) p = 1150;
		if (windowWidth > 1150 && windowWidth <= 1280) p = 1280;

		setActivePoint(p);
    }, []);
    
    return (
        <div 
            className={styles.container} 
            style={{ 
                background: landingData?.components[currentSection]?.color,
                width: activePoint === 1281 ? "100%" : activePoint
            }}
        >
            {landingData?.components[currentSection]?.showCircles && <motion.div 
                className={styles.circle1} 
                style={{ width: c1Conf.width, height: c1Conf.height }}
                animate={circle1}
            />}
            {landingData?.components[currentSection]?.showCircles && <motion.div 
                className={styles.circle2} 
                style={{ width: c2Conf.width, height: c2Conf.height }}
                animate={circle2}
            />}
            <motion.div 
                onClick={() => setSelectedComponentId(landingData?.components[currentSection]?.id)} 
                className={styles.settingsIcon}
                onHoverStart={handleHoverStart}
                onHoverEnd={handleHoverEnd}
                onTapStart={handleHoverStart}
                onTapCancel={handleHoverEnd}
                onTap={() => handleHoverEnd()}
                animate={controls}
            >
                <Svg size={{ xs: 50, sm: 50, md: 60, lg: 60 }} svgName="Settings" color={invertHexColor(landingData?.components[currentSection]?.color || "#FFFFFF")} />
            </motion.div>
            <BackgroundMusic src={landingData?.audio} />
            {/* <img src="sober5.webp" alt="proto" className={styles.img} /> */}
            {landingData?.components[currentSection]?.canvas && <Canvas />}
            {landingData?.components[currentSection]?.showNav && <Navigation />}
            {landingData?.components[currentSection]?.showSettings && <Settings />}
            <AnimatePresence mode="wait">
                {renderSection(currentSection) && (
                <motion.div
                    key={currentSection + (explore ? "-explore" : "-intro") + selectedComponentId} 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    style={{ width: "100%" }}
                >
                    {renderSection(currentSection)}
                </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
