import * as React from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItemButton,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { deleteMedication, getPatientMedicines } from "@/api/medications";
import {
  addPatientMedicationSlotItem,
  createPatientMedicationSlot,
  deletePatientMedicationSlot,
  deletePatientMedicationSlotItem,
  getPatientMedicationSlots,
} from "@/api/medicationSchedule";
import { Paths } from "@/paths";
import PageContainer from "@/components/ui/PageContainer";
import SoftCard from "@/components/ui/SoftCard";
import type { MedicationDto, MedicationSlotDto, ProblemDetails } from "@/types/Medication";

function formatMedicationSubtitle(medication: MedicationDto) {
  const parts = [medication.form, medication.strength].filter(Boolean);
  return parts.length > 0 ? parts.join(" • ") : "Данные о дозировке пока не указаны";
}

function getApiErrorMessage(error: unknown, fallback: string) {
  if (!axios.isAxiosError(error)) {
    return fallback;
  }

  const problem = error.response?.data as ProblemDetails | undefined;
  return problem?.detail ?? problem?.title ?? fallback;
}

export default function MedicinesHomePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [query, setQuery] = React.useState("");
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [newSlotTime, setNewSlotTime] = React.useState("");
  const [selectedSlotId, setSelectedSlotId] = React.useState("");
  const [doseAmount, setDoseAmount] = React.useState("1");
  const [scheduleInstructions, setScheduleInstructions] = React.useState("");

  const medicinesQuery = useQuery({
    queryKey: ["patient-medicines"],
    queryFn: getPatientMedicines,
  });

  const slotsQuery = useQuery({
    queryKey: ["patient-medication-slots"],
    queryFn: getPatientMedicationSlots,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMedication,
    onSuccess: async (_, deletedId) => {
      await queryClient.invalidateQueries({ queryKey: ["patient-medicines"] });
      setSelectedId((current) => (current === deletedId ? null : current));
    },
  });

  const createSlotMutation = useMutation({
    mutationFn: createPatientMedicationSlot,
    onSuccess: async () => {
      setNewSlotTime("");
      await queryClient.invalidateQueries({ queryKey: ["patient-medication-slots"] });
    },
  });

  const deleteSlotMutation = useMutation({
    mutationFn: deletePatientMedicationSlot,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["patient-medication-slots"] });
    },
  });

  const deleteSlotItemMutation = useMutation({
    mutationFn: ({ slotId, itemId }: { slotId: string; itemId: string }) =>
      deletePatientMedicationSlotItem(slotId, itemId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["patient-medication-slots"] });
    },
  });

  const addSlotItemMutation = useMutation({
    mutationFn: ({ slotId, medicineId, amount, instructions }: {
      slotId: string;
      medicineId: string;
      amount: number;
      instructions: string;
    }) =>
      addPatientMedicationSlotItem(slotId, {
        medicineId,
        doseAmount: amount,
        instructions: instructions.trim() || undefined,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["patient-medication-slots"] });
      setDoseAmount("1");
      setScheduleInstructions((selectedMedication?.note?.trim() ?? ""));
    },
  });

  const medicines = medicinesQuery.data ?? [];
  const slots = slotsQuery.data ?? [];

  React.useEffect(() => {
    if (medicines.length === 0) {
      setSelectedId(null);
      return;
    }

    setSelectedId((current) => {
      if (current && medicines.some((item) => item.id === current)) {
        return current;
      }

      return medicines[0].id;
    });
  }, [medicines]);

  React.useEffect(() => {
    if (slots.length === 0) {
      setSelectedSlotId("");
      return;
    }

    setSelectedSlotId((current) => (current && slots.some((slot) => slot.id === current) ? current : slots[0].id));
  }, [slots]);

  const filtered = React.useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return medicines;
    }

    return medicines.filter((item) => item.name.toLowerCase().includes(normalized));
  }, [medicines, query]);

  const selectedMedication =
    filtered.find((item) => item.id === selectedId)
    ?? medicines.find((item) => item.id === selectedId)
    ?? null;

  React.useEffect(() => {
    setScheduleInstructions(selectedMedication?.note?.trim() ?? "");
    setDoseAmount("1");
  }, [selectedMedication?.id]);

  const cardSx = {
    width: "100%",
    minWidth: 0,
    minHeight: { xs: "auto", lg: 560 },
    overflow: "hidden",
  };

  const scheduleMutationError =
    getApiErrorMessage(createSlotMutation.error, "")
    || getApiErrorMessage(deleteSlotMutation.error, "")
    || getApiErrorMessage(deleteSlotItemMutation.error, "")
    || getApiErrorMessage(addSlotItemMutation.error, "");

  const handleCreateSlot = () => {
    createSlotMutation.mutate({ timeOfDay: newSlotTime.trim() });
  };

  const handleAddMedicationToSlot = () => {
    if (!selectedMedication || !selectedSlotId) {
      return;
    }

    const normalizedAmount = Number(doseAmount);
    addSlotItemMutation.mutate({
      slotId: selectedSlotId,
      medicineId: selectedMedication.id,
      amount: Number.isFinite(normalizedAmount) ? normalizedAmount : 0,
      instructions: scheduleInstructions,
    });
  };

  return (
    <PageContainer sx={{ maxWidth: "none" }}>
      <Stack spacing={{ xs: 3, md: 4 }} sx={{ width: "100%", minWidth: 0 }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h4" sx={{ fontSize: { xs: "1.5rem", md: "1.75rem" }, fontWeight: 600, lineHeight: 1.2 }}>
            Лекарства
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, maxWidth: 760 }}>
            Просматривайте список препаратов, редактируйте карточки и добавляйте новые лекарства в личный профиль.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "repeat(3, minmax(0, 1fr))" },
            gap: { xs: 2, md: 3 },
            width: "100%",
            minWidth: 0,
            overflow: "hidden",
            alignItems: "stretch",
          }}
        >
          <Box sx={{ minWidth: 0, overflow: "hidden", display: "flex" }}>
            <SoftCard title="Расписание приема" sx={cardSx} contentSx={{ gap: 3, minWidth: 0, flex: 1 }}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ minWidth: 0 }}>
                <TextField
                  type="time"
                  label="Новый слот"
                  value={newSlotTime}
                  onChange={(event) => setNewSlotTime(event.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ maxWidth: { xs: "100%", sm: 220 } }}
                  fullWidth
                />
                <Button
                  variant="outlined"
                  onClick={handleCreateSlot}
                  disabled={createSlotMutation.isPending}
                  sx={{ borderRadius: "12px", textTransform: "none", flexShrink: 0 }}
                >
                  {createSlotMutation.isPending ? "Сохранение..." : "Добавить временной слот"}
                </Button>
              </Stack>

              {scheduleMutationError ? <Alert severity="error">{scheduleMutationError}</Alert> : null}

              {slotsQuery.isLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1, minHeight: 300 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : null}

              {slotsQuery.isError ? (
                <Alert severity="error">
                  {getApiErrorMessage(slotsQuery.error, "Не удалось загрузить расписание приема.")}
                </Alert>
              ) : null}

              {!slotsQuery.isLoading && !slotsQuery.isError ? (
                slots.length > 0 ? (
                  <Stack spacing={2} sx={{ minWidth: 0, flex: 1 }}>
                    {slots.map((slot) => (
                      <ScheduleSlotCard
                        key={slot.id}
                        slot={slot}
                        onDeleteSlot={() => deleteSlotMutation.mutate(slot.id)}
                        onDeleteItem={(itemId) => deleteSlotItemMutation.mutate({ slotId: slot.id, itemId })}
                        deletingSlot={deleteSlotMutation.isPending}
                        deletingItem={deleteSlotItemMutation.isPending}
                      />
                    ))}
                  </Stack>
                ) : (
                  <Box
                    sx={{
                      flex: 1,
                      minHeight: 300,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px dashed #C9C9CB",
                      borderRadius: "12px",
                      px: 3,
                    }}
                  >
                    <Typography variant="body2" sx={{ color: "text.secondary", textAlign: "center" }}>
                      У вас пока нет временных слотов для приема лекарств.
                    </Typography>
                  </Box>
                )
              ) : null}

              <Stack direction={{ xs: "column", sm: "row", md: "column", xl: "row" }} spacing={2} sx={{ pt: 1, mt: "auto", minWidth: 0 }}>
                <Button
                  variant="contained"
                  onClick={() => navigate(Paths.patientMedicinesAdd)}
                  sx={{ borderRadius: "12px", boxShadow: "none", textTransform: "none" }}
                >
                  Добавить лекарство
                </Button>
              </Stack>
            </SoftCard>
          </Box>

          <Box sx={{ minWidth: 0, overflow: "hidden", display: "flex" }}>
            <SoftCard title="Лекарства" sx={cardSx} contentSx={{ gap: 2, minHeight: 0, minWidth: 0, flex: 1, overflow: "hidden" }}>
              <TextField
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Найти препарат"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                InputProps={{
                  startAdornment: <SearchRoundedIcon sx={{ color: "text.secondary", mr: 1 }} fontSize="small" />,
                }}
                fullWidth
              />

              {medicinesQuery.isLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1, minHeight: 300 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : null}

              {medicinesQuery.isError ? (
                <Alert severity="error">
                  {getApiErrorMessage(medicinesQuery.error, "Не удалось загрузить список лекарств.")}
                </Alert>
              ) : null}

              {!medicinesQuery.isLoading && !medicinesQuery.isError ? (
                medicines.length > 0 ? (
                  <List disablePadding sx={{ overflowY: "auto", overflowX: "hidden", flex: 1, minHeight: 300, minWidth: 0 }}>
                    {filtered.map((item) => (
                      <ListItemButton
                        key={item.id}
                        selected={item.id === selectedMedication?.id}
                        onClick={() => setSelectedId(item.id)}
                        sx={{
                          mb: 1,
                          px: 2,
                          py: 2,
                          borderRadius: "12px",
                          border: "1px solid transparent",
                          minWidth: 0,
                          "&.Mui-selected": { bgcolor: "#F5F5F7", borderColor: "#C9C9CB" },
                          "&.Mui-selected:hover": { bgcolor: "#F5F5F7" },
                          "&:hover": { bgcolor: "#F5F5F7" },
                        }}
                      >
                        <Avatar sx={{ width: 32, height: 32, mr: 2, borderRadius: "8px", bgcolor: "#F5F5F7", color: "text.primary", border: "1px solid #E5E5E7", flexShrink: 0 }}>
                          {item.name.slice(0, 1)}
                        </Avatar>
                        <ListItemText
                          primary={item.name}
                          secondary={formatMedicationSubtitle(item)}
                          primaryTypographyProps={{ fontWeight: 600, fontSize: 16, noWrap: true }}
                          secondaryTypographyProps={{ noWrap: true }}
                        />
                      </ListItemButton>
                    ))}
                  </List>
                ) : (
                  <Box
                    sx={{
                      flex: 1,
                      minHeight: 300,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px dashed #C9C9CB",
                      borderRadius: "12px",
                      px: 3,
                    }}
                  >
                    <Typography variant="body2" sx={{ color: "text.secondary", textAlign: "center" }}>
                      У вас пока нет добавленных лекарств.
                    </Typography>
                  </Box>
                )
              ) : null}
            </SoftCard>
          </Box>

          <Box sx={{ minWidth: 0, overflow: "hidden", display: "flex" }}>
            <SoftCard title="Карточка препарата" sx={cardSx} contentSx={{ gap: 3, minWidth: 0, flex: 1 }}>
              {selectedMedication ? (
                <>
                  <Box sx={{ p: { xs: 2, md: 3 }, borderRadius: "12px", border: "1px solid #E5E5E7", bgcolor: "#FFFFFF", minWidth: 0 }}>
                    <Typography variant="h5" sx={{ fontSize: "1.125rem", fontWeight: 600, overflowWrap: "anywhere" }}>
                      {selectedMedication.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, overflowWrap: "anywhere" }}>
                      {formatMedicationSubtitle(selectedMedication)}
                    </Typography>
                  </Box>

                  <Box sx={{ p: { xs: 2, md: 3 }, borderRadius: "12px", border: "1px solid #E5E5E7", bgcolor: "#FFFFFF", minWidth: 0 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                      Примечание
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ overflowWrap: "anywhere" }}>
                      {selectedMedication.note?.trim() || "Примечание пока не добавлено."}
                    </Typography>
                  </Box>

                  <Box sx={{ p: { xs: 2, md: 3 }, borderRadius: "12px", border: "1px solid #E5E5E7", bgcolor: "#FFFFFF", minWidth: 0 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                      Добавление в расписание
                    </Typography>
                    <Stack spacing={2} sx={{ minWidth: 0 }}>
                      <FormControl fullWidth disabled={slots.length === 0}>
                        <InputLabel id="medication-slot-label">Временной слот</InputLabel>
                        <Select
                          labelId="medication-slot-label"
                          label="Временной слот"
                          value={selectedSlotId}
                          onChange={(event) => setSelectedSlotId(event.target.value)}
                        >
                          {slots.map((slot) => (
                            <MenuItem key={slot.id} value={slot.id}>
                              {slot.timeOfDay}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <TextField
                        label="Количество"
                        type="number"
                        inputProps={{ min: 0.01, step: "0.01" }}
                        value={doseAmount}
                        onChange={(event) => setDoseAmount(event.target.value)}
                        fullWidth
                      />

                      <TextField
                        label="Примечание для приема"
                        multiline
                        minRows={3}
                        value={scheduleInstructions}
                        onChange={(event) => setScheduleInstructions(event.target.value)}
                        fullWidth
                      />

                      {slots.length === 0 ? (
                        <Typography variant="body2" color="text.secondary" sx={{ overflowWrap: "anywhere" }}>
                          Сначала добавьте хотя бы один временной слот в расписание приема.
                        </Typography>
                      ) : null}
                    </Stack>
                  </Box>

                  {deleteMutation.isError ? (
                    <Alert severity="error">
                      {getApiErrorMessage(deleteMutation.error, "Не удалось удалить лекарство.")}
                    </Alert>
                  ) : null}

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: "auto", minWidth: 0 }}>
                    <Button
                      variant="contained"
                      startIcon={<EditRoundedIcon />}
                      onClick={() => navigate(Paths.patientMedicinesEdit(selectedMedication.id))}
                      sx={{ py: 1.5, borderRadius: "12px", boxShadow: "none", textTransform: "none" }}
                    >
                      Редактировать
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteOutlineRoundedIcon />}
                      disabled={deleteMutation.isPending}
                      onClick={() => deleteMutation.mutate(selectedMedication.id)}
                      sx={{ py: 1.5, borderRadius: "12px", textTransform: "none" }}
                    >
                      {deleteMutation.isPending ? "Удаление..." : "Удалить"}
                    </Button>
                    <Button
                      variant="contained"
                      disabled={addSlotItemMutation.isPending || slots.length === 0}
                      onClick={handleAddMedicationToSlot}
                      sx={{ py: 1.5, borderRadius: "12px", boxShadow: "none", textTransform: "none" }}
                    >
                      {addSlotItemMutation.isPending ? "Добавление..." : "Добавить в расписание приема"}
                    </Button>
                  </Stack>
                </>
              ) : (
                <Box
                  sx={{
                    flex: 1,
                    minHeight: 240,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px dashed #C9C9CB",
                    borderRadius: "12px",
                    px: 3,
                  }}
                >
                  <Typography variant="body2" sx={{ color: "text.secondary", textAlign: "center" }}>
                    Выберите лекарство из списка или добавьте новое.
                  </Typography>
                </Box>
              )}
            </SoftCard>
          </Box>
        </Box>
      </Stack>
    </PageContainer>
  );
}

