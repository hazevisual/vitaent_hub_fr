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
    <Card {...cardProps}>
      <CardContent
        sx={{
          p: { xs: 2, sm: 2.5, md: 3.25 },
          "&:last-child": { pb: { xs: 2, sm: 2.5, md: 3.25 } },
          ...contentSx,
        }}
      >
        {(title || subtitle || headerAction) && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 1.5,
              mb: 2.2,
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              {title && (
                <Typography variant="h5" sx={{ fontSize: { xs: "1rem", md: "1.1rem" }, color: "text.primary" }}>
                  {title}
                </Typography>
              )}
              {subtitle && <Typography variant="body2">{subtitle}</Typography>}
            </Box>
            {headerAction}
          </Box>
        )}
        {children}
      </CardContent>
    </Card>
  );
}
