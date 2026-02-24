import * as React from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PageContainer from "@/components/ui/PageContainer";
import SoftCard from "@/components/ui/SoftCard";
import WeekDayViewContent from "@/pages/app/WeekDayViewContent";

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
      <Alert severity="error" variant="outlined" sx={{ borderRadius: "12px" }}>
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
  lineHeight: 1.2,
  fontWeight: 600,
  color: "text.secondary",
};

const HOME_CONTENT_MAX_WIDTH = 1560;
const HOME_CARD_2K_MEDIA_QUERY = "@media (min-width:2000px)";
const homeCardSx = {
  minWidth: 0,
  p: 3,
  [HOME_CARD_2K_MEDIA_QUERY]: {
    p: 3.75,
  },
};

export default function HomePage() {
  const [isWeekDayDialogOpen, setIsWeekDayDialogOpen] = React.useState(false);

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
          boxSizing: "border-box",
          width: "100%",
          maxWidth: HOME_CONTENT_MAX_WIDTH,
          mx: "auto",
          minWidth: 0,
          overflowX: "hidden",
        }}
      >
        <Box
            sx={{
              boxSizing: "border-box",
              width: "100%",
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              gap: { xs: 2, sm: 3, lg: 4 },
              [HOME_CARD_2K_MEDIA_QUERY]: {
                gap: 5,
              },
              pb: { xs: 1, md: 2 },
            }}
          >
          <Box
            sx={{
              boxSizing: "border-box",
              display: "grid",
              alignContent: "start",
              gridTemplateColumns: "minmax(0, 1fr)",
              "@media (min-width:900px)": {
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              },
              "@media (min-width:1200px)": {
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              },
              "@media (min-width:1600px)": {
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              },
              gap: { xs: 2, sm: 3, lg: 4 },
              [HOME_CARD_2K_MEDIA_QUERY]: {
                gap: 5,
              },
            }}
          >
        <SoftCard
          sx={{
            minHeight: { xs: 260, lg: 340 },
            [HOME_CARD_2K_MEDIA_QUERY]: {
              minHeight: 425,
            },
            ...homeCardSx,
          }}
        >
          {renderStateBody({
            state: completionState,
            emptyText: "Нет данных за выбранный день",
            errorText: "Не удалось загрузить данные. Попробуйте обновить страницу.",
            skeleton: (
              <Stack spacing={2} sx={{ minHeight: 200 }}>
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
                      px: 2,
                      py: 1,
                      borderRadius: 999,
                      bgcolor: "#F5F5F7",
                      border: "1px solid #C9C9CB",
                    }}
                  >
                    <Typography variant="caption" sx={{ lineHeight: 1.2, color: "text.primary", fontWeight: 500 }}>
                      16.02.2026
                    </Typography>
                  </Box>
                  <IconButton size="small" sx={{ color: "primary.main", justifySelf: "end" }}>
                    <ChevronRightRoundedIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Stack spacing={1} alignItems="center" sx={{ mt: 1 }}>
                  <Typography variant="h1" sx={{ lineHeight: 1, fontSize: { xs: "3rem", md: "3.75rem", lg: "4.2rem" }, fontWeight: 600 }}>
                    {dashboardData.completion}%
                  </Typography>
                  <Typography variant="body2" sx={{ textAlign: "center", color: "text.secondary" }}>
                    Данных заполнено за среду
                  </Typography>
                </Stack>

                <Button
                  variant="contained"
                  onClick={() => setIsWeekDayDialogOpen(true)}
                  sx={{
                    mt: "auto",
                    alignSelf: "center",
                    width: 160,
                    bgcolor: "#111111",
                    bgcolor: "primary.main",
                    color: "#FFFFFF",
                    borderRadius: "12px",
                    textTransform: "none",
                    boxShadow: "none",
                    "&:hover": { bgcolor: "primary.dark", boxShadow: "none" },
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
            minHeight: { xs: 260, lg: 340 },
            [HOME_CARD_2K_MEDIA_QUERY]: {
              minHeight: 425,
            },
            ...homeCardSx,
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
                <Typography variant="subtitle2" sx={{ ...sectionHeaderSx, textAlign: "center", mb: 3 }}>Ежедневное заполнение данных</Typography>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                  <IconButton size="small" sx={{ color: "primary.main" }}>
                    <ChevronLeftRoundedIcon fontSize="small" />
                  </IconButton>
                  <Typography variant="subtitle2" sx={{ ...sectionHeaderSx, textAlign: "center", textTransform: "capitalize" }}>{monthLabel}</Typography>
                  <IconButton size="small" sx={{ color: "primary.main" }}>
                    <ChevronRightRoundedIcon fontSize="small" />
                  </IconButton>
                </Stack>
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: 1 }}>
                  {calendarDays.map((day) => (
                    <Typography key={day} variant="caption" sx={{ textAlign: "center", pb: 1 }}>
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
                          borderRadius: "12px",
                          bgcolor: isSelected ? "#F5F5F7" : "transparent",
                          border: isSelected ? "1px solid #C9C9CB" : "1px solid transparent",
                          color: "text.primary",
                          display: "grid",
                          placeItems: "center",
                          typography: "body2",
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
            gridColumn: { xs: "auto", md: "1 / -1", lg: "auto" },
            minHeight: { xs: 240, lg: 340 },
            [HOME_CARD_2K_MEDIA_QUERY]: {
              minHeight: 425,
            },
            ...homeCardSx,
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
                    <Skeleton width="40%" height={22} sx={{ mb: 1 }} />
                    <Skeleton variant="rounded" width="100%" height={6} />
                  </Box>
                ))}
              </Stack>
            ),
            ready: (
              <Stack sx={{ height: "100%" }}>
                <Typography variant="subtitle2" sx={{ ...sectionHeaderSx, mb: 1 }}>Сводка по Болезни за выбранное число</Typography>
                <Typography variant="caption" sx={{ color: "text.secondary", mb: 3 }}>
                  16.02.2026
                </Typography>
                <Stack spacing={2}>
                  {symptomLabels.map((label, index) => {
                    const score = dashboardData.summaryRows[index % dashboardData.summaryRows.length]?.value ?? 0;
                    return (
                      <Box key={label}>
                        <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 500, mb: 1 }}>
                          {label}
                        </Typography>
                        <Box sx={{ height: 4, borderRadius: "8px", bgcolor: "rgba(240, 137, 152, 0.2)", overflow: "hidden" }}>
                          <Box
                            sx={{
                              width: `${score}%`,
                              height: "100%",
                              borderRadius: "8px",
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

          </Box>

          <Box
            sx={{
              boxSizing: "border-box",
              display: "grid",
              alignContent: "start",
              gridTemplateColumns: "minmax(0, 1fr)",
              "@media (min-width:1200px)": {
                gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)",
              },
              gap: { xs: 2, sm: 3, lg: 4 },
              [HOME_CARD_2K_MEDIA_QUERY]: {
                gap: 5,
              },
            }}
          >

        <SoftCard
          sx={{
            minHeight: { xs: 220, lg: 240 },
            [HOME_CARD_2K_MEDIA_QUERY]: {
              minHeight: 300,
            },
            ...homeCardSx,
          }}
        >
          {renderStateBody({
            state: recommendationState,
            emptyText: "Рекомендаций пока нет",
            errorText: "Не удалось загрузить данные. Попробуйте обновить страницу.",
            skeleton: (
              <Stack alignItems="center" spacing={3} width="100%" sx={{ minHeight: 152, justifyContent: "center" }}>
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

                  <Stack spacing={3} alignItems="center" justifyContent="center" sx={{ flex: 1 }}>
                    <Typography
                      variant="h2"
                      sx={{
                        textAlign: "center",
                        color: "text.primary",
                        lineHeight: 1.2,
                        fontWeight: 500,
                        maxWidth: 620,
                        fontSize: { xs: "1.5rem", md: "1.75rem", lg: "1.75rem" },
                      }}
                    >
                      {dashboardData.recommendation}
                    </Typography>
                    <Button variant="outlined" sx={{ borderRadius: "12px", minWidth: 132, boxShadow: "none" }}>
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
            minHeight: { xs: 220, lg: 240 },
            [HOME_CARD_2K_MEDIA_QUERY]: {
              minHeight: 300,
            },
            ...homeCardSx,
          }}
        >
          {renderStateBody({
            state: appointmentState,
            emptyText: "Нет предстоящих приёмов",
            errorText: "Не удалось загрузить данные. Попробуйте обновить страницу.",
            skeleton: (
              <Stack alignItems="center" spacing={2} width="100%" sx={{ minHeight: 152, justifyContent: "center" }}>
                <Skeleton width="80%" height={42} />
                <Skeleton width="62%" height={42} />
              </Stack>
            ),
            ready: (
              <Stack sx={{ height: "100%" }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", height: "100%" }}>
                  <Stack spacing={2}>
                    <Typography variant="h5" sx={{ color: "text.primary", maxWidth: 320, fontWeight: 500 }}>
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
      </Box>
      <Dialog
        open={isWeekDayDialogOpen}
        onClose={() => setIsWeekDayDialogOpen(false)}
        fullWidth
        maxWidth="lg"
        aria-labelledby="week-day-dialog-title"
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: { lg: "1560px" },
            borderRadius: "16px",
            border: "1px solid #E5E5E7",
            boxShadow: 3,
            maxHeight: "85vh",
            m: { xs: 2, md: 3 },
            bgcolor: "#FFFFFF",
          },
        }}
      >
        <DialogContent
          sx={{
            p: { xs: 3, xl: 4 },
            overflowY: "auto",
            bgcolor: "#FFFFFF",
          }}
        >
          <Stack spacing={3}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
              <Typography id="week-day-dialog-title" variant="subtitle2" sx={{ ...sectionHeaderSx, color: "text.primary" }}>
                Просмотр по неделе и дням
              </Typography>
              <IconButton
                aria-label="Закрыть окно просмотра по неделе и дням"
                size="small"
                onClick={() => setIsWeekDayDialogOpen(false)}
                sx={{ color: "text.secondary" }}
              >
                <CloseRoundedIcon fontSize="small" />
              </IconButton>
            </Box>

            <WeekDayViewContent />
          </Stack>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