function ScheduleSlotCard({
  slot,
  onDeleteSlot,
  onDeleteItem,
  deletingSlot,
  deletingItem,
}: {
  slot: MedicationSlotDto;
  onDeleteSlot: () => void;
  onDeleteItem: (itemId: string) => void;
  deletingSlot: boolean;
  deletingItem: boolean;
}) {
  return (
    <Box
      sx={{
        px: 2,
        py: 2,
        borderRadius: "12px",
        bgcolor: "#F5F5F7",
        border: "1px solid #C9C9CB",
        minWidth: 0,
        overflow: "hidden",
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5, minWidth: 0, gap: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.primary", minWidth: 0 }}>
          {slot.timeOfDay}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
          <Chip size="small" label={`${slot.items.length} шт`} />
          <IconButton
            onClick={onDeleteSlot}
            disabled={deletingSlot}
            sx={{ border: "1px solid #E5E5E7", borderRadius: "8px" }}
          >
            <DeleteOutlineRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>

      {slot.items.length > 0 ? (
        <Stack spacing={1} sx={{ minWidth: 0 }}>
          {slot.items.map((item) => (
            <Stack
              key={item.id}
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
              spacing={1}
              sx={{ minWidth: 0 }}
            >
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="body2" sx={{ color: "text.primary", overflowWrap: "anywhere" }}>
                  • {item.medicineName}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary", display: "block", overflowWrap: "anywhere" }}>
                  {`${item.doseAmount} ${item.instructions?.trim() ? `• ${item.instructions}` : ""}`.trim()}
                </Typography>
              </Box>
              <IconButton
                onClick={() => onDeleteItem(item.id)}
                disabled={deletingItem}
                sx={{ border: "1px solid #E5E5E7", borderRadius: "8px", flexShrink: 0 }}
              >
                <RemoveRoundedIcon fontSize="small" />
              </IconButton>
            </Stack>
          ))}
        </Stack>
      ) : (
        <Typography variant="body2" sx={{ color: "text.secondary", overflowWrap: "anywhere" }}>
          В этом слоте пока нет назначенных лекарств.
        </Typography>
      )}
    </Box>
  );
}
