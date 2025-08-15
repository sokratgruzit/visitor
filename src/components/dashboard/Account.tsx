import React, { useState, useEffect } from "react";
import { makePayment, getPaymentStatus, cancelSubscription } from "../../api/payment";
import { useNotificationStore } from "../../store/notificationStore";
import { authFetch } from "../../api/auth";
import type { PaymentResponse } from "../../types";

import styles from "./Account.module.css";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const Account: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [subscriptionStatus, setSubscriptionStatus] = useState("inactive");

    const notify = useNotificationStore((state) => state.showNotification);

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

    const handlePayment = async () => {
        setLoading(true);
        const res: PaymentResponse = await makePayment({ product: "Подписка", amount: 299 });
        if (res.success && res.confirmationUrl) {
            setSubscriptionStatus("pending");
            window.location.href = res.confirmationUrl;
        } else {
            notify({ type: "error", message: res.message || "Не удалось создать платёж" });
        }
        setLoading(false);
    };

    const handleCancel = async () => {
        setLoading(true);
        const res: PaymentResponse = await cancelSubscription();
        if (res.success) {
            setSubscriptionStatus("inactive");
            notify({ type: "success", message: "Подписка отменена" });
        } else {
            notify({ type: "error", message: res.message || "Не удалось отменить подписку" });
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
            <h1 className={styles.title}>Аккаунт</h1>
            <p className={styles.status}>
                Статус подписки: <span className={styles[subscriptionStatus]}>{subscriptionStatus || "Не активирована"}</span>
            </p>

            <div className={styles.fields}>
                {(subscriptionStatus === "inactive" || !subscriptionStatus) && (
                    <button className={styles.payButton} onClick={handlePayment} disabled={loading}>
                        {loading ? "Подготовка..." : "Оплатить / Подписаться"}
                    </button>
                )}

                {subscriptionStatus === "pending" && (
                    <button className={styles.payButton} disabled>
                        Оплата в процессе...
                    </button>
                )}

                {subscriptionStatus === "active" && (
                    <button className={styles.payButton} onClick={handleCancel} disabled={loading}>
                        {loading ? "..." : "Отменить подписку"}
                    </button>
                )}

                <button className={styles.payButton} onClick={handleCheckStatus} disabled={loading}>
                    Проверить статус
                </button>
            </div>
        </div>
    );
};
