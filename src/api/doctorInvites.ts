import axios from "axios";
import { api } from "./client";

export type DoctorInviteCreateResponse = {
  code: string;
  expiresAt: string;
};

export type DoctorInviteListItem = {
  code: string;
  status: string;
  createdAt: string;
  expiresAt: string;
  usedAt?: string | null;
};

function getInviteApiErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { title?: string; message?: string } | undefined;
    return data?.message ?? data?.title ?? fallback;
  }

  return error instanceof Error ? error.message : fallback;
}

export async function createDoctorInvite(): Promise<DoctorInviteCreateResponse> {
  try {
    const response = await api.post<DoctorInviteCreateResponse>("/api/doctor/invites");
    return response.data;
  } catch (error) {
    throw new Error(getInviteApiErrorMessage(error, "Не удалось сгенерировать код приглашения."));
  }
}

export async function getDoctorInvites(): Promise<DoctorInviteListItem[]> {
  try {
    const response = await api.get<DoctorInviteListItem[]>("/api/doctor/invites");
    return response.data ?? [];
  } catch (error) {
    throw new Error(getInviteApiErrorMessage(error, "Не удалось загрузить коды приглашения."));
  }
}
