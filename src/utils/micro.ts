import type { TriangleData } from "../types";

export const micro: Omit<TriangleData, "phase">[] = [];

export function addSolidRingToMicro(
    centerX: number,
    centerY: number,
    outerRadius: number,
    count: number,
    color: string = "#000000",
    size: number = 0.7,
    scale: number = 3,
    z: number = -3,
    thickness: number = 10,
) {
    const innerRadius = outerRadius - thickness;

    for (let i = 0; i < count; i++) {
        const angle1 = (i / count) * Math.PI * 2;
        const angle2 = ((i + 1) / count) * Math.PI * 2;

        // Точки на внешнем круге
        const ax = centerX + outerRadius * Math.cos(angle1);
        const ay = centerY + outerRadius * Math.sin(angle1);

        const dx = centerX + outerRadius * Math.cos(angle2);
        const dy = centerY + outerRadius * Math.sin(angle2);

        // Точки на внутреннем круге
        const bx = centerX + innerRadius * Math.cos(angle1);
        const by = centerY + innerRadius * Math.sin(angle1);

        const cx = centerX + innerRadius * Math.cos(angle2);
        const cy = centerY + innerRadius * Math.sin(angle2);

        // Первый треугольник: A (outer1), B (inner1), C (inner2)
        micro.push({
            x: 0,
            y: 0,
            size,
            color,
            rotation: 0,
            points: [
                { x: ax, y: ay },
                { x: bx, y: by },
                { x: cx, y: cy }
            ],
            startX: 0,
            startY: 0,
            scatterX: 0,
            scatterY: 0,
            scale,
            z
        });

        // Второй треугольник: A (outer1), C (inner2), D (outer2)
        micro.push({
            x: 0,
            y: 0,
            size,
            color,
            rotation: 0,
            points: [
                { x: ax, y: ay },
                { x: cx, y: cy },
                { x: dx, y: dy }
            ],
            startX: 0,
            startY: 0,
            scatterX: 0,
            scatterY: 0,
            scale,
            z
        });
    }
}



