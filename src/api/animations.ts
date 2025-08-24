import { authFetch } from "./auth";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const accessToken = localStorage.getItem("accessToken");

/**
 * Создание новой анимации
 */
export async function createAnimation(animationData: any): Promise<{
    success: boolean;
    message?: string;
    animation?: any;
}> {
    const response = await authFetch(`${apiBaseUrl}/api/animations`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(animationData),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        return { success: false, message: data.message || "Ошибка при создании анимации" };
    }

    return { success: true, message: data.message || "Анимация создана", animation: data.animation };
}

/**
 * Получение списка анимаций текущего пользователя
 */
export async function getMyAnimations(): Promise<{
    success: boolean;
    message?: string;
    animations?: any[];
}> {
    const response = await authFetch(`${apiBaseUrl}/api/animations`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        return { success: false, message: data.message || "Ошибка при получении анимаций" };
    }

    return { success: true, message: data.message, animations: data.animations };
}

/**
 * Получение анимации по ID (публичный доступ)
 */
export async function getAnimationById(id: number | string): Promise<{
    success: boolean;
    message?: string;
    animation?: any;
}> {
    const response = await fetch(`${apiBaseUrl}/api/animations/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        return { success: false, message: data.message || "Анимация не найдена" };
    }

    return { success: true, animation: data.animation };
}

/**
 * Удаление анимации (только для владельца)
 */
export async function deleteAnimation(id: number): Promise<{
    success: boolean;
    message?: string;
}> {
    const response = await authFetch(`${apiBaseUrl}/api/animations/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        return { success: false, message: data.message || "Ошибка при удалении анимации" };
    }

    return { success: true, message: data.message || "Анимация удалена" };
}

/**
 * Обновление анимации (название, данные, статус и т.п.)
 */
export async function updateAnimation(id: number, animationData: any): Promise<{
    success: boolean;
    message?: string;
    animation?: any;
}> {
    animationData.status = "production";
    
    const response = await authFetch(`${apiBaseUrl}/api/animations/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(animationData),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        return { success: false, message: data.message || "Ошибка при обновлении анимации" };
    }

    return { success: true, message: data.message || "Анимация обновлена", animation: data.animation };
}
