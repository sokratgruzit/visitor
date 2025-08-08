import React from "react";
import { useLocation } from "react-router-dom";
import styles from "./EmailConfirmed.module.css";

export const EmailConfirmed: React.FC = () => {
	const location = useLocation();
	const params = new URLSearchParams(location.search);
	const msg = params.get("msg");

	let message = "";

	switch (msg) {
		case "success":
			message = "Почта успешно подтверждена!";
			break;
		case "expired":
			message = "Срок действия токена истёк.";
			break;
		case "empty":
			message = "Токен не был передан.";
			break;
		default:
			message = "Неизвестный статус подтверждения.";
	}

	return (
		<div className={styles.container}>
			<h1 className={styles.title}>Подтверждение почты</h1>
			<p className={styles.message}>{message}</p>
		</div>
	);
};
