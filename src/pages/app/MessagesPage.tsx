import * as React from "react";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import PushPinRoundedIcon from "@mui/icons-material/PushPinRounded";
import PageContainer from "@/components/ui/PageContainer";
import SoftCard from "@/components/ui/SoftCard";

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
  hasUnread?: boolean;
};

type Message = {
  id: string;
  doctorId: string;
  author: string;
  text: string;
  time: string;
  fromDoctor: boolean;
  date: string;
};

const doctors: Doctor[] = [
  { id: "d1", name: "Ирина Смирнова", specialty: "Гастроэнтеролог", avatar: "ИС", hasUnread: true },
  { id: "d2", name: "Алексей Никифоров", specialty: "Кардиолог", avatar: "АН" },
  { id: "d3", name: "Мария Левина", specialty: "Эндокринолог", avatar: "МЛ", hasUnread: true },
  { id: "d4", name: "Дмитрий Орлов", specialty: "Невролог", avatar: "ДО" },
];

const initialMessages: Message[] = [
  {
    id: "m1",
    doctorId: "d1",
    author: "Ирина Смирнова",
    text: "Здравствуйте. Как вы себя чувствуете после последнего приема?",
    time: "09:12",
    fromDoctor: true,
    date: "24 января",
  },
  {
    id: "m2",
    doctorId: "d1",
    author: "Вы",
    text: "Доброе утро. Стало лучше, но после еды иногда сохраняется дискомфорт.",
    time: "09:16",
    fromDoctor: false,
    date: "24 января",
  },
  {
    id: "m3",
    doctorId: "d1",
    author: "Ирина Смирнова",
    text: "Поняла. Продолжайте диету и напишите, если симптом усилится.",
    time: "09:22",
    fromDoctor: true,
    date: "24 января",
  },
  {
    id: "m4",
    doctorId: "d2",
    author: "Алексей Никифоров",
    text: "Не забудьте измерять давление утром и вечером.",
    time: "11:05",
    fromDoctor: true,
    date: "23 января",
  },
  {
    id: "m5",
    doctorId: "d3",
    author: "Мария Левина",
    text: "Подготовьте, пожалуйста, результаты анализов к следующей встрече.",
    time: "13:50",
    fromDoctor: true,
    date: "22 января",
  },
];

const CONTENT_MAX_WIDTH = 1560;

