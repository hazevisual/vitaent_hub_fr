import { api } from "@/api/client";
import type {
  MedicationCreateRequest,
  MedicationDto,
  MedicationUpdateRequest,
} from "@/types/Medication";

export async function getPatientMedicines(): Promise<MedicationDto[]> {
  const response = await api.get<MedicationDto[]>("/api/patient/medicines");
  return response.data;
}

export async function getPatientMedicine(id: string): Promise<MedicationDto> {
  const response = await api.get<MedicationDto>(`/api/patient/medicines/${id}`);
  return response.data;
}

export async function createMedication(payload: MedicationCreateRequest): Promise<MedicationDto> {
  const response = await api.post<MedicationDto>("/api/patient/medicines", payload);
  return response.data;
}

export async function updateMedication(id: string, payload: MedicationUpdateRequest): Promise<MedicationDto> {
  const response = await api.put<MedicationDto>(`/api/patient/medicines/${id}`, payload);
  return response.data;
}

export async function deleteMedication(id: string): Promise<void> {
  await api.delete(`/api/patient/medicines/${id}`);
}
