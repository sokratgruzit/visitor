import { useConstructorStore } from "../../../store/constructorStore";
import { useNotificationStore } from "../../../store/notificationStore";

import type { LandingComponent } from "../../../types";

import styles from "./ComponentModal.module.css";

interface Props {
    updateComponent: (newData: any) => void;
    component: LandingComponent;
}

export const ImageTab = ({ updateComponent, component }: Props) => {
    const { setPreviewImage, activePoint, previewImage } = useConstructorStore();
    const notify = useNotificationStore((state) => state.showNotification);
    let bps = component?.imageConfig;
    let bp = bps?.find((b: any) => b.minWidth === activePoint);
    const bpIndex = bps?.findIndex((b: any) => b.minWidth === activePoint);

    const onImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
       
        if (file.type !== "image/png" && file.type !== "image/jpeg") {
            notify({ type: "error", message: "Можно загружать только PNG или JPEG изображения" });
            e.target.value = ""; // сбросить выбор
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            updateComponent({
                fileBase64: reader.result,
            });
            setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
    };

    return (
        <>
            <label className={styles.customFileLabel}>
                Картинка:
                <div className={styles.customFileWrapper}>
                    Выбрать файл
                    <input
                        type="file"
                        accept="image/png, image/jpeg"
                        onChange={onImageUpload}
                        className={styles.customFileInput}
                    />
                </div>
            </label>

            {(previewImage || component?.fileUrl) && <div className={styles.animationBlock}>
                <h3 className={styles.title}>Настройки картинки:</h3>
                <label>
                    По оси У (px): {bp?.top}
                    <input
                        type="range"
                        min={-1000}
                        max={1000}
                        step={1}
                        value={bp?.top}
                        onChange={(e) => {
                            if (bps) bps[bpIndex || 0].top = parseInt(e.target.value);

                            updateComponent({ imageConfig: bps });
                        }}
                    />
                </label>
                <label>
                    По оси Х (%): {bp?.left}
                    <input
                        type="range"
                        min={-100}
                        max={100}
                        step={0.5}
                        value={bp?.left}
                        onChange={(e) => {
                            if (bps) bps[bpIndex || 0].left = parseInt(e.target.value);

                            updateComponent({ imageConfig: bps });
                        }}
                    />
                </label>
                <label>
                    Ширина (px): {bp?.width}
                    <input
                        type="range"
                        min={-1000}
                        max={1000}
                        step={1}
                        value={bp?.width}
                        onChange={(e) => {
                            if (bps) bps[bpIndex || 0].width = parseInt(e.target.value);

                            updateComponent({ imageConfig: bps });
                        }}
                    />
                </label>
                <label>
                    Высота (px): {bp?.height}
                    <input
                        type="range"
                        min={-1000}
                        max={1000}
                        step={1}
                        value={bp?.height}
                        onChange={(e) => {
                            if (bps) bps[bpIndex || 0].height = parseInt(e.target.value);

                            updateComponent({ imageConfig: bps });
                        }}
                    />
                </label>
                <label>
                    Вращение (deg): {bp?.rotate}
                    <input
                        type="range"
                        min={0}
                        max={360}
                        step={1}
                        value={bp?.rotate}
                        onChange={(e) => {
                            if (bps) bps[bpIndex || 0].rotate = parseInt(e.target.value);

                            updateComponent({ imageConfig: bps });
                        }}
                    />
                </label>
            </div>}
        </>
    )
};