import { Box, Typography } from "@mui/material";
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
            {weekDays.map((day) => (
              <Box
                key={day.id}
                sx={{
                  minWidth: 0,
                  minHeight: { xs: 240, lg: 300, xl: 340 },
                  borderRadius: "12px",
                  border: day.isCurrent ? "1px solid #2D6AE3" : "1px solid #E5E5E7",
                  bgcolor: day.isCurrent ? "#2D6AE3" : "#FFFFFF",
                  color: day.isCurrent ? "#FFFFFF" : "#000000",
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease",
                  boxShadow: "none",
                  "&:hover": {
                    transform: "translateY(-10px)",
                    borderColor: day.isCurrent ? "#2D6AE3" : "#C9C9CB",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                  },
                }}
              >
                <Box>
                  <Typography sx={{ fontSize: "1.35rem", lineHeight: 1.1, fontWeight: 600 }}>{day.dateNumber}</Typography>
                  <Typography sx={{ mt: 0.75, color: day.isCurrent ? "rgba(255,255,255,0.85)" : "#6B6B6B", fontSize: "0.78rem" }}>{day.subDate}</Typography>
                </Box>

                <Typography sx={{ fontSize: "1rem", fontWeight: 500, textAlign: "center" }}>{day.label}</Typography>

                <Typography sx={{ fontSize: "0.9rem", color: day.isCurrent ? "rgba(255,255,255,0.92)" : "#6B6B6B", textAlign: "left" }}>
                  Заполнено {day.completion}%
                </Typography>
              </Box>
            ))}
          </Box>
        </SoftCard>
      </Box>
    </PageContainer>
  );
}
