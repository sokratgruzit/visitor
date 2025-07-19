import { useEffect, useRef } from 'react';
import { useAppStore } from "../../store/useAppStore";

interface Props {
  src: string;
  volume?: number;
  loop?: boolean;
}

export default function BackgroundMusic({
    src,
    volume = 0.5,
    loop = true,
}: Props) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const { startMusic } = useAppStore();

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.volume = volume;
        audio.loop = loop;

        if (startMusic) {
            audio.play().catch((e) => console.warn("Can't play:", e));
        } else {
            audio.pause();
        }
    }, [startMusic, volume, loop]);

    return <audio ref={audioRef} src={src} />;
}
