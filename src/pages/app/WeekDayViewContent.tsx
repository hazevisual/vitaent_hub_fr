import { Box, Button, Divider, Typography } from "@mui/material";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import SoftCard from "@/components/ui/SoftCard";

const sleepIntervals = [
  { title: "Первый интервал сна", start: "01:15", end: "08:00" },
  { title: "Второй интервал сна", start: "15:00", end: "16:00" },
] as const;

const attributes = [
  { label: "Сон", status: "Заполнено", active: true },
  { label: "Прием пищи", status: "Не заполнено", active: false },
  { label: "Соц. активность", status: "Не заполнено", active: false },
  { label: "Подвижность", status: "Не заполнено", active: false },
] as const;

export default function WeekDayViewContent() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 2, md: 3 }, minWidth: 0 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr)",
          gap: { xs: 2, md: 3 },
          minWidth: 0,
          "@media (min-width:1280px)": {
            gridTemplateColumns: "minmax(300px, 1fr) minmax(360px, 1.2fr) minmax(300px, 1fr)",
          },
        }}
      >
        <SoftCard title="Расписание сна" sx={{ minWidth: 0 }} contentSx={{ gap: 3, minWidth: 0 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {sleepIntervals.map((interval, index) => (
              <Box key={interval.title}>
                <Typography sx={{ fontSize: "1rem", fontWeight: 600, color: "#171717", mb: 1.5 }}>
                  {interval.title}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, color: "#2D6AE3", mb: 2, flexWrap: "wrap" }}>
                  <AccessTimeRoundedIcon sx={{ fontSize: 20 }} />
                  <Typography sx={{ color: "#2D6AE3", fontWeight: 500 }}>{interval.start}</Typography>
                  <Typography sx={{ color: "#C9C9CB" }}>—</Typography>
                  <AccessTimeRoundedIcon sx={{ fontSize: 20 }} />
                  <Typography sx={{ color: "#2D6AE3", fontWeight: 500 }}>{interval.end}</Typography>
                </Box>
                {index < sleepIntervals.length - 1 && <Divider sx={{ borderColor: "#E5E5E7" }} />}
              </Box>
            ))}
          </Box>

          <Button
            variant="outlined"
            sx={{
              alignSelf: "flex-start",
              borderRadius: "12px",
              textTransform: "none",
              borderColor: "#2D6AE3",
              color: "#2D6AE3",
              px: 2,
              py: 1,
            }}
          >
            Добавить временной слот
          </Button>

          <Box
            sx={{
              p: { xs: 2, md: 3 },
              borderRadius: "12px",
              border: "1px solid #C9C9CB",
              bgcolor: "#F5F5F7",
              display: "flex",
              flexDirection: "column",
              gap: 1,
              minWidth: 0,
            }}
          >
            <Typography sx={{ color: "#171717", fontWeight: 600 }}>Качество сна</Typography>
            <Typography sx={{ color: "#171717", fontWeight: 500 }}>Оценка за ночь</Typography>
            <Typography sx={{ color: "#6B7280" }}>Плейсхолдер: 7 ч 20 мин сна, 1 пробуждение.</Typography>
            <Typography sx={{ color: "#6B7280" }}>
              Плейсхолдер: режим сна стабильный, рекомендуется сохранить текущее время отхода ко сну.
            </Typography>
          </Box>
        </SoftCard>

        <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 2, md: 3 }, minWidth: 0 }}>
          <Typography sx={{ textAlign: "center", fontSize: "1rem", fontWeight: 500, color: "#6B7280" }}>
            Атрибуты
          </Typography>
          <SoftCard sx={{ minWidth: 0 }} contentSx={{ minWidth: 0 }}>
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: { xs: 2, md: 3 }, minWidth: 0 }}>
              {attributes.map((item) => (
                <Box
                  key={item.label}
                  sx={{
                    borderRadius: "12px",
                    border: "1px solid #C9C9CB",
                    p: { xs: 2, md: 3 },
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: { xs: 180, md: 220 },
                    minWidth: 0,
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: 72, md: 88 },
                      height: { xs: 72, md: 88 },
                      borderRadius: "16px",
                      border: "1px solid #C9C9CB",
                      bgcolor: item.active ? "#171717" : "#F5F5F7",
                    }}
                  />
                  <Typography sx={{ color: "#171717", fontWeight: 500, textAlign: "center" }}>{item.label}</Typography>
                  <Typography sx={{ color: item.active ? "#2D6AE3" : "#6B7280", textAlign: "center" }}>{item.status}</Typography>
                </Box>
              ))}
            </Box>
          </SoftCard>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 2, md: 3 }, minWidth: 0 }}>
          <Typography sx={{ textAlign: "center", fontSize: "1rem", fontWeight: 500, color: "#6B7280" }}>
            Информация
          </Typography>
          <SoftCard sx={{ minWidth: 0, height: "100%" }} contentSx={{ minWidth: 0, height: "100%", gap: 2 }}>
            <Typography sx={{ color: "#6B7280", lineHeight: 1.6 }}>
              <Box component="span" sx={{ color: "#2D6AE3" }}>
                Сон
              </Box>{" "}
              — это физиологическое состояние, которое регулярно повторяется каждый день. Оно помогает организму
              восстановиться, отдохнуть и поддерживать устойчивую работу нервной системы.
            </Typography>
            <Typography sx={{ color: "#6B7280", lineHeight: 1.6 }}>
              Ухудшение качества сна влияет на самочувствие, концентрацию и общий эмоциональный фон. Регулярное
              отслеживание помогает заметить изменения раньше.
            </Typography>
            <Box sx={{ mt: "auto", pt: 3, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
              <Button startIcon={<ArrowBackIosNewRoundedIcon />} variant="text" sx={{ textTransform: "none", color: "#2D6AE3" }}>
                Назад
              </Button>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#171717",
                  color: "#FFFFFF",
                  borderRadius: "12px",
                  textTransform: "none",
                  boxShadow: "none",
                  px: 3,
                  py: 1,
                  "&:hover": { bgcolor: "#222222", boxShadow: "none" },
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
