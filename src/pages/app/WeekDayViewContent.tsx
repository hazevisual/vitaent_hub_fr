import * as React from "react";
import { Box, Button, Typography } from "@mui/material";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";

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
    <Box
      sx={{
        p: 3,
        borderRadius: "16px",
        border: "1px solid #E5E5E7",
        bgcolor: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
        gap: 3,
        "@media (min-width:2000px)": {
          p: 3.75,
        },
      }}
    >
      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "text.primary", lineHeight: 1.2 }}>
        Просмотр по неделе и дням
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
          gap: 2,
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
                minHeight: 80,
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
                justifyContent: "space-between",
                gap: 1,
                textTransform: "none",
                "&:hover": {
                  bgcolor: isSelected ? "#F0F0F2" : "#F8F8FA",
                  borderColor: isSelected ? "#C9C9CB" : "#E5E5E7",
                },
              }}
            >
              <Typography variant="caption" sx={{ color: "text.secondary", lineHeight: 1.2 }}>
                {day.label}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 600 }}>
                {day.date}
              </Typography>
              {isSelected ? (
                <Box
                  sx={{
                    width: "100%",
                    height: 2,
                    borderRadius: "8px",
                    bgcolor: "primary.main",
                  }}
                />
              ) : null}
            </Button>
          );
        })}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))" },
          gap: 2,
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
              minHeight: 112,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CalendarTodayRoundedIcon sx={{ fontSize: 16, color: "primary.main" }} />
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                {item.title}
              </Typography>
            </Box>
            <Typography variant="h5" sx={{ mt: 2, color: "text.primary", fontWeight: 600 }}>
              {item.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
