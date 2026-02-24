import * as React from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PageContainer from "@/components/ui/PageContainer";
import SoftCard from "@/components/ui/SoftCard";

type Medication = {
  id: string;
  name: string;
  dosage: string;
  stock: string;
  note: string;
};

type Slot = {
  id: string;
  time: string;
  medications: string[];
};

const medications: Medication[] = [
  { id: "1", name: "Парацетамол", dosage: "500 мг", stock: "26 таб", note: "После еды" },
  { id: "2", name: "Омепразол", dosage: "20 мг", stock: "11 капс", note: "За 30 минут до еды" },
  { id: "3", name: "Аторвастатин", dosage: "10 мг", stock: "18 таб", note: "Вечерний приём" },
  { id: "4", name: "Витамин D", dosage: "2000 МЕ", stock: "42 капс", note: "Один раз в день" },
];

const slots: Slot[] = [
  { id: "morning", time: "08:00", medications: ["Парацетамол", "Омепразол"] },
  { id: "evening", time: "20:00", medications: ["Аторвастатин"] },
];

export default function MedicinesHomePage() {
  const [query, setQuery] = React.useState("");
  const [selectedId, setSelectedId] = React.useState(medications[0].id);
  const [quantity, setQuantity] = React.useState(1);

  const filtered = React.useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return medications;
    return medications.filter((item) => item.name.toLowerCase().includes(normalized));
  }, [query]);

  const selectedMedication = medications.find((item) => item.id === selectedId) ?? medications[0];

  return (
    <PageContainer sx={{ width: "100%", maxWidth: "100%" }}>
      <Stack spacing={3} sx={{ width: "100%", maxWidth: "100%", minWidth: 0 }}>
        <Box sx={{ mb: { xs: 0.5, md: 1 } }}>
          <Typography variant="h4" sx={{ fontSize: { xs: "1.4rem", md: "1.7rem" }, fontWeight: 700 }}>
            Лекарства
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Настройте расписание и добавляйте препараты в нужные временные слоты.
          </Typography>
        </Box>

        <Box sx={{ width: "100%", maxWidth: "100%", minWidth: 0 }}>
          <Grid container spacing={{ xs: 2.5, md: 3 }} alignItems="stretch" sx={{ width: "100%", maxWidth: "100%", m: 0, minWidth: 0 }}>
            <Grid item xs={12} md={4} sx={{ minWidth: 0, maxWidth: "100%", display: "flex" }}>
              <SoftCard title="Расписание приёма" sx={{ minHeight: { xs: "auto", lg: 520 }, width: "100%" }}>
              <Stack spacing={2.25}>
                {slots.map((slot) => (
                  <Box
                    key={slot.id}
                    sx={{
                      px: 3,
                      py: 1.75,
                      borderRadius: 1,
                      bgcolor: "background.paper",
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.primary" }}>
                        {slot.time}
                      </Typography>
                      <Chip size="small" label={`${slot.medications.length} шт`} />
                    </Stack>
                    <Stack
                      spacing={1}
                      sx={{
                        px: 1.25,
                        py: 1,
                        borderRadius: 0.75,
                        bgcolor: "background.paper",
                      }}
                    >
                      {slot.medications.map((name) => (
                        <Typography key={`${slot.id}-${name}`} variant="body2" sx={{ color: "text.primary" }}>
                          • {name}
                        </Typography>
                      ))}
                    </Stack>
                  </Box>
                ))}
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ pt: 1.25, mt: "auto" }}>
                  <Button variant="contained">Добавить лекарства</Button>
                  <Button variant="outlined">Добавить временной слот</Button>
                </Stack>
              </Stack>
            </SoftCard>
            </Grid>

            <Grid item xs={12} md={4} sx={{ minWidth: 0, maxWidth: "100%", display: "flex" }}>
              <SoftCard
                title="Лекарства"
                sx={{
                  minHeight: { xs: "auto", lg: 520 },
                  width: "100%",
                  bgcolor: "background.paper",
                  border: "1px solid #C8C8CC",
                  boxShadow: "0 0 0 1px #F5F5F7",
                }}
              >
              <Stack spacing={2.25} sx={{ minHeight: 0, flex: 1 }}>
                <TextField
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Найти препарат"
                  InputProps={{
                    startAdornment: <SearchRoundedIcon sx={{ color: "text.secondary", mr: 1 }} fontSize="small" />,
                  }}
                  fullWidth
                />

                <List disablePadding sx={{ overflowY: "auto", flex: 1, minHeight: 300 }}>
                  {filtered.map((item) => (
                    <ListItemButton
                      key={item.id}
                      selected={item.id === selectedMedication.id}
                      onClick={() => setSelectedId(item.id)}
                      sx={{
                        mb: 1,
                        px: 1.5,
                        py: 1.25,
                        borderRadius: 2,
                        border: "1px solid transparent",
                        "&.Mui-selected": {
                          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                          borderColor: (theme) => alpha(theme.palette.primary.main, 0.32),
                        },
                        "&.Mui-selected:hover": {
                          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
                        },
                        "&:hover": {
                          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                        },
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 34,
                          height: 34,
                          mr: 1.2,
                          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.24),
                          color: "primary.dark",
                        }}
                      >
                        {item.name.slice(0, 1)}
                      </Avatar>
                      <ListItemText
                        primary={item.name}
                        secondary={`${item.dosage} • ${item.stock}`}
                        primaryTypographyProps={{ fontWeight: 600, fontSize: 14 }}
                      />
                    </ListItemButton>
                  ))}
                </List>
              </Stack>
            </SoftCard>
            </Grid>

            <Grid item xs={12} md={4} sx={{ minWidth: 0, maxWidth: "100%", display: "flex" }}>
              <SoftCard title="Карточка препарата" sx={{ minHeight: { xs: "auto", lg: 520 }, width: "100%" }}>
              <Stack spacing={2.5}>
                <Box>
                  <Typography variant="h5" sx={{ fontSize: "1.05rem" }}>
                    {selectedMedication.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {selectedMedication.dosage}
                  </Typography>
                </Box>

                <Divider />

                <Box sx={{ pt: 0.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    Примечание
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedMedication.note}
                  </Typography>
                </Box>

                <Box sx={{ pt: 0.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    Количество
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1.1}>
                    <IconButton onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}>
                      <RemoveRoundedIcon fontSize="small" />
                    </IconButton>
                    <Chip label={quantity} sx={{ minWidth: 54, fontWeight: 600 }} />
                    <IconButton onClick={() => setQuantity((prev) => prev + 1)}>
                      <AddRoundedIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Box>

                <Button variant="contained" sx={{ mt: "auto", pt: 1.4, pb: 1.4 }}>
                  Добавить в расписание приёма
                </Button>
              </Stack>
            </SoftCard>
            </Grid>
          </Grid>
        </Box>
      </Stack>
    </PageContainer>
  );
}
