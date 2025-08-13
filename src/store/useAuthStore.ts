import { create } from "zustand";
import { authFetch } from "../api/auth";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

interface UserType {
    id: number;
    email: string;
    name: string;
    isActive: boolean;
    emailVerified: boolean;
}

interface AuthState {
    user: UserType | null;
    isAuthLoaded: boolean;
    setUser: (user: UserType) => void;
    clearAuth: () => void;
    initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthLoaded: false,
    setUser: (user) => set({ user }),
    clearAuth: () => {
        set({ user: null });
        localStorage.removeItem("accessToken");
    },
    initializeAuth: async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            set({ isAuthLoaded: true });
            return;
        }

        try {
            const res = await authFetch(`${apiBaseUrl}/api/auth/get-user`);
            if (!res.ok) throw new Error();

            const data = await res.json();
            set({ user: data.user });
        } catch {
            localStorage.removeItem("accessToken");
            set({ user: null });
        } finally {
            set({ isAuthLoaded: true });
        }
    },
}));
