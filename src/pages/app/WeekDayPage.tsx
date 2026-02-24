import { Box, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import PageContainer from "@/components/ui/PageContainer";
import SoftCard from "@/components/ui/SoftCard";

const WEEK_DAY_PAGE_MAX_WIDTH = 1560;
const DAY_LABELS = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];

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
      <Box
        sx={{
          width: "100%",
          maxWidth: WEEK_DAY_PAGE_MAX_WIDTH,
          mx: "auto",
          minWidth: 0,
          overflowX: "hidden",
        }}
      >
        <SoftCard
          sx={{
            p: 3,
            border: "1px solid #E5E5E7",
            borderRadius: "16px",
            "@media (min-width:2000px)": {
              p: 3.75,
            },
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
              gap: 3,
            }}
          >
            {weekDays.map((day) => {
              const isSelected = day.id === selectedOrCurrentDayId;
              const isBlueCurrent = day.isCurrent;
              const isNeutralSelected = isSelected && !day.isCurrent;

              return (
                <Box
                  key={day.id}
                  onClick={() => setSelectedDayId(day.id)}
                  sx={{
                    minWidth: 0,
                    minHeight: { xs: 240, lg: 300, xl: 340 },
                    borderRadius: "12px",
                    border: isBlueCurrent ? "1px solid #2D6AE3" : isNeutralSelected ? "1px solid #C9C9CB" : "1px solid #E5E5E7",
                    bgcolor: isBlueCurrent ? "#2D6AE3" : isNeutralSelected ? "#F5F5F7" : "#FFFFFF",
                    color: isBlueCurrent ? "#FFFFFF" : "#000000",
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    transition: "transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease",
                    boxShadow: "none",
                    "&:hover": {
                      transform: "translateY(-10px)",
                      borderColor: isBlueCurrent ? "#2D6AE3" : "#C9C9CB",
                      boxShadow: "0 6px 14px rgba(0, 0, 0, 0.08)",
                    },
                    "&:active": {
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                    {isBlueCurrent && (
                      <Typography sx={{ fontSize: "0.72rem", lineHeight: 1, color: "rgba(255,255,255,0.88)", textAlign: "center" }}>Текущий день</Typography>
                    )}
                    <Typography sx={{ fontSize: "1.35rem", lineHeight: 1.1, fontWeight: 600, textAlign: "center" }}>{day.dateNumber}</Typography>
                    <Typography sx={{ color: isBlueCurrent ? "rgba(255,255,255,0.9)" : "#6B6B6B", fontSize: "0.78rem", textAlign: "center" }}>{day.subDate}</Typography>
                  </Box>

                  <Typography sx={{ fontSize: "1rem", fontWeight: 500, textAlign: "center", color: isBlueCurrent ? "#FFFFFF" : "#000000" }}>{day.label}</Typography>

                  <Typography sx={{ fontSize: "0.9rem", color: isBlueCurrent ? "#FFFFFF" : "#6B6B6B", textAlign: "center" }}>
                    Заполнено {day.completion}%
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </SoftCard>
      </Box>
    </PageContainer>
  );
}
