import * as React from "react";
import { Alert, Box, Button, IconButton, Skeleton, Stack, Typography } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import EditableField from "@/components/editable/EditableField";
import EditableNumberField from "@/components/editable/EditableNumberField";
import EditableSelect from "@/components/editable/EditableSelect";
import EditableSoftCard from "@/components/editable/EditableSoftCard";
import EditableTextArea from "@/components/editable/EditableTextArea";
import PageContainer from "@/components/ui/PageContainer";
import SoftCard from "@/components/ui/SoftCard";
import { getPatientDashboardBlocks, updatePatientDashboardBlocks } from "@/api/dashboardBlocks";
import { Paths } from "@/paths";
import type { DashboardBlockData } from "@/types/DashboardBlocks";
import arrowDefault from "@/assets/ArrowDefault.svg";
import arrowHover from "@/assets/ArrowHower.svg";

type CardState = "loading" | "error" | "empty" | "ready";
type EditableCardKey = "completion" | "summary" | "recommendation" | "appointment";

const symptomLabels = [
  "Ажитация",
  "Депрессия",
  "Тревога",
  "Раздражительность",
  "Усталость",
  "Импульсивные решения",
  "Короткий сон",
];

const calendarDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const weekdayOptions = [
  { value: "Понедельник", label: "Понедельник" },
  { value: "Вторник", label: "Вторник" },
  { value: "Среду", label: "Среда" },
  { value: "Четверг", label: "Четверг" },
  { value: "Пятницу", label: "Пятница" },
  { value: "Субботу", label: "Суббота" },
  { value: "Воскресенье", label: "Воскресенье" },
];

const monthFormatter = new Intl.DateTimeFormat("ru-RU", { month: "long", year: "numeric" });
const monthLabel = monthFormatter.format(new Date(2026, 1, 1)).replace(/^./, (letter) => letter.toUpperCase());

const fallbackDashboardData: DashboardBlockData = {
  completion: 100,
  completionDayLabel: "Среду",
  recommendation: "За последнюю неделю вы спите меньше, чем обычно. Обратите внимание на режим сна.",
  appointmentTime: "11:30",
  appointmentDate: "27.01.2026",
  summaryDate: "16.02.2026",
  summaryRows: [62, 44, 57, 39, 51, 36, 28],
};

function cloneDashboardData(source: DashboardBlockData): DashboardBlockData {
  return {
    completion: source.completion,
    completionDayLabel: source.completionDayLabel,
    recommendation: source.recommendation,
    appointmentTime: source.appointmentTime,
    appointmentDate: source.appointmentDate,
    summaryDate: source.summaryDate,
    summaryRows: [...source.summaryRows],
  };
}

function getSummaryRowsForLabels(source: number[]): number[] {
  const fallbackRowValue = source[0] ?? 0;
  return symptomLabels.map((_, index) => source[index] ?? fallbackRowValue);
}

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

function NavArrowIcon({ direction = "left" }: { direction?: "left" | "right" }) {
  return (
    <Box
      component="img"
      src={arrowDefault}
      alt=""
      aria-hidden="true"
      className="arrow-icon-default"
      sx={{
        width: 18,
        height: 18,
        display: "block",
        transform: direction === "right" ? "rotate(180deg)" : "none",
      }}
    />
  );
}

function getMutationErrorMessage(error: unknown, fallback: string) {
  if (error && typeof error === "object" && "response" in error) {
    const response = (error as { response?: { data?: { title?: string; message?: string } } }).response;
    return response?.data?.message ?? response?.data?.title ?? fallback;
  }

  return error instanceof Error ? error.message : fallback;
}

