import { Box, Button, Divider, Typography } from "@mui/material";
import SoftCard from "@/components/ui/SoftCard";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";

const sleepIntervals = [
  { title: "1-ый интервал сна", start: "01:15", end: "8:00" },
  { title: "2-ой интервал сна", start: "15:00", end: "16:00" },
] as const;

const attributes = [
  { label: "Сон", status: "Заполненно", active: true },
  { label: "Прием Пищи", status: "Не заполненно", active: false },
  { label: "Соц. Активность", status: "Не заполненно", active: false },
  { label: "Подвижность", status: "Не заполненно", active: false },
] as const;

export default function WeekDayViewContent() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr)",
          gap: 3,
          "@media (min-width:1280px)": {
            gridTemplateColumns: "minmax(320px, 1fr) minmax(380px, 1.25fr) minmax(320px, 1fr)",
          },
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 0 }}>
          <Typography sx={{ textAlign: "center", fontSize: "1.05rem", fontWeight: 500, color: "#6B6B6B" }}>Расписание сна</Typography>
          <SoftCard sx={{ minHeight: 380 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              {sleepIntervals.map((interval, index) => (
                <Box key={interval.title}>
                  <Typography sx={{ fontSize: "1.06rem", fontWeight: 500, color: "#000", mb: 1.5 }} variant="body1">
                    {interval.title}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, color: "#2D6AE3", mb: 1.5 }}>
                    <AccessTimeRoundedIcon sx={{ fontSize: 22 }} />
                    <Typography sx={{ color: "#2D6AE3", fontWeight: 500 }}>{interval.start}</Typography>
                    <Typography sx={{ color: "#C9C9CB" }}>—</Typography>
                    <AccessTimeRoundedIcon sx={{ fontSize: 22 }} />
                    <Typography sx={{ color: "#2D6AE3", fontWeight: 500 }}>{interval.end}</Typography>
                  </Box>
                  {index < sleepIntervals.length - 1 && <Divider sx={{ borderColor: "#E5E5E7" }} />}
                </Box>
              ))}
              <Button
                variant="outlined"
                sx={{
                  alignSelf: "flex-start",
                  borderRadius: "12px",
                  textTransform: "none",
                  borderColor: "#2D6AE3",
                  color: "#2D6AE3",
                  px: 2,
                  py: 0.9,
                }}
              >
                Добавить временной слот
              </Button>
            </Box>
          </SoftCard>

          <SoftCard title="Качество сна" sx={{ minHeight: 220 }}>
            <Box
              sx={{
                p: 2,
                borderRadius: "12px",
                border: "1px solid #C9C9CB",
                bgcolor: "#F5F5F7",
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <Typography sx={{ color: "#000", fontWeight: 500 }}>Оценка за ночь</Typography>
              <Typography sx={{ color: "#6B6B6B" }}>Плейсхолдер: 7 ч 20 мин сна, 1 пробуждение</Typography>
              <Typography sx={{ color: "#6B6B6B" }}>Плейсхолдер: стабильный режим, рекомендуем сохранить время отхода ко сну.</Typography>
            </Box>
          </SoftCard>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 0 }}>
          <Typography sx={{ textAlign: "center", fontSize: "1.05rem", fontWeight: 500, color: "#6B6B6B" }}>Атрибуты</Typography>
          <SoftCard>
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 2.5 }}>
              {attributes.map((item) => (
                <Box
                  key={item.label}
                  sx={{
                    borderRadius: "16px",
                    border: "1px solid #C9C9CB",
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 220,
                  }}
                >
                  <Box sx={{ width: 96, height: 96, borderRadius: "16px", border: "1px solid #C9C9CB", bgcolor: item.active ? "#000" : "#F5F5F7" }} />
                  <Typography sx={{ color: "#000", fontWeight: 500, textAlign: "center" }}>{item.label}</Typography>
                  <Typography sx={{ color: "#2D6AE3", textAlign: "center" }}>{item.status}</Typography>
                </Box>
              ))}
            </Box>
          </SoftCard>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 0 }}>
          <Typography sx={{ textAlign: "center", fontSize: "1.05rem", fontWeight: 500, color: "#6B6B6B" }}>Информация</Typography>
          <SoftCard>
            <Typography sx={{ color: "#6B6B6B", lineHeight: 1.6 }}>
              <Box component="span" sx={{ color: "#2D6AE3" }}>
                Сон
              </Box>{" "}
              - это физиологическое состояние, которое повторяется регулярно, каждый день. Он помогает организму отдохнуть, набраться сил, восстановить иммунитет.
            </Typography>
            <Typography sx={{ color: "#6B6B6B", lineHeight: 1.6, mt: 2.5 }}>
              Ухудшение качества сна всегда сказывается на самочувствии. Хронические нарушения сна отражаются на здоровье центральной нервной системы.
            </Typography>
            <Box sx={{ mt: "auto", pt: 4, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
              <Button startIcon={<ArrowBackIosNewRoundedIcon />} variant="text" sx={{ textTransform: "none", color: "#2D6AE3" }}>
                Назад
              </Button>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#000",
                  color: "#fff",
                  borderRadius: "12px",
                  textTransform: "none",
                  boxShadow: "none",
                  px: 2.5,
                  py: 1,
                  "&:hover": { bgcolor: "#161616", boxShadow: "none" },
                }}
              >
                Завершить заполнение данных
              </Button>
            </Box>
          </SoftCard>
        </Box>
      </Box>
    </Box>
  );
}
