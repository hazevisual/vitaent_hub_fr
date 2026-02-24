import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Box, Button, Chip, Divider, Grid, Skeleton, Stack, Typography } from "@mui/material";
import PageContainer from "@/components/ui/PageContainer";
import SoftCard from "@/components/ui/SoftCard";
import { getDiseaseById, getDiseaseStatsById } from "@/api/diseases";

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

type SectionListProps = {
  title: string;
  items?: string[];
  isLoading: boolean;
};

function SectionList({ title, items, isLoading }: SectionListProps) {
  return (
    <Stack spacing={1.5} sx={{ minWidth: 0 }}>
      <Typography variant="h6" sx={{ fontSize: "1.05rem", fontWeight: 600 }}>
        {title}
      </Typography>
      {isLoading ? (
        <Stack spacing={1}>
          <Skeleton variant="text" width="70%" />
          <Skeleton variant="text" width="90%" />
          <Skeleton variant="text" width="65%" />
        </Stack>
      ) : (
        <Stack component="ul" spacing={1} sx={{ my: 0, pl: 2.5, minWidth: 0 }}>
          {items?.map((item) => (
            <Typography
              key={`${title}-${item}`}
              component="li"
              variant="body2"
              sx={{
                color: "text.secondary",
                overflowWrap: "anywhere",
              }}
            >
              {item}
            </Typography>
          ))}
        </Stack>
      )}
    </Stack>
  );
}

