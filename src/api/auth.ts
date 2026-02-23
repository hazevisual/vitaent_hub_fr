import axios from "axios";
import type { AuthResponse } from "types/Auth/AuthResponse";
import { api, setAccessToken } from "./client";

export type AuthRequest = { UserName: string; Password: string };

export type MeResponse = {
    email?: string;
    userName?: string;
    username?: string;
};

export type RegisterRequest = {
    login: string;
    password: string;
    confirmPassword: string;
    hospitalId?: number;
};

function getApiErrorMessage(error: unknown, fallback: string): string {
    if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string; title?: string } | undefined;
        return data?.message ?? data?.title ?? fallback;
    }

    return error instanceof Error ? error.message : fallback;
}

export async function getMe(): Promise<MeResponse> {
    const response = await api.get<MeResponse>("/api/me");
    return response.data ?? {};
}

export async function signIn(payload: AuthRequest): Promise<AuthResponse> {
    try {
        const res = await api.post<{ accessToken: string; expiresIn?: number }>("/api/auth/sign-in", {
            username: payload.UserName,
            password: payload.Password,
        });

        const token = res.data?.accessToken;
        if (!token) {
            throw new Error("Ошибка авторизации");
        }

        setAccessToken(token);

        const me = await getMe();
        const resolvedUserName = me.email ?? me.userName ?? me.username ?? payload.UserName;

        return {
            success: true,
            token,
            accessToken: token,
            user: {
                userId: 1,
                userName: resolvedUserName,
                urlHospital: "",
            },
        };
    } catch (error: unknown) {
        throw new Error(getApiErrorMessage(error, "Не удалось выполнить вход. Проверьте логин и пароль."));
    }
}

export async function signOut(): Promise<void> {
    setAccessToken(null);
}

export async function registerUser(payload: RegisterRequest): Promise<AuthResponse> {
    void payload;
    throw new Error("Registration endpoint is not configured.");
}
