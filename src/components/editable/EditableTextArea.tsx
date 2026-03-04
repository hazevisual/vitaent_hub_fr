import { Box, Stack, TextField, Typography } from "@mui/material";

type EditableTextAreaProps = {
  label: string;
  value: string;
  isEditing: boolean;
  isSaving?: boolean;
  onChange: (next: string) => void;
  placeholder?: string;
  maxLength?: number;
  minRows?: number;
  maxViewHeight?: number;
};

export default function EditableTextArea({
  label,
  value,
  isEditing,
  isSaving = false,
  onChange,
  placeholder,
  maxLength,
  minRows = 4,
  maxViewHeight = 180,
}: EditableTextAreaProps) {
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
          multiline
          minRows={minRows}
          fullWidth
          disabled={isSaving}
          inputProps={{ maxLength }}
        />
      ) : (
        <Box
          sx={{
            minHeight: 120,
            maxHeight: maxViewHeight,
            overflowY: "auto",
            border: "1px solid #E5E5E7",
            borderRadius: "12px",
            px: 1.5,
            py: 1.25,
            bgcolor: "#FAFAFB",
          }}
        >
          <Typography variant="body2" sx={{ color: "text.primary", whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
            {value || "Не указано"}
          </Typography>
        </Box>
      )}
    </Stack>
  );
}
