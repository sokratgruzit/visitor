import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import Typing from "../typing/Typing";

import styles from "./SectionIntro.module.css";

export default function SectionIntro() {
  const [startSecondBlock, setStartSecondBlock] = useState<boolean>(false);

  useEffect(() => {
    let timeout = setTimeout(() => {
      setStartSecondBlock(true);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className={styles.container}>
      <Typing
        text="Добро пожаловать в Sober Man"
        className={`${styles.title} title-l texturedType`}
        showCursor={false}
      />
      {startSecondBlock && <Typing
        text="Многие срываются, потому что после клиники их встречает пустота — "
        className={`${styles.subtitle} descr-l`}
      />}
      <motion.span 
        className={`${styles.endPhrase} descr-l`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          damping: 10,
          stiffness: 200,
          duration: .7,
          delay: 9
        }}
      >и мы хотим это изменить.</motion.span>
    </div>
  );
}
