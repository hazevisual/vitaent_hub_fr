import axios from "axios";
import type { AuthResponse } from "types/Auth/AuthResponse";
import type { RegisterRequest } from "types/Auth/RegisterRequest";
import { api, setAccessToken } from "./client";

export type AuthRequest = { UserName: string; Password: string; TenantSlug?: string };

export type MeResponse = {
  userId?: string;
  username?: string;
  tenantId?: string | null;
  tenantSlug?: string | null;
  membershipId?: string | null;
  roles?: string[];
  patientId?: string | null;
  doctorId?: string | null;
};

type ApiProblemResponse = {
  message?: string;
  title?: string;
  errors?: Record<string, string[] | undefined>;
};

function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiProblemResponse | undefined;
    const validationMessages = data?.errors
      ? Object.values(data.errors)
          .flatMap((messages) => messages ?? [])
          .filter(Boolean)
      : [];

    return validationMessages[0] ?? data?.message ?? data?.title ?? fallback;
  }

  return error instanceof Error ? error.message : fallback;
}

export async function getMe(): Promise<MeResponse> {
  const response = await api.get<MeResponse>("/api/me");
  return response.data ?? {};
}

function mapAuthResponse(
  token: string,
  me: MeResponse,
  fallbackUserName: string,
  refreshToken?: string | null,
): AuthResponse {
  return {
    success: true,
    token,
    accessToken: token,
    refreshToken: refreshToken ?? undefined,
    user: {
      userId: me.userId ?? "",
      userName: me.username ?? fallbackUserName,
      urlHospital: me.tenantSlug ?? "",
      tenantId: me.tenantId ?? null,
      tenantSlug: me.tenantSlug ?? null,
      membershipId: me.membershipId ?? null,
      roles: me.roles ?? [],
      patientId: me.patientId ?? null,
      doctorId: me.doctorId ?? null,
    },
  };
}

export async function signIn(payload: AuthRequest): Promise<AuthResponse> {
  try {
    const res = await api.post<{ accessToken: string; expiresIn?: number; refreshToken?: string | null }>("/api/auth/login", {
      username: payload.UserName,
      password: payload.Password,
      tenantSlug: payload.TenantSlug ?? null,
    });

    const token = res.data?.accessToken;
    if (!token) {
      throw new Error("Ошибка авторизации.");
    }

    setAccessToken(token);

    const me = await getMe();
    return mapAuthResponse(token, me, payload.UserName, res.data?.refreshToken ?? undefined);
  } catch (error: unknown) {
    throw new Error(getApiErrorMessage(error, "Не удалось выполнить вход. Проверьте логин и пароль."));
  }
}

export async function signOut(): Promise<void> {
  setAccessToken(null);
}

export async function registerUser(payload: RegisterRequest): Promise<AuthResponse> {
  try {
    const res = await api.post<{ accessToken: string; expiresIn?: number; refreshToken?: string | null }>("/api/auth/register-by-invite", {
      inviteCode: payload.inviteCode,
      email: payload.email,
      password: payload.password,
      fullName: payload.fullName,
      birthDate: payload.birthDate,
      sex: payload.sex,
    });

    const token = res.data?.accessToken;
    if (!token) {
      throw new Error("Не удалось завершить регистрацию.");
    }

    setAccessToken(token);

    const me = await getMe();
    return mapAuthResponse(token, me, payload.email, res.data?.refreshToken ?? undefined);
  } catch (error: unknown) {
    throw new Error(getApiErrorMessage(error, "Не удалось завершить регистрацию по коду приглашения."));
  }
}