export default function HomePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editingCard, setEditingCard] = React.useState<EditableCardKey | null>(null);
  const [draftData, setDraftData] = React.useState<DashboardBlockData>(cloneDashboardData(fallbackDashboardData));

  const dashboardQuery = useQuery({
    queryKey: ["patient-dashboard-blocks"],
    queryFn: getPatientDashboardBlocks,
  });

  const updateMutation = useMutation({
    mutationFn: updatePatientDashboardBlocks,
    onSuccess: (response) => {
      queryClient.setQueryData(["patient-dashboard-blocks"], response);
      setEditingCard(null);
    },
  });

  const dashboardData = dashboardQuery.data?.data ?? fallbackDashboardData;
  const summaryRows = getSummaryRowsForLabels(dashboardData.summaryRows);
  const editingLocked = editingCard !== null;
  const mutationError = updateMutation.isError
    ? getMutationErrorMessage(updateMutation.error, "Не удалось сохранить изменения. Повторите попытку.")
    : "";

  React.useEffect(() => {
    if (editingCard === null) {
      setDraftData(cloneDashboardData(dashboardData));
    }
  }, [dashboardData, editingCard]);

  function startEditing(card: EditableCardKey) {
    if (editingCard && editingCard !== card) {
      return;
    }

    setDraftData(cloneDashboardData(dashboardData));
    setEditingCard(card);
  }

  function cancelEditing() {
    setEditingCard(null);
    setDraftData(cloneDashboardData(dashboardData));
  }

  function saveEditing() {
    if (!editingCard || updateMutation.isPending) {
      return;
    }

    updateMutation.mutate({ data: cloneDashboardData(draftData) });
  }

  function updateSummaryRow(index: number, value: number) {
    setDraftData((prev) => {
      const nextRows = getSummaryRowsForLabels(prev.summaryRows);
      nextRows[index] = Math.max(0, Math.min(100, value));
      return {
        ...prev,
        summaryRows: nextRows,
      };
    });
  }

  const completionState = resolveState({
    isBlockLoading: dashboardQuery.isLoading,
    hasError: dashboardQuery.isError,
    isEmpty: false,
  });

  const calendarState = resolveState({
    isBlockLoading: dashboardQuery.isLoading,
    hasError: dashboardQuery.isError,
    isEmpty: false,
  });

  const summaryState = resolveState({
    isBlockLoading: dashboardQuery.isLoading,
    hasError: dashboardQuery.isError,
    isEmpty: summaryRows.length === 0,
  });

  const recommendationState = resolveState({
    isBlockLoading: dashboardQuery.isLoading,
    hasError: dashboardQuery.isError,
    isEmpty: !dashboardData.recommendation.trim(),
  });

  const appointmentState = resolveState({
    isBlockLoading: dashboardQuery.isLoading,
    hasError: dashboardQuery.isError,
    isEmpty: !dashboardData.appointmentTime.trim() && !dashboardData.appointmentDate.trim(),
  });

  const completionEditing = editingCard === "completion";
  const summaryEditing = editingCard === "summary";
  const recommendationEditing = editingCard === "recommendation";
  const appointmentEditing = editingCard === "appointment";

  return (
    <PageContainer>
      <Stack spacing={{ xs: 2, md: 3, xl: 4 }} sx={{ minWidth: 0 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr)",
            gap: { xs: 2, md: 3, xl: 4 },
            minWidth: 0,
            "@media (min-width:900px)": { gridTemplateColumns: "repeat(2, minmax(0, 1fr))" },
            "@media (min-width:1200px)": { gridTemplateColumns: "repeat(3, minmax(0, 1fr))" },
          }}
        >
          <EditableSoftCard
            title="Заполнение дня"
            subtitle="Редактируемый блок пациента"
            mode={completionEditing ? "edit" : "view"}
            isSaving={completionEditing && updateMutation.isPending}
            editDisabled={editingLocked && !completionEditing}
            onEdit={() => startEditing("completion")}
            onCancel={cancelEditing}
            onSave={saveEditing}
            sx={{ height: { xs: 300, lg: 360, xl: 420 }, minWidth: 0 }}
          >
            {renderStateBody({
              state: completionState,
              emptyText: "Нет данных за выбранный день.",
              errorText: "Не удалось загрузить данные. Попробуйте обновить страницу.",
              skeleton: (
                <Stack spacing={2} sx={{ minHeight: 200 }}>
                  <Skeleton variant="rounded" width="100%" height={40} />
                  <Skeleton width="50%" height={96} sx={{ mx: "auto" }} />
                  <Skeleton width="80%" sx={{ mx: "auto" }} />
                  <Skeleton variant="rounded" width={160} height={40} sx={{ mt: "auto", mx: "auto" }} />
                </Stack>
              ),
              ready: completionEditing ? (
                <Stack spacing={2.5} sx={{ minWidth: 0 }}>
                  {mutationError ? <Alert severity="error">{mutationError}</Alert> : null}
                  <EditableNumberField
                    label="Процент заполнения"
                    value={draftData.completion}
                    min={0}
                    max={100}
                    isEditing
                    isSaving={updateMutation.isPending}
                    onChange={(next) =>
                      setDraftData((prev) => ({
                        ...prev,
                        completion: Math.max(0, Math.min(100, next)),
                      }))
                    }
                  />
                  <EditableSelect
                    label="Подпись дня"
                    value={draftData.completionDayLabel}
                    options={weekdayOptions}
                    isEditing
                    isSaving={updateMutation.isPending}
                    onChange={(next) => setDraftData((prev) => ({ ...prev, completionDayLabel: next }))}
                  />
                </Stack>
              ) : (
                <Stack sx={{ height: "100%", minWidth: 0 }}>
                  <Box sx={{ display: "grid", gridTemplateColumns: "40px 1fr 40px", alignItems: "center", mb: 3 }}>
                    <IconButton
                      size="small"
                      sx={{
                        justifySelf: "start",
                        "& .arrow-icon-hover": { display: "none" },
                        "&:hover .arrow-icon-default": { display: "none" },
                        "&:hover .arrow-icon-hover": { display: "block" },
                      }}
                    >
                      <NavArrowIcon direction="left" />
                      <Box
                        component="img"
                        src={arrowHover}
                        alt=""
                        aria-hidden="true"
                        className="arrow-icon-hover"
                        sx={{ width: 18, height: 18, display: "none" }}
                      />
                    </IconButton>
                    <Box sx={{ justifySelf: "center", px: 2, py: 1, borderRadius: 999, bgcolor: "#F5F5F7", border: "1px solid #C9C9CB" }}>
                      <Typography variant="caption" sx={{ lineHeight: 1.2, color: "text.primary", fontWeight: 500 }}>
                        {dashboardData.summaryDate}
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      sx={{
                        justifySelf: "end",
                        "& .arrow-icon-hover": { display: "none" },
                        "&:hover .arrow-icon-default": { display: "none" },
                        "&:hover .arrow-icon-hover": { display: "block" },
                      }}
                    >
                      <NavArrowIcon direction="right" />
                      <Box
                        component="img"
                        src={arrowHover}
                        alt=""
                        aria-hidden="true"
                        className="arrow-icon-hover"
                        sx={{ width: 18, height: 18, display: "none", transform: "rotate(180deg)" }}
                      />
                    </IconButton>
                  </Box>

                  <Stack spacing={2} alignItems="center" sx={{ mt: 1 }}>
                    <Typography variant="h1" sx={{ lineHeight: 1, fontSize: { xs: "3rem", md: "3.75rem", lg: "4.2rem" }, fontWeight: 600 }}>
                      {dashboardData.completion}%
                    </Typography>
                    <Typography variant="body2" sx={{ textAlign: "center", color: "text.secondary" }}>
                      Данных заполнено за {dashboardData.completionDayLabel}
                    </Typography>
                  </Stack>

                  <Button
                    variant="contained"
                    onClick={() => navigate(Paths.patientWeekDays)}
                    sx={{ mt: "auto", alignSelf: "center", width: 160, borderRadius: "12px", textTransform: "none", boxShadow: "none" }}
                  >
                    Открыть
                  </Button>
                </Stack>
              ),
            })}
          </EditableSoftCard>

          <SoftCard sx={{ height: { xs: 300, lg: 360, xl: 420 }, minWidth: 0 }} contentSx={{ minHeight: 0 }}>
            {renderStateBody({
              state: calendarState,
              emptyText: "Нет данных календаря.",
              errorText: "Не удалось загрузить данные. Попробуйте обновить страницу.",
              skeleton: (
                <Box sx={{ minHeight: 200, display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: 1 }}>
                  {Array.from({ length: 42 }).map((_, idx) => (
                    <Skeleton key={idx} variant="rounded" height={28} />
                  ))}
                </Box>
              ),
              ready: (
                <Stack sx={{ minWidth: 0 }}>
                  <Typography variant="subtitle2" sx={{ textAlign: "center", mb: 3, fontWeight: 600, color: "text.secondary" }}>
                    Ежедневное заполнение данных
                  </Typography>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                    <IconButton size="small">
                      <NavArrowIcon direction="left" />
                    </IconButton>
                    <Typography variant="subtitle2" sx={{ textAlign: "center", textTransform: "capitalize", fontWeight: 600, color: "text.secondary" }}>
                      {monthLabel}
                    </Typography>
                    <IconButton size="small">
                      <NavArrowIcon direction="right" />
                    </IconButton>
                  </Stack>
                  <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: 1, minWidth: 0 }}>
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
                </Stack>
              ),
            })}
          </SoftCard>

          <EditableSoftCard
            title="Сводка по болезни"
            subtitle="Интенсивность симптомов"
            mode={summaryEditing ? "edit" : "view"}
            isSaving={summaryEditing && updateMutation.isPending}
            editDisabled={editingLocked && !summaryEditing}
            onEdit={() => startEditing("summary")}
            onCancel={cancelEditing}
            onSave={saveEditing}
            sx={{ gridColumn: { xs: "auto", md: "1 / -1", lg: "auto" }, height: { xs: 300, lg: 360, xl: 420 }, minWidth: 0 }}
          >
            {renderStateBody({
              state: summaryState,
              emptyText: "Симптомы не отмечены.",
              errorText: "Не удалось загрузить данные. Попробуйте обновить страницу.",
              skeleton: (
                <Stack spacing={2} sx={{ minHeight: 194 }}>
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <Box key={idx}>
                      <Skeleton width="40%" height={22} sx={{ mb: 1 }} />
                      <Skeleton variant="rounded" width="100%" height={6} />
                    </Box>
                  ))}
                </Stack>
              ),
              ready: summaryEditing ? (
                <Stack spacing={2.5} sx={{ minWidth: 0 }}>
                  {mutationError ? <Alert severity="error">{mutationError}</Alert> : null}
                  <EditableField
                    label="Дата сводки"
                    value={draftData.summaryDate}
                    isEditing
                    isSaving={updateMutation.isPending}
                    maxLength={32}
                    onChange={(next) => setDraftData((prev) => ({ ...prev, summaryDate: next }))}
                  />
                  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" }, gap: 2, minWidth: 0 }}>
                    {symptomLabels.map((label, index) => (
                      <EditableNumberField
                        key={label}
                        label={label}
                        value={getSummaryRowsForLabels(draftData.summaryRows)[index] ?? 0}
                        min={0}
                        max={100}
                        isEditing
                        isSaving={updateMutation.isPending}
                        onChange={(next) => updateSummaryRow(index, next)}
                      />
                    ))}
                  </Box>
                </Stack>
              ) : (
                <Stack sx={{ height: "100%", minWidth: 0 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: "text.secondary" }}>
                    Сводка по болезни за выбранное число
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary", mb: 3 }}>
                    {dashboardData.summaryDate}
                  </Typography>
                  <Stack spacing={2}>
                    {symptomLabels.map((label, index) => {
                      const score = summaryRows[index] ?? 0;
                      return (
                        <Box key={label}>
                          <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 500, mb: 1 }}>
                            {label}
                          </Typography>
                          <Box sx={{ height: 4, borderRadius: "8px", bgcolor: "rgba(240, 137, 152, 0.2)", overflow: "hidden" }}>
                            <Box sx={{ width: `${score}%`, height: "100%", borderRadius: "8px", bgcolor: "#E78B9B" }} />
                          </Box>
                        </Box>
                      );
                    })}
                  </Stack>
                </Stack>
              ),
            })}
          </EditableSoftCard>
        </Box>

        <Box
          sx={{
            display: "grid",
            alignContent: "start",
            gridTemplateColumns: "minmax(0, 1fr)",
            gap: { xs: 2, md: 3, xl: 4 },
            minWidth: 0,
            "@media (min-width:1200px)": { gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)" },
          }}
        >
          <EditableSoftCard
            title="Системные рекомендации"
            mode={recommendationEditing ? "edit" : "view"}
            isSaving={recommendationEditing && updateMutation.isPending}
            editDisabled={editingLocked && !recommendationEditing}
            onEdit={() => startEditing("recommendation")}
            onCancel={cancelEditing}
            onSave={saveEditing}
            sx={{ height: { xs: 260, lg: 280, xl: 320 }, minWidth: 0 }}
          >
            {renderStateBody({
              state: recommendationState,
              emptyText: "Рекомендаций пока нет.",
              errorText: "Не удалось загрузить данные. Попробуйте обновить страницу.",
              skeleton: (
                <Stack alignItems="center" spacing={3} width="100%" sx={{ minHeight: 152, justifyContent: "center" }}>
                  <Skeleton width="76%" height={44} />
                  <Skeleton width="48%" height={44} />
                  <Skeleton variant="rounded" width={130} height={38} />
                </Stack>
              ),
              ready: recommendationEditing ? (
                <Stack spacing={2.5}>
                  {mutationError ? <Alert severity="error">{mutationError}</Alert> : null}
                  <EditableTextArea
                    label="Текст рекомендации"
                    value={draftData.recommendation}
                    isEditing
                    isSaving={updateMutation.isPending}
                    maxLength={1024}
                    minRows={5}
                    onChange={(next) => setDraftData((prev) => ({ ...prev, recommendation: next }))}
                  />
                </Stack>
              ) : (
                <Stack sx={{ height: "100%", minWidth: 0 }}>
                  <Typography variant="subtitle2" sx={{ textAlign: "center", fontWeight: 500, color: "text.secondary", mb: 3 }}>
                    Рекомендация от системы
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flex: 1, gap: 2, minWidth: 0 }}>
                    <IconButton sx={{ width: 40, height: 40, flexShrink: 0 }}>
                      <NavArrowIcon direction="left" />
                    </IconButton>
                    <Stack spacing={3} alignItems="center" justifyContent="center" sx={{ flex: 1, minWidth: 0 }}>
                      <Box
                        sx={{
                          maxHeight: 108,
                          overflowY: "auto",
                          px: 0.5,
                          minWidth: 0,
                        }}
                      >
                        <Typography
                          variant="h2"
                          sx={{
                            textAlign: "center",
                            color: "text.primary",
                            lineHeight: 1.2,
                            fontWeight: 500,
                            maxWidth: 620,
                            fontSize: { xs: "1.5rem", md: "1.75rem" },
                            overflowWrap: "anywhere",
                          }}
                        >
                          {dashboardData.recommendation}
                        </Typography>
                      </Box>
                    </Stack>
                    <IconButton sx={{ width: 40, height: 40, flexShrink: 0 }}>
                      <NavArrowIcon direction="right" />
                    </IconButton>
                  </Box>
                </Stack>
              ),
            })}
          </EditableSoftCard>

          <EditableSoftCard
            title="Ближайший прием"
            mode={appointmentEditing ? "edit" : "view"}
            isSaving={appointmentEditing && updateMutation.isPending}
            editDisabled={editingLocked && !appointmentEditing}
            onEdit={() => startEditing("appointment")}
            onCancel={cancelEditing}
            onSave={saveEditing}
            sx={{ height: { xs: 260, lg: 280, xl: 320 }, minWidth: 0 }}
          >
            {renderStateBody({
              state: appointmentState,
              emptyText: "Нет предстоящих приемов.",
              errorText: "Не удалось загрузить данные. Попробуйте обновить страницу.",
              skeleton: (
                <Stack alignItems="center" spacing={2} width="100%" sx={{ minHeight: 152, justifyContent: "center" }}>
                  <Skeleton width="80%" height={42} />
                  <Skeleton width="62%" height={42} />
                </Stack>
              ),
              ready: appointmentEditing ? (
                <Stack spacing={2.5}>
                  {mutationError ? <Alert severity="error">{mutationError}</Alert> : null}
                  <EditableField
                    label="Время приема"
                    value={draftData.appointmentTime}
                    isEditing
                    isSaving={updateMutation.isPending}
                    maxLength={16}
                    onChange={(next) => setDraftData((prev) => ({ ...prev, appointmentTime: next }))}
                  />
                  <EditableField
                    label="Дата приема"
                    value={draftData.appointmentDate}
                    isEditing
                    isSaving={updateMutation.isPending}
                    maxLength={32}
                    onChange={(next) => setDraftData((prev) => ({ ...prev, appointmentDate: next }))}
                  />
                </Stack>
              ) : (
                <Stack sx={{ height: "100%", minWidth: 0, justifyContent: "center" }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", height: "100%", minWidth: 0 }}>
                    <Stack spacing={2} sx={{ minWidth: 0 }}>
                      <Typography variant="h5" sx={{ color: "text.primary", maxWidth: 320, fontWeight: 500 }}>
                        Ваш следующий прием назначен
                      </Typography>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="h5" sx={{ fontWeight: 600, color: "primary.main" }}>
                          {dashboardData.appointmentTime}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          {dashboardData.appointmentDate}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Stack>
              ),
            })}
          </EditableSoftCard>
        </Box>
      </Stack>
    </PageContainer>
  );
}
