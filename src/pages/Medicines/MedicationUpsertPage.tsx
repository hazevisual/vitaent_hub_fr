import * as React from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  createMedication,
  getPatientMedicine,
  updateMedication,
} from "@/api/medications";
import { Paths } from "@/paths";
import PageContainer from "@/components/ui/PageContainer";
import SoftCard from "@/components/ui/SoftCard";
import type {
  MedicationCreateRequest,
  MedicationForm,
  ProblemDetails,
  ValidationProblemDetails,
} from "@/types/Medication";

type FieldErrors = Record<string, string>;

const formOptions: MedicationForm[] = ["Таблетки", "Капсулы", "Сироп", "Спрей", "Мазь", "Инъекции", "Другое"];

function getProblemMessage(error: unknown, fallback: string) {
  if (!axios.isAxiosError(error)) {
    return fallback;
  }

  const problem = error.response?.data as ProblemDetails | undefined;
  return problem?.detail ?? problem?.title ?? fallback;
}

export default function MedicationUpsertPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const isEditMode = Boolean(id);

  const [name, setName] = React.useState("");
  const [form, setForm] = React.useState<MedicationForm | "">("");
  const [strength, setStrength] = React.useState("");
  const [note, setNote] = React.useState("");
  const [fieldErrors, setFieldErrors] = React.useState<FieldErrors>({});
  const [pageError, setPageError] = React.useState<string | null>(null);
  const [successOpen, setSuccessOpen] = React.useState(false);

  const medicationQuery = useQuery({
    queryKey: ["patient-medicine", id],
    queryFn: () => getPatientMedicine(id!),
    enabled: isEditMode,
  });

  React.useEffect(() => {
    if (!medicationQuery.data) {
      return;
    }

    setName(medicationQuery.data.name);
    setForm((medicationQuery.data.form as MedicationForm | null) ?? "");
    setStrength(medicationQuery.data.strength ?? "");
    setNote(medicationQuery.data.note ?? "");
  }, [medicationQuery.data]);

  const mutation = useMutation({
    mutationFn: async (payload: MedicationCreateRequest) => {
      if (isEditMode && id) {
        return updateMedication(id, payload);
      }

      return createMedication(payload);
    },
    onSuccess: async (savedMedicine) => {
      await queryClient.invalidateQueries({ queryKey: ["patient-medicines"] });
      if (id) {
        await queryClient.invalidateQueries({ queryKey: ["patient-medicine", id] });
      }

      setPageError(null);
      setFieldErrors({});
      setSuccessOpen(true);
      navigate(Paths.patientMedicinesEdit(savedMedicine.id), { replace: true });
    },
    onError: (error: unknown) => {
      if (!axios.isAxiosError(error)) {
        setPageError("Не удалось сохранить карточку лекарства. Повторите попытку.");
        return;
      }

      if (error.response?.status === 400) {
        const data = error.response.data as ValidationProblemDetails;
        const apiErrors: FieldErrors = {};
        Object.entries(data.errors ?? {}).forEach(([key, messages]) => {
          if (messages.length > 0) {
            apiErrors[key.toLowerCase()] = messages[0];
          }
        });
        setFieldErrors(apiErrors);
        setPageError(data.title ?? "Проверьте корректность заполнения полей.");
        return;
      }

      setPageError(getProblemMessage(error, "Не удалось сохранить карточку лекарства. Повторите попытку."));
    },
  });

  const getFieldError = (...keys: string[]) => {
    for (const key of keys) {
      const err = fieldErrors[key.toLowerCase()];
      if (err) {
        return err;
      }
    }

    return "";
  };

  const validate = () => {
    const nextErrors: FieldErrors = {};

    if (name.trim().length < 1) {
      nextErrors.name = "Введите название лекарства.";
    }

    if (name.trim().length > 256) {
      nextErrors.name = "Название лекарства не должно превышать 256 символов.";
    }

    if (strength.trim().length > 128) {
      nextErrors.strength = "Поле дозировки не должно превышать 128 символов.";
    }

    if ((form as string).trim().length > 128) {
      nextErrors.form = "Поле формы выпуска не должно превышать 128 символов.";
    }

    if (note.trim().length > 1024) {
      nextErrors.note = "Примечание не должно превышать 1024 символа.";
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const buildPayload = (): MedicationCreateRequest => ({
    name: name.trim(),
    form: form || undefined,
    strength: strength.trim() || undefined,
    note: note.trim() || undefined,
  });

  const onSubmit = () => {
    setPageError(null);
    if (!validate()) {
      return;
    }

    mutation.mutate(buildPayload());
  };

  const isBusy = mutation.isPending || medicationQuery.isLoading;

  return (
    <PageContainer>
      <Stack spacing={{ xs: 2, md: 3 }} sx={{ width: "100%", minWidth: 0 }}>
        <Box>
          <Typography variant="h4" sx={{ fontSize: { xs: "1.4rem", md: "1.7rem" }, fontWeight: 700 }}>
            {isEditMode ? "Лекарства / Редактировать" : "Лекарства / Добавить"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Заполните основные данные карточки препарата. После сохранения лекарство появится в вашем списке.
          </Typography>
        </Box>

        {medicationQuery.isError ? (
          <Alert severity="error">
            {getProblemMessage(medicationQuery.error, "Не удалось загрузить карточку лекарства.")}
          </Alert>
        ) : null}

        {pageError ? <Alert severity="error">{pageError}</Alert> : null}

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" }, gap: { xs: 2, md: 3 }, alignItems: "start", minWidth: 0 }}>
          <SoftCard
            title="Карточка лекарства"
            subtitle="Сохраните название, форму выпуска, дозировку и примечание."
            sx={{ minWidth: 0 }}
          >
            {medicationQuery.isLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                <CircularProgress size={24} />
              </Box>
            ) : (
              <Stack spacing={3} sx={{ height: "100%" }}>
                <Stack spacing={2}>
                  <TextField
                    label="Название *"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    error={Boolean(getFieldError("name"))}
                    helperText={getFieldError("name")}
                    fullWidth
                  />

                  <FormControl fullWidth error={Boolean(getFieldError("form"))}>
                    <InputLabel id="medication-form-label">Форма</InputLabel>
                    <Select
                      labelId="medication-form-label"
                      label="Форма"
                      value={form}
                      onChange={(event) => setForm(event.target.value as MedicationForm | "")}
                    >
                      <MenuItem value="">Не выбрано</MenuItem>
                      {formOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    label="Дозировка"
                    value={strength}
                    onChange={(event) => setStrength(event.target.value)}
                    error={Boolean(getFieldError("strength"))}
                    helperText={getFieldError("strength") || "Например: 500 мг"}
                    fullWidth
                  />

                  <TextField
                    label="Примечание"
                    multiline
                    minRows={4}
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    error={Boolean(getFieldError("note"))}
                    helperText={getFieldError("note") || "Например: После еды"}
                    fullWidth
                  />
                </Stack>

                <Stack direction="row" spacing={1.5} justifyContent="flex-end" sx={{ mt: "auto", pt: 1, flexWrap: "wrap" }}>
                  <Button variant="outlined" onClick={() => navigate(Paths.patientMedicines)} disabled={isBusy} sx={{ textTransform: "none" }}>
                    Назад
                  </Button>
                  <Button variant="contained" onClick={onSubmit} disabled={isBusy} sx={{ textTransform: "none" }}>
                    {mutation.isPending ? "Сохранение..." : "Сохранить"}
                  </Button>
                </Stack>
              </Stack>
            )}
          </SoftCard>

          <SoftCard title="Что сохранится" sx={{ minWidth: 0 }}>
            <Stack spacing={1.5}>
              <Typography variant="body2" color="text.secondary">
                • Название препарата.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Форма выпуска.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Дозировка в свободной форме.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Примечание для дальнейшего добавления в расписание.
              </Typography>
            </Stack>
          </SoftCard>
        </Box>
      </Stack>

      <Snackbar
        open={successOpen}
        autoHideDuration={2500}
        onClose={() => setSuccessOpen(false)}
        message="Карточка лекарства сохранена"
      />
    </PageContainer>
  );
}
