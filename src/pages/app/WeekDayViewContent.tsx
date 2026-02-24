import * as React from "react";
import { Box, Button, Typography } from "@mui/material";

const weekDays = [
  { label: "Пн", date: "16" },
  { label: "Вт", date: "17" },
  { label: "Ср", date: "18" },
  { label: "Чт", date: "19" },
  { label: "Пт", date: "20" },
  { label: "Сб", date: "21" },
  { label: "Вс", date: "22" },
];

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
        {weekDays.map((day) => {
          const isSelected = selectedWeekDay === day.label;
          const completion = dayCompletion[day.label as keyof typeof dayCompletion];

          return (
            <Button
              key={day.label}
              variant="text"
              onClick={() => setSelectedWeekDay(day.label)}
              sx={{
                minWidth: 0,
                minHeight: 240,
                px: 2,
                py: 2,
                borderRadius: "12px",
                border: isSelected ? "1px solid #C9C9CB" : "1px solid #E5E5E7",
                bgcolor: isSelected ? "#F5F5F7" : "#FFFFFF",
                color: "text.primary",
                boxShadow: "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                gap: 1,
                textTransform: "none",
                "&:hover": {
                  bgcolor: isSelected ? "#F0F0F2" : "#F8F8FA",
                  borderColor: isSelected ? "#C9C9CB" : "#E5E5E7",
                },
              }}
            >
              <Typography variant="caption" sx={{ color: "text.secondary", lineHeight: 1.2, fontWeight: 400 }}>
                {day.label}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 600 }}>
                {day.date}
              </Typography>
              <Typography variant="caption" sx={{ mt: "auto", color: "text.secondary", fontWeight: 400 }}>
                Заполнено {completion}%
              </Typography>
              <Box
                sx={{
                  width: "100%",
                  height: 4,
                  borderRadius: "8px",
                  bgcolor: "#E5E5E7",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    width: `${completion}%`,
                    height: "100%",
                    borderRadius: "8px",
                    bgcolor: "primary.main",
                  }}
                />
              </Box>
            </Button>
          );
        })}
      </Box>
    </Box>
  );
}
