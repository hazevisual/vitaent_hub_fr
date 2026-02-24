import * as React from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Slider,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import SentimentDissatisfiedRoundedIcon from "@mui/icons-material/SentimentDissatisfiedRounded";
import SentimentNeutralRoundedIcon from "@mui/icons-material/SentimentNeutralRounded";
import SentimentSatisfiedAltRoundedIcon from "@mui/icons-material/SentimentSatisfiedAltRounded";
import PsychologyAltRoundedIcon from "@mui/icons-material/PsychologyAltRounded";
import ReportGmailerrorredRoundedIcon from "@mui/icons-material/ReportGmailerrorredRounded";
import MoodBadRoundedIcon from "@mui/icons-material/MoodBadRounded";
import WhatshotRoundedIcon from "@mui/icons-material/WhatshotRounded";
import { useNavigate } from "react-router-dom";
import PageContainer from "@/components/ui/PageContainer";
import SoftCard from "@/components/ui/SoftCard";

type EmotionOption = {
  id: string;
  name: string;
  description: string;
  info: string;
  icon: React.ReactNode;
};

type DayEmotionEntry = {
  id: string;
  name: string;
  intensity: number;
  icon: React.ReactNode;
};

const emotionCatalog: EmotionOption[] = [
  {
    id: "calm",
    name: "Спокойствие",
    description: "Ровное эмоциональное состояние без выраженного напряжения.",
    info: "Подходит для фиксации стабильного дня без резких эмоциональных перепадов.",
    icon: <SentimentSatisfiedAltRoundedIcon fontSize="small" />,
  },
  {
    id: "anxiety",
    name: "Тревога",
    description: "Внутреннее напряжение, беспокойство и сложность сосредоточиться.",
    info: "Отмечайте тревогу, чтобы отслеживать частоту и интенсивность на протяжении дня.",
    icon: <SentimentDissatisfiedRoundedIcon fontSize="small" />,
  },
  {
    id: "neutral",
    name: "Нейтрально",
    description: "Состояние без ярко выраженных положительных или отрицательных эмоций.",
    info: "Нейтральные состояния помогают формировать объективную картину эмоционального фона.",
    icon: <SentimentNeutralRoundedIcon fontSize="small" />,
  },
  {
    id: "suppression",
    name: "Подавленность",
    description: "Эмоциональный спад, ощущение опустошенности и сниженной вовлеченности.",
    info: "Отмечайте подавленность, чтобы отслеживать периоды сниженного эмоционального ресурса.",
    icon: <PsychologyAltRoundedIcon fontSize="small" />,
  },
  {
    id: "stress",
    name: "Стресс",
    description: "Состояние перегрузки, внутреннего давления и сложности расслабиться.",
    info: "Регулярная фиксация стресса помогает увидеть триггеры и динамику нагрузки в течение дня.",
    icon: <ReportGmailerrorredRoundedIcon fontSize="small" />,
  },
  {
    id: "irritability",
    name: "Раздражительность",
    description: "Повышенная чувствительность к внешним факторам и быстрая эмоциональная реакция.",
    info: "Используйте этот пункт, чтобы оценивать частоту эмоционального напряжения в повседневных ситуациях.",
    icon: <MoodBadRoundedIcon fontSize="small" />,
  },
  {
    id: "aggression",
    name: "Агрессия",
    description: "Выраженная острота реакции, вспышки злости и конфликтность.",
    info: "Фиксация агрессии помогает сопоставлять её с контекстом дня и корректировать поведенческие стратегии.",
    icon: <WhatshotRoundedIcon fontSize="small" />,
  },
];

const contentMaxWidth = 1920;

