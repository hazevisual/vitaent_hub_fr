import { Alert, Box, CircularProgress, Stack, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import PageContainer from "@/components/ui/PageContainer";
import SoftCard from "@/components/ui/SoftCard";
import { api } from "@/api/client";

type AdminContextResponse = {
  tenantId?: string | null;
  tenantSlug?: string | null;
  membershipId?: string | null;
  roles?: string[];
  isSystemAdmin?: boolean;
};

export default function AdminContextPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin-context"],
    queryFn: async () => {
      const response = await api.get<AdminContextResponse>("/api/admin/context");
      return response.data;
    },
  });

  return (
    <PageContainer>
      <SoftCard title="Контекст администратора" subtitle="Данные о клинике и ролях, определенных для текущей сессии.">
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress size={24} />
          </Box>
        ) : null}

        {isError ? (
          <Alert severity="error">
            {error instanceof Error ? error.message : "Не удалось загрузить контекст администратора."}
          </Alert>
        ) : null}

        {!isLoading && !isError && data ? (
          <Stack spacing={2}>
            <Box>
              <Typography variant="body2" color="text.secondary">Slug клиники</Typography>
              <Typography variant="body1">{data.tenantSlug ?? "Не определен"}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">ID клиники</Typography>
              <Typography variant="body1" sx={{ overflowWrap: "break-word" }}>
                {data.tenantId ?? "Не определен"}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">ID участия</Typography>
              <Typography variant="body1" sx={{ overflowWrap: "break-word" }}>
                {data.membershipId ?? "Не определен"}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Роли</Typography>
              <Typography variant="body1">
                {(data.roles ?? []).length > 0 ? (data.roles ?? []).join(", ") : "Роли отсутствуют"}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Системный администратор</Typography>
              <Typography variant="body1">{data.isSystemAdmin ? "Да" : "Нет"}</Typography>
            </Box>
          </Stack>
        ) : null}
      </SoftCard>
    </PageContainer>
  );
}
