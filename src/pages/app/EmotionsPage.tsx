import * as React from "react";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import {
  Alert,
  Box,
  Button,
  List,
  ListItemButton,
  Slider,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PageContainer from "@/components/ui/PageContainer";
import SoftCard from "@/components/ui/SoftCard";

type Emotion = {
  id: string;
  title: string;
  description: string;
  symptoms?: string[];
  value: number | null;
};

type EmotionGroup = {
  id: string;
  title: string;
  fillable: boolean;
  emotions: Emotion[];
};

const EMOTIONS_CONTENT_MAX_WIDTH = 1560;
const twoKMediaQuery = "@media (min-width:2000px)";

const initialGroups: EmotionGroup[] = [
  {
    id: "morning-negative",
    title: "Утреннее состояние",
    fillable: true,
    emotions: [
      {
        id: "depression",
        title: "Подавленность",
        description: "Подавленность отражает снижение тонуса, мотивации и эмоционального ресурса в начале дня.",
        symptoms: ["Сложно включиться в задачи", "Чувство усталости уже утром"],
        value: null,
      },
      {
        id: "anxiety",
        title: "Тревога",
        description: "Тревога показывает уровень внутреннего беспокойства и напряжения.",
        symptoms: ["Навязчивые мысли", "Ощущение неопределенности"],
        value: null,
      },
      {
        id: "stress",
        title: "Стресс",
        description: "Стресс помогает зафиксировать реакцию организма на нагрузку и внешнее давление.",
        symptoms: ["Мышечное напряжение", "Снижение концентрации"],
        value: null,
      },
      {
        id: "irritability",
        title: "Раздражительность",
        description: "Раздражительность показывает, насколько остро вы реагировали на обычные события.",
        value: null,
      },
      {
        id: "aggression",
        title: "Агрессия",
        description: "Агрессия отражает интенсивность импульсивных и конфликтных реакций.",
        value: null,
      },
    ],
  },
  {
    id: "morning-positive",
    title: "Утреннее состояние",
    fillable: true,
    emotions: [
      {
        id: "joy",
        title: "Радость",
        description: "Радость показывает степень позитивного эмоционального фона в течение утра.",
        value: null,
      },
      {
        id: "optimism",
        title: "Оптимизм",
        description: "Оптимизм отражает уверенность в благоприятном развитии дня.",
        value: null,
      },
      {
        id: "confidence",
        title: "Уверенность",
        description: "Уверенность помогает оценить ощущение контроля и готовности к действиям.",
        value: null,
      },
      {
        id: "satisfaction",
        title: "Удовлетворение",
        description: "Удовлетворение фиксирует внутреннее чувство согласия с собой и текущим состоянием.",
        value: null,
      },
    ],
  },
  {
    id: "evening",
    title: "Вечернее состояние",
    fillable: false,
    emotions: [
      {
        id: "evening-calm",
        title: "Спокойствие",
        description: "Вечерние эмоции будут доступны после заполнения утреннего расписания.",
        value: null,
      },
      {
        id: "evening-fatigue",
        title: "Усталость",
        description: "Вечерние эмоции будут доступны после заполнения утреннего расписания.",
        value: null,
      },
    ],
  },
];

const getFlatSequence = (groups: EmotionGroup[]) =>
  groups.flatMap((group) => group.emotions.map((emotion) => ({ ...emotion, groupId: group.id, fillable: group.fillable })));

export default function EmotionsPage() {
  const navigate = useNavigate();
  const [groups, setGroups] = React.useState<EmotionGroup[]>(initialGroups);
  const [selectedEmotionId, setSelectedEmotionId] = React.useState(initialGroups[0].emotions[0].id);
  const [sliderValue, setSliderValue] = React.useState(0);
  const [isFinishMessageOpen, setIsFinishMessageOpen] = React.useState(false);
  const [isAllFilledMessageOpen, setIsAllFilledMessageOpen] = React.useState(false);

  const sequence = React.useMemo(() => getFlatSequence(groups), [groups]);
  const fillableEmotionIds = React.useMemo(() => sequence.filter((emotion) => emotion.fillable).map((emotion) => emotion.id), [sequence]);

  const selectedEmotion = React.useMemo(
    () => sequence.find((emotion) => emotion.id === selectedEmotionId) ?? null,
    [sequence, selectedEmotionId]
  );

  const allRequiredFilled = React.useMemo(
    () => sequence.filter((emotion) => emotion.fillable).every((emotion) => emotion.value !== null),
    [sequence]
  );

  React.useEffect(() => {
    if (!selectedEmotion) {
      return;
    }

    setSliderValue(selectedEmotion.value ?? 0);
  }, [selectedEmotion]);

  const selectEmotion = (emotionId: string) => {
    const emotion = sequence.find((item) => item.id === emotionId);
    if (!emotion || !emotion.fillable) {
      return;
    }

    setSelectedEmotionId(emotionId);
    setSliderValue(emotion.value ?? 0);
  };

  const setEmotionValue = (emotionId: string, value: number) => {
    setGroups((previous) =>
      previous.map((group) => ({
        ...group,
        emotions: group.emotions.map((emotion) => (emotion.id === emotionId ? { ...emotion, value } : emotion)),
      }))
    );
  };

  const handleApplyValue = () => {
    if (!selectedEmotion || !selectedEmotion.fillable) {
      return;
    }

    setEmotionValue(selectedEmotion.id, sliderValue);

    const nextSequence = sequence.map((emotion) =>
      emotion.id === selectedEmotion.id ? { ...emotion, value: sliderValue } : emotion
    );

    const selectedIndex = fillableEmotionIds.findIndex((id) => id === selectedEmotion.id);
    const nextEmotionId = fillableEmotionIds.slice(selectedIndex + 1).find((id) => {
      const target = nextSequence.find((emotion) => emotion.id === id);
      if (!target) {
        return false;
      }

      if (target.id === selectedEmotion.id) {
        return false;
      }

      return target.value === null;
    });

    if (!nextEmotionId) {
      setIsAllFilledMessageOpen(true);
      return;
    }

    setSelectedEmotionId(nextEmotionId);
    const nextEmotion = nextSequence.find((emotion) => emotion.id === nextEmotionId);
    setSliderValue(nextEmotion?.value ?? 0);
  };

  return (
    <PageContainer
      sx={{
        pt: { xs: 3, sm: 3, lg: 4 },
        pb: { xs: 2, md: 2.5, lg: 3 },
        minHeight: { xs: "calc(100vh - 68px)", md: "calc(100vh - 74px)" },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: EMOTIONS_CONTENT_MAX_WIDTH,
          mx: "auto",
          minWidth: 0,
          flex: 1,
          minHeight: 0,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
          }}
        >
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr)",
              alignItems: "start",
              alignContent: "start",
              justifyContent: "flex-start",
              gap: { xs: 1.5, md: 1.75, lg: 2 },
              [twoKMediaQuery]: { gap: 2.5 },
              "@media (min-width:1200px)": {
                gridTemplateColumns: "minmax(260px, 1fr) minmax(340px, 1.15fr) minmax(300px, 1fr)",
              },
            }}
          >
          <SoftCard
            title="Расписание за день"
            sx={{ minHeight: 0 }}
            contentSx={{ minHeight: 0, p: { xs: 2, sm: 2, md: 2 }, "&:last-child": { pb: { xs: 2, sm: 2, md: 2 } } }}
          >
            <Box sx={{ flex: 1, minHeight: 0 }}>
              {groups.map((section) => (
                <Box key={section.id} sx={{ mb: 1.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.75 }}>
                    <AccessTimeRoundedIcon sx={{ fontSize: 18, color: section.fillable ? "primary.main" : "#C9C9CB" }} />
                    <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
                      {section.title}
                    </Typography>
                  </Box>

                  <List disablePadding sx={{ display: "grid", gap: 0.5 }}>
                    {section.emotions.map((emotion) => {
                      const isSelected = emotion.id === selectedEmotionId;
                      const isDisabled = !section.fillable;
                      return (
                        <ListItemButton
                          key={emotion.id}
                          selected={isSelected}
                          disabled={isDisabled}
                          onClick={() => selectEmotion(emotion.id)}
                          sx={{
                            borderRadius: "12px",
                            border: isSelected ? "1px solid #C9C9CB" : "1px solid transparent",
                            bgcolor: isSelected ? "#F5F5F7" : "transparent",
                            px: 1.25,
                            py: 0.75,
                            opacity: isDisabled ? 0.56 : 1,
                            "&:hover": { bgcolor: "#F0F0F2" },
                            "&.Mui-selected": { bgcolor: "#F5F5F7" },
                            "&.Mui-selected:hover": { bgcolor: "#F0F0F2" },
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between", gap: 1.5 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Box
                                sx={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: "50%",
                                  bgcolor: isSelected ? "primary.main" : "#C9C9CB",
                                  flexShrink: 0,
                                }}
                              />
                              <Typography variant="body2" sx={{ color: isSelected ? "primary.main" : "text.primary" }}>
                                {emotion.title}
                              </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {emotion.value ?? "—"}
                            </Typography>
                          </Box>
                        </ListItemButton>
                      );
                    })}
                  </List>
                </Box>
              ))}
            </Box>
          </SoftCard>

          <SoftCard
            title={selectedEmotion?.title ?? "Эмоция"}
            sx={{ minHeight: 0 }}
            contentSx={{ minHeight: 0, p: { xs: 2, sm: 2, md: 2 }, "&:last-child": { pb: { xs: 2, sm: 2, md: 2 } } }}
          >
            <Stack
              spacing={{ xs: 1, md: 1.5 }}
              sx={{ minHeight: 0, minWidth: 0 }}
            >
              <Box sx={{ display: "flex", justifyContent: "center", width: "100%", flexShrink: 0, py: 0.25 }}>
                <Box
                  aria-hidden
                  sx={{
                    width: { xs: 118, md: 128, xl: 140 },
                    height: { xs: 118, md: 128, xl: 140 },
                    borderRadius: "50%",
                    border: "1px solid #C9C9CB",
                    bgcolor: "#F5F5F7",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Иллюстрация
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  flexShrink: 0,
                  minWidth: 0,
                  py: 0,
                  px: 0.5,
                }}
              >
                <Typography variant="body2" sx={{ color: "text.secondary", flexShrink: 0 }}>
                  Интенсивность
                </Typography>
                <Box sx={{ flex: 1, minWidth: 0, px: 0.75 }}>
                  <Slider
                    aria-label="Интенсивность эмоции"
                    min={0}
                    max={10}
                    step={1}
                    valueLabelDisplay="off"
                    value={sliderValue}
                    disabled={!selectedEmotion?.fillable}
                    onChange={(_event, value) => setSliderValue(value as number)}
                    sx={{
                      width: "100%",
                      minWidth: 0,
                      boxSizing: "border-box",
                      py: "1px",
                      "& .MuiSlider-rail": {
                        height: 4,
                        bgcolor: "#E5E5E7",
                        opacity: 1,
                      },
                      "& .MuiSlider-track": {
                        height: 4,
                        border: 0,
                      },
                      "& .MuiSlider-thumb": {
                        width: 14,
                        height: 14,
                        boxShadow: "none",
                        border: "1px solid #C9C9CB",
                        "&:hover, &.Mui-focusVisible, &.Mui-active": {
                          boxShadow: "0 0 0 4px rgba(42,106,240,0.12)",
                        },
                      },
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    minWidth: 36,
                    py: 0.25,
                    px: 1,
                    borderRadius: "999px",
                    border: "1px solid #C9C9CB",
                    bgcolor: "#FFFFFF",
                    textAlign: "center",
                    flexShrink: 0,
                    maxWidth: 72,
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.1, color: "text.primary" }}>
                    {sliderValue}
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="contained"
                onClick={handleApplyValue}
                disabled={!selectedEmotion?.fillable}
                sx={{
                  mt: 0.5,
                  alignSelf: "stretch",
                  borderRadius: "12px",
                  textTransform: "none",
                  boxShadow: "none",
                  flexShrink: 0,
                }}
              >
                Добавить
              </Button>
            </Stack>
          </SoftCard>

          <Box
            sx={{
              minWidth: 0,
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
              width: "100%",
              boxSizing: "border-box",
              gap: { xs: 2, md: 2, lg: 2 },
              [twoKMediaQuery]: { gap: 2 },
              "& > *": {
                width: "100%",
                boxSizing: "border-box",
              },
            }}
          >
            <SoftCard
              title="Информация"
              sx={{ minHeight: 0 }}
              contentSx={{ minHeight: 0, p: { xs: 2, sm: 2, md: 2 }, "&:last-child": { pb: { xs: 2, sm: 2, md: 2 } } }}
            >
              <Stack spacing={1} sx={{ flex: 1, minHeight: 0, minWidth: 0 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.35 }}>
                  {selectedEmotion?.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.55 }}>
                  {selectedEmotion?.description}
                </Typography>
                {!!selectedEmotion?.symptoms?.length && (
                  <Box>
                    <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 0.75 }}>
                      Возможные симптомы:
                    </Typography>
                    <Box component="ul" sx={{ m: 0, pl: 2.5, color: "#6B6B6B", maxWidth: "none" }}>
                      {selectedEmotion.symptoms.map((symptom) => (
                        <Typography
                          key={symptom}
                          component="li"
                          variant="body2"
                          sx={{ color: "text.secondary", lineHeight: 1.5, mb: 0.5, pr: 0 }}
                        >
                          {symptom}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                )}
              </Stack>
            </SoftCard>

            <SoftCard
              title="Общая статистика за день (Заполните расписание за день)"
              sx={{ minHeight: 0 }}
              contentSx={{ minHeight: 0, p: { xs: 2, sm: 2, md: 2 }, "&:last-child": { pb: { xs: 2, sm: 2, md: 2 } } }}
            >
              <Stack spacing={0.75} sx={{ flex: 1, minHeight: 0 }}>
                {sequence
                  .filter((item) => item.fillable)
                  .map((item) => {
                    const safeValue = item.value ?? 0;
                    return (
                      <Box key={item.id}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", mb: 0 }}>
                          <Typography variant="body2">{item.title}</Typography>
                          <Typography variant="caption" sx={{ color: "text.secondary" }}>
                            {safeValue} из 10
                          </Typography>
                        </Box>
                        <Box sx={{ width: "100%", height: 6, borderRadius: 99, bgcolor: "#E5E5E7", overflow: "hidden" }}>
                          <Box
                            sx={{
                              width: `${(safeValue / 10) * 100}%`,
                              height: "100%",
                              bgcolor: "primary.main",
                            }}
                          />
                        </Box>
                      </Box>
                    );
                  })}
              </Stack>
            </SoftCard>

            <Box sx={{ mt: 0, pt: 0, display: "flex", justifyContent: "flex-end", gap: 1.5, flexWrap: "wrap", flexShrink: 0 }}>
              <Button
                variant="outlined"
                onClick={() => {
                  if (window.history.length > 1) {
                    navigate(-1);
                    return;
                  }
                  navigate("/app", { replace: true });
                }}
                sx={{ textTransform: "none", borderRadius: "12px" }}
              >
                Назад
              </Button>
              <Button
                variant="contained"
                disabled={!allRequiredFilled}
                onClick={() => setIsFinishMessageOpen(true)}
                sx={{
                  textTransform: "none",
                  borderRadius: "12px",
                  boxShadow: "none",
                }}
              >
                Завершить заполнение данных
              </Button>
            </Box>
          </Box>
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={isFinishMessageOpen}
        autoHideDuration={3000}
        onClose={() => setIsFinishMessageOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={() => setIsFinishMessageOpen(false)} severity="success" variant="filled" sx={{ width: "100%" }}>
          Данные сохранены
        </Alert>
      </Snackbar>

      <Snackbar
        open={isAllFilledMessageOpen}
        autoHideDuration={2200}
        onClose={() => setIsAllFilledMessageOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={() => setIsAllFilledMessageOpen(false)} severity="info" variant="filled" sx={{ width: "100%" }}>
          Все эмоции заполнены
        </Alert>
      </Snackbar>
    </PageContainer>
  );
}
