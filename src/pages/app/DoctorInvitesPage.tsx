import * as React from "react";
import { Alert, Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import PageContainer from "@/components/ui/PageContainer";
import SoftCard from "@/components/ui/SoftCard";
import { createDoctorInvite, getDoctorInvites, type DoctorInviteCreateResponse, type DoctorInviteListItem } from "@/api/doctorInvites";

const inviteStatusLabels: Record<string, string> = {
  active: "Активен",
  used: "Использован",
  revoked: "Отозван",
  expired: "Просрочен",
};

function formatDateTime(value?: string | null) {
  if (!value) {
    return "Не указано";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getInviteStatusLabel(status: DoctorInviteListItem["status"]) {
  return inviteStatusLabels[status] ?? "Неизвестно";
}

export default function DoctorInvitesPage() {
  const queryClient = useQueryClient();
  const [lastGeneratedInvite, setLastGeneratedInvite] = React.useState<DoctorInviteCreateResponse | null>(null);
  const [copyMessage, setCopyMessage] = React.useState("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["doctor-invites"],
    queryFn: getDoctorInvites,
  });

  const inviteMutation = useMutation({
    mutationFn: createDoctorInvite,
    onSuccess: async (result) => {
      setLastGeneratedInvite(result);
      setCopyMessage("");
      await queryClient.invalidateQueries({ queryKey: ["doctor-invites"] });
    },
  });

  async function handleCopyCode() {
    if (!lastGeneratedInvite?.code || !navigator.clipboard) {
      return;
    }

    try {
      await navigator.clipboard.writeText(lastGeneratedInvite.code);
      setCopyMessage("Код скопирован.");
    } catch {
      setCopyMessage("Не удалось скопировать код.");
    }
  }

  return (
    <PageContainer>
      <Stack spacing={3} sx={{ minWidth: 0 }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: "text.primary", mb: 1 }}>
            Коды приглашения пациента
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", maxWidth: 760 }}>
            Сгенерируйте одноразовый код приглашения для пациента вашей клиники. Пациент сможет зарегистрироваться только по этому коду.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", xl: "minmax(0, 1.1fr) minmax(0, 0.9fr)" },
            gap: 3,
            minWidth: 0,
          }}
        >
          <SoftCard
            title="Создать новый код"
            subtitle="Код привязан к текущей клинике и по умолчанию действует 30 дней."
            sx={{ minWidth: 0 }}
            headerAction={
              <Button
                variant="contained"
                startIcon={<AddRoundedIcon />}
                onClick={() => inviteMutation.mutate()}
                disabled={inviteMutation.isPending}
                sx={{ textTransform: "none", flexShrink: 0 }}
              >
                {inviteMutation.isPending ? "Генерация..." : "Сгенерировать код приглашения"}
              </Button>
            }
          >
            <Stack spacing={2} sx={{ minWidth: 0 }}>
              {inviteMutation.isError ? (
                <Alert severity="error">
                  {inviteMutation.error instanceof Error ? inviteMutation.error.message : "Не удалось сгенерировать код приглашения."}
                </Alert>
              ) : null}

              {lastGeneratedInvite ? (
                <Box
                  sx={{
                    border: "1px solid #E5E5E7",
                    borderRadius: "12px",
                    p: 3,
                    backgroundColor: "#F9F9FA",
                    minWidth: 0,
                    overflow: "hidden",
                  }}
                >
                  <Stack spacing={2} sx={{ minWidth: 0 }}>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
                        Сгенерированный код
                      </Typography>
                      <Typography
                        variant="h4"
                        sx={{
                          fontSize: { xs: "1.5rem", md: "1.75rem" },
                          fontWeight: 700,
                          letterSpacing: "0.08em",
                          color: "text.primary",
                          overflowWrap: "break-word",
                        }}
                      >
                        {lastGeneratedInvite.code}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
                        Действует до
                      </Typography>
                      <Typography variant="body1">{formatDateTime(lastGeneratedInvite.expiresAt)}</Typography>
                    </Box>

                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", minWidth: 0 }}>
                      <Button
                        variant="outlined"
                        startIcon={<ContentCopyRoundedIcon />}
                        onClick={handleCopyCode}
                        disabled={!lastGeneratedInvite?.code}
                        sx={{ textTransform: "none" }}
                      >
                        Копировать код
                      </Button>
                      {copyMessage ? (
                        <Typography variant="body2" sx={{ color: "text.secondary", alignSelf: "center" }}>
                          {copyMessage}
                        </Typography>
                      ) : null}
                    </Box>
                  </Stack>
                </Box>
              ) : (
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  После генерации код появится здесь. Передайте его пациенту для регистрации.
                </Typography>
              )}
            </Stack>
          </SoftCard>

          <SoftCard title="Последние коды" subtitle="Только коды, созданные текущим врачом." sx={{ minWidth: 0 }}>
            {isLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress size={24} />
              </Box>
            ) : null}

            {isError ? (
              <Alert severity="error">
                {error instanceof Error ? error.message : "Не удалось загрузить коды приглашения."}
              </Alert>
            ) : null}

            {!isLoading && !isError ? (
              data && data.length > 0 ? (
                <Stack spacing={2} sx={{ minWidth: 0 }}>
                  {data.map((invite) => (
                    <Box
                      key={`${invite.code}-${invite.createdAt}`}
                      sx={{
                        border: "1px solid #E5E5E7",
                        borderRadius: "12px",
                        p: 2,
                        minWidth: 0,
                        overflow: "hidden",
                      }}
                    >
                      <Stack spacing={1} sx={{ minWidth: 0 }}>
                        <Typography variant="body1" sx={{ fontWeight: 600, overflowWrap: "break-word" }}>
                          {invite.code}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          Статус: {getInviteStatusLabel(invite.status)}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          Создан: {formatDateTime(invite.createdAt)}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          Действует до: {formatDateTime(invite.expiresAt)}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          Использован: {invite.usedAt ? formatDateTime(invite.usedAt) : "Нет"}
                        </Typography>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Вы еще не создавали коды приглашения.
                </Typography>
              )
            ) : null}
          </SoftCard>
        </Box>
      </Stack>
    </PageContainer>
  );
}
