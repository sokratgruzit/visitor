import { useAppStore } from "../../../store/useAppStore";
import { useConstructorStore } from "../../../store/constructorStore";

import type { Circle } from "../../../types";

import Button from "../button/Button";

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
                        className="input"
                        style={{ accentColor: "#000", width: 30 }}
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
                        className="input"
                        style={{ accentColor: "#000" }}
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
                        className="input"
                        style={{ accentColor: "#000" }}
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
                        className="input"
                        style={{ accentColor: "#000" }}
                        onChange={(e) => updatePos("left", parseInt(e.target.value), leftMode)}
                    />
                    <div className={styles.toggleButtons}>
                        <div style={{ height: 20, width: "20%" }}>
                            <Button
                                text="full"
                                onClick={() => {
                                    setLeftMode("full");
                                    updatePos("left", leftPos, "full");
                                }}
                                size="flex"
                                delay={.8}
                                limiter={window.innerWidth <= 768}
                                color="#FFFFFF"
                                btnColor={leftMode === "full" ? "#63C5AB" : "#000000"}
                                fontSize=".75rem"
                            />
                        </div>
                        <div style={{ height: 20, width: "20%" }}>
                            <Button
                                text="half"
                                onClick={() => {
                                    setLeftMode("half");
                                    updatePos("left", leftPos, "half");
                                }}
                                size="flex"
                                delay={.8}
                                limiter={window.innerWidth <= 768}
                                color="#FFFFFF"
                                btnColor={leftMode === "half" ? "#63C5AB" : "#000000"}
                                fontSize=".75rem"
                            />
                        </div>
                        <div style={{ height: 20, width: "20%" }}>
                            <Button
                                text="reset"
                                onClick={() => {
                                    setLeftMode(null);
                                    updatePos("left", leftPos, null);
                                }}
                                size="flex"
                                delay={.8}
                                limiter={window.innerWidth <= 768}
                                color="#FFFFFF"
                                btnColor={"#000000"}
                                fontSize=".75rem"
                            />
                        </div>
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
                        className="input"
                        style={{ accentColor: "#000" }}
                        onChange={(e) => updatePos("top", parseInt(e.target.value), topMode)}
                    />
                    <div className={styles.toggleButtons}>
                        <div style={{ height: 20, width: "20%" }}>
                            <Button
                                text="full"
                                onClick={() => {
                                    setTopMode("full");
                                    updatePos("top", topPos, "full");
                                }}
                                size="flex"
                                delay={.8}
                                limiter={window.innerWidth <= 768}
                                color="#FFFFFF"
                                btnColor={topMode === "full" ? "#63C5AB" : "#000000"}
                                fontSize=".75rem"
                            />
                        </div>
                        <div style={{ height: 20, width: "20%" }}>
                            <Button
                                text="half"
                                onClick={() => {
                                    setTopMode("half");
                                    updatePos("top", topPos, "half");
                                }}
                                size="flex"
                                delay={.8}
                                limiter={window.innerWidth <= 768}
                                color="#FFFFFF"
                                btnColor={topMode === "half" ? "#63C5AB" : "#000000"}
                                fontSize=".75rem"
                            />
                        </div>
                        <div style={{ height: 20, width: "20%" }}>
                            <Button
                                text="reset"
                                onClick={() => {
                                    setTopMode(null);
                                    updatePos("top", topPos, null);
                                }}
                                size="flex"
                                delay={.8}
                                limiter={window.innerWidth <= 768}
                                color="#FFFFFF"
                                btnColor={"#000000"}
                                fontSize=".75rem"
                            />
                        </div>
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
                        className="input"
                        style={{ accentColor: "#000" }}
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
                        className="input"
                        style={{ accentColor: "#000" }}
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
                        className="input"
                        style={{ accentColor: "#000" }}
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
                        className="input"
                        style={{ accentColor: "#000" }}
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
                        className="input"
                        style={{ accentColor: "#000" }}
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
                        className="input"
                        style={{ accentColor: "#000" }}
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
                        className="input"
                        style={{ accentColor: "#000" }}
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
                        className="input"
                        style={{ accentColor: "#000" }}
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
                        className="input"
                        style={{ accentColor: "#000" }}
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
                        className="input"
                        style={{ accentColor: "#000" }}
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
                        className="input"
                        style={{ accentColor: "#000" }}
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