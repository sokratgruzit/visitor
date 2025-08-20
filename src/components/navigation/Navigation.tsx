import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";

import { useAppStore } from "../../store/useAppStore";
import { useConstructorStore } from "../../store/constructorStore";

import Button from "../ui/button/Button";
import { Svg } from "../svgs/Svg.module";

import styles from "./Navigation.module.css";

export function Navigation() {
  const [navPosition, setNavPosition] = useState<string>("right");
  const [stylePosition, setStylePosition] = useState<string>("right");

  const { currentSection, setSection, windowWidth, landingData } = useAppStore();
  const { activePoint } = useConstructorStore();

  const navControls = useAnimation();
  const numberControls = useAnimation();
  const prevBtnControls = useAnimation();
  const nextBtnControls = useAnimation();
  const position = landingData.components[currentSection].navPosition;
  const limiter = window.innerWidth <= 768 || activePoint === 768 || activePoint === 440;

  useEffect(() => {
    setNavPosition(position);
    setStylePosition("");

    if (position === "right") {
      let x = limiter ? window.innerWidth - 140 : window.innerWidth - 230;
      let y = limiter ? window.innerHeight / 2 - 40 / 2 : window.innerHeight / 2 - 100 / 2;

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
      let x = limiter ? window.innerWidth / 2 - 200 / 2 : window.innerWidth / 2 - 300 / 2;
      let y = limiter ? window.innerHeight - 60 : window.innerHeight - 130;

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
      let x = limiter ? window.innerWidth / 2 - 200 / 2 : window.innerWidth / 2 - 300 / 2;
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
  }, [currentSection, windowWidth, position]);

  return (
    <motion.div animate={navControls} className={`${styles[`container${limiter ? "Preview" : ""}`]} ${styles[`${stylePosition}${limiter ? "Preview" : ""}`]}`}>
      <Button
        onClick={() => setSection(Math.max(0, currentSection - 1))}
        size={limiter ? "preview" : "small"}
        left="0px"
        top={limiter ? "calc(50% - 20px)" : "calc(50% - 30px)"}
        icon={
          <motion.div
            animate={prevBtnControls} 
            className={styles.icon}
          >
            <Svg svgName="ArrowDropDownOutlined" size={{ xs: 45, sm: 45, md: 45, lg: 45 }} color={landingData.components[currentSection].color} />
          </motion.div>
        }
        labelColor={landingData.components[currentSection].color}
        labelText={landingData.components[currentSection - 1 === -1 ? 0 : currentSection - 1].title}
        direction={navPosition !== "right" ? "right" : "right-rotate"}
        disabled={currentSection === 0}
        section={currentSection}
        color={landingData.components[currentSection].color}
        btnColor={landingData.components[currentSection].btn}
        limiter={limiter}
      />
      <div 
        style={{ 
          color: landingData.components[currentSection].color,
          backgroundColor: landingData.components[currentSection].btn
        }} 
        className={styles[`slideNumber${limiter ? "Preview" : ""}`]}
      >
        <motion.span animate={numberControls}>
          {currentSection}  
        </motion.span>
      </div>
      <Button
        onClick={() => setSection(Math.min(landingData.components.length, currentSection + 1))}
        size={limiter ? "preview" : "small"}
        left={limiter ? "160px" : "240px"}
        top={limiter ? "calc(50% - 20px)" : "calc(50% - 30px)"}
        icon={
          <motion.div
            animate={nextBtnControls} 
            className={styles.icon}
          >
            <Svg svgName="ArrowDropDownOutlined" size={{ xs: 45, sm: 45, md: 45, lg: 45 }} color={landingData.components[currentSection].color} />
          </motion.div>
        }
        labelColor={landingData.components[currentSection].color}
        labelText={landingData.components[currentSection + 1]?.title}
        direction={navPosition !== "right" ? "left" : "right-rotate"}
        disabled={currentSection === landingData.components.length - 1}
        section={currentSection}
        color={landingData.components[currentSection].color}
        btnColor={landingData.components[currentSection].btn}
        limiter={limiter}
      />
    </motion.div>
  );
}
