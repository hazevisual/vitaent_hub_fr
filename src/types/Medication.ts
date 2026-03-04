export type MedicationForm =
  | "Таблетки"
  | "Капсулы"
  | "Сироп"
  | "Спрей"
  | "Мазь"
  | "Инъекции"
  | "Другое";

export type MedicationDto = {
  id: string;
  name: string;
  strength?: string | null;
  form?: MedicationForm | string | null;
  note?: string | null;
  createdAt: string;
};

export type MedicationSlotItemDto = {
  id: string;
  medicineId: string;
  medicineName: string;
  medicineStrength?: string | null;
  medicineForm?: string | null;
  doseAmount: number;
  instructions?: string | null;
  createdAt: string;
};

export type MedicationSlotDto = {
  id: string;
  timeOfDay: string;
  createdAt: string;
  items: MedicationSlotItemDto[];
};

export type MedicationCreateRequest = {
  name: string;
  strength?: string;
  form?: string;
  note?: string;
};

export type MedicationUpdateRequest = MedicationCreateRequest;

export type MedicationSlotCreateRequest = {
  timeOfDay: string;
};

export type MedicationSlotItemCreateRequest = {
  medicineId: string;
  doseAmount: number;
  instructions?: string;
};

export type ValidationProblemDetails = {
  title?: string;
  detail?: string;
  errors?: Record<string, string[]>;
};

export type ProblemDetails = {
  title?: string;
  detail?: string;
};
