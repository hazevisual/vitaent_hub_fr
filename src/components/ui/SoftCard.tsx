import { Box, Card, CardContent, Typography } from "@mui/material";
import type { CardProps } from "@mui/material";
import type { ReactNode } from "react";

type SoftCardProps = CardProps & {
  title?: string;
  subtitle?: string;
  headerAction?: ReactNode;
  contentSx?: CardProps["sx"];
};

export default function SoftCard({
  title,
  subtitle,
  headerAction,
  children,
  contentSx,
  ...cardProps
}: SoftCardProps) {
  return (
    <Card
      {...cardProps}
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--vitaent-surface-bg)",
        border: "1px solid var(--vitaent-border)",
        borderRadius: "25px",
        boxShadow: "none",
        overflow: "hidden",
        ...(cardProps.sx ?? {}),
      }}
    >
      <CardContent
        sx={{
          p: { xs: 2.5, md: 3 },
          "&:last-child": { pb: { xs: 2.5, md: 3 } },
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minWidth: 0,
          ...contentSx,
        }}
      >
        {(title || subtitle || headerAction) && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 2,
              mb: 2,
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              {title && (
                <Typography variant="h5" sx={{ color: "text.primary" }}>
                  {title}
                </Typography>
              )}
              {subtitle && (
                <Typography variant="body1" sx={{ mt: 0.75, color: "text.secondary" }}>
                  {subtitle}
                </Typography>
              )}
            </Box>
            {headerAction}
          </Box>
        )}
        {children}
      </CardContent>
    </Card>
  );
}
