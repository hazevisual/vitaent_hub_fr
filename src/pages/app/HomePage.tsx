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

const calendarDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

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
  recommendation: "Следуйте рекомендации врача",
  appointment: "Ваш следующий прием назначен на 31 октября, в 10:30",
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
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr", lg: "2.2fr 1fr" },
          gap: { xs: 1.5, sm: 2, md: 2.25, lg: 2.5 },
        }}
      >
        <Box
          sx={{
            display: "grid",
            gap: { xs: 1.5, sm: 2, md: 2.25, lg: 2.5 },
            gridTemplateColumns: { xs: "1fr", sm: "1fr", md: "1fr", xl: "1fr 1.1fr" },
          }}
        >
          <SoftCard title="Daily completion" sx={{ minHeight: { xs: 250, sm: 265, md: 280 } }}>
            {renderStateBody({
              state: completionState,
              emptyText: "No data for selected day",
              errorText: "Unable to load daily completion.",
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
                    Great work! You completed all planned activities for today.
                  </Typography>
                  <Button variant="contained" size="medium">
                    View details
                  </Button>
                </>
              ),
            })}
          </SoftCard>

          <SoftCard
            title="September 2026"
            sx={{ minHeight: { xs: 290, sm: 305, md: 320 } }}
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
              emptyText: "No calendar data available",
              errorText: "Unable to load calendar.",
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

        <SoftCard title="Summary" sx={{ minHeight: { xs: 255, sm: 270, md: 280 } }}>
          {renderStateBody({
            state: summaryState,
            emptyText: "No symptoms recorded",
            errorText: "Unable to load summary indicators.",
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
          mt: { xs: 1.5, sm: 2, md: 2.25, lg: 2.5 },
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr", lg: "1.8fr 1.2fr" },
          gap: { xs: 1.5, sm: 2, md: 2.25, lg: 2.5 },
        }}
      >
        <SoftCard
          sx={{
            minHeight: { xs: 235, sm: 250, md: 255 },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {renderStateBody({
            state: recommendationState,
            emptyText: "No recommendations yet",
            errorText: "Unable to load recommendations.",
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

        <SoftCard sx={{ minHeight: { xs: 235, sm: 250, md: 255 }, display: "grid", placeItems: "center" }}>
          {renderStateBody({
            state: appointmentState,
            emptyText: "No upcoming appointments",
            errorText: "Unable to load appointment information.",
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
