import * as React from "react";
import { Box, Button, CircularProgress, IconButton, Stack, Typography } from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import SoftCard from "@/components/ui/SoftCard";

type EditableSoftCardProps = {
  title: string;
  subtitle?: string;
  mode: "view" | "edit";
  isSaving?: boolean;
  saveDisabled?: boolean;
  editDisabled?: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  children: React.ReactNode;
  sx?: Record<string, unknown>;
};

export default function EditableSoftCard({
  title,
  subtitle,
  mode,
  isSaving = false,
  saveDisabled = false,
  editDisabled = false,
  onEdit,
  onSave,
  onCancel,
  children,
  sx,
}: EditableSoftCardProps) {
  return (
    <SoftCard sx={sx} contentSx={{ p: 0, minHeight: 0 }}>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}>
        <Box
          sx={{
            px: { xs: 2.5, md: 3 },
            pt: { xs: 2.5, md: 3 },
            pb: 2,
            borderBottom: "1px solid var(--vitaent-border)",
            bgcolor: "var(--vitaent-surface-bg)",
            position: "sticky",
            top: 0,
            zIndex: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2, minWidth: 0 }}>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h5" sx={{ color: "text.primary" }}>
                {title}
              </Typography>
              {subtitle ? (
                <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.75 }}>
                  {subtitle}
                </Typography>
              ) : null}
            </Box>

            {mode === "view" ? (
              <IconButton
                onClick={onEdit}
                size="small"
                aria-label="Редактировать блок"
                disabled={editDisabled}
                sx={{ flexShrink: 0 }}
              >
                <EditRoundedIcon fontSize="small" />
              </IconButton>
            ) : (
              <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
                <Button onClick={onCancel} disabled={isSaving} variant="outlined" sx={{ textTransform: "none" }}>
                  Отмена
                </Button>
                <Button onClick={onSave} disabled={isSaving || saveDisabled} variant="contained" sx={{ textTransform: "none", minWidth: 112 }}>
                  {isSaving ? (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CircularProgress size={16} color="inherit" />
                      <span>Сохранение</span>
                    </Stack>
                  ) : (
                    "Сохранить"
                  )}
                </Button>
              </Stack>
            )}
          </Box>
        </Box>

        <Box
          sx={{
            px: { xs: 2.5, md: 3 },
            pt: 2,
            pb: { xs: 2.5, md: 3 },
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
          }}
        >
          {children}
        </Box>
      </Box>
    </SoftCard>
  );
}
