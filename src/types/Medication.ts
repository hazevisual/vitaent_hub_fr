export type MedicationForm =
  | "Таблетки"
  | "Капсулы"
  | "Сироп"
  | "Спрей"
  | "Мазь"
  | "Инъекции"
  | "Другое";

export type MedicationDoseUnit =
  | "мг"
  | "мкг"
  | "г"
  | "мл"
  | "капли"
  | "таб"
  | "капс"
  | "впрыск"
  | "другое";

export type MedicationScheduleType = "Daily" | "Weekly" | "Interval" | "Prn";

export type MedicationSchedule = {
  type: MedicationScheduleType;
  times?: string[];
  weekdays?: number[];
  intervalDays?: number;
  prnReason?: string;
};

export type MedicationReminder = {
  enabled: boolean;
  leadTimeMinutes?: number;
};

export type MedicationStock = {
  enabled: boolean;
  currentStock?: number;
  lowStockThreshold?: number;
};

export type MedicationDto = {
  id: string;
  name: string;
  form?: MedicationForm;
  doseAmount: number;
  doseUnit: MedicationDoseUnit;
  schedule: MedicationSchedule;
  startDate: string;
  endDate?: string;
  isPrn: boolean;
  notes?: string;
  reminders?: MedicationReminder;
  stock?: MedicationStock;
};

export type MedicationCreateRequest = Omit<MedicationDto, "id">;

export type MedicationUpdateRequest = MedicationCreateRequest;

export type ValidationProblemDetails = {
  title?: string;
  detail?: string;
  errors?: Record<string, string[]>;
};

export type ProblemDetails = {
  title?: string;
  detail?: string;
};