export default function DiseasePage() {
  const { id = "1" } = useParams<{ id: string }>();

  const diseaseQuery = useQuery({
    queryKey: ["disease", id],
    queryFn: () => getDiseaseById(id),
  });

  const statsQuery = useQuery({
    queryKey: ["disease-stats", id],
    queryFn: () => getDiseaseStatsById(id),
  });

  const statItems = useMemo(
    () => [
      {
        label: "Новые за 30 дней",
        value: statsQuery.data?.newCasesLast30Days ?? "—",
      },
      {
        label: "Активные случаи",
        value: statsQuery.data?.activeCases ?? "—",
      },
      {
        label: "Всего пациентов",
        value: statsQuery.data?.totalPatients ?? "—",
      },
      {
        label: "Ср. длительность лечения",
        value: statsQuery.data?.averageTreatmentDurationDays
          ? `${statsQuery.data.averageTreatmentDurationDays} дней`
          : "—",
      },
      {
        label: "Последнее обновление",
        value: formatDate(statsQuery.data?.updatedAt),
      },
      {
        label: "Карточка создана",
        value: formatDate(diseaseQuery.data?.createdAt),
      },
    ],
    [diseaseQuery.data?.createdAt, statsQuery.data]
  );

  return (
    <PageContainer>
      <SoftCard
        sx={{ width: "100%", minWidth: 0, boxSizing: "border-box", overflow: "hidden" }}
        contentSx={{ p: { xs: 2, sm: 3, md: 4 }, "&:last-child": { pb: { xs: 2, sm: 3, md: 4 } } }}
      >
        <Grid container spacing={{ xs: 3, md: 4 }} sx={{ width: "100%", m: 0, minWidth: 0 }}>
          <Grid item xs={12} md={8} sx={{ minWidth: 0 }}>
            <Stack spacing={3.5} sx={{ minWidth: 0 }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                sx={{ minWidth: 0 }}
              >
                <Box sx={{ minWidth: 0 }}>
                  {diseaseQuery.isLoading ? (
                    <>
                      <Skeleton variant="text" width={320} height={42} />
                      <Skeleton variant="text" width={180} height={28} />
                    </>
                  ) : (
                    <>
                      <Typography variant="h5" sx={{ fontWeight: 700, overflowWrap: "anywhere" }}>
                        {diseaseQuery.data?.name ?? "Карточка заболевания"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, overflowWrap: "anywhere" }}>
                        {diseaseQuery.data?.code ?? "Код не указан"}
                      </Typography>
                    </>
                  )}
                </Box>
                <Button variant="contained" sx={{ borderRadius: "10px", boxShadow: "none", flexShrink: 0 }}>
                  Редактировать
                </Button>
              </Stack>

              <Divider />

              <Stack spacing={1.5} sx={{ minWidth: 0 }}>
                <Typography variant="h6" sx={{ fontSize: "1.05rem", fontWeight: 600 }}>
                  Описание
                </Typography>
                {diseaseQuery.isLoading ? (
                  <Stack spacing={1}>
                    <Skeleton variant="text" />
                    <Skeleton variant="text" />
                    <Skeleton variant="text" width="92%" />
                    <Skeleton variant="text" width="70%" />
                  </Stack>
                ) : (
                  <Typography variant="body1" color="text.secondary" sx={{ overflowWrap: "anywhere" }}>
                    {diseaseQuery.data?.description}
                  </Typography>
                )}
              </Stack>

              <Stack spacing={1.5} sx={{ minWidth: 0 }}>
                <Typography variant="h6" sx={{ fontSize: "1.05rem", fontWeight: 600 }}>
                  Клиническое течение
                </Typography>
                {diseaseQuery.isLoading ? (
                  <Stack spacing={1}>
                    <Skeleton variant="text" />
                    <Skeleton variant="text" width="85%" />
                    <Skeleton variant="text" width="65%" />
                  </Stack>
                ) : (
                  <Typography variant="body1" color="text.secondary" sx={{ overflowWrap: "anywhere" }}>
                    {diseaseQuery.data?.clinicalCourse}
                  </Typography>
                )}
              </Stack>

              <SectionList title="Основные симптомы" items={diseaseQuery.data?.symptoms} isLoading={diseaseQuery.isLoading} />
              <SectionList title="Возможные осложнения" items={diseaseQuery.data?.complications} isLoading={diseaseQuery.isLoading} />
              <SectionList
                title="Рекомендуемые обследования"
                items={diseaseQuery.data?.recommendedExams}
                isLoading={diseaseQuery.isLoading}
              />
            </Stack>
          </Grid>

          <Grid item xs={12} md={4} sx={{ minWidth: 0, maxWidth: "100%" }}>
            <Box
              sx={{
                minWidth: 0,
                width: "100%",
                maxWidth: { md: 380 },
                ml: { md: "auto" },
                alignSelf: "flex-start",
                border: "1px solid #E5E5E7",
                borderRadius: "14px",
                p: { xs: 2, md: 2.5 },
                backgroundColor: "#FAFAFB",
              }}
            >
              <Typography variant="h6" sx={{ fontSize: "1.05rem", fontWeight: 600, mb: 2 }}>
                Метаданные
              </Typography>
              <Stack spacing={1.5} sx={{ minWidth: 0 }}>
                {statItems.map((item) => (
                  <Box
                    key={item.label}
                    sx={{
                      px: 1.5,
                      py: 1.25,
                      borderRadius: "10px",
                      border: "1px solid #E5E5E7",
                      bgcolor: "#FFFFFF",
                      minWidth: 0,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary" sx={{ overflowWrap: "anywhere" }}>
                      {item.label}
                    </Typography>
                    {statsQuery.isLoading ? (
                      <Skeleton variant="text" width="45%" sx={{ mt: 0.5 }} />
                    ) : (
                      <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5, overflowWrap: "anywhere" }}>
                        {item.value}
                      </Typography>
                    )}
                  </Box>
                ))}

                {statsQuery.isError && (
                  <Chip
                    color="warning"
                    label="Не удалось загрузить статистику. Показаны базовые значения."
                    sx={{ width: "100%", justifyContent: "flex-start", height: "auto", "& .MuiChip-label": { py: 0.75 } }}
                  />
                )}
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </SoftCard>
    </PageContainer>
  );
}
