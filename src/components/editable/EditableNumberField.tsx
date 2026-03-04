import { Box, Stack, TextField, Typography } from "@mui/material";

type EditableNumberFieldProps = {
  label: string;
  value: number;
  isEditing: boolean;
  isSaving?: boolean;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
};

export default function EditableNumberField({
  label,
  value,
  isEditing,
  isSaving = false,
  onChange,
  min,
  max,
}: EditableNumberFieldProps) {
  return (
    <Stack spacing={1} sx={{ minWidth: 0 }}>
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        {label}
      </Typography>

      {isEditing ? (
        <TextField
          type="number"
          value={Number.isFinite(value) ? value : 0}
          onChange={(event) => {
            const raw = event.target.value;
            const parsed = Number.parseInt(raw, 10);
            if (Number.isFinite(parsed)) {
              onChange(parsed);
              return;
            }

            onChange(0);
          }}
          size="small"
          fullWidth
          disabled={isSaving}
          inputProps={{ min, max, step: 1 }}
        />
      ) : (
        <Box
          sx={{
            minHeight: 40,
            border: "1px solid #E5E5E7",
            borderRadius: "12px",
            px: 1.5,
            py: 1,
            bgcolor: "#FAFAFB",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography variant="body2" sx={{ color: "text.primary" }}>
            {value}
          </Typography>
        </Box>
      )}
    </Stack>
  );
}
