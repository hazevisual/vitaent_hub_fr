import { Box, FormControl, MenuItem, Select, Stack, Typography } from "@mui/material";

type EditableSelectOption = {
  value: string;
  label: string;
};

type EditableSelectProps = {
  label: string;
  value: string;
  options: EditableSelectOption[];
  isEditing: boolean;
  isSaving?: boolean;
  onChange: (next: string) => void;
};

export default function EditableSelect({
  label,
  value,
  options,
  isEditing,
  isSaving = false,
  onChange,
}: EditableSelectProps) {
  const selectedLabel = options.find((option) => option.value === value)?.label ?? value;

  return (
    <Stack spacing={1} sx={{ minWidth: 0 }}>
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        {label}
      </Typography>

      {isEditing ? (
        <FormControl size="small" fullWidth disabled={isSaving}>
          <Select value={value} onChange={(event) => onChange(String(event.target.value))}>
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
          <Typography variant="body2" sx={{ color: "text.primary", overflowWrap: "anywhere" }}>
            {selectedLabel || "Не указано"}
          </Typography>
        </Box>
      )}
    </Stack>
  );
}
