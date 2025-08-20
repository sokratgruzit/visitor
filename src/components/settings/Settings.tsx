import { motion } from "framer-motion";
import { useEffect } from "react";

import { useAppStore } from "../../store/useAppStore";
import { useConstructorStore } from "../../store/constructorStore";

import Button from "../ui/button/Button";
import { Svg } from "../svgs/Svg.module";

import styles from "./Settings.module.css";

export function Settings() {
  const { 
    currentSection, 
    startMusic, 
    autoPlayback, 
    landingData,
    setAutoPlayback, 
    setStartMusic,
    setSection
  } = useAppStore();

  const { activePoint } = useConstructorStore();
  const limiter = window.innerWidth <= 768 || activePoint === 768 || activePoint === 440;

  useEffect(() => {
    const timeouts = Array(landingData.components.length).fill(2000);
    let timeout: ReturnType<typeof setTimeout>;

    const switchToNextSection = () => {
      if (currentSection < landingData.components.length) {
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
    <div className={styles[`container${limiter ? "Preview" : ""}`]}>
      <Button
        onClick={() => setAutoPlayback(!autoPlayback)}
        size={limiter ? "preview" : "small"}
        left="0px"
        top="0px"
        icon={<>
          {!autoPlayback && <motion.div 
            className={styles.icon} 
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
          >
            <Svg svgName="RotateRightTwoTone" size={{ xs: 27, sm: 27, md: 35, lg: 35 }} color={landingData.components[currentSection].color} />
          </motion.div>}
          {autoPlayback && <motion.div 
            className={styles.icon}
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
          >
            <Svg svgName="StopOutlined" size={{ xs: 27, sm: 27, md: 35, lg: 35 }} color={landingData.components[currentSection].color} />
          </motion.div>}
        </>}
        labelColor={landingData.components[currentSection].color}
        labelText="Прокрутить автоматически"
        disabled={currentSection === landingData.components.length - 1}
        section={currentSection}
        color={landingData.components[currentSection].color}
        btnColor={landingData.components[currentSection].btn}
        limiter={limiter}
      />
      <Button
        onClick={() => setStartMusic(!startMusic)}
        size={limiter ? "preview" : "small"}
        left="0px"
        top={limiter ? "60px" : "100px"}
        icon={<span 
          className={styles.soundIconWrap}
        >
          <motion.span 
            className={styles.line} 
            style={{ background: landingData.components[currentSection].color }}
            initial={{ opacity: !startMusic ? 0 : 1, scale: !startMusic ? 0 : 1, rotate: -50 }}
            animate={{ opacity: !startMusic ? 1 : 0, scale: !startMusic ? 1 : 0, rotate: -50 }}
            transition={{
              duration: .3,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className={styles.icon} 
            initial={{ rotate: 0 }}
            whileHover={{ rotate: 180 }}
            transition={{
              duration: .3
            }}
          >
            <Svg svgName="VolumeUp" size={{ xs: 27, sm: 27, md: 35, lg: 35 }} color={landingData.components[currentSection].color} />
          </motion.div>
        </span>}
        labelColor={landingData.components[currentSection].color}
        labelText="Просмотреть со звуком"
        section={currentSection}
        color={landingData.components[currentSection].color}
        btnColor={landingData.components[currentSection].btn}
        limiter={limiter}
      />
    </div>
  );
}
