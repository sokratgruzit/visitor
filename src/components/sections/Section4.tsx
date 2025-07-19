import Typing from "../typing/Typing";

import styles from "./Section4.module.css";

export default function Section4() {
  return (
    <div className={styles.container}>
      <Typing
        text="Уникальность"
        className={`${styles.title} texturedType`}
        showCursor={false}
      />
      <div className={styles.blockWrap}>
        <div className={`${styles.descr1} descr-l`}>Комбинация геймификации, ИИ и поддержки семьи</div>
        <div className={`${styles.descr1} descr-l`}>Настройка под конкретного человека, его интересы и цели</div>
        <div className={`${styles.descr1} descr-l`}>Эмоциональная вовлеченность через визуал, миссии и уровни</div>
        <div className={`${styles.descr1} descr-l`}>Возможность влиять на жизнь близкого, не давя на него</div>
      </div>
    </div>
  );
}
