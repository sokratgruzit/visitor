import Typing from "../typing/Typing";

import { Svg } from "../svgs/Svg.module";

import styles from "./Section6.module.css";

export default function Section6({ data }: any) {
  return (
    <div className={styles.container}>
      <Typing
        text={data.title}
        className={`${styles.title} texturedType2`}
        showCursor={false}
      />
      <div className={styles.supportBlock}>
        <Typing
          text={data.text1}
          className={`${styles.descr1} texturedType2`}
          showCursor={false}
        />
        {data.links.map((item: any) => {
          return (
            <a key={item.link} href={item.link} target="_blank">
              <Svg classId={item.classId} svgName={item.icon} />
            </a>
          )
        })}
      </div>
    </div>
  );
}
