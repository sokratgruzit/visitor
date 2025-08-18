import { authFetch } from "./auth";
import type { PaymentData, PaymentResponse } from "../types";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

// Создание платежа / подписки
export async function makePayment(data: PaymentData): Promise<PaymentResponse> {
    try {
        const response = await authFetch(`${apiBaseUrl}/api/payment/yookassa`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            return { success: false, message: `HTTP error: ${response.status}` };
        }

        return await response.json();
    } catch (err) {
        console.error("Ошибка при запросе оплаты:", err);
        return { success: false, message: "Сетевая ошибка" };
    }
}

// Проверка статуса платежа
export async function getPaymentStatus(): Promise<PaymentResponse> {
    try {
        const response = await authFetch(`${apiBaseUrl}/api/payment/yookassa/status`, {
            method: "GET",
            credentials: "include",
        });

        if (!response.ok) {
            return { success: false, message: `HTTP error: ${response.status}` };
        }

        return await response.json();
    } catch (err) {
        console.error("Ошибка при проверке статуса платежа:", err);
        return { success: false, message: "Сетевая ошибка" };
    }
}

// Отмена подписки
export async function cancelSubscription(): Promise<PaymentResponse> {
    try {
        const response = await authFetch(`${apiBaseUrl}/api/payment/yookassa/cancel`, {
            method: "POST",
            credentials: "include",
        });

        if (!response.ok) {
            return { success: false, message: `HTTP error: ${response.status}` };
        }

        return await response.json();
    } catch (err) {
        console.error("Ошибка при отмене подписки:", err);
        return { success: false, message: "Сетевая ошибка" };
    }
}

// Возобновление подписки
export async function resumeSubscription(): Promise<PaymentResponse> {
    try {
        const response = await authFetch(`${apiBaseUrl}/api/payment/yookassa/resume`, {
            method: "POST",
            credentials: "include",
        });

        if (!response.ok) {
            return { success: false, message: `HTTP error: ${response.status}` };
        }

        return await response.json();
    } catch (err) {
        console.error("Ошибка при возобновлении подписки:", err);
        return { success: false, message: "Сетевая ошибка" };
    }
}

// Получение истории платежей пользователя
export async function getUserPaymentHistory(): Promise<any> {
    try {
        const response = await authFetch(`${apiBaseUrl}/api/payment/yookassa/history`, {
            method: "GET",
            credentials: "include",
        });

        if (!response.ok) {
            return { success: false, message: `HTTP error: ${response.status}` };
        }

        return await response.json();
    } catch (err) {
        console.error("Ошибка при получении истории платежей:", err);
        return { success: false, message: "Сетевая ошибка" };
    }
}

