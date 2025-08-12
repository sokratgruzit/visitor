import { useAppStore } from "../../../store/useAppStore";
import { useConstructorStore } from "../../../store/constructorStore";

import type { Circle } from "../../../types";

import styles from "./ComponentModal.module.css";

interface Props {
    bp: any;
    c1bp: Circle;
    c2bp: Circle;
    updateScale: (val: number) => void;
    updateDist: (val: number) => void;
    updateRotate: (val: number) => void;
    leftPos: number;
    updatePos: (val: "top" | "left", val2: number, val3: "half" | "full" | null) => void;
    leftMode: "half" | "full" | null;
    setLeftMode: (val: "half" | "full" | null) => void;
    topPos: number;
    topMode: "half" | "full" | null;
    setTopMode: (val: "half" | "full" | null) => void;
    updateComponent: (newData: any) => void;
	componentId: string;
}

export const AnimationTab = ({ 
    bp,
    c1bp,
    c2bp,
    updateScale,
    updateDist,
    leftPos,
    updatePos,
    leftMode,
    setLeftMode,
    topPos,
    topMode,
    setTopMode,
    updateRotate,
    updateComponent,
    componentId
}: Props) => {
    const { landingData } = useAppStore();
    const { activePoint } = useConstructorStore();

    const component = landingData?.components?.find((c: any) => c.id === componentId) || {};

    return (
        <>
            <div className={styles.animationBlock}>
                <label style={{ flexDirection: "row" }}>
					<input
						type="checkbox"
						checked={component?.showCircles || false}
						onChange={(e) => updateComponent({ showCircles: e.target.checked })}
					/>
					Показать круги
				</label>

                <label>
                    Масштаб (s): {bp.s ?? 0}
                    <input
                        type="range"
                        min={0}
                        max={3}
                        step={0.1}
                        value={bp.s ?? 0}
                        onChange={(e) => updateScale(parseFloat(e.target.value))}
                    />
                </label>

                <label>
                    Дисторшн (dist): {bp.dist ?? 0}
                    <input
                        type="range"
                        min={0}
                        max={10}
                        step={0.1}
                        value={bp.dist ?? 0}
                        onChange={(e) => updateDist(parseFloat(e.target.value))}
                    />
                </label>

                <label>
                    По оси Х: {bp.left}
                    <input
                        type="range"
                        min={-1000}
                        max={1000}
                        step={1}
                        value={leftPos}
                        onChange={(e) => updatePos("left", parseInt(e.target.value), leftMode)}
                    />
                    <div className={styles.toggleButtons}>
                        <button
                            type="button"
                            onClick={() => {
                                setLeftMode("full");
                                updatePos("left", leftPos, "full");
                            }}
                            className={`${styles.posBtn} ${leftMode === "full" ? styles.active : ""}`}
                        >
                            full
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setLeftMode("half");
                                updatePos("left", leftPos, "half");
                            }}
                            className={`${styles.posBtn} ${leftMode === "half" ? styles.active : ""}`}
                        >
                            half
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setLeftMode(null);
                                updatePos("left", leftPos, null);
                            }}
                            className={styles.posBtn} 
                        >
                            Обнулить
                        </button>
                    </div>
                </label>

                <label>
                    По оси У: {bp.top}
                    <input
                        type="range"
                        min={-1000}
                        max={1000}
                        step={1}
                        value={topPos}
                        onChange={(e) => updatePos("top", parseInt(e.target.value), topMode)}
                    />
                    <div className={styles.toggleButtons}>
                        <button
                            type="button"
                            onClick={() => {
                                setTopMode("full");
                                updatePos("top", topPos, "full");
                            }}
                            className={`${styles.posBtn} ${topMode === "full" ? styles.active : ""}`}
                        >
                            full
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setTopMode("half");
                                updatePos("top", topPos, "half");
                            }}
                            className={`${styles.posBtn} ${topMode === "half" ? styles.active : ""}`}
                        >
                            half
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setTopMode(null);
                                updatePos("top", topPos, null);
                            }}
                            className={styles.posBtn}
                        >
                            Обнулить
                        </button>
                    </div>
                </label>

                <label>
                    Вращение (deg): {bp.rotate ?? 0}
                    <input
                        type="range"
                        min={0}
                        max={360}
                        step={1}
                        value={bp.rotate ?? 0}
                        onChange={(e) => updateRotate(parseInt(e.target.value))}
                    />
                </label>
            </div>
            {/* Управление кругами */}
            {component.showCircles && <div className={styles.animationBlock}>
                <h3 className={styles.title}>Круг 1</h3>
                <label>
                    По оси У: {c1bp.top}
                    <input
                        type="range"
                        min={-1000}
                        max={1000}
                        step={1}
                        value={c1bp.top}
                        onChange={(e) => {
                            let bps = component?.circle1;
                            const bpIndex = bps.findIndex((b: any) => b.minWidth === activePoint);

                            bps[bpIndex].top = parseInt(e.target.value);
    
                            updateComponent({ circle1: bps });
                        }}
                    />
                </label>
                <label>
                    По оси Х: {c1bp?.left}
                    <input
                        type="range"
                        min={-1000}
                        max={1000}
                        step={1}
                        value={c1bp?.left}
                        onChange={(e) => {
                            let bps = component?.circle1;
                            const bpIndex = bps.findIndex((b: any) => b.minWidth === activePoint);

                            bps[bpIndex].left = parseInt(e.target.value);

                            updateComponent({ circle1: bps });
                        }}
                    />
                </label>
                <label>
                    Ширина (px): {c1bp.width}
                    <input
                        type="range"
                        min={100}
                        max={1000}
                        step={1}
                        value={c1bp.width}
                        onChange={(e) => {
                            let bps = component?.circle1;
                            const bpIndex = bps.findIndex((b: any) => b.minWidth === activePoint);

                            bps[bpIndex].width = parseInt(e.target.value);

                            updateComponent({ circle1: bps });
                        }}
                    />
                </label>
                <label>
                    Высота (px): {c1bp?.height}
                    <input
                        type="range"
                        min={100}
                        max={1000}
                        step={1}
                        value={c1bp?.height}
                        onChange={(e) => {
                            let bps = component?.circle1;
                            const bpIndex = bps.findIndex((b: any) => b.minWidth === activePoint);

                            bps[bpIndex].height = parseInt(e.target.value);

                            updateComponent({ circle1: bps });
                        }}
                    />
                </label>
                <label>
                    Вращение (deg): {c1bp?.rotate}
                    <input
                        type="range"
                        min={0}
                        max={360}
                        step={1}
                        value={c1bp?.rotate}
                        onChange={(e) => {
                            let bps = component?.circle1;
                            const bpIndex = bps.findIndex((b: any) => b.minWidth === activePoint);

                            bps[bpIndex].rotate = parseInt(e.target.value);

                            updateComponent({ circle1: bps });
                        }}
                    />
                </label>

                <h3 className={styles.title}>Круг 2</h3>
                <label>
                    По оси У: {c2bp?.top}
                    <input
                        type="range"
                        min={-1000}
                        max={1000}
                        step={1}
                        value={c2bp?.top}
                        onChange={(e) => {
                            let bps = component?.circle2;
                            const bpIndex = bps.findIndex((b: any) => b.minWidth === activePoint);

                            bps[bpIndex].top = parseInt(e.target.value);

                            updateComponent({ circle2: bps });
                        }}
                    />
                </label>
                <label>
                    По оси Х: {c2bp?.left}
                    <input
                        type="range"
                        min={-1000}
                        max={1000}
                        step={1}
                        value={c2bp?.left}
                        onChange={(e) => {
                            let bps = component?.circle2;
                            const bpIndex = bps.findIndex((b: any) => b.minWidth === activePoint);

                            bps[bpIndex].left = parseInt(e.target.value);

                            updateComponent({ circle2: bps });
                        }}
                    />
                </label>
                <label>
                    Ширина (px): {c2bp?.width}
                    <input
                        type="range"
                        min={100}
                        max={1000}
                        step={1}
                        value={c2bp?.width}
                        onChange={(e) => {
                            let bps = component?.circle2;
                            const bpIndex = bps.findIndex((b: any) => b.minWidth === activePoint);

                            bps[bpIndex].width = parseInt(e.target.value);

                            updateComponent({ circle2: bps });
                        }}
                    />
                </label>
                <label>
                    Высота (px): {c2bp?.height}
                    <input
                        type="range"
                        min={100}
                        max={1000}
                        step={1}
                        value={c2bp?.height}
                        onChange={(e) => {
                            let bps = component?.circle2;
                            const bpIndex = bps.findIndex((b: any) => b.minWidth === activePoint);

                            bps[bpIndex].height = parseInt(e.target.value);

                            updateComponent({ circle2: bps });
                        }}
                    />
                </label>
                <label>
                    Вращение (deg): {c2bp?.rotate}
                    <input
                        type="range"
                        min={0}
                        max={360}
                        step={1}
                        value={c2bp?.rotate}
                        onChange={(e) => {
                            let bps = component?.circle2;
                            const bpIndex = bps.findIndex((b: any) => b.minWidth === activePoint);

                            bps[bpIndex].rotate = parseInt(e.target.value);

                            updateComponent({ circle2: bps });
                        }}
                    />
                </label>
            </div>}
        </>
    );
};