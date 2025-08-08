import Typing from "../typing/Typing";

import styles from "./Section4.module.css";

export default function Section4({ data }: any) {
  return (
    <div className={styles.container}>
      <Typing
        text="Уникальность"
        className={`${styles.title} texturedType`}
        showCursor={false}
      />
      <div className={styles.blockWrap}>
        {data.texts.map((text: string) => {
          return <div key={text} className={`${styles.descr1} descr-l`}>{text}</div>
        })}
      </div>
    </div>
  );
}
