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
        height: "100%",
        backgroundColor: "#FFFFFF",
        border: "1px solid #E5E5E7",
        borderRadius: "16px",
        boxShadow: "none",
        "@media (min-width:2000px)": {
          borderRadius: "16px",
        },
        ...(cardProps.sx ?? {}),
      }}
    >
      <CardContent
        sx={{
          p: { xs: 2, sm: 2.5, md: 3 },
          "&:last-child": { pb: { xs: 2, sm: 2.5, md: 3 } },
          "@media (min-width:2000px)": {
            p: { xs: 2.5, sm: 3, md: 3.75 },
            "&:last-child": { pb: { xs: 2.5, sm: 3, md: 3.75 } },
          },
          display: "flex",
          flexDirection: "column",
          flex: 1,
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
                <Typography
                  variant="h5"
                  sx={{ fontSize: { xs: "1rem", md: "1.06rem", lg: "1.12rem" }, fontWeight: 600, color: "text.primary" }}
                >
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
