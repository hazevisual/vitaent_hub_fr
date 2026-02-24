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

const dayCards = [
  { title: "Симптомы", value: "62%" },
  { title: "Пульс", value: "44%" },
  { title: "Давление", value: "57%" },
  { title: "Сон", value: "39%" },
];

export default function WeekDayViewContent() {
  const [selectedWeekDay, setSelectedWeekDay] = React.useState("Вс");

  return (
    <>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
          gap: 1,
        }}
      >
        {weekDays.map((day) => {
          const isSelected = selectedWeekDay === day.label;

          return (
            <Button
              key={day.label}
              variant="text"
              onClick={() => setSelectedWeekDay(day.label)}
              sx={{
                minWidth: 0,
                px: 1,
                py: 1,
                borderRadius: "12px",
                border: isSelected ? "1px solid #C9C9CB" : "1px solid #E5E5E7",
                bgcolor: isSelected ? "#F5F5F7" : "#FFFFFF",
                color: "text.primary",
                boxShadow: "none",
                display: "flex",
                flexDirection: "column",
                gap: 0.25,
                "&:hover": {
                  bgcolor: isSelected ? "#F0F0F2" : "#F8F8FA",
                  borderColor: isSelected ? "#C9C9CB" : "#E5E5E7",
                },
              }}
            >
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                {day.label}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 600 }}>
                {day.date}
              </Typography>
            </Button>
          );
        })}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))" },
          gap: 1.5,
        }}
      >
        {dayCards.map((item) => (
          <Box
            key={item.title}
            sx={{
              p: 2,
              borderRadius: "12px",
              border: "1px solid #E5E5E7",
              bgcolor: "#FFFFFF",
              boxShadow: "none",
            }}
          >
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {item.title}
            </Typography>
            <Typography variant="h5" sx={{ mt: 0.5, color: "text.primary", fontWeight: 600 }}>
              {item.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </>
  );
}
