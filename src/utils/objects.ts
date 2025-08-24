import type { TriangleData } from "../types";

// import { soberWord } from "./soberWord";
// import { laptop } from "./laptop";
// import { panic } from "./panic";
// import { superMan } from "./superMan";
// import { bridge } from "./bridge";
// import { umbrella } from "./umbrella";
import { micro, addSolidRingToMicro } from "./micro";
import { getAnimationById } from "../api/animations";

let initializedMicro = false;

export async function getTrianglesData(canvasType: string | number): Promise<{
  mutated: Omit<TriangleData, "phase">[];
  target: Omit<TriangleData, "phase">[];
}> {
  const width = window.innerWidth;
  const height = window.innerHeight;

  function scalePoint(point: { x: number; y: number }) {
    return { x: point.x, y: point.y};
  }

  const distance = 1500;
  let res = await getAnimationById(canvasType);
  if (!res.success) return { mutated: [], target: [] };
  let base = res.animation.data;

  // if (canvasType === "sober") {
  //   base = soberWord;
  // }

  // if (canvasType === "laptop") {
  //   base = laptop;
  // }

  // if (canvasType === "panic") {
  //   base = panic;
  // }

  // if (canvasType === "super") {
  //   base = superMan;
  // }

  // if (canvasType === "chain") {
  //   base = bridge;
  // }

  // if (canvasType === "umbrella") {
  //   base = umbrella;
  // }

  if (canvasType === 5) {
    if (!initializedMicro) {
      initializedMicro = true;
      addSolidRingToMicro(4, 4, 114, 8, "#03A9F4", 0.7, 3, -3, 16);
      addSolidRingToMicro(0, 0, 114, 8, "#000000", 0.7, 3, -3, 16);

      addSolidRingToMicro(4, 4, 90, 8, "#03A9F4", 0.7, 3, -3, 9);
      addSolidRingToMicro(0, 0, 90, 8, "#000000", 0.7, 3, -3, 9);

      addSolidRingToMicro(29, 171, 16, 6, "#03A9F4", 0.7, 3, -3, 7);
      addSolidRingToMicro(25, 167, 16, 6, "#000000", 0.7, 3, -3, 7);
      addSolidRingToMicro(-19, 201, 16, 6, "#03A9F4", 0.7, 3, -3, 7);
      addSolidRingToMicro(-23, 197, 16, 6, "#000000", 0.7, 3, -3, 7);
      addSolidRingToMicro(-177, 28, 16, 6, "#03A9F4", 0.7, 3, -3, 7);
      addSolidRingToMicro(-181, 24, 16, 6, "#000000", 0.7, 3, -3, 7);
      addSolidRingToMicro(-149, -67, 16, 6, "#03A9F4", 0.7, 3, -3, 7);
      addSolidRingToMicro(-153, -71, 16, 6, "#000000", 0.7, 3, -3, 7);
      addSolidRingToMicro(-20, -165, 16, 6, "#03A9F4", 0.7, 3, -3, 7);
      addSolidRingToMicro(-24, -169, 16, 6, "#000000", 0.7, 3, -3, 7);
      addSolidRingToMicro(28, -193, 16, 6, "#03A9F4", 0.7, 3, -3, 7);
      addSolidRingToMicro(24, -197, 16, 6, "#000000", 0.7, 3, -3, 7);
      addSolidRingToMicro(185, -20, 16, 6, "#03A9F4", 0.7, 3, -3, 7);
      addSolidRingToMicro(181, -24, 16, 6, "#000000", 0.7, 3, -3, 7);
      addSolidRingToMicro(154, 76, 16, 6, "#03A9F4", 0.7, 3, -3, 7);
      addSolidRingToMicro(153, 72, 16, 6, "#000000", 0.7, 3, -3, 7);

      addSolidRingToMicro(221, 78, 27, 6, "#03A9F4", 0.7, 3, -3, 13);
      addSolidRingToMicro(217, 74, 27, 6, "#000000", 0.7, 3, -3, 13);
      addSolidRingToMicro(203, -102, 27, 6, "#03A9F4", 0.7, 3, -3, 13);
      addSolidRingToMicro(199, -106, 27, 6, "#000000", 0.7, 3, -3, 13);
      addSolidRingToMicro(144, -209, 27, 6, "#03A9F4", 0.7, 3, -3, 13);
      addSolidRingToMicro(140, -213, 27, 6, "#000000", 0.7, 3, -3, 13);
      addSolidRingToMicro(-120, -211, 27, 6, "#03A9F4", 0.7, 3, -3, 13);
      addSolidRingToMicro(-124, -215, 27, 6, "#000000", 0.7, 3, -3, 13);
      addSolidRingToMicro(-213, -69, 27, 6, "#03A9F4", 0.7, 3, -3, 13);
      addSolidRingToMicro(-217, -73, 27, 6, "#000000", 0.7, 3, -3, 13);
      addSolidRingToMicro(-195, 110, 27, 6, "#03A9F4", 0.7, 3, -3, 13);
      addSolidRingToMicro(-199, 106, 27, 6, "#000000", 0.7, 3, -3, 13);
      addSolidRingToMicro(-135, 217, 27, 6, "#03A9F4", 0.7, 3, -3, 13);
      addSolidRingToMicro(-139, 213, 27, 6, "#000000", 0.7, 3, -3, 13);
      addSolidRingToMicro(127, 220, 27, 6, "#03A9F4", 0.7, 3, -3, 13);
      addSolidRingToMicro(123, 216, 27, 6, "#000000", 0.7, 3, -3, 13);
    }

    micro.sort((a, b) =>
      (a.color === "#03A9F4" ? -1 : 1) - (b.color === "#03A9F4" ? -1 : 1)
    );

    base = [...base, ...micro];
  }

  const target = base.map((triangle: any) => {
    const x = triangle.x;
    const y = triangle.y;
    const size = triangle.size;

    const dirX = x;
    const dirY = y;
    const norm = Math.sqrt(dirX * dirX + dirY * dirY) || 1;
    const scaleFactor = distance / norm;

    return {
      x,
      y,
      size,
      color: triangle.color,
      rotation: triangle.rotation,
      points: triangle.points.map(scalePoint),
      startX: x * scaleFactor,
      startY: y * scaleFactor,
      scatterX: (Math.random() - 0.5) * 1500,
      scatterY: (Math.random() - 0.5) * 1500,
      scale: triangle.scale,
      z: triangle.z,
    };
  });

  const mutated = target.map((t: any) => ({
    ...t,
    x: (Math.random() - 0.5) * width * 2,
    y: (Math.random() - 0.5) * height * 2,
    rotation: Math.random() * 360,
  }));

  return { mutated, target };
}