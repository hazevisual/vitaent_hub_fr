import * as React from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Grid,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
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
  const cardSx = {
    minHeight: { xs: "auto", lg: 520 },
    width: "100%",
    border: "1px solid #E5E5E7",
    borderRadius: "16px",
    bgcolor: "#FFFFFF",
    boxShadow: "none",
    "@media (min-width:2000px)": {
      "& .MuiCardContent-root": {
        p: 3.75,
        "&:last-child": { pb: 3.75 },
      },
    },
  };

  return (
    <PageContainer sx={{ width: "100%", maxWidth: "100%" }}>
      <Stack spacing={4} sx={{ width: "100%", maxWidth: "100%", minWidth: 0 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h4" sx={{ fontSize: { xs: "1.5rem", md: "1.75rem" }, fontWeight: 600, lineHeight: 1.2 }}>
            Лекарства
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Настройте расписание и добавляйте препараты в нужные временные слоты.
          </Typography>
        </Box>

        <Box sx={{ width: "100%", maxWidth: "100%", minWidth: 0 }}>
          <Grid container spacing={{ xs: 2, md: 3 }} alignItems="stretch" sx={{ width: "100%", maxWidth: "100%", m: 0, minWidth: 0 }}>
            <Grid item xs={12} md={4} sx={{ minWidth: 0, maxWidth: "100%", display: "flex" }}>
              <SoftCard title="Расписание приёма" sx={cardSx}>
              <Stack spacing={2}>
                {slots.map((slot) => (
                  <Box
                    key={slot.id}
                    sx={{
                      px: 3,
                      py: 2,
                      borderRadius: "12px",
                      bgcolor: "#F5F5F7",
                      border: "1px solid #C9C9CB",
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.primary" }}>
                        {slot.time}
                      </Typography>
                      <Chip size="small" label={`${slot.medications.length} шт`} />
                    </Stack>
                    <Stack
                      spacing={1}
                      sx={{
                        px: 2,
                        py: 1,
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
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ pt: 2, mt: "auto" }}>
                  <Button variant="contained" sx={{ borderRadius: "12px", boxShadow: "none" }}>Добавить лекарства</Button>
                  <Button variant="outlined" sx={{ borderRadius: "12px", boxShadow: "none" }}>Добавить временной слот</Button>
                </Stack>
              </Stack>
            </SoftCard>
            </Grid>

            <Grid item xs={12} md={4} sx={{ minWidth: 0, maxWidth: "100%", display: "flex" }}>
              <SoftCard
                title="Лекарства"
                sx={cardSx}
              >
              <Stack spacing={2} sx={{ minHeight: 0, flex: 1 }}>
                <TextField
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Найти препарат"
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
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
                        px: 2,
                        py: 2,
                        borderRadius: "12px",
                        border: "1px solid transparent",
                        "&.Mui-selected": {
                          bgcolor: "#F5F5F7",
                          borderColor: "#C9C9CB",
                        },
                        "&.Mui-selected:hover": {
                          bgcolor: "#F5F5F7",
                        },
                        "&:hover": {
                          bgcolor: "#F5F5F7",
                        },
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          mr: 2,
                          borderRadius: "8px",
                          bgcolor: "#F5F5F7",
                          color: "text.primary",
                          border: "1px solid #E5E5E7",
                        }}
                      >
                        {item.name.slice(0, 1)}
                      </Avatar>
                      <ListItemText
                        primary={item.name}
                        secondary={`${item.dosage} • ${item.stock}`}
                        primaryTypographyProps={{ fontWeight: 600, fontSize: 16 }}
                      />
                    </ListItemButton>
                  ))}
                </List>
              </Stack>
            </SoftCard>
            </Grid>

            <Grid item xs={12} md={4} sx={{ minWidth: 0, maxWidth: "100%", display: "flex" }}>
              <SoftCard title="Карточка препарата" sx={cardSx}>
              <Stack spacing={3}>
                <Box sx={{ p: 2, borderRadius: "12px", border: "1px solid #E5E5E7", bgcolor: "#FFFFFF" }}>
                  <Typography variant="h5" sx={{ fontSize: "1.125rem", fontWeight: 600 }}>
                    {selectedMedication.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {selectedMedication.dosage}
                  </Typography>
                </Box>

                <Box sx={{ p: 2, borderRadius: "12px", border: "1px solid #E5E5E7", bgcolor: "#FFFFFF" }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                    Примечание
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedMedication.note}
                  </Typography>
                </Box>

                <Box sx={{ p: 2, borderRadius: "12px", border: "1px solid #E5E5E7", bgcolor: "#FFFFFF" }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                    Количество
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <IconButton sx={{ border: "1px solid #E5E5E7", borderRadius: "8px" }} onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}>
                      <RemoveRoundedIcon fontSize="small" />
                    </IconButton>
                    <Chip label={quantity} sx={{ minWidth: 56, fontWeight: 600, borderRadius: "8px", bgcolor: "#F5F5F7", border: "1px solid #E5E5E7" }} />
                    <IconButton sx={{ border: "1px solid #E5E5E7", borderRadius: "8px" }} onClick={() => setQuantity((prev) => prev + 1)}>
                      <AddRoundedIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Box>

                <Button variant="contained" sx={{ mt: "auto", pt: 1.5, pb: 1.5, borderRadius: "12px", boxShadow: "none" }}>
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
