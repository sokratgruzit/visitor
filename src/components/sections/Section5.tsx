import Typing from "../typing/Typing";

import { Svg } from "../svgs/Svg.module";

import styles from "./Section5.module.css";

export default function Section5({ data }: any) {
  return (
    <div className={styles.container}>
      <Typing
        text={data.title}
        className={`${styles.title} texturedType`}
        showCursor={false}
      />
      <div className={styles.blockWrap}>
        {data.list.map((item: any) => {
          return (
            <div key={item.text} className={`${styles.descr1} descr-l`}>
              <Svg classId={item.classId} svgName={item.icon} />
              {item.text}
            </div>
          )
        })}
      </div>
    </div>
  );
}
