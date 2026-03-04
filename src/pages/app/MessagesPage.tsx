import * as React from "react";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Collapse,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import PushPinRoundedIcon from "@mui/icons-material/PushPinRounded";
import PageContainer from "@/components/ui/PageContainer";
import SoftCard from "@/components/ui/SoftCard";

const doctors = [
  {
    id: "d1",
    name: "Ирина Смирнова",
    specialty: "Гастроэнтеролог",
    avatar: "ИС",
    experienceYears: 12,
    credentials: ["Доктор медицинских наук", "Высшая категория", "Член РГА"],
    hasUnread: true,
  },
  {
    id: "d2",
    name: "Алексей Никифоров",
    specialty: "Кардиолог",
    avatar: "АН",
    experienceYears: 9,
    credentials: ["Кандидат медицинских наук", "Первая категория"],
  },
  {
    id: "d3",
    name: "Мария Левина",
    specialty: "Эндокринолог",
    avatar: "МЛ",
    experienceYears: 14,
    credentials: ["Доктор медицинских наук", "Высшая категория", "Член РАЭ"],
    hasUnread: true,
  },
];

const initialMessages = [
  {
    id: "m1",
    doctorId: "d1",
    author: "Ирина Смирнова",
    text: "Здравствуйте. Как вы себя чувствуете после последнего приема?",
    time: "09:12",
    fromDoctor: true,
  },
  {
    id: "m2",
    doctorId: "d1",
    author: "Вы",
    text: "Доброе утро. Стало лучше, но после еды иногда сохраняется дискомфорт.",
    time: "09:16",
    fromDoctor: false,
  },
  {
    id: "m3",
    doctorId: "d1",
    author: "Ирина Смирнова",
    text: "Поняла. Продолжайте диету и напишите, если симптом усилится.",
    time: "09:22",
    fromDoctor: true,
  },
];

