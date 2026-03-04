import * as React from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card as MuiCard,
  FormControl,
  InputLabel,
  Link,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/auth/AuthProvider";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxWidth: 480,
  padding: theme.spacing(4),
  gap: theme.spacing(3),
  margin: "auto",
  backgroundColor: "#FFFFFF",
  borderRadius: 16,
  border: "1px solid #C9C9CB",
  boxShadow: "none",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(3),
  },
}));

const schema = z.object({
  inviteCode: z.string().trim().min(1, "Введите код приглашения."),
  email: z.string().trim().min(1, "Введите адрес электронной почты.").email("Введите корректный адрес электронной почты."),
  password: z.string().min(6, "Пароль должен содержать не менее 6 символов."),
  fullName: z.string().trim().min(2, "Введите имя пациента.").max(256, "Имя пациента должно содержать от 2 до 256 символов."),
  birthDate: z.string().min(1, "Укажите дату рождения."),
  sex: z.enum(["male", "female", "other", "unknown"], {
    errorMap: () => ({ message: "Укажите пол." }),
  }),
});

type FormData = z.infer<typeof schema>;

const sexOptions = [
  { value: "female", label: "Женский" },
  { value: "male", label: "Мужской" },
  { value: "other", label: "Другой" },
  { value: "unknown", label: "Не указан" },
] as const;

const SignUp = () => {
  const navigate = useNavigate();
  const { registerByInvite, user } = useAuth();
  const [errorMessage, setErrorMessage] = React.useState("");

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      inviteCode: "",
      email: "",
      password: "",
      fullName: "",
      birthDate: "",
      sex: "unknown",
    },
    mode: "onSubmit",
  });

  React.useEffect(() => {
    if (user) {
      navigate("/app", { replace: true });
    }
  }, [user, navigate]);

  const mutation = useMutation({
    mutationFn: async (values: FormData) => {
      await registerByInvite(values);
    },
    onError: (error: unknown) => {
      setErrorMessage(error instanceof Error ? error.message : "Не удалось завершить регистрацию по коду приглашения.");
    },
  });

  const onSubmit = (values: FormData) => {
    if (isSubmitting || mutation.isPending) {
      return;
    }

    setErrorMessage("");
    mutation.mutate(values);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 3, sm: 4 },
        backgroundColor: "#F5F5F7",
      }}
    >
      <Card variant="outlined">
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h5" sx={{ fontSize: "1.125rem", fontWeight: 600, color: "text.primary" }}>
            Регистрация по коду приглашения
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
            Введите код приглашения от врача. Клиника будет определена автоматически.
          </Typography>
        </Box>

        {errorMessage ? (
          <Typography variant="body2" sx={{ color: "error.main", textAlign: "center" }}>
            {errorMessage}
          </Typography>
        ) : null}

        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ display: "flex", flexDirection: "column", width: "100%", gap: 2 }}>
          <FormControl fullWidth>
            <TextField
              label="Код приглашения"
              autoFocus
              fullWidth
              disabled={mutation.isPending}
              error={!!errors.inviteCode}
              helperText={errors.inviteCode?.message}
              {...register("inviteCode")}
            />
          </FormControl>

          <FormControl fullWidth>
            <TextField
              label="Электронная почта"
              type="email"
              autoComplete="email"
              fullWidth
              disabled={mutation.isPending}
              error={!!errors.email}
              helperText={errors.email?.message}
              {...register("email")}
            />
          </FormControl>

          <FormControl fullWidth>
            <TextField
              label="Пароль"
              type="password"
              autoComplete="new-password"
              fullWidth
              disabled={mutation.isPending}
              error={!!errors.password}
              helperText={errors.password?.message}
              {...register("password")}
            />
          </FormControl>

          <FormControl fullWidth>
            <TextField
              label="Полное имя"
              fullWidth
              disabled={mutation.isPending}
              error={!!errors.fullName}
              helperText={errors.fullName?.message}
              {...register("fullName")}
            />
          </FormControl>

          <FormControl fullWidth>
            <TextField
              label="Дата рождения"
              type="date"
              fullWidth
              disabled={mutation.isPending}
              error={!!errors.birthDate}
              helperText={errors.birthDate?.message}
              InputLabelProps={{ shrink: true }}
              {...register("birthDate")}
            />
          </FormControl>

          <Controller
            control={control}
            name="sex"
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.sex}>
                <InputLabel id="sex-label">Пол</InputLabel>
                <Select
                  {...field}
                  labelId="sex-label"
                  label="Пол"
                  disabled={mutation.isPending}
                >
                  {sexOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.sex ? (
                  <Typography variant="caption" sx={{ color: "error.main", mt: 1.5, px: 1.75 }}>
                    {errors.sex.message}
                  </Typography>
                ) : null}
              </FormControl>
            )}
          />

          <Button type="submit" fullWidth variant="contained" disabled={mutation.isPending} sx={{ textTransform: "none", mt: 1 }}>
            {mutation.isPending ? "Регистрация..." : "Зарегистрироваться"}
          </Button>
        </Box>

        <Box sx={{ pt: 3, borderTop: "1px solid #E5E5E7", textAlign: "center" }}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Уже есть учетная запись?
            <Link component={RouterLink} to="/" sx={{ ml: 1 }}>
              Войти
            </Link>
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};

export default SignUp;
