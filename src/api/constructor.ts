import { authFetch } from "./auth";
import type { SlugResponse } from "../types";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const accessToken = localStorage.getItem("accessToken");

/**
 * Проверка слага на уникальность.
 * Возвращает `true`, если слаг свободен.
 * Бросает ошибку, если слаг занят или произошла другая ошибка.
 */
export async function checkSlug(slug: string): Promise<SlugResponse> {
    const response = await authFetch(`${apiBaseUrl}/api/constructor/check-slug?slug=${encodeURIComponent(slug)}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        return {
            success: data.success,
            message: data.message || "Ошибка при проверке слага",
        };
    }

    return {
        success: data.success,
        message: data.message || "Slug успешно проверен",
        available: data.available,
    };
}

/**
 * Добавление слага.
 * Возвращает `true`, если успешно добавлен.
 * Бросает ошибку, если слаг уже существует или произошла другая ошибка.
 */
export async function addSlug(slug: string): Promise<SlugResponse> {
	const response = await authFetch(`${apiBaseUrl}/api/constructor/add-slug`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
		body: JSON.stringify({ slug }),
	});

	const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        return {
            success: data.success,
            message: data.message || "Ошибка при добавлении слага",
        };
    }

    return {
        success: data.success,
        message: data.message || "Slug успешно добавлен",
        id: data.id,
    };
}

/**
 * Получение данных лендинга для конструктора.
 * Требует авторизации.
 */
export async function getConstructorLanding(): Promise<{
	success: boolean;
	data?: any;
	message?: string;
    slug?: string;
}> {
	const response = await authFetch(`${apiBaseUrl}/api/constructor/landing-data`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
	});

	const data = await response.json().catch(() => ({}));
    
	if (!response.ok) {
		return {
			success: false,
			message: data.message || "Ошибка при получении лендинга",
		};
	}

	return {
		success: true,
		data: data.data,
        slug: data.slug
	};
}

/**
 * Сохранение данных лендинга.
 */
export async function saveLanding(landingData: any, slug: string): Promise<{
	success: boolean;
	message?: string;
}> {
	const response = await authFetch(`${apiBaseUrl}/api/constructor/save-landing`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
		body: JSON.stringify({ data: landingData, slug }),
	});

	const data = await response.json().catch(() => ({}));

	if (!response.ok) {
		return {
			success: false,
			message: data.message || "Ошибка при сохранении лендинга",
		};
	}

	return {
		success: true,
		message: data.message || "Лендинг успешно сохранен",
	};
}