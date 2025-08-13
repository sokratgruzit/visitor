import { create } from "zustand";

interface ConstructorState {
	slug: string;
    selectedComponentId: string | null;
	activePoint: number;
	previewImage: string | ArrayBuffer | null;
	setSlug: (slug: string) => void;
	setPreviewImage: (img: string | ArrayBuffer | null) => void;
	setActivePoint: (point: number) => void;
    setSelectedComponentId: (id: string | null) => void,
}

export const useConstructorStore = create<ConstructorState>((set) => ({
	slug: "",
    selectedComponentId: null,
	activePoint: 1281,
	previewImage: "",
	setSlug: (slug) => set({ slug }),
	setPreviewImage: (img) => set({ previewImage: img }),
	setActivePoint: (point) => set({ activePoint: point }),
    setSelectedComponentId: (id) => set({ selectedComponentId: id }),
}));
