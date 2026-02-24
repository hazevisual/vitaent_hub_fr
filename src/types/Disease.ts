export type DiseaseDto = {
  id: string;
  name: string;
  code: string;
  description: string;
  clinicalCourse: string;
  symptoms: string[];
  complications: string[];
  recommendedExams: string[];
  createdAt: string;
};

export type DiseaseStatsDto = {
  totalPatients: number;
  activeCases: number;
  newCasesLast30Days: number;
  averageTreatmentDurationDays: number;
  updatedAt?: string;
};
