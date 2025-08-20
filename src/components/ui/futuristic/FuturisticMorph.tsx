import { motion } from "framer-motion";

import styles from "./FuturisticMorph.module.css";

export const FuturisticMorph = () => {
	const screenHeight = typeof window !== "undefined" ? window.innerHeight : 800;

	return (
		<div className={styles.container}>
			<motion.span
				className={styles.v}
				initial={{ x: 0, y: -200, scale: 1, color: "#fdfd96" }}
				animate={{
					y: [
						-200,                   
						screenHeight - 100,     
						screenHeight - 200,     
						screenHeight - 100,     
						screenHeight - 120,     
						screenHeight - 100,     
						screenHeight / 2 - 60,     
						screenHeight / 2 - 60,     
					],
					color: ["#fdfd96", "#77dd77"], 
					scale: [1, 1, 15], 
					x: [0, 0, -150]
				}}
				transition={{
					y: {
						duration: 10,
						times: [0, .01, .02, .03, .04, .05, .06, 1],
						ease: ["easeIn", "easeOut", "easeIn", "easeOut", "easeIn", "easeIn", "easeIn"]
					},
					x: {
						duration: 10,
						times: [0, .9, 1],
						ease: "easeIn",
					},
					scale: {
						duration: 10,
						times: [0, .9, 1],
						ease: "easeIn",
					},
					color: {
						duration: 10,
						times: [0, .1, .15, .2, .25, .3, .35, 1],
						repeat: Infinity,
					}
				}}
			>
				V
			</motion.span>
			<motion.span
				className={styles.i}
				initial={{ x: -200, y: window.innerHeight / 2 - 60, scale: 1, rotate: 0, color: "#a3d5ff" }}
				animate={{
					x: [-200, 0, 0, 0, 0, 0, 0, 0],   
					rotate: [0, 720, 720],  
					y: window.innerHeight / 2 - 60,      
					scale: [1, 1, .9, 1, 15, 15], 
					color: ["#a3d5ff", "#ff9999"],              
				}}
				transition={{
					x: {
						duration: 10,
						times: [0, .05, .06, .07, .08, .09, .35, 1],
						ease: ["easeIn", "easeOut", "easeIn", "easeOut", "easeIn", "easeIn", "easeIn"],
					},
					y: {
						duration: 1
					},
					rotate: {
						duration: 10,
						times: [0, .05, 1],
						ease: "easeIn",
					},
					scale: {
						duration: 10,
						times: [0, .87, .88, .89, .9, 1],
						ease: "easeIn",
					},
					color: {
						duration: 10,
						times: [0, .1, .15, .2, .25, .3, .35, 1],
						repeat: Infinity,
					}
				}}
			>
				I
			</motion.span>
			<motion.span
				className={styles.s}
				initial={{ scale: 1, color: "#fbc4d4", rotate: 0 }}
				animate={{
					scale: [1, 2, 1, 1.8, 1, 1.6, 1, 1.4, 1, 1, 15],
					rotate: [0, 0, 20],  
					color: ["#fbc4d4", "#d6b4ff", "#a3d5ff", "#fbc4d4"], 
				}}
				transition={{
					scale: {
						duration: 10,
						times: [0, .05, .06, .07, .08, .09, .1, .101, .102, .9, 1],
					},
					rotate: {
						duration: 10,
						times: [0, .98, 1],
					},
					color: {
						duration: 10,
						times: [0, .1, .15, .2, .25, .3, .35, 1],
						repeat: Infinity,
					},
				}}
			>
				S
			</motion.span>
			<motion.span
				className={styles.i2}
				initial={{ scale: 1, x: -300, color: "#c1f0c1" }}
				animate={{
					x: [-300, 0, -50, 0, -10, 0, 0, 0],
					scale: [1, 1, 15],
					color: ["#c1f0c1", "#fdd1c1", "#c1dfff", "#c1f0c1"],
				}}
				transition={{
					x: { 
						duration: 10, 
						times: [0, .01, .02, .03, .05, .08, .35, 1], 
						ease: ["easeIn", "easeOut", "easeIn", "easeOut", "easeIn", "easeIn", "easeIn"],
					},
					scale: { 
						duration: 10, 
						times: [0, .9, 1] 
					},
					color: { 
						duration: 10, 
						times: [0, .1, .15, .2, .25, .3, .35, 1],
						repeat: Infinity 
					},
				}}
			>
				I
			</motion.span>
			<motion.span
				className={styles.t}
				initial={{ scale: 1, x: 300, y: -50, skewX: 0, color: "#ffe0a3" }}
				animate={{
					x: [300, 100, 0, 0, 0, 0, 0, 0],
					y: [-50, 0, -20, 0, 0, 0, 0, 0],
					scale: [1, 1, 15],
					skewX: [0, 20, -20, 0, 0],
					color: ["#ffe0a3", "#d4a3ff", "#a3f4ff", "#ffe0a3"],
				}}
				transition={{
					x: { 
						duration: 10, 
						times: [0, .05, .1, .2, .25, .3, .35, 1], 
						ease: "easeInOut" 
					},
					y: { 
						duration: 10, 
						times: [0, .05, .1, .2, .25, .3, .35, 1], 
						ease: "easeInOut" 
					},
					scale: { 
						duration: 10, 
						times: [0, .9, 1], 
					},
					skewX: { 
						duration: 10, 
						times: [0, .05, .1, .2, 1], 
					},
					color: { 
						duration: 10, 
						times: [0, .1, .15, .2, .25, .3, .35, 1],
						repeat: Infinity 
					},
				}}
			>
				T
			</motion.span>
			<motion.span
				className={styles.o}
				initial={{ scale: 1, x: -300, y: 100, rotate: 0, color: "#ffb3b3" }}
				animate={{
					x: [-300, -100, 0, 0, 0, 0, 0, 0],
					y: [100, 50, 0, 0, 0, 0, 0, 0],
					rotate: [0, 360, 360],
					scale: [1, 1, 15],
					color: ["#ffb3b3", "#b3ffd4", "#b3d4ff", "#ffb3b3"],
				}}
				transition={{
					x: { 
						duration: 10, 
						times: [0, .05, .1, .2, .25, .3, .35, 1], 
						ease: "easeInOut" 
					},
					y: { 
						duration: 10, 
						times: [0, .05, .1, .2, .25, .3, .35, 1], 
						ease: "easeInOut" 
					},
					rotate: { 
						duration: 10, 
						times: [0, .1, 1],
						ease: "easeIn"
					},
					scale: { 
						duration: 10, 
						times: [0, .9, 1]
					},
					color: { 
						duration: 10, 
						times: [0, .1, .15, .2, .25, .3, .35, 1],
						repeat: Infinity 
					},
				}}
			>
				O
			</motion.span>
			<motion.span
				className={styles.r}
				initial={{ scale: 1, y: 500, rotate: 0, color: "#b3ffd9" }}
				animate={{
					y: [
						500, 
						screenHeight / 2 - 120, 
						screenHeight / 2 - 150,  
						screenHeight / 2 - 120, 
						screenHeight / 2 - 150, 
						0, 
						0, 
						0
					],
					scale: [1, 1, 15],
					rotate: [0, 5, -5, 0, 0, 0, 0, 0],
					color: ["#b3ffd9", "#ffc1d4", "#d4b3ff", "#b3ffd9"],
				}}
				transition={{
					y: { 
						duration: 10, 
						times: [0, .01, .02, .03, .04, .05, .35, 1],
						ease: ["easeIn", "easeOut", "easeIn", "easeOut", "easeIn", "easeIn", "easeIn"],
					},
					scale: { 
						duration: 10, 
						times: [0, .9, 1] 
					},
					rotate: { 
						duration: 10, 
						times: [0, .02, .04, .05, .25, .3, .35, 1], 
					},
					color: { 
						duration: 10, 
						times: [0, .1, .15, .2, .25, .3, .35, 1],
						repeat: Infinity 
					},
				}}
			>
				R
			</motion.span> 
		</div>
  	);
};