function LeftScheduleCard({ schedule }: { schedule: DayEmotionEntry[] }) {
  return (
    <SoftCard title="Расписание за день" sx={{ minWidth: 0 }} contentSx={{ minWidth: 0, gap: 2 }}>
      {schedule.length === 0 ? (
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Добавьте эмоции, чтобы сформировать последовательность дня.
        </Typography>
      ) : (
        <Stack
          spacing={1.25}
          sx={{
            minWidth: 0,
            width: "100%",
            maxHeight: 420,
            overflowY: "auto",
            scrollbarGutter: "stable",
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(23, 23, 23, 0.25) transparent",
            "&::-webkit-scrollbar": {
              width: 6,
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(23, 23, 23, 0.25)",
              borderRadius: "999px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "transparent",
            },
          }}
        >
          {schedule.map((entry, index) => (
            <Box
              key={entry.id}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
                border: "1px solid #E5E5E7",
                borderRadius: "12px",
                bgcolor: "#F5F5F7",
                px: 1.5,
                py: 1,
                minWidth: 0,
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
                <Typography variant="body2" sx={{ color: "text.secondary", minWidth: 20 }}>
                  {index + 1}.
                </Typography>
                <Avatar sx={{ width: 28, height: 28, bgcolor: "#FFFFFF", color: "text.primary", border: "1px solid #E5E5E7" }}>
                  {entry.icon}
                </Avatar>
                <Typography variant="body2" sx={{ fontWeight: 500 }} noWrap>
                  {entry.name}
                </Typography>
              </Stack>
              <Chip label={`Инт. ${entry.intensity}`} size="small" sx={{ bgcolor: "#FFFFFF", border: "1px solid #E5E5E7" }} />
            </Box>
          ))}
        </Stack>
      )}
    </SoftCard>
  );
}

function CenterSelectedEmotionCard({
  selectedEmotion,
  intensity,
  onIntensityChange,
  onSelectEmotion,
  onAdd,
}: {
  selectedEmotion: EmotionOption;
  intensity: number;
  onIntensityChange: (value: number) => void;
  onSelectEmotion: (emotion: EmotionOption) => void;
  onAdd: () => void;
}) {
  return (
    <SoftCard title="Выбранная эмоция" sx={{ minWidth: 0 }} contentSx={{ minWidth: 0, gap: 2 }}>
      <Stack
        direction="row"
        sx={{
          flexWrap: "wrap",
          justifyContent: "flex-start",
          alignContent: "flex-start",
          gap: 1,
          minWidth: 0,
        }}
      >
        {emotionCatalog.map((emotion) => {
          const active = emotion.id === selectedEmotion.id;
          return (
            <Button
              key={emotion.id}
              onClick={() => onSelectEmotion(emotion)}
              variant="text"
              sx={{
                borderRadius: "12px",
                px: 1.5,
                py: 0.9,
                color: "text.primary",
                border: "1px solid",
                borderColor: active ? "#C9C9CB" : "#E5E5E7",
                bgcolor: active ? "#F5F5F7" : "#FFFFFF",
                textTransform: "none",
                whiteSpace: "nowrap",
                flex: "0 0 auto",
                maxWidth: "100%",
              }}
            >
              {emotion.name}
            </Button>
          );
        })}
      </Stack>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
        <Avatar sx={{ bgcolor: "#F5F5F7", color: "text.primary", border: "1px solid #E5E5E7" }}>
          {selectedEmotion.icon}
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontWeight: 600 }}>{selectedEmotion.name}</Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {selectedEmotion.description}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1, minWidth: 0 }}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Интенсивность
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {intensity}/10
          </Typography>
        </Stack>
        <Box sx={{ px: 0.5, minWidth: 0 }}>
          <Slider
            value={intensity}
            onChange={(_, value) => onIntensityChange(value as number)}
            min={0}
            max={10}
            step={1}
            marks
            valueLabelDisplay="auto"
            sx={{ minWidth: 0 }}
          />
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 0.5 }}>
        <Button variant="contained" onClick={onAdd} sx={{ borderRadius: "12px", textTransform: "none", px: 2.5 }}>
          Добавить
        </Button>
      </Box>
    </SoftCard>
  );
}

