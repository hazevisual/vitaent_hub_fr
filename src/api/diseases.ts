import axios from "axios";
import { api } from "@/api/client";
import type { DiseaseDto, DiseaseStatsDto } from "@/types/Disease";

const TENANT = "clinic1";

const mockedDisease: DiseaseDto = {
  id: "1",
  name: "Сахарный диабет 2 типа",
  code: "E11",
  description:
    "Хроническое метаболическое заболевание, характеризующееся устойчивым повышением уровня глюкозы крови на фоне инсулинорезистентности.",
  clinicalCourse:
    "Течение чаще постепенное: от бессимптомного периода и нарушенной толерантности к глюкозе до клинически выраженных проявлений. Заболевание требует длительного наблюдения, коррекции образа жизни и медикаментозной терапии.",
  symptoms: [
    "Полиурия и жажда",
    "Сухость во рту",
    "Повышенная утомляемость",
    "Снижение остроты зрения",
  ],
  complications: [
    "Диабетическая нефропатия",
    "Диабетическая ретинопатия",
    "Периферическая нейропатия",
    "Сердечно-сосудистые осложнения",
  ],
  recommendedExams: [
    "Глюкоза плазмы натощак",
    "HbA1c",
    "Липидный профиль",
    "Оценка функции почек (СКФ, альбуминурия)",
    "Осмотр глазного дна",
  ],
  createdAt: "2026-01-02T09:00:00Z",
};

const mockedStats: DiseaseStatsDto = {
  totalPatients: 148,
  activeCases: 124,
  newCasesLast30Days: 12,
  averageTreatmentDurationDays: 214,
  updatedAt: "2026-02-18T08:30:00Z",
};

export async function getDiseaseById(id: string): Promise<DiseaseDto> {
  try {
    const response = await api.get<DiseaseDto>(`/api/diseases/${id}?tenant=${TENANT}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && (!error.response || error.response.status === 404 || error.response.status === 501)) {
      return { ...mockedDisease, id };
    }

    throw error;
  }
}

export async function getDiseaseStatsById(id: string): Promise<DiseaseStatsDto> {
  try {
    const response = await api.get<DiseaseStatsDto>(`/api/diseases/${id}/stats?tenant=${TENANT}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && (!error.response || error.response.status === 404 || error.response.status === 501)) {
      return mockedStats;
    }

    throw error;
  }
}
