import type { RegisterData, LoginData } from "../types";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export async function registerUser(data: RegisterData) {
    const response = await fetch(`${apiBaseUrl}/api/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    return response.json();
}

export async function logoutUser() {
    const response = await fetch(`${apiBaseUrl}/api/auth/logout`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
    });

    return response.json();
}

export async function loginUser(data: LoginData) {
    const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    return response.json();
}

export async function checkGate(accessToken: string) {
    const response = await fetch(`${apiBaseUrl}/api/auth/gate`, {
        method: "GET",
        credentials: "include",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error("Доступ запрещён");
    }

    return response.json();
}

export async function authFetch(input: RequestInfo, init?: RequestInit) {
    const token = localStorage.getItem("accessToken");

    const headers = init?.headers instanceof Headers ? init.headers : new Headers(init?.headers);
    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    let response = await fetch(input, { ...init, headers, credentials: "include" }); // include for cookie

    if (response.status === 401) {
        try {
            // попытка обновить accessToken
            const refreshRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/refresh`, {
                method: "POST",
                credentials: "include",
            });

            if (!refreshRes.ok) throw new Error();

            const { accessToken: newAccessToken } = await refreshRes.json();
            localStorage.setItem("accessToken", newAccessToken);

            headers.set("Authorization", `Bearer ${newAccessToken}`);
            response = await fetch(input, { ...init, headers, credentials: "include" });
        } catch {
            window.location.href = "/login";
            throw new Error("Необходимо залогиниться заново");
        }
    }

    return response;
}

