// components/NotificationContainer.tsx
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotificationStore } from "../../../store/notificationStore";

export const Notification = () => {
	const notifications = useNotificationStore((state) => state.notifications);
	const removeNotification = useNotificationStore((state) => state.removeNotification);

	useEffect(() => {
		notifications.forEach(({ id }) => {
			const timer = setTimeout(() => removeNotification(id), 2000);
			return () => clearTimeout(timer);
		});
	}, [notifications, removeNotification]);

	return (
		<div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999 }}>
			<AnimatePresence>
				{notifications.map(({ id, type, message }) => (
					<motion.div
						key={id}
						initial={{ opacity: 0, x: 50 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: 50 }}
						transition={{ type: "spring", stiffness: 500, damping: 30 }}
						style={{
							backgroundColor: "#fff",
							borderRadius: 8,
							boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
							border: `2px solid ${
								type === "success"
									? "#63C5AB"
									: type === "error"
									? "#E05353"
									: "#E0AA3E"
							}`,
							color:
								type === "success"
									? "#63C5AB"
									: type === "error"
									? "#E05353"
									: "#E0AA3E",
							fontWeight: "600",
							padding: "12px 20px",
							marginBottom: 12,
							minWidth: 240,
							userSelect: "none",
						}}
					>
						{message}
					</motion.div>
				))}
			</AnimatePresence>
		</div>
	);
};
