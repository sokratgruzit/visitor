import React, { useState, useEffect } from "react";
import { makePayment, getPaymentStatus, getUserPaymentHistory } from "../../api/payment";
import { useNotificationStore } from "../../store/notificationStore";
import { useAuthStore } from "../../store/useAuthStore";
import { authFetch } from "../../api/auth";
import type { PaymentResponse, Payment } from "../../types";
import Button from "../ui/button/Button";

import styles from "./Account.module.css";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const Account: React.FC = () => {
	const [loading, setLoading] = useState(false);
	const [subscriptionStatus, setSubscriptionStatus] = useState("inactive");
	const [payments, setPayments] = useState<Payment[]>([]);

	const notify = useNotificationStore((state) => state.showNotification);
    const { user } = useAuthStore();

	useEffect(() => {
		const getUserData = async () => {
			const res = await authFetch(`${apiBaseUrl}/api/auth/get-user`);
			if (!res.ok) {
				notify({ type: "error", message: "Не удалось получить пользователя" });
			} else {
				const data = await res.json();
				setSubscriptionStatus(data.user.subscriptionStatus);
			}
		};
		getUserData();
	}, []);

	useEffect(() => {
		const fetchPayments = async () => {
			try {
				const res = await getUserPaymentHistory();
				if (res.success) {
					setPayments(res.payments || []);
				} else {
					notify({ type: "error", message: "Не удалось загрузить историю платежей" });
				}
			} catch (err) {
				notify({ type: "error", message: "Сетевая ошибка при загрузке платежей" });
			}
		};
		fetchPayments();
	}, []);

	const handlePayment = async () => {
		setLoading(true);
		const res: PaymentResponse = await makePayment({ product: "subscription", amount: 800 });
		if (res.success && res.confirmationUrl) {
			setSubscriptionStatus("pending");
			window.location.href = res.confirmationUrl;
		} else {
			notify({ type: "error", message: res.message || "Не удалось создать платёж" });
		}
		setLoading(false);
	};

	const handleCheckStatus = async () => {
		setLoading(true);
		const res: PaymentResponse = await getPaymentStatus();
		if (res.success && res.status) {
			setSubscriptionStatus(res.status);
			notify({ type: "success", message: `Статус подписки: ${res.status}` });
		} else {
			notify({ type: "error", message: res.message || "Не удалось проверить статус" });
		}
		setLoading(false);
	};

	return (
		<div className={styles.container}>
            <div className={styles.topSection}>
                <div className={styles.fields}>
                    <p className={styles.status}>
                        Статус подписки: <span className={styles[subscriptionStatus]}>{subscriptionStatus || "Не активирована"}</span>
                    </p>

                    {user?.subscriptionEndAt && subscriptionStatus === "active" && (
                        <p className={styles.status}>
                            Действует до: <span>{new Date(user?.subscriptionEndAt).toLocaleString()}</span>
                        </p>
                    )}
                </div>

                <div className={styles.fields}>
                    {(subscriptionStatus !== "active" || !subscriptionStatus) && (
                        <div className={styles.btnsWrap}>
                            <Button
                                text={loading ? "Подготовка..." : subscriptionStatus === "pending" ? "В процессе..." : "Оплатить / Подписаться"}
                                onClick={handlePayment}
                                disabled={loading}
                                size="flex"
                                delay={1}
                                limiter={window.innerWidth <= 768}
                                color="#FFFFFF"
                                btnColor="#E05353"
                                fontSize="1rem"
                            />
                        </div>
                    )}

                    <div className={styles.btnsWrap}>
                        <Button
                            text="Проверить статус"
                            onClick={handleCheckStatus}
                            disabled={loading}
                            size="flex"
                            delay={1}
                            limiter={window.innerWidth <= 768}
                            color="#FFFFFF"
                            btnColor="#E05353"
                            fontSize="1rem"
                        />
                    </div>
                </div>
            </div>

			<div className={styles.infoBlock}>
				<h2>История платежей</h2>
				<div className={styles.tableWrapper}>
					<table className={styles.paymentsTable}>
						<thead>
							<tr>
								<th>ID</th>
								<th>Описание</th>
								<th>Сумма</th>
								<th>Статус</th>
								<th>Метод</th>
								<th>Дата создания</th>
							</tr>
						</thead>
						<tbody>
							{payments.length === 0 && (
								<tr>
									<td colSpan={6} style={{ textAlign: "center" }}>Платежи отсутствуют</td>
								</tr>
							)}
							{payments.map((p) => (
								<tr key={p.id}>
									<td data-label="ID">{p?.id}</td>
									<td data-label="Описание">{p?.description}</td>
									<td data-label="Сумма">{p?.amount?.value} {p?.amount?.currency}</td>
									<td data-label="Статус" className={styles[p?.status === "succeeded" ? "active" : p?.status === "canceled" ? "inactive" : "pending"]}>{p?.status}</td>
									<td data-label="Метод">{p?.payment_method?.title}</td>
									<td data-label="Дата создания">{new Date(p?.created_at).toLocaleString()}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};
