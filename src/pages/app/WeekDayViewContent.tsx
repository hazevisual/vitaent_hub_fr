import * as React from "react";
import { Box, Button, Typography } from "@mui/material";

const weekDays = [
  { shortLabel: "Пн", fullLabel: "Понедельник" },
  { shortLabel: "Вт", fullLabel: "Вторник" },
  { shortLabel: "Ср", fullLabel: "Среда" },
  { shortLabel: "Чт", fullLabel: "Четверг" },
  { shortLabel: "Пт", fullLabel: "Пятница" },
  { shortLabel: "Сб", fullLabel: "Суббота" },
  { shortLabel: "Вс", fullLabel: "Воскресенье" },
] as const;

const dayCompletion = {
  Пн: 48,
  Вт: 54,
  Ср: 62,
  Чт: 58,
  Пт: 66,
  Сб: 71,
  Вс: 63,
} as const;

export default function WeekDayViewContent() {
  const today = React.useMemo(() => new Date(), []);
  const weekStart = React.useMemo(() => {
    const currentDate = new Date(today);
    const dayOfWeek = currentDate.getDay();
    const offsetToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    currentDate.setDate(currentDate.getDate() + offsetToMonday);
    return currentDate;
  }, [today]);

  const [selectedWeekDay, setSelectedWeekDay] = React.useState("Вс");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "text.primary", lineHeight: 1.2 }}>
        Просмотр по неделе и дням
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, minmax(92px, 1fr))",
          gap: 2,
        }}
      >
        {weekDays.map((day, index) => {
          const cardDate = new Date(weekStart);
          cardDate.setDate(weekStart.getDate() + index);
          const isCurrentDay = cardDate.toDateString() === today.toDateString();
          const isSelected = selectedWeekDay === day.shortLabel;
          const completion = dayCompletion[day.shortLabel as keyof typeof dayCompletion];

          return (
            <Button
              key={day.shortLabel}
              variant="text"
              onClick={() => setSelectedWeekDay(day.shortLabel)}
              sx={{
                minWidth: 0,
                minHeight: 240,
                px: 2,
                py: 2.5,
                borderRadius: "12px",
                border: isCurrentDay || isSelected ? "1px solid #C9C9CB" : "1px solid #E5E5E7",
                bgcolor: isCurrentDay ? "primary.main" : isSelected ? "#F5F5F7" : "#FFFFFF",
                color: isCurrentDay ? "#FFFFFF" : "text.primary",
                boxShadow: isCurrentDay ? "0 8px 20px rgba(116, 142, 198, 0.18)" : "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1.5,
                textTransform: "none",
                transition: "transform 200ms ease, box-shadow 200ms ease",
                cursor: "pointer",
                "&:hover": {
                  transform: "translateY(-10px)",
                  bgcolor: isCurrentDay ? "primary.dark" : isSelected ? "#F0F0F2" : "#F8F8FA",
                  boxShadow: isCurrentDay ? "0 12px 24px rgba(116, 142, 198, 0.24)" : "0 10px 18px rgba(62, 78, 114, 0.1)",
                },
                "&:active": {
                  transform: "translateY(-4px)",
                },
              }}
            >
              <Box sx={{ minHeight: 56, display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
                {isCurrentDay && (
                  <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.8)", fontWeight: 500, lineHeight: 1.2 }}>
                    Текущий день
                  </Typography>
                )}
                <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1, color: "inherit" }}>
                  {cardDate.getDate()}
                </Typography>
                <Typography variant="caption" sx={{ color: isCurrentDay ? "rgba(255, 255, 255, 0.8)" : "text.secondary", lineHeight: 1.2 }}>
                  {`${String(cardDate.getMonth() + 1).padStart(2, "0")}.${cardDate.getFullYear()}`}
                </Typography>
              </Box>

              <Typography variant="body2" sx={{ fontWeight: 600, color: "inherit", textAlign: "center" }}>
                {day.fullLabel}
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, width: "100%" }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: isCurrentDay ? "#FFFFFF" : "text.secondary",
                    fontWeight: 400,
                    textAlign: "center",
                  }}
                >
                  Заполнено {completion}%
                </Typography>
                <Box
                  sx={{
                    width: "100%",
                    height: 4,
                    borderRadius: "8px",
                    bgcolor: isCurrentDay ? "rgba(255, 255, 255, 0.3)" : "#E5E5E7",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      width: `${completion}%`,
                      height: "100%",
                      borderRadius: "8px",
                      bgcolor: isCurrentDay ? "#FFFFFF" : "primary.main",
                    }}
                  />
                </Box>
              </Box>
            </Button>
          );
        })}
      </Box>
    </Box>
  );
}
