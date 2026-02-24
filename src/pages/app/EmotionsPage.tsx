import * as React from "react";
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

type EmotionItem = {
  id: string;
  sectionId: string;
  name: string;
  value: number;
  info: string;
};

type EmotionSection = {
  id: string;
  title: string;
  items: EmotionItem[];
};

type EmotionStat = {
  id: string;
  label: string;
  value: number;
};

const EMOTIONS_CONTENT_MAX_WIDTH = 1560;
const twoKMediaQuery = "@media (min-width:2000px)";

const initialSections: EmotionSection[] = [
  {
    id: "morning",
    title: "Утреннее состояние",
    items: [
      {
        id: "calm",
        sectionId: "morning",
        name: "Спокойствие",
        value: 6,
        info: "Спокойствие показывает, насколько ровным и устойчивым было ваше внутреннее состояние утром.",
      },
      {
        id: "anxiety",
        sectionId: "morning",
        name: "Тревожность",
        value: 3,
        info: "Тревожность отражает уровень внутреннего напряжения и беспокойства в течение дня.",
      },
      {
        id: "energy",
        sectionId: "morning",
        name: "Энергичность",
        value: 7,
        info: "Энергичность показывает уровень бодрости, готовности к действиям и активности.",
      },
    ],
  },
  {
    id: "evening",
    title: "Вечернее состояние",
    items: [
      {
        id: "joy",
        sectionId: "evening",
        name: "Радость",
        value: 5,
        info: "Радость описывает степень позитивных эмоций, удовлетворенности и приятных ощущений.",
      },
      {
        id: "irritability",
        sectionId: "evening",
        name: "Раздражительность",
        value: 4,
        info: "Раздражительность отражает, насколько легко возникали негативные реакции на внешние факторы.",
      },
      {
        id: "fatigue",
        sectionId: "evening",
        name: "Усталость",
        value: 6,
        info: "Усталость показывает накопленный уровень физического и эмоционального истощения.",
      },
    ],
  },
];

const initialStats: EmotionStat[] = [
  { id: "calm", label: "Спокойствие", value: 6 },
  { id: "anxiety", label: "Тревожность", value: 3 },
  { id: "energy", label: "Энергичность", value: 7 },
  { id: "joy", label: "Радость", value: 5 },
  { id: "irritability", label: "Раздражительность", value: 4 },
  { id: "fatigue", label: "Усталость", value: 6 },
];

function getEmotionById(sections: EmotionSection[], id: string) {
  for (const section of sections) {
    for (const emotion of section.items) {
      if (emotion.id === id) {
        return emotion;
      }
    }
  }

  return null;
}

