import { useEffect, useRef, useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import { motion, useAnimation } from "framer-motion";

import { clamp, parseColor, randomPhase } from "../../utils/utils";
import type { TriangleData } from "../../types";
import { getTrianglesData } from "../../utils/objects";
import { getPositionConfig } from "../../utils/utils";

import styles from "./Canvas.module.css";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const Canvas = () => {
  const [scaleFactor, setScaleFactor] = useState<number>(1);
  const [distortion, setDistortion] = useState<number>(3);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trianglesRef = useRef<TriangleData[]>([]);
  const canvasControls = useAnimation();
  const { setWindowWidth, currentSection, windowWidth, landingData } = useAppStore();

  const positionCanvas = (width: number, section: number) => {
    const config = landingData.components[section].positionConfig || {};

    const { s, dist, left, top, rotate } = getPositionConfig(width, config, "canvas");

    setScaleFactor(s || 1);
    setDistortion(dist || 3);

    canvasControls.start({
      translateX: left,
      translateY: top,
      rotate: rotate,
      transition: {
        duration: .5,
        ease: "easeInOut"
      }
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    function resize() {
      const width = window.innerWidth;
      const dpr = window.devicePixelRatio || 1;

      canvas.width = 1500 * dpr;
      canvas.height = 1500 * dpr;

      canvas.style.width = `${1500}px`;
      canvas.style.height = `${1500}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0); 
      ctx.scale(dpr, dpr);

      positionCanvas(width, currentSection);
      setWindowWidth(window.innerWidth);
    }

    resize();
    window.addEventListener("resize", resize);

    let startTime: number | null = null;
    let frameId: number;

    function draw(elapsed: number) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const BASE_WIDTH = 1150;
      const scaleX = canvas.clientWidth / BASE_WIDTH;
      const scale = (scaleX) * scaleFactor;
      const c = { x: canvas.clientWidth / 2, y: canvas.clientHeight / 2 };

      for (const t of trianglesRef.current) {
        if (t.inactive) {
          t.orbitAngle! += t.orbitSpeed!;
          const cx = canvas.clientWidth / 2;
          const cy = canvas.clientHeight / 2;
          t.x = cx + Math.cos(t.orbitAngle!) * t.orbitRadius!;
          t.y = cy + Math.sin(t.orbitAngle!) * t.orbitRadius!;
          t.rotation += 0.05;
        } else {
          t.x = lerp(t.x, t.targetX ?? t.x, 0.05);
          t.y = lerp(t.y, t.targetY ?? t.y, 0.05);
          t.rotation = lerp(t.rotation, t.targetRotation ?? t.rotation, 0.05);
        }

        const targetColor = parseColor(t.targetColor ?? t.color);
        const shift = Math.floor(Math.sin(elapsed * 3 + t.phase) * 50);
        const r = clamp(targetColor.r + shift, 0, 255);
        const g = clamp(targetColor.g, 0, 255);
        const b = clamp(targetColor.b, 0, 255);
        const alpha = t.inactive ? t.alpha ?? 0.2 : 1;

        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;

        const offsetY = Math.sin(elapsed * 2 + t.phase) * distortion * scale;
        const drawX = t.x;
        const drawY = t.y + offsetY / scale;

        ctx.save();
        ctx.translate(c.x + drawX * scale, c.y + drawY * scale);
        ctx.rotate((t.rotation * Math.PI) / 180);

        const currentPoints = t.points;
        const targetPoints = t.targetPoints ?? currentPoints;
        const points = currentPoints.map((p, i) => {
          const tp = targetPoints[i] || p;
          return {
            x: lerp(p.x, tp.x, 0.05),
            y: lerp(p.y, tp.y, 0.05),
          };
        });
        t.points = points;

        ctx.beginPath();
        points.forEach((p, i) => {
          const px = p.x * t.size * scale;
          const py = p.y * t.size * scale;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    }

    function animate(time: number) {
      if (!startTime) startTime = time;
      const elapsed = (time - startTime) / 1000;
      draw(elapsed);
      frameId = requestAnimationFrame(animate);
    }

    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
    };
  }, [scaleFactor, currentSection, distortion, landingData.components[currentSection].positionConfig]);

  useEffect(() => {
    const { target } = getTrianglesData(landingData.components[currentSection].canvas);

    for (let i = 0; i < trianglesRef.current.length; i++) {
      const triangle = trianglesRef.current[i];
      const targetTriangle = target[i];

      if (targetTriangle) {
        triangle.inactive = false;
        triangle.targetX = targetTriangle.x;
        triangle.targetY = targetTriangle.y;
        triangle.targetRotation = targetTriangle.rotation;
        triangle.targetColor = targetTriangle.color;
        triangle.targetPoints = targetTriangle.points;
      } else {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const dx = triangle.x - cx;
        const dy = triangle.y - cy;
        const orbitRadius = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);

        triangle.inactive = true;
        triangle.orbitRadius = orbitRadius;
        triangle.orbitAngle = angle;
        triangle.orbitSpeed = (Math.random() * 0.005) + 0.001; 
        triangle.alpha = 0.15;
      }
    }

    for (let i = trianglesRef.current.length; i < target.length; i++) {
      const t = target[i];
      trianglesRef.current.push({
        ...t,
        phase: randomPhase(),
        targetX: (Math.random() - 0.5) * window.innerWidth / 2,
        targetY: (Math.random() - 0.5) * window.innerHeight / 2,
        targetRotation: Math.random() * 100,
        targetColor: t.color,
        targetPoints: t.points,
      });
    }
  }, [currentSection, windowWidth, landingData.components[currentSection].canvas]);

  useEffect(() => {
    const { mutated, target } = getTrianglesData(landingData.components[currentSection].canvas);

    trianglesRef.current = mutated.map((t, i) => {
      const targetTriangle = target[i];
      return {
        ...t,
        phase: randomPhase(),
        targetX: targetTriangle.x,
        targetY: targetTriangle.y,
        targetRotation: targetTriangle.rotation,
        targetColor: targetTriangle.color,
        targetPoints: targetTriangle.points,
      };
    });
  }, []);

  return <motion.canvas 
    ref={canvasRef} 
    className={styles.canvas}
    animate={canvasControls} 
  />;
};
