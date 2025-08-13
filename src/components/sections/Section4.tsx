import { useEffect, useRef } from "react";

import { useConstructorStore } from "../../store/constructorStore";
import { useAppStore } from "../../store/useAppStore";
import { getPositionConfig } from "../../utils/utils";

import Typing from "../typing/Typing";

import styles from "./Section4.module.css";

export default function Section4({ data }: any) {
  const scrollableRef = useRef<HTMLDivElement>(null);
  const { activePoint } = useConstructorStore();
  const { landingData, currentSection, windowWidth } = useAppStore();

  const limiter = activePoint === 768 || activePoint === 440 || window.innerWidth <= 768;

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

  return (
    <div className={styles.container}>
      <Typing
        text="Уникальность"
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
        {data.list.map((text: string, idx: number) => {
          return <div key={text + idx} style={{ color: data?.textColor }} className={`${styles.descr1} descr-l${limiter ? "Preview" : ""}`}>{text}</div>
        })}
      </div>
    </div>
  );
}
