import { Box, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import PageContainer from "@/components/ui/PageContainer";
import SoftCard from "@/components/ui/SoftCard";

const DAY_LABELS = [
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
  "Воскресенье",
];

const completionByDay = [84, 76, 100, 63, 91, 58, 72] as const;

function getWeekStart(date: Date) {
  const start = new Date(date);
  const day = (start.getDay() + 6) % 7;
  start.setDate(start.getDate() - day);
  start.setHours(0, 0, 0, 0);
  return start;
}

const currentDate = new Date();
const weekStart = getWeekStart(currentDate);

const weekDays = Array.from({ length: 7 }).map((_, index) => {
  const date = new Date(weekStart);
  date.setDate(weekStart.getDate() + index);

  return {
    id: date.toISOString(),
    label: DAY_LABELS[index],
    dateNumber: date.getDate(),
    subDate: new Intl.DateTimeFormat("ru-RU", { month: "short", year: "numeric" }).format(date),
    completion: completionByDay[index],
    isCurrent: date.toDateString() === currentDate.toDateString(),
  };
});

export default function WeekDayPage() {
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);

  const selectedOrCurrentDayId = useMemo(() => {
    if (selectedDayId) {
      return selectedDayId;
    }

    return weekDays.find((day) => day.isCurrent)?.id ?? weekDays[0]?.id ?? null;
  }, [selectedDayId]);

  return (
    <PageContainer>
      <SoftCard sx={{ minWidth: 0 }} contentSx={{ gap: 0 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(1, minmax(0, 1fr))",
              sm: "repeat(2, minmax(0, 1fr))",
              md: "repeat(3, minmax(0, 1fr))",
              lg: "repeat(4, minmax(0, 1fr))",
              xl: "repeat(7, minmax(0, 1fr))",
            },
            gap: { xs: 2, md: 3 },
            minWidth: 0,
          }}
        >
          {weekDays.map((day) => {
            const isSelected = day.id === selectedOrCurrentDayId;
            const isCurrent = day.isCurrent;
            const isNeutralSelected = isSelected && !isCurrent;

            return (
              <Box
                key={day.id}
                onClick={() => setSelectedDayId(day.id)}
                sx={{
                  minWidth: 0,
                  minHeight: { xs: 180, md: 220, xl: 260 },
                  borderRadius: "12px",
                  border: isCurrent ? "1px solid #2D6AE3" : isNeutralSelected ? "1px solid #C9C9CB" : "1px solid #E5E5E7",
                  bgcolor: isCurrent ? "#2D6AE3" : isNeutralSelected ? "#F5F5F7" : "#FFFFFF",
                  color: isCurrent ? "#FFFFFF" : "#171717",
                  p: { xs: 2, md: 3 },
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 2,
                  cursor: "pointer",
                  transition: "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",
                  boxShadow: "none",
                  overflow: "hidden",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    borderColor: isCurrent ? "#2D6AE3" : "#C9C9CB",
                    boxShadow: "0 8px 20px rgba(15, 23, 42, 0.08)",
                  },
                  "&:active": {
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, minWidth: 0 }}>
                  {isCurrent && (
                    <Typography
                      sx={{
                        fontSize: "0.75rem",
                        lineHeight: 1.2,
                        color: "rgba(255, 255, 255, 0.9)",
                        textAlign: "center",
                      }}
                    >
                      Текущий день
                    </Typography>
                  )}
                  <Typography sx={{ fontSize: "1.5rem", lineHeight: 1.1, fontWeight: 600, textAlign: "center" }}>
                    {day.dateNumber}
                  </Typography>
                  <Typography
                    sx={{
                      color: isCurrent ? "rgba(255, 255, 255, 0.92)" : "#6B7280",
                      fontSize: "0.875rem",
                      textAlign: "center",
                    }}
                  >
                    {day.subDate}
                  </Typography>
                </Box>

                <Typography sx={{ fontSize: "1rem", fontWeight: 500, textAlign: "center", wordBreak: "break-word" }}>
                  {day.label}
                </Typography>

                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    color: isCurrent ? "#FFFFFF" : "#6B7280",
                    textAlign: "center",
                  }}
                >
                  Заполнено {day.completion}%
                </Typography>
              </Box>
            );
          })}
        </Box>
      </SoftCard>
    </PageContainer>
  );
}
