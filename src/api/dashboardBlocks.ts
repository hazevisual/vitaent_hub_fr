import { api } from "@/api/client";
import type { DashboardBlockResponse, DashboardBlockUpdateRequest } from "@/types/DashboardBlocks";

export async function getPatientDashboardBlocks(): Promise<DashboardBlockResponse> {
  const response = await api.get<DashboardBlockResponse>("/api/patient/dashboard-blocks");
  return response.data;
}

export async function updatePatientDashboardBlocks(payload: DashboardBlockUpdateRequest): Promise<DashboardBlockResponse> {
  const response = await api.put<DashboardBlockResponse>("/api/patient/dashboard-blocks", payload);
  return response.data;
}
