import { api } from "@/api/client";
import type {
  MedicationCreateRequest,
  MedicationDto,
  MedicationUpdateRequest,
} from "@/types/Medication";

const TENANT = "clinic1";

export async function createMedication(payload: MedicationCreateRequest): Promise<MedicationDto> {
  const response = await api.post<MedicationDto>(`/api/medications?tenant=${TENANT}`, payload);
  return response.data;
}

export async function updateMedication(id: string, payload: MedicationUpdateRequest): Promise<MedicationDto> {
  const response = await api.put<MedicationDto>(`/api/medications/${id}?tenant=${TENANT}`, payload);
  return response.data;
}
