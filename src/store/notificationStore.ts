import { create } from "zustand";

export type NotificationType = "success" | "error" | "warning";

interface Notification {
	id: number;
	type: NotificationType;
	message: string;
}

interface NotificationStore {
	notifications: Notification[];
	showNotification: (notification: Omit<Notification, "id">) => void;
	removeNotification: (id: number) => void;
}

let nextId = 1;

export const useNotificationStore = create<NotificationStore>((set) => ({
	notifications: [],
	showNotification: (notification: Omit<Notification, "id">) =>
		set((state) => ({
			notifications: [...state.notifications, { id: nextId++, ...notification }],
		})),
	removeNotification: (id: number) =>
		set((state) => ({
			notifications: state.notifications.filter((n) => n.id !== id),
		})),
}));
