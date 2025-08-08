import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import { useAppStore } from "../../store/useAppStore";
import { useConstructorStore } from "../../store/constructorStore";

import Typing from "../typing/Typing";
import Button from "../ui/button/Button";

import styles from "./SectionIntro.module.css";

export default function SectionIntro({ data }: any) {
  const [startSecondBlock, setStartSecondBlock] = useState<boolean>(false);

  const { 
    explore, 
    landingData,
    setStartMusic,
    setExplore,
    setSection
  } = useAppStore();

  const { activePoint } = useConstructorStore();
  const limiter = activePoint === 768 || activePoint === 440 || window.innerWidth <= 768;

  const handleExplore = () => {
    setExplore(true);
    setSection(1);
    if (landingData.playMusic) setStartMusic(true);
  };

  useEffect(() => {
    let timeout = setTimeout(() => {
      setStartSecondBlock(true);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className={styles.container}>
      <Typing
        text={data?.title || ""}
        className={`${styles.title} title-l${limiter ? "Preview" : ""} texturedType`}
        showCursor={false}
      />
      {startSecondBlock && <Typing
        text={data?.text1 || ""}
        className={`${styles.subtitle} descr-l${limiter ? "Preview" : ""}`}
      />}
      <motion.span 
        className={`${styles.endPhrase} descr-l${limiter ? "Preview" : ""}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          damping: 10,
          stiffness: 200,
          duration: .7,
          delay: 9
        }}
      >{data?.text2 || ""}</motion.span>
      {!explore && (
        <Button
          text={landingData.introBtn}
          onClick={handleExplore}
          size={limiter ? "medium" : "large"}
          borderColor="#D32F2F"
          left={limiter ? "calc(50% - 100px)" : "calc(50% - 120px)"}
          top="calc(100% - 100px)"
          delay={11}
        />
      )}
    </div>
  );
}