function RightInfoCard({ infoText }: { infoText: string }) {
  return (
    <SoftCard title="Информация" sx={{ minWidth: 0 }} contentSx={{ minWidth: 0 }}>
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        {infoText}
      </Typography>
    </SoftCard>
  );
}

function RightDailyStatsCard({ schedule }: { schedule: DayEmotionEntry[] }) {
  const hasData = schedule.length > 0;
  const averageIntensity = hasData
    ? Math.round((schedule.reduce((sum, entry) => sum + entry.intensity, 0) / schedule.length) * 10) / 10
    : null;

  const emotionFrequency = schedule.reduce<Record<string, number>>((acc, entry) => {
    acc[entry.name] = (acc[entry.name] ?? 0) + 1;
    return acc;
  }, {});

  const dominantEmotion = hasData
    ? Object.entries(emotionFrequency).sort((a, b) => b[1] - a[1])[0]?.[0]
    : null;

  return (
    <SoftCard
      title="Общая статистика за день"
      sx={{ flex: 1, minHeight: 0, minWidth: 0 }}
      contentSx={{ minWidth: 0, justifyContent: "flex-start", gap: 1.25 }}
    >
      {hasData ? (
        <>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Добавлено эмоций: <strong style={{ color: "#000" }}>{schedule.length}</strong>
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Средняя интенсивность: <strong style={{ color: "#000" }}>{averageIntensity}</strong>
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Преобладающая эмоция: <strong style={{ color: "#000" }}>{dominantEmotion}</strong>
          </Typography>
        </>
      ) : (
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Заполните расписание за день
        </Typography>
      )}
    </SoftCard>
  );
}

export default function EmotionsPage() {
  const navigate = useNavigate();
  const [selectedEmotion, setSelectedEmotion] = React.useState<EmotionOption>(emotionCatalog[0]);
  const [intensity, setIntensity] = React.useState(5);
  const [daySchedule, setDaySchedule] = React.useState<DayEmotionEntry[]>([]);

  const handleAddEmotion = React.useCallback(() => {
    setDaySchedule((prev) => [
      ...prev,
      {
        id: `${selectedEmotion.id}-${Date.now()}-${prev.length}`,
        name: selectedEmotion.name,
        intensity,
        icon: selectedEmotion.icon,
      },
    ]);
  }, [selectedEmotion, intensity]);

  return (
    <PageContainer>
      <Box
        sx={{
          width: "100%",
          maxWidth: contentMaxWidth,
          mx: "auto",
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          gap: { xs: 2, md: 3 },
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr)",
            gap: { xs: 2, md: 3 },
            alignItems: "stretch",
            minWidth: 0,
            "@media (min-width:900px) and (max-width:1279px)": {
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            },
            "@media (min-width:1280px)": {
              gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.1fr) minmax(0, 1fr)",
            },
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <LeftScheduleCard schedule={daySchedule} />
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <CenterSelectedEmotionCard
              selectedEmotion={selectedEmotion}
              intensity={intensity}
              onIntensityChange={setIntensity}
              onSelectEmotion={setSelectedEmotion}
              onAdd={handleAddEmotion}
            />
          </Box>

          <Box sx={{ minWidth: 0, display: "flex", flexDirection: "column", gap: { xs: 2, md: 3 } }}>
            <RightInfoCard infoText={selectedEmotion.info} />
            <Box sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", minWidth: 0 }}>
              <RightDailyStatsCard schedule={daySchedule} />
            </Box>
          </Box>
        </Box>

        <Stack direction="row" spacing={1.5} justifyContent="flex-end" sx={{ minWidth: 0 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackRoundedIcon />}
            onClick={() => navigate(-1)}
            sx={{ borderRadius: "12px", textTransform: "none" }}
          >
            Назад
          </Button>
          <Button
            variant="contained"
            endIcon={<CheckRoundedIcon />}
            sx={{ borderRadius: "12px", textTransform: "none" }}
          >
            Завершить заполнение
          </Button>
        </Stack>
      </Box>
    </PageContainer>
  );
}
