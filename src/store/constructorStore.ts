import { create } from "zustand";

interface ConstructorState {
	slug: string;
    selectedComponentId: string | null;
	activePoint: number;
	setSlug: (slug: string) => void;
	setActivePoint: (point: number) => void;
    setSelectedComponentId: (id: string | null) => void,
}

export const useConstructorStore = create<ConstructorState>((set) => ({
	slug: "",
    selectedComponentId: null,
	activePoint: 10000,
	setSlug: (slug) => set({ slug }),
	setActivePoint: (point) => set({ activePoint: point }),
    setSelectedComponentId: (id) => set({ selectedComponentId: id }),
}));