export default function MessagesPage() {
  const [activeDoctorId, setActiveDoctorId] = React.useState(doctors[0].id);
  const [draft, setDraft] = React.useState("");
  const [messages, setMessages] = React.useState(initialMessages);

  const activeDoctor = React.useMemo(
    () => doctors.find((doctor) => doctor.id === activeDoctorId) ?? doctors[0],
    [activeDoctorId]
  );

  const activeMessages = React.useMemo(
    () => messages.filter((message) => message.doctorId === activeDoctorId),
    [activeDoctorId, messages]
  );

  const onSendMessage = () => {
    const text = draft.trim();
    if (!text) {
      return;
    }

    const now = new Date();
    const time = now.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });

    setMessages((prev) => [
      ...prev,
      {
        id: `local-${Date.now()}`,
        doctorId: activeDoctorId,
        author: "Вы",
        text,
        time,
        fromDoctor: false,
        date: "24 января",
      },
    ]);
    setDraft("");
  };

  return (
    <PageContainer>
      <Box sx={{ width: "100%", maxWidth: CONTENT_MAX_WIDTH, mx: "auto", minWidth: 0 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr)",
            gap: { xs: 2, sm: 3, lg: 4 },
            "@media (min-width:1200px)": {
              gridTemplateColumns: "minmax(0, 2.2fr) minmax(320px, 0.9fr)",
            },
          }}
        >
          <SoftCard sx={{ minHeight: { xs: 620, lg: 700, xl: 740 } }} contentSx={{ p: 0 }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "minmax(200px, 0.9fr) minmax(0, 2.1fr)",
                minHeight: "100%",
              }}
            >
              <Box sx={{ borderRight: "1px solid #E5E5E7", minWidth: 0 }}>
                <Box sx={{ px: { xs: 2, md: 3 }, py: 2.5 }}>
                  <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600 }}>
                    Диалоги с врачами
                  </Typography>
                </Box>
                <List disablePadding sx={{ px: 1.2, pb: 1.5 }}>
                  {doctors.map((doctor) => {
                    const isActive = doctor.id === activeDoctorId;
                    return (
                      <ListItemButton
                        key={doctor.id}
                        onClick={() => setActiveDoctorId(doctor.id)}
                        sx={{
                          borderRadius: "12px",
                          mb: 0.75,
                          px: 1.2,
                          py: 1,
                          border: "1px solid",
                          borderColor: isActive ? "#C9C9CB" : "transparent",
                          bgcolor: isActive ? "#F5F5F7" : "transparent",
                          "&:hover": { bgcolor: "#F5F5F7" },
                          gap: 1.25,
                        }}
                      >
                        <Badge
                          variant="dot"
                          color="primary"
                          overlap="circular"
                          invisible={!doctor.hasUnread}
                          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        >
                          <Avatar sx={{ width: 34, height: 34, fontSize: 12, bgcolor: "#E8EEF9", color: "#3B4E6D" }}>
                            {doctor.avatar}
                          </Avatar>
                        </Badge>
                        <ListItemText
                          primary={doctor.name}
                          secondary={doctor.specialty}
                          primaryTypographyProps={{ fontSize: 13.5, fontWeight: 600, color: "text.primary", noWrap: true }}
                          secondaryTypographyProps={{ fontSize: 12, color: "text.secondary", noWrap: true }}
                        />
                      </ListItemButton>
                    );
                  })}
                </List>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", minWidth: 0, minHeight: 0 }}>
                <Box sx={{ px: { xs: 2, md: 3 }, py: 2, borderBottom: "1px solid #E5E5E7" }}>
                  <Stack direction="row" alignItems="center" spacing={1.5} sx={{ minWidth: 0 }}>
                    <Avatar sx={{ bgcolor: "#E8EEF9", color: "#3B4E6D" }}>{activeDoctor.avatar}</Avatar>
                    <Typography variant="h6" sx={{ fontSize: "1rem", fontWeight: 600, minWidth: 0 }} noWrap>
                      {activeDoctor.name}
                    </Typography>
                    <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 1.2, minWidth: 0 }}>
                      <TextField
                        size="small"
                        placeholder="Поиск по истории сообщений"
                        sx={{ width: { xs: 180, md: 260 } }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchRoundedIcon fontSize="small" sx={{ color: "text.secondary" }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <Button size="small" variant="outlined" startIcon={<PushPinRoundedIcon sx={{ fontSize: 16 }} />}>
                        Закрепленные сообщения
                      </Button>
                    </Box>
                  </Stack>
                </Box>

                <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto", px: { xs: 2, md: 3 }, py: 2.5 }}>
                  <Stack spacing={1.5}>
                    <Box sx={{ display: "flex", justifyContent: "center", py: 0.5 }}>
                      <Typography
                        variant="caption"
                        sx={{ px: 1.5, py: 0.45, borderRadius: "999px", bgcolor: "#F5F5F7", border: "1px solid #C9C9CB", color: "text.secondary" }}
                      >
                        24 января
                      </Typography>
                    </Box>

                    {activeMessages.map((message) => (
                      <Box key={message.id} sx={{ display: "flex", justifyContent: message.fromDoctor ? "flex-end" : "flex-start" }}>
                        <Box
                          sx={{
                            maxWidth: "78%",
                            borderRadius: "12px",
                            px: 1.5,
                            py: 1.15,
                            bgcolor: message.fromDoctor ? "#FFFFFF" : "#F5F5F7",
                            border: "1px solid #E5E5E7",
                          }}
                        >
                          <Typography variant="caption" sx={{ display: "block", color: "text.secondary", fontWeight: 600, mb: 0.5 }}>
                            {message.author}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "text.primary", lineHeight: 1.5 }}>
                            {message.text}
                          </Typography>
                          <Typography variant="caption" sx={{ display: "block", textAlign: "right", color: "text.secondary", mt: 0.75 }}>
                            {message.time}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </Box>

                <Divider />
                <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: "#FFFFFF" }}>
                  <Stack direction="row" spacing={1.25} alignItems="center">
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Введите сообщение"
                      value={draft}
                      onChange={(event) => setDraft(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          onSendMessage();
                        }
                      }}
                    />
                    <IconButton color="primary" onClick={onSendMessage} aria-label="Отправить сообщение">
                      <SendRoundedIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Box>
              </Box>
            </Box>
          </SoftCard>

          <SoftCard title="Профиль врача" sx={{ minHeight: { xs: 220, lg: 280 }, alignSelf: "start" }}>
            <Stack spacing={2.5} alignItems="center" sx={{ textAlign: "center", mt: 0.5 }}>
              <Avatar sx={{ width: 92, height: 92, fontSize: 30, bgcolor: "#E8EEF9", color: "#3B4E6D" }}>{activeDoctor.avatar}</Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontSize: "1.05rem", fontWeight: 600 }}>
                  {activeDoctor.name}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
                  {activeDoctor.specialty}
                </Typography>
              </Box>
            </Stack>
          </SoftCard>
        </Box>
      </Box>
    </PageContainer>
  );
}
