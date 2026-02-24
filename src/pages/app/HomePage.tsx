import * as React from "react";
import {
  Alert,
  Box,
  Button,
  IconButton,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import PageContainer from "@/components/ui/PageContainer";
import SoftCard from "@/components/ui/SoftCard";

type CardState = "loading" | "error" | "empty" | "ready";

type SummaryRow = {
  label: string;
  value: number;
};

const calendarDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

const monthFormatter = new Intl.DateTimeFormat("ru-RU", { month: "long", year: "numeric" });
const monthLabel = monthFormatter.format(new Date(2026, 1, 1)).replace(/^./, (letter) => letter.toUpperCase());

const dashboardData: {
  completion: number | null;
  summaryRows: SummaryRow[];
  recommendation: string | null;
  appointment: string | null;
} = {
  completion: 100,
  summaryRows: [
    { label: "Симптомы", value: 62 },
    { label: "Пульс", value: 44 },
    { label: "Давление", value: 57 },
    { label: "Сон", value: 39 },
  ],
  recommendation: "Следуйте рекомендациям врача",
  appointment: "Ваш следующий приём назначен на 31 октября в 10:30",
};

const mockErrors = {
  completion: false,
  calendar: false,
  summary: false,
  recommendation: false,
  appointment: false,
};

const isLoading = false; // TODO: replace with actual dashboard loading state when API data is connected.

function resolveState({
  isBlockLoading,
  hasError,
  isEmpty,
}: {
  isBlockLoading: boolean;
  hasError: boolean;
  isEmpty: boolean;
}): CardState {
  if (isBlockLoading) return "loading";
  if (hasError) return "error";
  if (isEmpty) return "empty";
  return "ready";
}

function renderStateBody({
  state,
  emptyText,
  errorText,
  skeleton,
  ready,
}: {
  state: CardState;
  emptyText: string;
  errorText: string;
  skeleton: React.ReactNode;
  ready: React.ReactNode;
}) {
  if (state === "loading") return skeleton;
  if (state === "error") {
    return (
      <Alert severity="error" variant="outlined" sx={{ borderRadius: 3 }}>
        {errorText}
      </Alert>
    );
  }
  if (state === "empty") {
    return (
      <Box sx={{ minHeight: 160, display: "grid", placeItems: "center" }}>
        <Typography variant="body2" sx={{ color: "text.secondary", textAlign: "center" }}>
          {emptyText}
        </Typography>
      </Box>
    );
  }

  return ready;
}

export default function HomePage() {
  const completionState = resolveState({
    isBlockLoading: isLoading,
    hasError: mockErrors.completion,
    isEmpty: dashboardData.completion === null,
  });

  const calendarState = resolveState({
    isBlockLoading: isLoading,
    hasError: mockErrors.calendar,
    isEmpty: false,
  });

  const summaryState = resolveState({
    isBlockLoading: isLoading,
    hasError: mockErrors.summary,
    isEmpty: dashboardData.summaryRows.length === 0,
  });

  const recommendationState = resolveState({
    isBlockLoading: isLoading,
    hasError: mockErrors.recommendation,
    isEmpty: !dashboardData.recommendation,
  });

  const appointmentState = resolveState({
    isBlockLoading: isLoading,
    hasError: mockErrors.appointment,
    isEmpty: !dashboardData.appointment,
  });

  return (
    <PageContainer>
      <Box
        sx={{
          width: "100%",
          minWidth: 0,
          display: "grid",
          gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
          gap: { xs: "16px", sm: "24px", lg: "32px" },
        }}
      >
        <Box
          sx={{
            gridColumn: { xs: "1 / -1", lg: "1 / span 8" },
            minWidth: 0,
            display: "grid",
            gap: { xs: "16px", sm: "24px", lg: "32px" },
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
          }}
        >
          <SoftCard
            title="Выполнение за день"
            subtitle="Сегодня выполнено"
            sx={{ minHeight: { xs: 250, sm: 265, md: 280 }, minWidth: 0 }}
          >
            {renderStateBody({
              state: completionState,
              emptyText: "Нет данных за выбранный день",
              errorText: "Не удалось загрузить данные. Попробуйте обновить страницу.",
              skeleton: (
                <Stack spacing={1.8}>
                  <Skeleton width="38%" height={24} />
                  <Skeleton variant="rounded" width="65%" height={78} />
                  <Skeleton width="90%" />
                  <Skeleton width="70%" />
                  <Skeleton variant="rounded" width={140} height={38} />
                </Stack>
              ),
              ready: (
                <>
                  <Typography variant="h1" sx={{ mt: 0.5, mb: 1.5, fontSize: { xs: "3.2rem", sm: "4rem", md: "5rem" } }}>
                    {dashboardData.completion}%
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 3, maxWidth: 420 }}>
                    Отличный результат! Вы выполнили все запланированные активности за сегодня.
                  </Typography>
                  <Button variant="contained" size="medium">
                    Открыть
                  </Button>
                </>
              ),
            })}
          </SoftCard>

          <SoftCard
            title="Календарь"
            subtitle={monthLabel}
            sx={{ minHeight: { xs: 290, sm: 305, md: 320 }, minWidth: 0 }}
            headerAction={
              <Stack direction="row" spacing={0.5}>
                <IconButton size="small" sx={{ bgcolor: "rgba(140, 167, 220, 0.14)" }}>
                  <ChevronLeftRoundedIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" sx={{ bgcolor: "rgba(140, 167, 220, 0.14)" }}>
                  <ChevronRightRoundedIcon fontSize="small" />
                </IconButton>
              </Stack>
            }
          >
            {renderStateBody({
              state: calendarState,
              emptyText: "Нет данных календаря",
              errorText: "Не удалось загрузить данные. Попробуйте обновить страницу.",
              skeleton: (
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: 1 }}>
                  {Array.from({ length: 42 }).map((_, idx) => (
                    <Skeleton key={idx} variant="rounded" height={28} />
                  ))}
                </Box>
              ),
              ready: (
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: 1 }}>
                  {calendarDays.map((day) => (
                    <Typography key={day} variant="caption" sx={{ textAlign: "center", pb: 0.5 }}>
                      {day}
                    </Typography>
                  ))}
                  {Array.from({ length: 35 }).map((_, idx) => {
                    const day = idx + 1;
                    const isShown = day <= 30;
                    const isSelected = day === 18;

                    return (
                      <Box
                        key={idx}
                        sx={{
                          height: 34,
                          borderRadius: 2,
                          bgcolor: isSelected ? "rgba(140, 167, 220, 0.8)" : "rgba(140, 167, 220, 0.1)",
                          color: isSelected ? "#fff" : "text.primary",
                          display: "grid",
                          placeItems: "center",
                          fontSize: 13,
                          fontWeight: 600,
                        }}
                      >
                        {isShown ? day : ""}
                      </Box>
                    );
                  })}
                </Box>
              ),
            })}
          </SoftCard>
        </Box>

        <SoftCard
          title="Сводка по состоянию"
          subtitle="Показатели и симптомы"
          sx={{
            gridColumn: { xs: "1 / -1", md: "1 / -1", lg: "9 / span 4" },
            minWidth: 0,
            minHeight: { xs: 255, sm: 270, md: 280 },
          }}
        >
          {renderStateBody({
            state: summaryState,
            emptyText: "Симптомы не отмечены",
            errorText: "Не удалось загрузить данные. Попробуйте обновить страницу.",
            skeleton: (
              <Stack spacing={2.1}>
                {Array.from({ length: 4 }).map((_, idx) => (
                  <Box key={idx}>
                    <Skeleton width="40%" height={22} sx={{ mb: 0.8 }} />
                    <Skeleton variant="rounded" width="100%" height={6} />
                  </Box>
                ))}
              </Stack>
            ),
            ready: (
              <Stack spacing={2.2} sx={{ mt: 0.5 }}>
                {dashboardData.summaryRows.map((row) => (
                  <Box key={row.label}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.8 }}>
                      <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 600 }}>
                        {row.label}
                      </Typography>
                      <Typography variant="caption">{row.value}%</Typography>
                    </Stack>
                    <Box sx={{ height: 5, borderRadius: 999, bgcolor: "rgba(240, 137, 152, 0.2)", overflow: "hidden" }}>
                      <Box
                        sx={{
                          width: `${row.value}%`,
                          height: "100%",
                          borderRadius: 999,
                          bgcolor: "#E78B9B",
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Stack>
            ),
          })}
        </SoftCard>
      </Box>

      <Box
        sx={{
          width: "100%",
          minWidth: 0,
          mt: { xs: "16px", sm: "24px", lg: "32px" },
          display: "grid",
          gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
          gap: { xs: "16px", sm: "24px", lg: "32px" },
        }}
      >
        <SoftCard
          title="Рекомендации"
          subtitle="На основе вашей сводки"
          sx={{
            gridColumn: { xs: "1 / -1", md: "1 / span 8", lg: "1 / span 8" },
            minHeight: { xs: 235, sm: 250, md: 255 },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            minWidth: 0,
          }}
        >
          {renderStateBody({
            state: recommendationState,
            emptyText: "Рекомендаций пока нет",
            errorText: "Не удалось загрузить данные. Попробуйте обновить страницу.",
            skeleton: (
              <Stack alignItems="center" spacing={2.4} width="100%">
                <Skeleton width="76%" height={44} />
                <Skeleton width="48%" height={44} />
                <Skeleton variant="rounded" width={130} height={38} />
              </Stack>
            ),
            ready: (
              <>
                <IconButton sx={{ position: "absolute", left: { xs: 12, sm: 22 }, bgcolor: "rgba(140, 167, 220, 0.12)" }}>
                  <ChevronLeftRoundedIcon />
                </IconButton>
                <Stack spacing={2.2} alignItems="center" px={5}>
                  <Typography
                    sx={{
                      fontSize: { xs: "1.4rem", sm: "1.75rem", md: "2.2rem" },
                      textAlign: "center",
                      color: "rgba(109, 135, 181, 0.72)",
                      fontWeight: 500,
                    }}
                  >
                    {dashboardData.recommendation}
                  </Typography>
                  <Button variant="outlined">Подробнее</Button>
                </Stack>
                <IconButton sx={{ position: "absolute", right: { xs: 12, sm: 22 }, bgcolor: "rgba(140, 167, 220, 0.12)" }}>
                  <ChevronRightRoundedIcon />
                </IconButton>
              </>
            ),
          })}
        </SoftCard>

        <SoftCard
          title="Следующий приём"
          sx={{
            gridColumn: { xs: "1 / -1", md: "9 / span 4", lg: "9 / span 4" },
            minHeight: { xs: 235, sm: 250, md: 255 },
            display: "grid",
            placeItems: "center",
            minWidth: 0,
          }}
        >
          {renderStateBody({
            state: appointmentState,
            emptyText: "Нет предстоящих приёмов",
            errorText: "Не удалось загрузить данные. Попробуйте обновить страницу.",
            skeleton: (
              <Stack alignItems="center" spacing={1.3} width="100%">
                <Skeleton width="80%" height={42} />
                <Skeleton width="62%" height={42} />
              </Stack>
            ),
            ready: (
              <Typography
                sx={{
                  fontSize: { xs: "1.3rem", sm: "1.6rem", md: "2rem" },
                  textAlign: "center",
                  color: "rgba(95, 120, 164, 0.8)",
                  maxWidth: 420,
                }}
              >
                {dashboardData.appointment}
              </Typography>
            ),
          })}
        </SoftCard>
      </Box>
    </PageContainer>
  );
}