export default function MessagesPage() {
  const [activeDoctorId, setActiveDoctorId] = React.useState(doctors[0].id);
  const [draft, setDraft] = React.useState("");
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [messages, setMessages] = React.useState(initialMessages);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (searchOpen) {
      searchInputRef.current?.focus();
      return;
    }
    setSearchQuery("");
  }, [searchOpen]);

  const activeDoctor = React.useMemo(() => doctors.find((doctor) => doctor.id === activeDoctorId) ?? doctors[0], [activeDoctorId]);
  const activeMessages = React.useMemo(() => messages.filter((message) => message.doctorId === activeDoctorId), [activeDoctorId, messages]);

  const onSendMessage = () => {
    const text = draft.trim();
    if (!text) return;
    const now = new Date();
    const time = now.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
    setMessages((prev) => [...prev, { id: `local-${Date.now()}`, doctorId: activeDoctorId, author: "Вы", text, time, fromDoctor: false }]);
    setDraft("");
  };

  return (
    <PageContainer>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr)",
          gap: { xs: 2, md: 3 },
          minWidth: 0,
          "@media (min-width:1200px)": {
            gridTemplateColumns: "minmax(0, 2.2fr) minmax(320px, 0.9fr)",
          },
        }}
      >
        <SoftCard sx={{ minHeight: { xs: 620, lg: 700, xl: 740 }, minWidth: 0 }} contentSx={{ p: 0, minWidth: 0, height: "100%" }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(240px, 0.95fr) minmax(0, 2.05fr)" },
              minHeight: "100%",
              minWidth: 0,
            }}
          >
            <Box sx={{ borderRight: { md: "1px solid #E5E5E7" }, borderBottom: { xs: "1px solid #E5E5E7", md: "none" }, minWidth: 0 }}>
              <Box sx={{ px: { xs: 2, md: 3 }, py: { xs: 2, md: 3 } }}>
                <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600 }}>
                  Диалоги с врачами
                </Typography>
              </Box>
              <List disablePadding sx={{ px: { xs: 2, md: 2 }, pb: { xs: 2, md: 2 }, minWidth: 0 }}>
                {doctors.map((doctor) => {
                  const isActive = doctor.id === activeDoctorId;
                  return (
                    <ListItemButton
                      key={doctor.id}
                      onClick={() => setActiveDoctorId(doctor.id)}
                      sx={{
                        borderRadius: "12px",
                        mb: 1,
                        px: 2,
                        py: 1.5,
                        border: "1px solid",
                        borderColor: isActive ? "#C9C9CB" : "transparent",
                        bgcolor: isActive ? "#F5F5F7" : "transparent",
                        "&:hover": { bgcolor: "#F5F5F7" },
                        gap: 1.5,
                        minWidth: 0,
                      }}
                    >
                      <Badge variant="dot" color="primary" overlap="circular" invisible={!doctor.hasUnread} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
                        <Avatar sx={{ width: 36, height: 36, fontSize: 12, bgcolor: "#E8EEF9", color: "#3B4E6D" }}>
                          {doctor.avatar}
                        </Avatar>
                      </Badge>
                      <ListItemText
                        primary={doctor.name}
                        secondary={doctor.specialty}
                        primaryTypographyProps={{ fontSize: 14, fontWeight: 600, color: "text.primary", noWrap: true }}
                        secondaryTypographyProps={{ fontSize: 12, color: "text.secondary", noWrap: true }}
                      />
                    </ListItemButton>
                  );
                })}
              </List>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", minWidth: 0, minHeight: 0 }}>
              <Box sx={{ px: { xs: 2, md: 3 }, py: { xs: 2, md: 3 }, borderBottom: "1px solid #E5E5E7" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ minWidth: 0, flex: 1 }}>
                    <Avatar sx={{ bgcolor: "#E8EEF9", color: "#3B4E6D" }}>{activeDoctor.avatar}</Avatar>
                    <Typography variant="h6" sx={{ fontSize: "1rem", fontWeight: 600, minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {activeDoctor.name}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ flexShrink: 0, flexWrap: "wrap" }}>
                    <IconButton size="small" aria-label="Открыть поиск по сообщениям" onClick={() => setSearchOpen((prev) => !prev)}>
                      <SearchRoundedIcon fontSize="small" />
                    </IconButton>
                    <Button size="small" variant="outlined" startIcon={<PushPinRoundedIcon sx={{ fontSize: 16 }} />} sx={{ whiteSpace: "nowrap", flexShrink: 0, textTransform: "none" }}>
                      Закрепленные сообщения
                    </Button>
                  </Stack>
                </Box>

                <Collapse in={searchOpen} timeout="auto" unmountOnExit>
                  <Box sx={{ mt: 2 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <TextField
                        inputRef={searchInputRef}
                        fullWidth
                        size="small"
                        placeholder="Поиск по истории сообщений"
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                      />
                      <IconButton size="small" aria-label="Закрыть поиск" onClick={() => setSearchOpen(false)}>
                        <CloseRoundedIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Box>
                </Collapse>
              </Box>

              <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto", px: { xs: 2, md: 3 }, py: { xs: 2, md: 3 }, minWidth: 0 }}>
                <Stack spacing={2}>
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Typography variant="caption" sx={{ px: 1.5, py: 0.5, borderRadius: "999px", bgcolor: "#F5F5F7", border: "1px solid #C9C9CB", color: "text.secondary" }}>
                      24 января
                    </Typography>
                  </Box>
                  {activeMessages.map((message) => (
                    <Box key={message.id} sx={{ display: "flex", justifyContent: message.fromDoctor ? "flex-start" : "flex-end", minWidth: 0 }}>
                      <Box sx={{ maxWidth: { xs: "92%", md: "78%" }, borderRadius: "12px", px: 2, py: 1.5, bgcolor: message.fromDoctor ? "#FFFFFF" : "#F5F5F7", border: "1px solid #E5E5E7", minWidth: 0 }}>
                        <Typography variant="caption" sx={{ display: "block", color: "text.secondary", fontWeight: 600, mb: 1 }}>
                          {message.author}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.primary", lineHeight: 1.5, overflowWrap: "anywhere" }}>
                          {message.text}
                        </Typography>
                        <Typography variant="caption" sx={{ display: "block", textAlign: "right", color: "text.secondary", mt: 1 }}>
                          {message.time}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Box>

              <Divider />
              <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: "#FFFFFF" }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
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
                  <IconButton color="primary" onClick={onSendMessage} aria-label="Отправить сообщение" sx={{ flexShrink: 0 }}>
                    <SendRoundedIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Box>
            </Box>
          </Box>
        </SoftCard>

        <SoftCard title="Профиль врача" sx={{ minHeight: { xs: 220, lg: 280 }, alignSelf: "start", minWidth: 0 }}>
          <Stack spacing={3} alignItems="center" sx={{ textAlign: "center", mt: 1, minWidth: 0 }}>
            <Avatar sx={{ width: 92, height: 92, fontSize: 30, bgcolor: "#E8EEF9", color: "#3B4E6D" }}>{activeDoctor.avatar}</Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h6" sx={{ fontSize: "1.05rem", fontWeight: 600 }}>
                {activeDoctor.name}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
                {activeDoctor.specialty}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
                Стаж: {activeDoctor.experienceYears} лет
              </Typography>
              <Stack spacing={0.5} sx={{ mt: 2 }}>
                {activeDoctor.credentials.map((credential) => (
                  <Typography key={credential} variant="caption" sx={{ color: "text.secondary" }}>
                    {credential}
                  </Typography>
                ))}
              </Stack>
            </Box>
            <Box sx={{ width: "100%", maxWidth: 300, aspectRatio: "16 / 10", borderRadius: "12px", border: "1px solid #C9C9CB", bgcolor: "#F5F5F7", display: "flex", alignItems: "center", justifyContent: "center", px: 2 }}>
              <Typography variant="body2" sx={{ color: "text.secondary", textAlign: "center" }}>
                Фото / сертификаты
              </Typography>
            </Box>
          </Stack>
        </SoftCard>
      </Box>
    </PageContainer>
  );
}
