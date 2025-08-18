import { authFetch } from "./auth";

import type { VotingResponse } from "../types";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const accessToken = localStorage.getItem("accessToken");

/**
 * Создание нового голосования
 */
export async function createVoting(payload: {
    title: string;
    description: string;
    level?: number;
    status?: string;
    creatorId?: number | string | null;
}) : Promise<VotingResponse> {
    const response = await authFetch(`${apiBaseUrl}/api/votings`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));

    return {
        success: response.ok && data.success,
        message: data.message || (response.ok ? "Голосование создано" : "Ошибка создания голосования"),
        voting: data.voting,
    };
}

interface GetVotingsParams {
	page?: number;
	limit?: number;
    userId?: number;
}

/**
 * Получение всех голосований
 */
export async function getVotings(params: GetVotingsParams = {}): Promise<VotingResponse> {
	const { page = 1, limit = 10, userId = null } = params;
	const url = new URL(`${apiBaseUrl}/api/votings`);
	url.searchParams.append("page", String(page));
	url.searchParams.append("limit", String(limit));

	if (userId !== null) {
		url.searchParams.append("userId", String(userId));
	}

	const response = await fetch(url.toString(), {
		method: "GET",
		headers: { "Content-Type": "application/json" },
	});

	const data = await response.json().catch(() => ({}));

	return {
		success: response.ok && data.success,
		message: data.message || (response.ok ? "Список голосований получен" : "Ошибка получения списка"),
		my: data.my ? {
			votings: data.my.votings || [],
			totalPages: data.my.totalPages || 1,
			currentPage: data.my.currentPage || 1,
			totalCount: data.my.totalCount || 0,
		} : undefined,
		all: data.all ? {
			votings: data.all.votings || [],
			totalPages: data.all.totalPages || 1,
			currentPage: data.all.currentPage || 1,
			totalCount: data.all.totalCount || 0,
		} : undefined,
		voting: data.voting,
	};
}

/**
 * Получение одного голосования по ID
 */
export async function getVotingById(id: number | string): Promise<VotingResponse> {
    const response = await fetch(`${apiBaseUrl}/api/votings/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    const data = await response.json().catch(() => ({}));
    return {
        success: response.ok && data.success,
        message: data.message || (response.ok ? "Голосование получено" : "Ошибка получения голосования"),
        voting: data.voting,
    };
}

/**
 * Обновление голосования (partial update)
 */
export async function updateVoting(id: number | string, payload: {
    title?: string;
    description?: string;
    level?: number;
    status?: string;
}): Promise<VotingResponse> {
    const response = await authFetch(`${apiBaseUrl}/api/votings/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));
    return {
        success: response.ok && data.success,
        message: data.message || (response.ok ? "Голосование обновлено" : "Ошибка обновления"),
        voting: data.voting,
    };
}

/**
 * Удаление голосования
 */
export async function deleteVoting(id: number | string): Promise<VotingResponse> {
    const response = await authFetch(`${apiBaseUrl}/api/votings/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });

    const data = await response.json().catch(() => ({}));
    return {
        success: response.ok && data.success,
        message: data.message || (response.ok ? "Голосование удалено" : "Ошибка удаления"),
    };
}