export default function EmotionsPage() {
  const navigate = useNavigate();
  const [sections, setSections] = React.useState<EmotionSection[]>(initialSections);
  const [stats, setStats] = React.useState<EmotionStat[]>(initialStats);
  const [selectedEmotionId, setSelectedEmotionId] = React.useState(initialSections[0].items[0].id);
  const [sliderValue, setSliderValue] = React.useState(initialSections[0].items[0].value);
  const [isFinishMessageOpen, setIsFinishMessageOpen] = React.useState(false);

  const selectedEmotion = React.useMemo(() => getEmotionById(sections, selectedEmotionId), [sections, selectedEmotionId]);

  React.useEffect(() => {
    if (selectedEmotion) {
      setSliderValue(selectedEmotion.value);
    }
  }, [selectedEmotion]);

  const handleApplyValue = () => {
    if (!selectedEmotion) {
      return;
    }

    setSections((previous) =>
      previous.map((section) => ({
        ...section,
        items: section.items.map((emotion) =>
          emotion.id === selectedEmotion.id ? { ...emotion, value: sliderValue } : emotion
        ),
      }))
    );

    setStats((previous) =>
      previous.map((item) => (item.id === selectedEmotion.id ? { ...item, value: sliderValue } : item))
    );
  };

  return (
    <PageContainer>
      <Box sx={{ width: "100%", maxWidth: EMOTIONS_CONTENT_MAX_WIDTH, mx: "auto", minWidth: 0 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr)",
            alignItems: "stretch",
            gap: { xs: 2, md: 3, lg: 4 },
            [twoKMediaQuery]: { gap: 5 },
            "@media (min-width:1200px)": {
              gridTemplateColumns: "minmax(260px, 1fr) minmax(340px, 1.15fr) minmax(300px, 1fr)",
            },
          }}
        >
          <SoftCard title="Расписание за день">
            <Box sx={{ maxHeight: { xs: 320, md: 540, xl: 620 }, overflowY: "auto", pr: 0.5 }}>
              {sections.map((section) => (
                <Box key={section.id} sx={{ mb: 2.5 }}>
                  <Typography variant="subtitle2" sx={{ color: "text.secondary", mb: 1.2 }}>
                    {section.title}
                  </Typography>
                  <List disablePadding sx={{ display: "grid", gap: 0.8 }}>
                    {section.items.map((emotion) => {
                      const isSelected = emotion.id === selectedEmotionId;
                      return (
                        <ListItemButton
                          key={emotion.id}
                          selected={isSelected}
                          onClick={() => setSelectedEmotionId(emotion.id)}
                          sx={{
                            borderRadius: "12px",
                            border: isSelected ? "1px solid #C9C9CB" : "1px solid transparent",
                            bgcolor: isSelected ? "#F5F5F7" : "transparent",
                            px: 1.25,
                            py: 1,
                            "&:hover": { bgcolor: "#F0F0F2" },
                            "&.Mui-selected": { bgcolor: "#F5F5F7" },
                            "&.Mui-selected:hover": { bgcolor: "#F0F0F2" },
                          }}
                        >
                          <Box sx={{ display: "flex", width: "100%", justifyContent: "space-between", gap: 1.5 }}>
                            <Typography variant="body2">{emotion.name}</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {emotion.value}
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

          <SoftCard title={selectedEmotion?.name ?? "Эмоция"}>
            <Stack spacing={{ xs: 2.5, md: 3 }} sx={{ height: "100%" }}>
              <Box
                aria-hidden
                sx={{
                  width: { xs: 170, md: 200, xl: 220 },
                  height: { xs: 170, md: 200, xl: 220 },
                  borderRadius: "50%",
                  border: "1px solid #C9C9CB",
                  bgcolor: "#F5F5F7",
                  display: "grid",
                  placeItems: "center",
                  mx: "auto",
                }}
              >
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Иллюстрация
                </Typography>
              </Box>

              <Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Интенсивность
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 600, lineHeight: 1 }}>
                    {sliderValue}
                  </Typography>
                </Box>
                <Slider
                  aria-label="Интенсивность эмоции"
                  min={0}
                  max={10}
                  step={1}
                  marks
                  value={sliderValue}
                  valueLabelDisplay="auto"
                  onChange={(_event, value) => setSliderValue(value as number)}
                />
              </Box>

              <Button
                variant="contained"
                onClick={handleApplyValue}
                sx={{
                  mt: "auto",
                  alignSelf: "stretch",
                  borderRadius: "12px",
                  textTransform: "none",
                  boxShadow: "none",
                }}
              >
                Добавить
              </Button>
            </Stack>
          </SoftCard>

          <Stack spacing={{ xs: 2, md: 3, lg: 4 }} sx={{ minWidth: 0, [twoKMediaQuery]: { gap: 5 } }}>
            <SoftCard title="Информация">
              <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                {selectedEmotion?.info}
              </Typography>
            </SoftCard>

            <SoftCard title="Общая статистика за день">
              <Stack spacing={1.5}>
                {stats.map((item) => (
                  <Box key={item.id}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", mb: 0.45 }}>
                      <Typography variant="body2">{item.label}</Typography>
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        {item.value} из 10
                      </Typography>
                    </Box>
                    <Box sx={{ width: "100%", height: 8, borderRadius: 99, bgcolor: "#E5E5E7", overflow: "hidden" }}>
                      <Box
                        sx={{
                          width: `${(item.value / 10) * 100}%`,
                          height: "100%",
                          bgcolor: "primary.main",
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Stack>
            </SoftCard>

            <Box sx={{ mt: "auto", display: "flex", justifyContent: "flex-end", gap: 1.5, flexWrap: "wrap" }}>
              <Button
                variant="text"
                onClick={() => {
                  if (window.history.length > 1) {
                    navigate(-1);
                    return;
                  }
                  navigate("/", { replace: true });
                }}
                sx={{ textTransform: "none" }}
              >
                Назад
              </Button>
              <Button
                variant="contained"
                onClick={() => setIsFinishMessageOpen(true)}
                sx={{
                  textTransform: "none",
                  borderRadius: "12px",
                  bgcolor: "#111111",
                  color: "#FFFFFF",
                  boxShadow: "none",
                  "&:hover": { bgcolor: "#222222", boxShadow: "none" },
                }}
              >
                Завершить заполнение данных
              </Button>
            </Box>
          </Stack>
        </Box>
      </Box>

      <Snackbar
        open={isFinishMessageOpen}
        autoHideDuration={3000}
        onClose={() => setIsFinishMessageOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={() => setIsFinishMessageOpen(false)} severity="success" variant="filled" sx={{ width: "100%" }}>
          Данные по эмоциям сохранены локально.
        </Alert>
      </Snackbar>
    </PageContainer>
  );
}
