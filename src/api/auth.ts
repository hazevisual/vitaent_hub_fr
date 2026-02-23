import type { AuthResponse } from "types/Auth/AuthResponse";
import { api, setAccessToken } from "./client";

export type AuthRequest = { UserName: string; Password: string };

export type RegisterRequest = {
    login: string;
    password: string;
    confirmPassword: string;
    hospitalId?: number;
};

export async function signIn(payload: AuthRequest): Promise<AuthResponse> {
    const res = await api.post<{ accessToken: string }>("/auth/sign-in", {
        username: payload.UserName,
        password: payload.Password,
    });

    const token = res.data?.accessToken;
    if (!token) {
        throw new Error("Ошибка авторизации");
    }

    setAccessToken(token);

    return {
        success: true,
        token,
        accessToken: token,
        user: {
            userId: 1,
            userName: payload.UserName,
            urlHospital: "",
        },
    };
}

export async function signOut(): Promise<void> {
    setAccessToken(null);
}

export async function refreshSession(): Promise<AuthResponse> {
    throw new Error("Refresh session is not configured for local JWT flow.");
}

export async function registerUser(payload: RegisterRequest): Promise<AuthResponse> {
    void payload;
    throw new Error("Registration endpoint is not configured.");
}
