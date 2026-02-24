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
import { alpha } from "@mui/material/styles";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import PageContainer from "@/components/ui/PageContainer";
import SoftCard from "@/components/ui/SoftCard";

type CardState = "loading" | "error" | "empty" | "ready";

type SummaryRow = {
  label: string;
  value: number;
};

const symptomLabels = [
  "Ажитация",
  "Депрессия",
  "Тревога",
  "Раздражительность",
  "Усталость",
  "Импульсивные решения, поступки",
  "Короткий сон",
];

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
  recommendation: "В последнюю неделю вы спите меньше, чем за последние 3 месяца. Обратите внимание!",
  appointment: "На 11:30 27.01.2023",
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

const sectionHeaderSx = {
  textAlign: "left",
  fontSize: "0.95rem",
  lineHeight: 1.2,
  fontWeight: 600,
  color: "rgba(74, 88, 118, 0.95)",
};

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
          maxWidth: 1360,
          mx: "auto",
          minWidth: 0,
          overflowX: "hidden",
        }}
      >
        <Box
          sx={{
            width: "100%",
            minWidth: 0,
            display: "grid",
            alignContent: "start",
            gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "repeat(12, minmax(0, 1fr))" },
            rowGap: { xs: 2, sm: 3, lg: 4 },
            columnGap: { xs: 2, sm: 3, lg: 4 },
            pb: { xs: 1, md: 2 },
          }}
        >
        <SoftCard
          sx={{
            gridColumn: { xs: "1 / -1", md: "1 / span 6", lg: "1 / span 4" },
            minHeight: { xs: 260, lg: 340 },
            minWidth: 0,
            p: 3,
          }}
        >
          {renderStateBody({
            state: completionState,
            emptyText: "Нет данных за выбранный день",
            errorText: "Не удалось загрузить данные. Попробуйте обновить страницу.",
            skeleton: (
              <Stack spacing={1.8} sx={{ minHeight: 200 }}>
                <Skeleton variant="rounded" width="100%" height={40} />
                <Skeleton width="50%" height={96} sx={{ mx: "auto" }} />
                <Skeleton width="80%" sx={{ mx: "auto" }} />
                <Skeleton variant="rounded" width={160} height={40} sx={{ mt: "auto", mx: "auto" }} />
              </Stack>
            ),
            ready: (
                <Stack sx={{ height: "100%" }}>
                  <Box sx={{ display: "grid", gridTemplateColumns: "40px 1fr 40px", alignItems: "center", mb: 2 }}>
                  <IconButton size="small" sx={{ color: "primary.main", justifySelf: "start" }}>
                    <ChevronLeftRoundedIcon fontSize="small" />
                  </IconButton>
                  <Box
                    sx={{
                      justifySelf: "center",
                      px: 2.25,
                      py: 0.8,
                      borderRadius: 999,
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                    }}
                  >
                    <Typography sx={{ fontSize: "0.8125rem", lineHeight: 1.2, color: "text.primary", fontWeight: 500 }}>
                      16.02.2026
                    </Typography>
                  </Box>
                  <IconButton size="small" sx={{ color: "primary.main", justifySelf: "end" }}>
                    <ChevronRightRoundedIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Stack spacing={1} alignItems="center" sx={{ mt: 1 }}>
                  <Typography variant="h1" sx={{ fontSize: { xs: "3.3rem", md: "3.8rem" }, lineHeight: 1 }}>
                    {dashboardData.completion}%
                  </Typography>
                  <Typography variant="body2" sx={{ textAlign: "center", color: "primary.main" }}>
                    Данных заполнено за среду
                  </Typography>
                </Stack>

                <Button
                  variant="contained"
                  sx={{
                    mt: "auto",
                    alignSelf: "center",
                    width: 160,
                    bgcolor: "#111111",
                    color: "#FFFFFF",
                    borderRadius: 999,
                    textTransform: "none",
                    "&:hover": { bgcolor: "#1f1f1f" },
                  }}
                >
                  Открыть
                </Button>
              </Stack>
            ),
          })}
        </SoftCard>

        <SoftCard
          sx={{
            gridColumn: { xs: "1 / -1", md: "7 / span 6", lg: "5 / span 4" },
            minHeight: { xs: 260, lg: 340 },
            minWidth: 0,
            p: 3,
          }}
        >
          {renderStateBody({
            state: calendarState,
            emptyText: "Нет данных календаря",
            errorText: "Не удалось загрузить данные. Попробуйте обновить страницу.",
            skeleton: (
              <Box sx={{ minHeight: 200, display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: 1 }}>
                {Array.from({ length: 42 }).map((_, idx) => (
                  <Skeleton key={idx} variant="rounded" height={28} />
                ))}
              </Box>
            ),
            ready: (
              <>
                <Typography sx={{ ...sectionHeaderSx, textAlign: "center", mb: 2.5 }}>Ежедневное заполнение данных</Typography>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2.2 }}>
                  <IconButton size="small" sx={{ color: "primary.main" }}>
                    <ChevronLeftRoundedIcon fontSize="small" />
                  </IconButton>
                  <Typography sx={{ ...sectionHeaderSx, textAlign: "center", textTransform: "capitalize" }}>{monthLabel}</Typography>
                  <IconButton size="small" sx={{ color: "primary.main" }}>
                    <ChevronRightRoundedIcon fontSize="small" />
                  </IconButton>
                </Stack>
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
                          bgcolor: (theme) =>
                            isSelected ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.1),
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
              </>
            ),
          })}
        </SoftCard>

        <SoftCard
          sx={{
            gridColumn: { xs: "1 / -1", md: "1 / -1", lg: "9 / span 4" },
            minWidth: 0,
            minHeight: { xs: 240, lg: 340 },
            p: 3,
          }}
        >
          {renderStateBody({
            state: summaryState,
            emptyText: "Симптомы не отмечены",
            errorText: "Не удалось загрузить данные. Попробуйте обновить страницу.",
            skeleton: (
              <Stack spacing={2.1} sx={{ minHeight: 194 }}>
                {Array.from({ length: 4 }).map((_, idx) => (
                  <Box key={idx}>
                    <Skeleton width="40%" height={22} sx={{ mb: 0.8 }} />
                    <Skeleton variant="rounded" width="100%" height={6} />
                  </Box>
                ))}
              </Stack>
            ),
            ready: (
              <Stack sx={{ height: "100%" }}>
                <Typography sx={{ ...sectionHeaderSx, mb: 0.75 }}>Сводка по Болезни за выбранное число</Typography>
                <Typography variant="caption" sx={{ color: "text.secondary", mb: 2.5 }}>
                  16.02.2026
                </Typography>
                <Stack spacing={1.8}>
                  {symptomLabels.map((label, index) => {
                    const score = dashboardData.summaryRows[index % dashboardData.summaryRows.length]?.value ?? 0;
                    return (
                      <Box key={label}>
                        <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 500, mb: 0.6 }}>
                          {label}
                        </Typography>
                        <Box sx={{ height: 4, borderRadius: 999, bgcolor: "rgba(240, 137, 152, 0.2)", overflow: "hidden" }}>
                          <Box
                            sx={{
                              width: `${score}%`,
                              height: "100%",
                              borderRadius: 999,
                              bgcolor: "#E78B9B",
                            }}
                          />
                        </Box>
                      </Box>
                    );
                  })}
                </Stack>
              </Stack>
            ),
          })}
        </SoftCard>

        <SoftCard
          sx={{
            gridColumn: { xs: "1 / -1", md: "1 / span 8", lg: "1 / span 8" },
            minHeight: { xs: 220, lg: 240 },
            minWidth: 0,
            p: 3,
          }}
        >
          {renderStateBody({
            state: recommendationState,
            emptyText: "Рекомендаций пока нет",
            errorText: "Не удалось загрузить данные. Попробуйте обновить страницу.",
            skeleton: (
              <Stack alignItems="center" spacing={2.4} width="100%" sx={{ minHeight: 152, justifyContent: "center" }}>
                <Skeleton width="76%" height={44} />
                <Skeleton width="48%" height={44} />
                <Skeleton variant="rounded" width={130} height={38} />
              </Stack>
            ),
            ready: (
              <Stack sx={{ height: "100%" }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    textAlign: "center",
                    fontWeight: 500,
                    color: "text.secondary",
                    mb: 2,
                  }}
                >
                  Системные рекомендации
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flex: 1, gap: 2 }}>
                  <IconButton sx={{ color: "primary.main", width: 40, height: 40 }}>
                    <ChevronLeftRoundedIcon />
                  </IconButton>

                  <Stack spacing={2.5} alignItems="center" justifyContent="center" sx={{ flex: 1 }}>
                    <Typography sx={{ textAlign: "center", color: "primary.main", fontSize: { xs: "1.2rem", md: "1.55rem" }, lineHeight: 1.4, fontWeight: 500, maxWidth: 620 }}>
                      {dashboardData.recommendation}
                    </Typography>
                    <Button variant="outlined" sx={{ borderRadius: 999, minWidth: 132 }}>
                      Подробнее
                    </Button>
                  </Stack>

                  <IconButton sx={{ color: "primary.main", width: 40, height: 40 }}>
                    <ChevronRightRoundedIcon />
                  </IconButton>
                </Box>
              </Stack>
            ),
          })}
        </SoftCard>

        <SoftCard
          sx={{
            gridColumn: { xs: "1 / -1", md: "9 / span 4", lg: "9 / span 4" },
            minHeight: { xs: 220, lg: 240 },
            minWidth: 0,
            p: 3,
          }}
        >
          {renderStateBody({
            state: appointmentState,
            emptyText: "Нет предстоящих приёмов",
            errorText: "Не удалось загрузить данные. Попробуйте обновить страницу.",
            skeleton: (
              <Stack alignItems="center" spacing={1.3} width="100%" sx={{ minHeight: 152, justifyContent: "center" }}>
                <Skeleton width="80%" height={42} />
                <Skeleton width="62%" height={42} />
              </Stack>
            ),
            ready: (
              <Stack sx={{ height: "100%" }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", height: "100%" }}>
                  <Stack spacing={1.4}>
                    <Typography sx={{ fontSize: { xs: "1.35rem", md: "1.6rem" }, color: "primary.main", maxWidth: 320, fontWeight: 500 }}>
                      Ваш следующий прием назначен
                    </Typography>
                    <Box sx={{ textAlign: "center" }}>
                      <Typography variant="h5" sx={{ fontWeight: 600, color: "primary.main" }}>
                        {dashboardData.appointment?.replace(/^На\s+/, "").split(" ")[0]}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        {dashboardData.appointment?.replace(/^На\s+/, "").split(" ")[1]}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Stack>
            ),
          })}
        </SoftCard>
        </Box>
      </Box>
    </PageContainer>
  );
}
