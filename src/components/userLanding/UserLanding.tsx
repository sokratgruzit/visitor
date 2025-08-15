import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import { useAppStore } from "../../store/useAppStore";
import { getPositionConfig } from "../../utils/utils";
import { getLandingBySlug } from "../../api/constructor";
import { useNotificationStore } from "../../store/notificationStore";

import { Navigation } from "../navigation/Navigation";
import { Settings } from "../settings/Settings";
import { Canvas } from "../animation/Canvas";
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

import styles from "./UserLanding.module.css";

export const UserLanding = () => {
    const { 
        explore, 
        windowWidth,
        currentSection, 
        landingData,
        setSection,
        setLandingData
    } = useAppStore();
    const notify = useNotificationStore((state) => state.showNotification);

    const isThrottledRef = useRef(false);
    const currentSectionRef = useRef(currentSection);
    const showCircles = landingData?.components[currentSection]?.showCircles;
    const circleConf1 = landingData?.components[currentSection]?.circle1 || [];
    const circleConf2 = landingData?.components[currentSection]?.circle2 || [];
    const c1Conf = getPositionConfig(windowWidth, circleConf1, "circle");
    const c2Conf = getPositionConfig(windowWidth, circleConf2, "circle");
    const circle1 = useAnimation();
    const circle2 = useAnimation();
    const { slug } = useParams();

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

    useEffect(() => {
        currentSectionRef.current = currentSection;
    }, [currentSection]);

    useEffect(() => {
        const getLanging = async (slug: string | null) => {
            const response = await getLandingBySlug(slug);

            if (response.success) {
                notify({ type: "success", message: response.message });
                setLandingData(response.landing);
            } else {
                notify({ type: "error", message: response.message });
            }
        };

        if (slug) getLanging(slug);
    }, [slug]);

    useEffect(() => {
        const changeSection = (direction: "up" | "down") => {
            if (isThrottledRef.current) return;

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
    }, [setSection, currentSection, explore, windowWidth]);

    return (
        <div className={styles.container} style={{ background: landingData?.components[currentSection].color }}>
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
            <BackgroundMusic src={landingData?.audio} />
            {/* <img src="sober5.webp" alt="proto" className={styles.img} /> */}
            {landingData?.components[currentSection].canvas && <Canvas />}
            {explore && <Navigation />}
            {explore && <Settings />}
            <AnimatePresence mode="wait">
                {renderSection(currentSection) && (
                <motion.div
                    key={currentSection + (explore ? "-explore" : "-intro")} 
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
