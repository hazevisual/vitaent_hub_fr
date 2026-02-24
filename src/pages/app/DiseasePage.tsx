import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  Alert,
  Box,
  Button,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getDiseaseById, getDiseaseStatsById } from "@/api/diseases";
import PageContainer from "@/components/ui/PageContainer";
import SoftCard from "@/components/ui/SoftCard";

type SectionListProps = {
  title: string;
  items?: string[];
  isLoading: boolean;
};

function SectionList({ title, items, isLoading }: SectionListProps) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="h6" sx={{ fontSize: "1rem", fontWeight: 600, mb: 1.5 }}>
        {title}
      </Typography>

      {isLoading ? (
        <Stack spacing={1}>
          <Skeleton variant="rounded" height={20} />
          <Skeleton variant="rounded" height={20} width="92%" />
          <Skeleton variant="rounded" height={20} width="80%" />
        </Stack>
      ) : (
        <Box component="ul" sx={{ m: 0, pl: 2.5, display: "grid", gap: 1, minWidth: 0 }}>
          {(items ?? []).map((item) => (
            <Typography
              component="li"
              variant="body1"
              key={item}
              sx={{ color: "text.primary", overflowWrap: "anywhere", minWidth: 0 }}
            >
              {item}
            </Typography>
          ))}
        </Box>
      )}
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

  const disease = diseaseQuery.data;
  const stats = statsQuery.data;
  const isLoading = diseaseQuery.isLoading || statsQuery.isLoading;

  const fallbackDescription =
    "Биполярное расстройство I типа (БАР I) — это хроническое аффективное заболевание, характеризующееся чередованием маниакальных, депрессивных и интермиссионных периодов. " +
    "В клинической практике важно учитывать длительность эпизодов, выраженность психомоторных и когнитивных нарушений, а также влияние симптомов на социальное и профессиональное функционирование пациента.";

  const descriptionText = disease?.description?.trim() ? disease.description : fallbackDescription;
  const updatedAt = stats?.updatedAt ?? disease?.createdAt;

  return (
    <PageContainer>
      <SoftCard
        sx={{ width: "100%", minWidth: 0, boxSizing: "border-box", overflow: "hidden" }}
        contentSx={{ p: { xs: 2, sm: 3, md: 4 }, "&:last-child": { pb: { xs: 2, sm: 3, md: 4 } }, minWidth: 0, gap: 3 }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
          sx={{ minWidth: 0 }}
        >
          <Box sx={{ minWidth: 0 }}>
            {isLoading ? (
              <>
                <Skeleton variant="rounded" width={340} height={38} sx={{ maxWidth: "100%", mb: 1 }} />
                <Skeleton variant="rounded" width={180} height={20} />
              </>
            ) : (
              <>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 600, overflowWrap: "anywhere", minWidth: 0 }}
                >
                  {disease?.name}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", overflowWrap: "anywhere" }}>
                  Код: {disease?.code}
                </Typography>
              </>
            )}
          </Box>

          <Button variant="outlined" startIcon={<EditOutlinedIcon fontSize="small" />} size="small">
            Редактировать
          </Button>
        </Stack>

        {(diseaseQuery.isError || statsQuery.isError) && (
          <Alert severity="warning" sx={{ borderRadius: "12px" }}>
            Часть данных временно недоступна. Отображаются доступные значения и заглушки.
          </Alert>
        )}

        <Grid container spacing={{ xs: 2, md: 3 }} sx={{ minWidth: 0 }}>
          <Grid item xs={12} md={8} sx={{ minWidth: 0 }}>
            <Stack spacing={3} sx={{ minWidth: 0 }}>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="h6" sx={{ fontSize: "1rem", fontWeight: 600, mb: 1.5 }}>
                  Описание
                </Typography>
                {isLoading ? (
                  <Stack spacing={1}>
                    <Skeleton variant="rounded" height={20} />
                    <Skeleton variant="rounded" height={20} width="96%" />
                    <Skeleton variant="rounded" height={20} width="90%" />
                    <Skeleton variant="rounded" height={20} width="82%" />
                  </Stack>
                ) : (
                  <Typography variant="body1" sx={{ whiteSpace: "pre-line", overflowWrap: "anywhere" }}>
                    {descriptionText}
                  </Typography>
                )}
              </Box>

              <Box sx={{ minWidth: 0 }}>
                <Typography variant="h6" sx={{ fontSize: "1rem", fontWeight: 600, mb: 1.5 }}>
                  Клиническое течение
                </Typography>
                {isLoading ? (
                  <Stack spacing={1}>
                    <Skeleton variant="rounded" height={20} />
                    <Skeleton variant="rounded" height={20} width="90%" />
                    <Skeleton variant="rounded" height={20} width="84%" />
                  </Stack>
                ) : (
                  <Typography variant="body1" sx={{ overflowWrap: "anywhere" }}>
                    {disease?.clinicalCourse}
                  </Typography>
                )}
              </Box>

              <SectionList title="Симптомы" items={disease?.symptoms} isLoading={isLoading} />
              <SectionList title="Осложнения" items={disease?.complications} isLoading={isLoading} />
              <SectionList title="Рекомендуемые обследования" items={disease?.recommendedExams} isLoading={isLoading} />
            </Stack>
          </Grid>

          <Grid item xs={12} md={4} sx={{ minWidth: 0, display: "flex" }}>
            <Box
              sx={{
                border: "1px solid #E5E5E7",
                borderRadius: "12px",
                p: { xs: 2, md: 2.5 },
                display: "flex",
                flexDirection: "column",
                gap: 2,
                minWidth: 0,
                width: "100%",
                maxWidth: { md: 380 },
              }}
            >
              <Typography variant="h6" sx={{ fontSize: "1rem", fontWeight: 600 }}>
                Статистика
              </Typography>

              <Box sx={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 1.5, minWidth: 0 }}>
                {[
                  { label: "Всего пациентов", value: stats?.totalPatients },
                  { label: "Активные случаи", value: stats?.activeCases },
                  { label: "Новые за 30 дней", value: stats?.newCasesLast30Days },
                  {
                    label: "Ср. длительность лечения",
                    value: stats ? `${stats.averageTreatmentDurationDays} дн.` : undefined,
                  },
                ].map((metric) => (
                  <Box
                    key={metric.label}
                    sx={{ border: "1px solid #E5E5E7", borderRadius: "12px", p: 1.5, minWidth: 0 }}
                  >
                    <Typography variant="body2" sx={{ color: "text.secondary", mb: 0.75, overflowWrap: "anywhere" }}>
                      {metric.label}
                    </Typography>
                    {isLoading ? (
                      <Skeleton variant="rounded" width={90} height={28} />
                    ) : (
                      <Typography variant="h6" sx={{ fontWeight: 600, overflowWrap: "anywhere" }}>
                        {metric.value ?? "—"}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>

              {isLoading ? (
                <Skeleton variant="rounded" width={170} height={18} />
              ) : (
                <Typography variant="caption" sx={{ color: "text.secondary", overflowWrap: "anywhere" }}>
                  Последнее обновление: {updatedAt ? new Date(updatedAt).toLocaleDateString("ru-RU") : "—"}
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </SoftCard>
    </PageContainer>
  );
}
