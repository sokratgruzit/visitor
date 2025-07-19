import { useEffect, useRef } from "react";

import Typing from "../typing/Typing";

import styles from "./Section1.module.css";

export default function Section1() {
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
        text="История проекта"
        className={`${styles.title} texturedType`}
        showCursor={false}
      />
      <div ref={scrollableRef} className={styles.scrollable}>
        <Typing
          text="Идея Sober Man родилась из наблюдения за близкими, которые проходили через сложный путь отказа от алкоголя. После лечения им часто не хватало поддержки, мотивации и ощущение, что они не одни."
          className={`${styles.descr1} descr-l`}
        />
        <Typing
          text="Многие срываются, потому что после клиники их встречает пустота — и мы хотим это изменить."
          className={`${styles.descr2} descr-l`}
        />
      </div>
    </div>
  );
}
