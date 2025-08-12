import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useTransform, useAnimationFrame, animate  } from "framer-motion";

import { useConstructorStore } from "../../store/constructorStore";
import { useAppStore } from "../../store/useAppStore";
import { getPositionConfig } from "../../utils/utils";

import Typing from "../typing/Typing";
import { Svg } from "../svgs/Svg.module";

import styles from "./Section2.module.css";

export default function Section2({ data }: any) {
  const scrollableRef = useRef<HTMLDivElement>(null);
  const listLength = data?.list?.length ?? 0;
  const STEP = 360 / listLength;

  const { activePoint } = useConstructorStore();
  const { landingData, currentSection, windowWidth } = useAppStore();
  const limiter = activePoint === 768 || activePoint === 440 || window.innerWidth <= 768;
  const labelLimiter = activePoint === 1150 || window.innerWidth <= 1150;

  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  const rotate = useMotionValue(0);
  let prevStep = useRef(-1);
  
  const labelRotates = Array.from({ length: listLength }, () => useMotionValue(0));

  const reversedLabelRotates = labelRotates.map(val => useTransform(val, v => v));

  const handleHover = (hover: boolean, index: number | null) => {
    setIsHovered(hover);
    setActiveIndex(index);
  };

  const conf = getPositionConfig(
    activePoint === 1281 ? windowWidth : activePoint,
    landingData?.components[currentSection]?.textConfig,
    "circle"
  );

  useEffect(() => {
    const node = scrollableRef.current;
    if (!node) return;

    const preventGlobalScroll = (e: WheelEvent | TouchEvent) => {
      const el = node;

      const isAtTop = el.scrollTop === 0;
      const isAtBottom = el.scrollHeight - el.scrollTop === el.clientHeight;

      if (
        (e instanceof WheelEvent && (
          (e.deltaY < 0 && isAtTop) ||
          (e.deltaY > 0 && isAtBottom)
        )) ||
        (e instanceof TouchEvent && el.scrollHeight <= el.clientHeight)
      ) {
        // В этих случаях не предотвращаем, дайте перейти секцию
        return;
      }

      // Предотвратить глобальный скролл
      e.stopPropagation();
    };

    node.addEventListener("wheel", preventGlobalScroll, { passive: false });
    node.addEventListener("touchmove", preventGlobalScroll, { passive: false });

    return () => {
      node.removeEventListener("wheel", preventGlobalScroll);
      node.removeEventListener("touchmove", preventGlobalScroll);
    };
  }, []);

  useAnimationFrame((_, delta) => {
    if (!isHovered && !initialLoad) {
      const current = rotate.get();
      const next = current - (delta / 1000) * 6;
      rotate.set(next);

      const step = Math.floor((Math.abs(next) + STEP / 2) / STEP); 
      if (step !== prevStep.current) {
        prevStep.current = step;
        
        labelRotates.forEach((val, i) => {
          animate(val, step * STEP, {
            type: "spring",
            stiffness: 300,
            damping: 15,
            delay: i * Math.random(), 
          });
        });
      }
    }
  });

  useEffect(() => {
    if (initialLoad) {
      rotate.set(0);
      setTimeout(() => {
        setInitialLoad(false);
      }, 500); 
    }
  }, [initialLoad]);

  return (
    <div className={styles.container}>
      <Typing
        text={data.title}
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
        <Typing
          text={data.text1}
          className={`${styles.descr1} descr-l${limiter ? "Preview" : ""}`}
          color={data?.textColor}
        />
      </div>
      {isHovered && activeIndex !== null && <div style={{ color: data.color }} className={`${styles.popup} descr-l${limiter ? "Preview" : ""}`}>{data.list[activeIndex].text}</div>}
      <motion.div 
        style={{ rotate }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          scale: { duration: 0.5, type: "spring", stiffness: 200, damping: 18 },
        }} 
        className={styles[!labelLimiter ? "labels" : "labelsPreview"]} 
      >
        {listLength > 0 && data?.list?.map((label: any, i: number) => {
          return (
            <motion.div
              key={i}
              className={`${styles[!labelLimiter ? "labelWrap" : "labelWrapPreview"]} ${styles[`label${i + 1}${!labelLimiter ? "Preview" : ""}`]}`}
              onMouseEnter={() => handleHover(true, i)}
              onMouseLeave={() => handleHover(false, null)}
              onTouchStart={() => handleHover(true, i)}
              onTouchEnd={() => handleHover(false, null)}
              style={{ rotate: reversedLabelRotates[i] }}
            >
              <div style={{ color: data.color }} className={`${styles[!labelLimiter ? "labelBg" : "labelBgPreview"]} ${activeIndex === i ? styles.active : null}`}>{label.type === "text" ? label.content : <Svg size={{ xs: 40, sm: 40, md: 40, lg: 50 }} svgName={label.content} color={data.color} />}</div>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  );
}
