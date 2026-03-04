import * as React from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Card as MuiCard,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/auth/AuthProvider";
import { Eye, EyeOff } from "lucide-react";
import signinLogo from "@/assets/LogoVitaentFull.svg";
import ForgotPassword from "./components/ForgotPassword";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxWidth: 440,
  minHeight: 560,
  padding: theme.spacing(4),
  gap: theme.spacing(3),
  backgroundColor: "#FFFFFF",
  borderRadius: 16,
  border: "1px solid #C9C9CB",
  boxShadow: "none",
  [theme.breakpoints.down("sm")]: {
    minHeight: "auto",
    padding: theme.spacing(3),
  },
}));

const schema = z.object({
  username: z.string().trim().min(1, "Введите логин."),
  password: z.string().min(6, "Пароль должен содержать не менее 6 символов."),
});

type FormData = z.infer<typeof schema>;

export default function SignIn() {
  const navigate = useNavigate();
  const { signIn, user } = useAuth();
  const [errorMessage, setErrorMessage] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = React.useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = React.useState(false);
  const [signedInUserName, setSignedInUserName] = React.useState("vitaent");
  const apiMocksEnabled = (import.meta.env.VITE_API_MOCKS as string | undefined)?.toLowerCase() === "true";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });

  React.useEffect(() => {
    if (user) {
      navigate("/app", { replace: true });
    }
  }, [user, navigate]);

  const mutation = useMutation({
    mutationFn: async (values: FormData) => {
      return await signIn({
        UserName: values.username,
        Password: values.password,
      });
    },
    onSuccess: () => {
      setSignedInUserName(user?.userName ?? "vitaent");
      setIsSuccessOpen(true);
    },
    onError: (e: unknown) => {
      const msg = e instanceof Error ? e.message : "Не удалось выполнить вход. Проверьте логин и пароль.";
      setErrorMessage(msg);
    },
  });

  React.useEffect(() => {
    if (user?.userName) {
      setSignedInUserName(user.userName);
    }
  }, [user]);

  const onSubmit = (data: FormData) => {
    if (isSubmitting || mutation.isPending) return;
    setErrorMessage("");
    mutation.mutate(data);
  };

  return (
    <>
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
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Box component="img" src={signinLogo} alt="Vitaent" sx={{ width: 176, height: "auto" }} />
          </Box>

          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h5" sx={{ fontSize: "1.125rem", fontWeight: 600, color: "text.primary" }}>
              Вход
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
              Войдите в рабочее пространство активной клиники.
            </Typography>
            {apiMocksEnabled ? (
              <Typography variant="caption" sx={{ mt: 1.5, display: "block", color: "text.secondary" }}>
                Тестовые учетные записи: `patient` / `Patient123!`, `doctor` / `Doctor123!`, `clinic` / `Clinic123!`, `admin` / `Admin123!`
              </Typography>
            ) : null}
          </Box>

          {errorMessage ? (
            <Typography variant="body2" sx={{ color: "error.main", textAlign: "center" }}>
              {errorMessage}
            </Typography>
          ) : null}

          <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
            <FormControl fullWidth>
              <TextField
                id="login"
                label="Логин"
                autoComplete="username"
                autoFocus
                fullWidth
                disabled={mutation.isPending}
                error={!!errors.username}
                helperText={errors.username?.message}
                {...register("username")}
              />
            </FormControl>

            <FormControl fullWidth>
              <TextField
                id="password"
                label="Пароль"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                fullWidth
                disabled={mutation.isPending}
                error={!!errors.password}
                helperText={errors.password?.message}
                {...register("password")}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                        onClick={() => setShowPassword((v) => !v)}
                        edge="end"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>

            <Button type="submit" variant="contained" fullWidth disabled={mutation.isPending || isSubmitting} sx={{ mt: 1, textTransform: "none" }}>
              {mutation.isPending ? "Вход..." : "Войти"}
            </Button>

            <Typography variant="caption" align="center" sx={{ color: "text.secondary" }}>
              Нужна помощь? Обратитесь к администратору клиники.
            </Typography>

            <Link component="button" variant="body2" sx={{ mx: "auto", color: "primary.main" }} onClick={() => setIsForgotPasswordOpen(true)}>
              Забыли пароль?
            </Link>
          </Box>

          <Box sx={{ pt: 3, mt: "auto", borderTop: "1px solid #E5E5E7", textAlign: "center" }}>
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
              Если врач выдал код приглашения, завершите регистрацию по нему.
            </Typography>
            <Button component={RouterLink} to="/register" variant="outlined" fullWidth sx={{ textTransform: "none" }}>
              Регистрация по коду
            </Button>
          </Box>
        </Card>
      </Box>

      <ForgotPassword open={isForgotPasswordOpen} handleClose={() => setIsForgotPasswordOpen(false)} />

      <Dialog open={isSuccessOpen} onClose={() => setIsSuccessOpen(false)}>
        <DialogTitle>Вход выполнен</DialogTitle>
        <DialogContent>
          <Typography>Вы вошли как {signedInUserName || "vitaent"}.</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setIsSuccessOpen(false);
              navigate("/app");
            }}
            variant="contained"
            sx={{ textTransform: "none" }}
          >
            Продолжить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
