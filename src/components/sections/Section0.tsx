import { useEffect, useRef } from "react";

import Typing from "../typing/Typing";

import styles from "./Section0.module.css";

export default function Section0() {
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
        text="Кто мы?"
        className={`${styles.title} texturedType`}
        showCursor={false}
      />
      <div ref={scrollableRef} className={styles.scrollable}>
        <Typing
          text="Привет! Меня зовут Давид, я основатель и фронтенд-разработчик проекта Sober Man. У меня за плечами опыт в стартапах, разработке продуктов и управлении. Сейчас я собрался создать что-то по-настоящему важное — приложение, которое может изменить чью-то жизнь."
          className={`${styles.descr1} descr-l`}
        />
        <Typing
          text="Над мобильной частью проекта будет работать отдельный разработчик. Других участников команды мы планируем нанять в ближайшее время."
          className={`${styles.descr3} descr-l`}
        />
        <Typing
          text="Sober Man — это не просто идея. Это история, через которую я прошёл сам. Я знаю, каково это — бороться, срываться, собирать себя заново. Именно поэтому я хочу создать инструмент, который реально помогает. Без морализаторства, без шаблонов — с поддержкой, пониманием и настоящей ценностью для человека."
          className={`${styles.descr2} descr-l`}
        />
      </div>
    </div>
  );
}
