import { motion } from "framer-motion";
import { useEffect } from "react";

import { useAppStore } from "../../store/useAppStore";

import Button from "../ui/button/Button";

import styles from "./Settings.module.css";

export function Settings() {
  const colors = ["#98BFF6", "#EDB948", "#63C5AB", "#EF9F64", "#F4696B", "#64d6e2", "#FFFFF0"];

  const { 
    currentSection, 
    startMusic, 
    autoPlayback, 
    setAutoPlayback, 
    setStartMusic,
    setSection
  } = useAppStore();

  useEffect(() => {
    const timeouts = [2000, 2000, 2000, 2000, 2000, 2000, 2000];
    let timeout: ReturnType<typeof setTimeout>;

    const switchToNextSection = () => {
      if (currentSection < 7) {
        timeout = setTimeout(() => {
          setSection(currentSection + 1);
          switchToNextSection();
        }, timeouts[currentSection]);
      } else {
        setAutoPlayback(false);
        clearTimeout(timeout);
      }
    };

    if (autoPlayback) switchToNextSection();

    return () => clearTimeout(timeout);
  }, [currentSection, autoPlayback]);

  return (
    <div className={styles.container}>
      <Button
        onClick={() => setAutoPlayback(!autoPlayback)}
        size="small"
        borderColor="#FFF"
        left="0px"
        top="0px"
        icon={<>
          {!autoPlayback && <motion.img 
            src="/images/reverse.svg" 
            alt="reverse" 
            className={styles.icon2} 
            initial={{ rotate: 0, scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ rotate: 180 }}
            transition={{
              rotate: {
                duraion: .3
              },
              scale: {
                duration: .3,
                stiffness: 200,
                damping: 10,
                type: "spring"
              },
              opacity: {
                duration: .3
              }
            }}
          />}
          {autoPlayback && <motion.div 
            className={styles.square}
            initial={{ rotate: 0, scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ rotate: 180 }}
            transition={{
              rotate: {
                duraion: .3
              },
              scale: {
                duration: .3,
                stiffness: 200,
                damping: 10,
                type: "spring"
              },
              opacity: {
                duration: .3
              }
            }}
          />}
        </>}
        bg={colors[currentSection]}
        labelColor={colors[currentSection]}
        labelText="Прокрутить автоматически"
        disabled={currentSection === 6}
        section={currentSection}
      />
      <Button
        onClick={() => setStartMusic(!startMusic)}
        size="small"
        borderColor="#FFF"
        left="0px"
        top={window.innerWidth <= 768 ? "60px" : "100px"}
        icon={<span 
          className={styles.soundIconWrap}
        >
          <motion.span 
            className={styles.line} 
            initial={{ opacity: !startMusic ? 0 : 1, scale: !startMusic ? 0 : 1, rotate: -50 }}
            animate={{ opacity: !startMusic ? 1 : 0, scale: !startMusic ? 1 : 0, rotate: -50 }}
            transition={{
              duration: .3,
              ease: "easeInOut"
            }}
          />
          <motion.img 
            src="/images/sound.svg" 
            alt="sound" 
            className={styles.icon} 
            initial={{ rotate: 0 }}
            whileHover={{ rotate: 180 }}
            transition={{
              duration: .3
            }}
          />
        </span>}
        bg={colors[currentSection]}
        labelColor={colors[currentSection]}
        labelText="Просмотреть со звуком"
        section={currentSection}
      />
    </div>
  );
}
