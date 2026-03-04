import { api } from "@/api/client";
import type {
  MedicationSlotCreateRequest,
  MedicationSlotDto,
  MedicationSlotItemCreateRequest,
  MedicationSlotItemDto,
} from "@/types/Medication";

export async function getPatientMedicationSlots(): Promise<MedicationSlotDto[]> {
  const response = await api.get<MedicationSlotDto[]>("/api/patient/medication-slots");
  return response.data;
}

export async function createPatientMedicationSlot(
  payload: MedicationSlotCreateRequest,
): Promise<MedicationSlotDto> {
  const response = await api.post<MedicationSlotDto>("/api/patient/medication-slots", payload);
  return response.data;
}

export async function deletePatientMedicationSlot(id: string): Promise<void> {
  await api.delete(`/api/patient/medication-slots/${id}`);
}

export async function addPatientMedicationSlotItem(
  slotId: string,
  payload: MedicationSlotItemCreateRequest,
): Promise<MedicationSlotItemDto> {
  const response = await api.post<MedicationSlotItemDto>(
    `/api/patient/medication-slots/${slotId}/items`,
    payload,
  );
  return response.data;
}

export async function deletePatientMedicationSlotItem(slotId: string, itemId: string): Promise<void> {
  await api.delete(`/api/patient/medication-slots/${slotId}/items/${itemId}`);
}
