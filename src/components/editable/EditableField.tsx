import { Box, Stack, TextField, Typography } from "@mui/material";

type EditableFieldProps = {
  label: string;
  value: string;
  isEditing: boolean;
  isSaving?: boolean;
  onChange: (next: string) => void;
  placeholder?: string;
  maxLength?: number;
};

export default function EditableField({
  label,
  value,
  isEditing,
  isSaving = false,
  onChange,
  placeholder,
  maxLength,
}: EditableFieldProps) {
  return (
    <Stack spacing={1} sx={{ minWidth: 0 }}>
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        {label}
      </Typography>

      {isEditing ? (
        <TextField
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          size="small"
          fullWidth
          disabled={isSaving}
          inputProps={{ maxLength }}
        />
      ) : (
        <Box
          sx={{
            minHeight: 40,
            maxHeight: 96,
            overflowY: "auto",
            border: "1px solid #E5E5E7",
            borderRadius: "12px",
            px: 1.5,
            py: 1,
            bgcolor: "#FAFAFB",
          }}
        >
          <Typography variant="body2" sx={{ color: "text.primary", overflowWrap: "anywhere" }}>
            {value || "Не указано"}
          </Typography>
        </Box>
      )}
    </Stack>
  );
}
