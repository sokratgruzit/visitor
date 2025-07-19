import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";

import { useAppStore } from "../../store/useAppStore";

import Button from "../ui/button/Button";

import styles from "./Navigation.module.css";

export function Navigation() {
  const colors = ["#98BFF6", "#EDB948", "#63C5AB", "#EF9F64", "#F4696B", "#64d6e2", "#FFFFF0"];
  const titles = [
    "Кто мы?",
    "История проекта",
    "Что такое Sober Man?",
    "Зачем это нужно?",
    "Уникальность",
    "Куда пойдут средства?",
    "Как поддержать",
  ];

  const [navPosition, setNavPosition] = useState<string>("right");
  const [stylePosition, setStylePosition] = useState<string>("right");

  const { currentSection, setSection, windowWidth, explore } = useAppStore();

  const navControls = useAnimation();
  const numberControls = useAnimation();
  const prevBtnControls = useAnimation();
  const nextBtnControls = useAnimation();


  useEffect(() => {
    let position = "right";

    if (currentSection === 1 || currentSection === 4 || currentSection === 5 || currentSection === 6) position = "bottom";
    if (currentSection === 2) position = "top";

    setNavPosition(position);
    setStylePosition("");

    if (position === "right") {
      let x = window.innerWidth <= 768 ? window.innerWidth - 140 : window.innerWidth - 230;
      let y = window.innerWidth <= 768 ? window.innerHeight / 2 - 40 / 2 : window.innerHeight / 2 - 100 / 2;

      navControls.start({
        x: x,               
        y: y,       
        rotate: 90,
        transition: {
          duration: 1,
          type: "spring",
          stiffness: 100,
          damping: 15
        }
      })
      .then(() => {
        setStylePosition(position);
      });

      numberControls.start({      
        rotate: 270,
        transition: {
          duration: 1,
          type: "spring",
          stiffness: 300,
          damping: 10,
          delay: .5
        }
      });
    }

    if (position === "bottom") {
      let x = window.innerWidth <= 768 ? window.innerWidth / 2 - 200 / 2 : window.innerWidth / 2 - 300 / 2;
      let y = window.innerWidth <= 768 ? window.innerHeight - 60 : window.innerHeight - 130;

      navControls.start({
        x: x,               
        y: y,       
        rotate: 0,
        transition: {
          duration: 1,
          type: "spring",
          stiffness: 100,
          damping: 15
        }
      })
      .then(() => {
        setStylePosition(position);
      });

      numberControls.start({      
        rotate: 0,
        transition: {
          duration: 1,
          type: "spring",
          stiffness: 300,
          damping: 10,
          delay: .5
        }
      });
    }

    if (position === "top") {
      let x = window.innerWidth <= 768 ? window.innerWidth / 2 - 200 / 2 : window.innerWidth / 2 - 300 / 2;
      let y = 30;

      navControls.start({
        x: x,               
        y: y,         
        rotate: 0,
        transition: {
          duration: 1,
          type: "spring",
          stiffness: 100,
          damping: 15
        }
      })
      .then(() => {
        setStylePosition(position);
      });

      numberControls.start({      
        rotate: 0,
        transition: {
          duration: 1,
          type: "spring",
          stiffness: 300,
          damping: 10,
          delay: .5
        }
      });
    }

    prevBtnControls.start({      
      rotate: [0, 90],
      transition: {
        duration: 1,
        type: "spring",
        stiffness: 300,
        damping: 7,
        delay: .2
      }
    });

    nextBtnControls.start({      
      rotate: [0, -90],
      transition: {
        duration: 1,
        type: "spring",
        stiffness: 300,
        damping: 7,
        delay: .2
      }
    });
  }, [currentSection, windowWidth]);

  return (
    <motion.div animate={navControls} className={`${styles.container} ${styles[stylePosition]}`}>
      <Button
        onClick={() => explore ? setSection(Math.max(0, currentSection - 1)) : null}
        size="small"
        borderColor="#FFF"
        left="0px"
        top={window.innerWidth <= 768 ? "calc(50% - 20px)" : "calc(50% - 30px)"}
        icon={<motion.img animate={prevBtnControls} src="/images/arrow.svg" alt="arrow" className={styles.icon} />}
        bg={colors[currentSection]}
        labelColor={colors[currentSection]}
        labelText={titles[currentSection - 1]}
        direction={navPosition !== "right" ? "right" : "right-rotate"}
        disabled={currentSection === 0}
        section={currentSection}
      />
      <div style={{ color: colors[currentSection] }} className={currentSection < 6 ? styles.slideNumber : styles.slideNumber2}>
        <motion.span animate={numberControls}>
          {currentSection + 1}  
        </motion.span>
      </div>
      <Button
        onClick={() => explore ? setSection(Math.min(6, currentSection + 1)) : null}
        size="small"
        borderColor="#FFF"
        left={window.innerWidth <= 768 ? "160px" : "240px"}
        top={window.innerWidth <= 768 ? "calc(50% - 20px)" : "calc(50% - 30px)"}
        icon={<motion.img animate={nextBtnControls} src="/images/arrow.svg" alt="arrow" className={styles.icon} />}
        bg={colors[currentSection]}
        labelColor={colors[currentSection]}
        labelText={titles[currentSection + 1]}
        direction={navPosition !== "right" ? "left" : "right-rotate"}
        disabled={currentSection === 6}
        section={currentSection}
      />
    </motion.div>
  );
}
