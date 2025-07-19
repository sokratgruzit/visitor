import { create } from "zustand";

interface AppState {
  currentSection: number;
  explore: boolean;
  intro: boolean;
  startMusic: boolean;
  autoPlayback: boolean;
  windowWidth: number;
  setSection: (index: number) => void;
  setExplore: (show: boolean) => void;
  setIntro: (play: boolean) => void;
  setStartMusic: (play: boolean) => void;
  setAutoPlayback: (play: boolean) => void;
  setWindowWidth: (width: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentSection: 0,
  explore: false,
  intro: true,
  startMusic: false,
  autoPlayback: false,
  windowWidth: 0,
  setSection: (index) => set({ currentSection: index }),
  setExplore: (show) => set({ explore: show }),
  setIntro: (play) => set({ intro: play }),
  setStartMusic: (play) => set({ startMusic: play }),
  setAutoPlayback: (play) => set({ autoPlayback: play }),
  setWindowWidth: (width) => set({ windowWidth: width }),
}));
