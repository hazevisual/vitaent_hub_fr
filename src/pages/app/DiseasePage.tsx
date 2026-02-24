import { Alert, Box, CircularProgress, Divider, Stack, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getDiseaseById, getDiseaseStatsById } from "@/api/diseases";
import PageContainer from "@/components/ui/PageContainer";
import SoftCard from "@/components/ui/SoftCard";

function SectionList({ title, items }: { title: string; items: string[] }) {
  return (
    <Box>
      <Typography variant="h6" sx={{ fontSize: "1rem", fontWeight: 600, mb: 1.5 }}>
        {title}
      </Typography>
      <Box component="ul" sx={{ m: 0, pl: 2.5, display: "grid", gap: 1 }}>
        {items.map((item) => (
          <Typography component="li" variant="body1" key={item} sx={{ color: "text.primary" }}>
            {item}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}

export default function DiseasePage() {
  const { id = "1" } = useParams<{ id: string }>();

  const diseaseQuery = useQuery({
    queryKey: ["disease", id],
    queryFn: () => getDiseaseById(id),
  });

  const statsQuery = useQuery({
    queryKey: ["disease", id, "stats"],
    queryFn: () => getDiseaseStatsById(id),
  });

  if (diseaseQuery.isLoading || statsQuery.isLoading) {
    return (
      <PageContainer>
        <Box sx={{ display: "grid", placeItems: "center", minHeight: 320 }}>
          <CircularProgress size={28} />
        </Box>
      </PageContainer>
    );
  }

  if (diseaseQuery.isError || statsQuery.isError || !diseaseQuery.data || !statsQuery.data) {
    return (
      <PageContainer>
        <Alert severity="error" sx={{ maxWidth: 720 }}>
          Не удалось загрузить данные заболевания. Попробуйте обновить страницу.
        </Alert>
      </PageContainer>
    );
  }

  const disease = diseaseQuery.data;
  const stats = statsQuery.data;
  const updatedAt = stats.updatedAt ?? disease.createdAt;
  const fallbackDescription =
    "Биполярное расстройство I типа (БАР I) — это хроническое аффективное заболевание, характеризующееся чередованием маниакальных, депрессивных и интермиссионных периодов. " +
    "В клинической практике важно учитывать длительность эпизодов, выраженность психомоторных и когнитивных нарушений, а также влияние симптомов на социальное и профессиональное функционирование пациента.\n\n" +
    "На этапе наблюдения оценивают качество сна, изменения аппетита, динамику активности, риск импульсивного поведения, наличие психотических симптомов, а также приверженность медикаментозной и психотерапевтической поддержке. " +
    "План ведения формируется индивидуально, с регулярной переоценкой эффективности и переносимости терапии.\n\n" +
    "При длительном течении заболевания рекомендуется структурированное междисциплинарное сопровождение: обучение пациента и семьи признакам обострения, работа с факторами стресса, контроль соматических факторов риска и профилактика рецидивов. " +
    "Своевременная коррекция схемы лечения и поддержка режима дня улучшают прогноз и устойчивость ремиссии.";
  const descriptionText = disease.description?.trim() ? disease.description : fallbackDescription;

  return (
    <PageContainer>
      <Box
        sx={{
          width: "100%",
          maxWidth: 1560,
          mx: "auto",
          minWidth: 0,
          overflowX: "hidden",
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1fr) 320px" },
            gap: { xs: 2, md: 3 },
            alignItems: "stretch",
            minWidth: 0,
            minHeight: 0,
          }}
        >
        <SoftCard
          sx={{ minWidth: 0, minHeight: 0 }}
          contentSx={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 0, minHeight: 0, overflow: "hidden" }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h4" sx={{ fontSize: { xs: "1.5rem", md: "1.8rem" }, fontWeight: 600, mb: 0.75 }}>
              {disease.name}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
              Код: {disease.code}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", minHeight: 0, overflow: "hidden", gap: 1.5 }}>
            <Typography variant="h6" sx={{ fontSize: "1rem", fontWeight: 600 }}>
              Описание
            </Typography>
            <Box
              sx={{
                maxHeight: "clamp(160px, 28vh, 320px)",
                overflowY: "auto",
                overflowX: "hidden",
                pr: 1,
                minWidth: 0,
              }}
            >
              <Typography variant="body1" sx={{ whiteSpace: "pre-line", overflowWrap: "anywhere" }}>
                {descriptionText}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ flexShrink: 0 }} />

          <Stack spacing={3} sx={{ minWidth: 0 }}>
            <Box>
              <Typography variant="h6" sx={{ fontSize: "1rem", fontWeight: 600, mb: 1.5 }}>
                Клиническое течение
              </Typography>
              <Typography variant="body1">{disease.clinicalCourse}</Typography>
            </Box>

            <SectionList title="Симптомы" items={disease.symptoms} />
            <SectionList title="Осложнения" items={disease.complications} />
            <SectionList title="Рекомендуемые обследования" items={disease.recommendedExams} />
          </Stack>
        </SoftCard>

        <SoftCard title="Статистика" sx={{ alignSelf: "start", minWidth: 0 }} contentSx={{ gap: 2.5, minWidth: 0 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 1.5,
            }}
          >
            {[
              { label: "Всего пациентов", value: stats.totalPatients },
              { label: "Активные случаи", value: stats.activeCases },
              { label: "Новые за 30 дней", value: stats.newCasesLast30Days },
              { label: "Ср. длительность лечения", value: `${stats.averageTreatmentDurationDays} дн.` },
            ].map((metric) => (
              <Box key={metric.label} sx={{ border: "1px solid #E5E5E7", borderRadius: "12px", p: 1.5, minWidth: 0 }}>
                <Typography variant="body2" sx={{ color: "text.secondary", mb: 0.75 }}>
                  {metric.label}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 600, fontSize: "1.25rem" }}>
                  {metric.value}
                </Typography>
              </Box>
            ))}
          </Box>

          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Последнее обновление: {new Date(updatedAt).toLocaleDateString("ru-RU")}
          </Typography>
        </SoftCard>
        </Box>
      </Box>
    </PageContainer>
  );
}
