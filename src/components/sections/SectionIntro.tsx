import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

import { useAppStore } from "../../store/useAppStore";
import { useConstructorStore } from "../../store/constructorStore";
import { getPositionConfig } from "../../utils/utils";

import Typing from "../typing/Typing";
import Button from "../ui/button/Button";
import styles from "./SectionIntro.module.css";

export default function SectionIntro({ data }: any) {
  const [startSecondBlock, setStartSecondBlock] = useState(false);
  const scrollableRef = useRef<HTMLDivElement>(null);

  const { landingData, currentSection, windowWidth, setStartMusic, setExplore, setSection } = useAppStore();
  const { activePoint } = useConstructorStore();

  const limiter = activePoint === 768 || activePoint === 440 || window.innerWidth <= 768;

  const conf = getPositionConfig(
    activePoint === 1281 ? windowWidth : activePoint,
    landingData?.components[currentSection]?.textConfig,
    "circle"
  );

  const handleExplore = () => {
    setExplore(true);
    setSection(currentSection + 1);
    if (landingData.playMusic) setStartMusic(true);
  };

  useEffect(() => {
    const timeout = setTimeout(() => setStartSecondBlock(true), 2000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const node = scrollableRef.current;
    if (!node) return;

    const preventGlobalScroll = (e: WheelEvent | TouchEvent) => {
      const isAtTop = node.scrollTop === 0;
      const isAtBottom = node.scrollHeight - node.scrollTop === node.clientHeight;

      if (
        (e instanceof WheelEvent &&
          ((e.deltaY < 0 && isAtTop) || (e.deltaY > 0 && isAtBottom))) ||
        (e instanceof TouchEvent && node.scrollHeight <= node.clientHeight)
      ) {
        return;
      }
      e.stopPropagation();
    };

    node.addEventListener("wheel", preventGlobalScroll, { passive: false });
    node.addEventListener("touchmove", preventGlobalScroll, { passive: false });

    return () => {
      node.removeEventListener("wheel", preventGlobalScroll);
      node.removeEventListener("touchmove", preventGlobalScroll);
    };
  }, []);

  return (
    <div className={styles.container}>
      <Typing
        text={data?.title || ""}
        className={`${data?.titlePosition} title-l${limiter ? "Preview" : ""} ${data?.titleColor}`}
        showCursor={false}
      />
      <div
        className="text-container scrollable"
        ref={scrollableRef}
        style={{
          top: conf.top,
          left: `${conf.left}%`,
          width: conf.width,
          height: conf.height,
          borderColor: data?.textColor,
          background: data?.color
        }}
      >
        {startSecondBlock && (
          <Typing
            text={data?.text1 || ""}
            className={`${styles.subtitle} descr-l${limiter ? "Preview" : ""}`}
            color={data?.textColor}
          />
        )}
        <motion.span
          className={`${styles.endPhrase} descr-l${limiter ? "Preview" : ""}`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{ color: data?.textColor }}
          transition={{
            type: "spring",
            damping: 10,
            stiffness: 200,
            duration: 0.7,
            delay: 2
          }}
        >
          {data?.text2 || ""}
        </motion.span>
      </div>
      <Button
        text={landingData.introBtn}
        onClick={handleExplore}
        size={limiter ? "medium" : "large"}
        left={limiter ? "calc(50% - 100px)" : "calc(50% - 120px)"}
        top="calc(100% - 100px)"
        delay={4}
        disabled={landingData.components.length < 2}
      />
    </div>
  );
}
