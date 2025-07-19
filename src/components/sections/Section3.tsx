import { useEffect, useRef } from "react";

import Typing from "../typing/Typing";

import styles from "./Section3.module.css";

export default function Section3() {
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
        text="Зачем это нужно?"
        className={`${styles.title} texturedType`}
        showCursor={false}
      />
      <div ref={scrollableRef} className={styles.scrollable}>
        <Typing
          text="Через геймификацию, наставничество, прогресс в фото, подарки от близких и реальные бонусы — мы превращаем трезвость не в страдание, а в приключение с наградой."
          className={`${styles.descr1} descr-l`}
        />
        <Typing
          text="Алкоголизм — это не просто вредная привычка. Это системная, разрушительная зависимость, которая ежегодно уносит миллионы жизней и разрушает семьи по всему миру. По оценкам Всемирной организации здравоохранения, каждый третий взрослый сталкивался с проблемами, связанными с алкоголем — лично или через близких."
          className={`${styles.descr2} descr-l`}
        />
        <Typing
          text="Многие государства и медицинские учреждения предлагают первичный курс лечения. Это детоксикация, реабилитационные центры, краткосрочные программы. Но вот что происходит потом?"
          className={`${styles.descr3} descr-l`}
        />
      </div>
    </div>
  );
}
