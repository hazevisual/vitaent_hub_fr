// src/api/auth.ts
import type { AuthResponse } from "types/Auth/AuthResponse";
import { api, setAccessToken } from "./client";

/**
 * ===== Типы =====
 */
export type AuthRequest = { UserName: string; Password: string };

export type RegisterRequest = {
    login: string;
    password: string;
    confirmPassword: string;
    hospitalId?: number;
};

/**
 * ===== Login =====
 */
export async function signIn(payload: AuthRequest): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>("/auth/login", payload);
    const data = res.data;

    if (!data?.success) {
        throw new Error(data?.errorMessage || "Ошибка авторизации");
    }

    if (data.token) setAccessToken(data.token);
    return data;
}

/**
 * ===== Logout =====
 */
export async function signOut(): Promise<void> {
    try {
        await api.post("/auth/logout", {});
    } finally {
        setAccessToken(null);
    }
}

/**
 * ===== Refresh session =====
 * вызываться при старте приложения (автовход).
 * refresh лежит в httpOnly cookie, сервер сам его прочитает.
 */
export async function refreshSession(): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>("/auth/refresh", {});
    const data = res.data;

    if (!res.status || res.status >= 400 || !data?.success) {
        throw new Error(data?.errorMessage || "Ошибка обновления токена");
    }

    if (data.token) setAccessToken(data.token);
    return data;
}

/**
 * ===== Register =====
 * регистрация + сразу выдаёт access-token (в data.token)
 * и ставит refresh-token в httpOnly cookie
 */
export async function registerUser(payload: RegisterRequest): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>("/auth/register", {
        username: payload.login,
        password: payload.password,
        confirmPassword: payload.confirmPassword,
        hospitalId: payload.hospitalId ?? null,
    });

    const data = res.data;

    if (!data?.success) {
        throw new Error(data?.errorMessage || "Ошибка при регистрации");
    }

    if (data.token) setAccessToken(data.token);
    return data;
}
