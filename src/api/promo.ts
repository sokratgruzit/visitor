import { authFetch } from "./auth";
import type { PromoCodeResponse } from "../types";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

// Применение промокода (уже зарегистрированным пользователем)
export async function applyPromoCode(code: string): Promise<PromoCodeResponse> {
    try {
        const response = await authFetch(`${apiBaseUrl}/api/promo-codes/apply`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
        });

        if (!response.ok) {
            return { success: false, message: `HTTP error: ${response.status}` };
        }

        return await response.json();
    } catch (err) {
        console.error("Ошибка при применении промокода:", err);
        return { success: false, message: "Сетевая ошибка" };
    }
}

// Получение всех промокодов (для админа)
export async function getPromoCodes(): Promise<PromoCodeResponse[]> {
    try {
        const response = await authFetch(`${apiBaseUrl}/api/promo-codes`, {
            method: "GET",
            credentials: "include",
        });

        if (!response.ok) return [];

        const data = await response.json();
        return data.promoCodes || [];
    } catch (err) {
        console.error("Ошибка при получении промокодов:", err);
        return [];
    }
}

// Получение промокода по id (для админа)
export async function getPromoCodeById(id: number): Promise<PromoCodeResponse> {
    try {
        const response = await authFetch(`${apiBaseUrl}/api/promo-codes/${id}`, {
            method: "GET",
            credentials: "include",
        });

        if (!response.ok) {
            return { success: false, message: `HTTP error: ${response.status}` };
        }

        return await response.json();
    } catch (err) {
        console.error("Ошибка при получении промокода:", err);
        return { success: false, message: "Сетевая ошибка" };
    }
}

// Создание промокода (админ)
export async function createPromoCode(data: any): Promise<PromoCodeResponse> {
    try {
        const response = await authFetch(`${apiBaseUrl}/api/promo-codes`, {
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
        console.error("Ошибка при создании промокода:", err);
        return { success: false, message: "Сетевая ошибка" };
    }
}

// Обновление промокода (админ)
export async function updatePromoCode(id: number, data: any): Promise<PromoCodeResponse> {
    try {
        const response = await authFetch(`${apiBaseUrl}/api/promo-codes/${id}`, {
            method: "PATCH",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            return { success: false, message: `HTTP error: ${response.status}` };
        }

        return await response.json();
    } catch (err) {
        console.error("Ошибка при обновлении промокода:", err);
        return { success: false, message: "Сетевая ошибка" };
    }
}

// Удаление промокода (админ)
export async function deletePromoCode(id: number): Promise<PromoCodeResponse> {
    try {
        const response = await authFetch(`${apiBaseUrl}/api/promo-codes/${id}`, {
            method: "DELETE",
            credentials: "include",
        });

        if (!response.ok) {
            return { success: false, message: `HTTP error: ${response.status}` };
        }

        return await response.json();
    } catch (err) {
        console.error("Ошибка при удалении промокода:", err);
        return { success: false, message: "Сетевая ошибка" };
    }
}
