import { useEffect, useRef } from "react";

import Typing from "../typing/Typing";

import styles from "./Section0.module.css";

export default function Section0({ data }: any) {
  const scrollableRef = useRef<HTMLDivElement>(null);

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
        text={data.title}
        className={`${styles.title} texturedType`}
        showCursor={false}
      />
      <div ref={scrollableRef} className={styles.scrollable}>
        <Typing
          text={data.text1}
          className={`${styles.descr1} descr-l`}
        />
        <Typing
          text={data.text2}
          className={`${styles.descr3} descr-l`}
        />
        <Typing
          text={data.text3}
          className={`${styles.descr2} descr-l`}
        />
      </div>
    </div>
  );
}
