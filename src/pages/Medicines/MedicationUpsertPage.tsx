import * as React from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { createMedication } from "@/api/medications";
import PageContainer from "@/components/ui/PageContainer";
import SoftCard from "@/components/ui/SoftCard";
import type {
  MedicationCreateRequest,
  MedicationDoseUnit,
  MedicationForm,
  MedicationScheduleType,
  ProblemDetails,
  ValidationProblemDetails,
} from "@/types/Medication";

type FieldErrors = Record<string, string>;

const formOptions: MedicationForm[] = ["Таблетки", "Капсулы", "Сироп", "Спрей", "Мазь", "Инъекции", "Другое"];
const doseUnitOptions: MedicationDoseUnit[] = ["мг", "мкг", "г", "мл", "капли", "таб", "капс", "впрыск", "другое"];
const reminderLeadOptions = [0, 5, 10, 15, 30, 60];
const weekdays = [
  { value: 1, label: "Пн" },
  { value: 2, label: "Вт" },
  { value: 3, label: "Ср" },
  { value: 4, label: "Чт" },
  { value: 5, label: "Пт" },
  { value: 6, label: "Сб" },
  { value: 7, label: "Вс" },
];

export default function MedicationUpsertPage() {
  const navigate = useNavigate();
  const [name, setName] = React.useState("");
  const [form, setForm] = React.useState<MedicationForm | "">("");
  const [doseAmount, setDoseAmount] = React.useState("");
  const [doseUnit, setDoseUnit] = React.useState<MedicationDoseUnit | "">("");
  const [notes, setNotes] = React.useState("");

  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [scheduleType, setScheduleType] = React.useState<MedicationScheduleType>("Daily");
  const [times, setTimes] = React.useState<string[]>([""]);
  const [weekdaysSelected, setWeekdaysSelected] = React.useState<number[]>([]);
  const [intervalDays, setIntervalDays] = React.useState("1");
  const [prnReason, setPrnReason] = React.useState("");

  const [reminderEnabled, setReminderEnabled] = React.useState(false);
  const [reminderLeadTime, setReminderLeadTime] = React.useState<number>(10);

  const [stockEnabled, setStockEnabled] = React.useState(false);
  const [currentStock, setCurrentStock] = React.useState("");
  const [lowStockThreshold, setLowStockThreshold] = React.useState("");

  const [fieldErrors, setFieldErrors] = React.useState<FieldErrors>({});
  const [pageError, setPageError] = React.useState<string | null>(null);
  const [successOpen, setSuccessOpen] = React.useState(false);

  const mutation = useMutation({
    mutationFn: createMedication,
    onSuccess: () => {
      setSuccessOpen(true);
      setPageError(null);
      setFieldErrors({});
    },
    onError: (error: unknown) => {
      if (!axios.isAxiosError(error)) {
        setPageError("Не удалось сохранить лекарство. Повторите попытку.");
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

      if (error.response?.status === 404) {
        const problem = error.response.data as ProblemDetails;
        setPageError(problem.detail ?? problem.title ?? "Эндпоинт создания лекарства не реализован на сервере.");
        return;
      }

      if (error.response?.status === 409) {
        const problem = error.response.data as ProblemDetails;
        setPageError(problem.detail ?? problem.title ?? "Операция недоступна.");
        return;
      }

      setPageError("Не удалось сохранить лекарство. Повторите попытку.");
    },
  });

  const updateTime = (index: number, value: string) => {
    setTimes((prev) => prev.map((item, idx) => (idx === index ? value : item)));
  };

  const addTime = () => {
    setTimes((prev) => [...prev, ""]);
  };

  const removeTime = (index: number) => {
    setTimes((prev) => (prev.length === 1 ? [""] : prev.filter((_, idx) => idx !== index)));
  };

  const toggleWeekday = (day: number) => {
    setWeekdaysSelected((prev) =>
      prev.includes(day) ? prev.filter((value) => value !== day) : [...prev, day].sort((a, b) => a - b)
    );
  };

  const getFieldError = (...keys: string[]) => {
    for (const key of keys) {
      const err = fieldErrors[key.toLowerCase()];
      if (err) return err;
    }
    return "";
  };

  const validate = (): boolean => {
    const nextErrors: FieldErrors = {};

    const trimmedName = name.trim();
    if (trimmedName.length < 2 || trimmedName.length > 80) {
      nextErrors.name = "Название обязательно: от 2 до 80 символов.";
    }

    const parsedDose = Number(doseAmount);
    if (!doseAmount || Number.isNaN(parsedDose) || parsedDose <= 0) {
      nextErrors.doseamount = "Доза за прием должна быть больше 0.";
    }

    if (doseAmount && !doseUnit) {
      nextErrors.doseunit = "Укажите единицу дозировки.";
    }

    if (!startDate) {
      nextErrors.startdate = "Укажите дату начала.";
    }

    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      nextErrors.enddate = "Дата окончания не может быть раньше даты начала.";
    }

    const validTimes = times.filter((value) => value.trim().length > 0);

    if (scheduleType !== "Prn" && validTimes.length === 0) {
      nextErrors.times = "Добавьте хотя бы одно время приема.";
    }

    if (scheduleType === "Weekly" && weekdaysSelected.length === 0) {
      nextErrors.weekdays = "Выберите хотя бы один день недели.";
    }

    if (scheduleType === "Interval") {
      const parsedInterval = Number(intervalDays);
      if (!Number.isInteger(parsedInterval) || parsedInterval < 1) {
        nextErrors.intervaldays = "Интервал должен быть целым числом не меньше 1.";
      }
    }

    const parsedStock = currentStock ? Number(currentStock) : null;
    const parsedThreshold = lowStockThreshold ? Number(lowStockThreshold) : null;

    if (stockEnabled) {
      if (parsedStock !== null && (!Number.isFinite(parsedStock) || parsedStock < 0)) {
        nextErrors.currentstock = "Остаток должен быть не меньше 0.";
      }

      if (parsedThreshold !== null && (!Number.isFinite(parsedThreshold) || parsedThreshold < 0)) {
        nextErrors.lowstockthreshold = "Порог должен быть не меньше 0.";
      }

      if (
        parsedStock !== null &&
        parsedThreshold !== null &&
        Number.isFinite(parsedStock) &&
        Number.isFinite(parsedThreshold) &&
        parsedThreshold > parsedStock
      ) {
        nextErrors.lowstockthreshold = "Порог не может быть больше текущего остатка.";
      }
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const buildPayload = (): MedicationCreateRequest => {
    const baseSchedule = { type: scheduleType };
    const cleanedTimes = times.filter((value) => value.trim().length > 0);

    return {
      name: name.trim(),
      form: form || undefined,
      doseAmount: Number(doseAmount),
      doseUnit: doseUnit as MedicationDoseUnit,
      notes: notes.trim() || undefined,
      startDate,
      endDate: endDate || undefined,
      isPrn: scheduleType === "Prn",
      schedule:
        scheduleType === "Weekly"
          ? { ...baseSchedule, times: cleanedTimes, weekdays: weekdaysSelected }
          : scheduleType === "Interval"
            ? { ...baseSchedule, times: cleanedTimes, intervalDays: Number(intervalDays) }
            : scheduleType === "Prn"
              ? { ...baseSchedule, prnReason: prnReason.trim() || undefined }
              : { ...baseSchedule, times: cleanedTimes },
      reminders: reminderEnabled
        ? {
            enabled: true,
            leadTimeMinutes: reminderLeadTime,
          }
        : {
            enabled: false,
          },
      stock: stockEnabled
        ? {
            enabled: true,
            currentStock: currentStock ? Number(currentStock) : undefined,
            lowStockThreshold: lowStockThreshold ? Number(lowStockThreshold) : undefined,
          }
        : {
            enabled: false,
          },
    };
  };

  const onSubmit = () => {
    setPageError(null);
    if (!validate()) return;
    mutation.mutate(buildPayload());
  };

  return (
    <PageContainer>
      <Stack spacing={3} sx={{ width: "100%" }}>
        <Box>
          <Typography variant="h4" sx={{ fontSize: { xs: "1.4rem", md: "1.7rem" }, fontWeight: 700 }}>
            Лекарства → Добавить
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Добавьте препарат и настройте расписание приема.
          </Typography>
        </Box>

        {pageError && <Alert severity="error">{pageError}</Alert>}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" },
            gap: 3,
            alignItems: "start",
          }}
        >
          <SoftCard title="Параметры лекарства" subtitle="Заполните карточку и настройте режим приема.">
            <Stack spacing={3.5} sx={{ height: "100%" }}>
              <Stack spacing={2}>
                <TextField
                  label="Название *"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  error={Boolean(getFieldError("name"))}
                  helperText={getFieldError("name")}
                  fullWidth
                />

                <FormControl fullWidth>
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

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField
                    label="Доза за прием *"
                    type="number"
                    inputProps={{ min: 0, step: "0.01" }}
                    value={doseAmount}
                    onChange={(event) => setDoseAmount(event.target.value)}
                    error={Boolean(getFieldError("doseamount", "dose"))}
                    helperText={getFieldError("doseamount", "dose")}
                    fullWidth
                  />
                  <FormControl fullWidth error={Boolean(getFieldError("doseunit"))}>
                    <InputLabel id="dose-unit-label">Единица *</InputLabel>
                    <Select
                      labelId="dose-unit-label"
                      label="Единица *"
                      value={doseUnit}
                      onChange={(event) => setDoseUnit(event.target.value as MedicationDoseUnit | "")}
                    >
                      {doseUnitOptions.map((unit) => (
                        <MenuItem key={unit} value={unit}>
                          {unit}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{getFieldError("doseunit")}</FormHelperText>
                  </FormControl>
                </Stack>

                <TextField
                  label="Заметки"
                  multiline
                  minRows={3}
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  fullWidth
                />
              </Stack>

              <Stack spacing={2}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "text.secondary" }}>
                  Расписание приема
                </Typography>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField
                    label="Дата начала *"
                    type="date"
                    value={startDate}
                    onChange={(event) => setStartDate(event.target.value)}
                    error={Boolean(getFieldError("startdate"))}
                    helperText={getFieldError("startdate")}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                  <TextField
                    label="Дата окончания"
                    type="date"
                    value={endDate}
                    onChange={(event) => setEndDate(event.target.value)}
                    error={Boolean(getFieldError("enddate"))}
                    helperText={getFieldError("enddate") || "Оставьте пустым для бессрочного приема."}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                </Stack>

                <ToggleButtonGroup
                  color="primary"
                  value={scheduleType}
                  exclusive
                  onChange={(_, value) => {
                    if (value) setScheduleType(value);
                  }}
                  sx={{ flexWrap: "wrap", justifyContent: "flex-start" }}
                >
                  <ToggleButton value="Daily">Каждый день</ToggleButton>
                  <ToggleButton value="Weekly">По дням недели</ToggleButton>
                  <ToggleButton value="Interval">Интервал</ToggleButton>
                  <ToggleButton value="Prn">PRN</ToggleButton>
                </ToggleButtonGroup>

                {scheduleType === "Weekly" && (
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Дни недели *
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {weekdays.map((day) => (
                        <Chip
                          key={day.value}
                          label={day.label}
                          color={weekdaysSelected.includes(day.value) ? "primary" : "default"}
                          onClick={() => toggleWeekday(day.value)}
                        />
                      ))}
                    </Stack>
                    {getFieldError("weekdays") && <FormHelperText error>{getFieldError("weekdays")}</FormHelperText>}
                  </Box>
                )}

                {scheduleType === "Interval" && (
                  <TextField
                    label="Интервал, дней *"
                    type="number"
                    value={intervalDays}
                    onChange={(event) => setIntervalDays(event.target.value)}
                    inputProps={{ min: 1, step: 1 }}
                    error={Boolean(getFieldError("intervaldays"))}
                    helperText={getFieldError("intervaldays")}
                    sx={{ maxWidth: 260 }}
                  />
                )}

                {scheduleType === "Prn" ? (
                  <TextField
                    label="Причина / Когда принимать"
                    value={prnReason}
                    onChange={(event) => setPrnReason(event.target.value)}
                    fullWidth
                  />
                ) : (
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Время приема *
                    </Typography>
                    <Stack spacing={1.2}>
                      {times.map((time, index) => (
                        <Stack key={`time-${index}`} direction="row" spacing={1.2} alignItems="center">
                          <TextField
                            type="time"
                            value={time}
                            onChange={(event) => updateTime(index, event.target.value)}
                            InputLabelProps={{ shrink: true }}
                            sx={{ maxWidth: 220 }}
                          />
                          <Button onClick={() => removeTime(index)} disabled={times.length <= 1}>
                            Удалить
                          </Button>
                        </Stack>
                      ))}
                      <Box>
                        <Button variant="outlined" onClick={addTime}>
                          + Добавить время
                        </Button>
                      </Box>
                      {getFieldError("times") && <FormHelperText error>{getFieldError("times")}</FormHelperText>}
                    </Stack>
                  </Box>
                )}
              </Stack>

              <Stack spacing={1.5}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "text.secondary" }}>
                  Напоминания
                </Typography>
                <FormControlLabel
                  control={<Switch checked={reminderEnabled} onChange={(_, checked) => setReminderEnabled(checked)} />}
                  label="Включить напоминания"
                />
                <FormControl disabled={!reminderEnabled} sx={{ maxWidth: 260 }}>
                  <InputLabel id="lead-time-label">За сколько минут</InputLabel>
                  <Select
                    labelId="lead-time-label"
                    label="За сколько минут"
                    value={reminderLeadTime}
                    onChange={(event) => setReminderLeadTime(Number(event.target.value))}
                  >
                    {reminderLeadOptions.map((value) => (
                      <MenuItem key={value} value={value}>
                        {value} минут
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>

              <Stack spacing={1.5}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "text.secondary" }}>
                  Контроль остатка
                </Typography>
                <FormControlLabel
                  control={<Switch checked={stockEnabled} onChange={(_, checked) => setStockEnabled(checked)} />}
                  label="Вести учет остатка"
                />

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField
                    label="Текущий остаток"
                    type="number"
                    disabled={!stockEnabled}
                    inputProps={{ min: 0, step: "0.01" }}
                    value={currentStock}
                    onChange={(event) => setCurrentStock(event.target.value)}
                    error={Boolean(getFieldError("currentstock"))}
                    helperText={getFieldError("currentstock")}
                    fullWidth
                  />
                  <TextField
                    label="Порог остатка"
                    type="number"
                    disabled={!stockEnabled}
                    inputProps={{ min: 0, step: "0.01" }}
                    value={lowStockThreshold}
                    onChange={(event) => setLowStockThreshold(event.target.value)}
                    error={Boolean(getFieldError("lowstockthreshold"))}
                    helperText={getFieldError("lowstockthreshold")}
                    fullWidth
                  />
                </Stack>
              </Stack>

              <Stack direction="row" spacing={1.5} justifyContent="flex-end" sx={{ mt: "auto", pt: 1 }}>
                <Button variant="outlined" onClick={() => navigate(-1)} disabled={mutation.isPending}>
                  Назад
                </Button>
                <Button variant="contained" onClick={onSubmit} disabled={mutation.isPending}>
                  {mutation.isPending ? "Сохранение..." : "Сохранить"}
                </Button>
              </Stack>
            </Stack>
          </SoftCard>

          <SoftCard title="Как заполнить карточку лекарства">
            <Stack spacing={1.25}>
              <Typography variant="body2" color="text.secondary">
                • Обязательные поля отмечены звездочкой (*).
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Для ежедневного, недельного и интервального приема нужно указать хотя бы одно время.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Если дата окончания не указана, препарат считается активным без ограничения срока.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Для PRN можно оставить расписание пустым и описать, в каких случаях принимать лекарство.
              </Typography>
            </Stack>
          </SoftCard>
        </Box>
      </Stack>

      <Snackbar
        open={successOpen}
        autoHideDuration={2500}
        onClose={() => setSuccessOpen(false)}
        message="Лекарство сохранено"
      />
    </PageContainer>
  );
}
