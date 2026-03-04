import { Box, Stack, Typography } from "@mui/material";
import PageContainer from "@/components/ui/PageContainer";
import SoftCard from "@/components/ui/SoftCard";

type SectionPlaceholderPageProps = {
  title: string;
  summary: string;
  primaryPoints: string[];
  secondaryTitle: string;
  secondaryPoints: string[];
};

export default function SectionPlaceholderPage({
  title,
  summary,
  primaryPoints,
  secondaryTitle,
  secondaryPoints,
}: SectionPlaceholderPageProps) {
  return (
    <PageContainer>
      <Stack spacing={{ xs: 2, md: 3 }} sx={{ minWidth: 0 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, color: "text.primary", mb: 1 }}>
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", maxWidth: 720 }}>
            {summary}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", xl: "2fr 1fr" },
            gap: { xs: 2, md: 3 },
            minWidth: 0,
          }}
        >
          <SoftCard title="Текущий объем" subtitle="Временный экран маршрута и оболочки" sx={{ minWidth: 0 }}>
            <Stack spacing={1.5}>
              {primaryPoints.map((point) => (
                <Typography key={point} variant="body2" sx={{ color: "text.primary" }}>
                  {point}
                </Typography>
              ))}
            </Stack>
          </SoftCard>

          <SoftCard title={secondaryTitle} sx={{ minWidth: 0 }}>
            <Stack spacing={1.5}>
              {secondaryPoints.map((point) => (
                <Typography key={point} variant="body2" sx={{ color: "text.secondary" }}>
                  {point}
                </Typography>
              ))}
            </Stack>
          </SoftCard>
        </Box>
      </Stack>
    </PageContainer>
  );
}
