// src/pages/auth/SignIn.tsx
import * as React from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
    Box, Button, Divider, FormControl, Link, TextField, Typography,
    Card as MuiCard, Alert, IconButton, InputAdornment
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/auth/AuthProvider";
import { Eye, EyeOff } from "lucide-react";
import signinLogo from "@/assets/sigin.png";
import { ClinicInfoDto } from "types/Clinic/ClinicInfoDto";

const Card = styled(MuiCard)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: "460px",
    padding: theme.spacing(4),
    gap: theme.spacing(2.5),
    backgroundColor: "#FCFCFC",
    borderRadius: "20px",
    border: "1px solid rgba(15, 23, 42, 0.08)",
    boxShadow:
        "0px 20px 45px rgba(15, 23, 42, 0.08)",
    [theme.breakpoints.down("sm")]: {
        padding: theme.spacing(3),
        borderRadius: "16px",
    },
    ...theme.applyStyles?.("dark", {
        boxShadow:
            "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
    }),
}));

// Локальная схема = удобные имена полей
const schema = z.object({
    username: z.string().trim().min(1, "Введите логин."),
    password: z.string().min(6, "Пароль должен быть минимум 6 символов."),
});
type FormData = z.infer<typeof schema>;

export default function SignIn() {
    const navigate = useNavigate();
    const { signIn, user } = useAuth();
    const [errorMessage, setErrorMessage] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onSubmit",
    });

    const {
        data: clinic,
        /*isLoading: clinicLoading,
        isError: clinicError,
        error: clinicErrorObj,*/
    } = useQuery<ClinicInfoDto>({
        queryKey: ["clinicInfo"],
        queryFn: async () => {
            const res = await fetch("/api/ClinicInfo", {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                },
            });

            if (!res.ok) {
                throw new Error("Не удалось загрузить данные клиники.");
            }

            return res.json() as Promise<ClinicInfoDto>;
        },
        // в фоне перезапрашивать необязательно, нам хватит одного раза на загрузку страницы
        staleTime: 5 * 60 * 1000,
    });



    // Если уже авторизованы — уводим
    React.useEffect(() => {
        if (user?.urlHospital) {
            const url = user.urlHospital.startsWith("http")
                ? user.urlHospital
                : "/dashboard";
            // Для внешнего URL делаем полноценно:
            if (url.startsWith("http")) {
                window.location.href = url;
            } else {
                navigate(url, { replace: true });
            }
        }
    }, [user, navigate]);

    const mutation = useMutation({
        mutationFn: async (values: FormData) => {
            // МАППИНГ под API: { UserName, Password }
            return await signIn({
                UserName: values.username,
                Password: values.password,
            });
        },
        onError: (e: unknown) => {
            const msg =
                e instanceof Error
                    ? e.message
                    : "Не удалось выполнить вход. Проверьте логин и пароль.";
            setErrorMessage(msg);
        },
    });

    const onSubmit = (data: FormData) => {
        // защита от двойного сабмита
        if (isSubmitting || mutation.isPending) return;
        setErrorMessage("");
        mutation.mutate(data);
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: { xs: 2, sm: 3 },
                py: { xs: 3, sm: 4 },
                background: "linear-gradient(180deg, #f8fbff 0%, #eef3fb 100%)",
            }}
        >
            <Card variant="outlined" sx={{ backgroundColor: clinic?.backgroundColor, color: clinic?.textColor }}>
                <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
                    <img src={signinLogo} alt="Logo" style={{ width: 200 }} />
                </Box>
                <Typography variant="h4" align="center" sx={{ fontWeight: 700 }}>
                    Sign in
                </Typography>
                <Typography variant="body1" align="center" sx={{ opacity: 0.7, mt: -1 }}>
                    Access Vitaent HUB
                </Typography>

                {!!errorMessage && (
                    <Alert severity="error" sx={{ width: "100%" }}>
                        {errorMessage}
                    </Alert>
                )}

                <Box
                    component="form"
                    noValidate
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        width: "100%",
                    }}
                >
                    <FormControl fullWidth>
                        <TextField
                            id="login"
                            label="Username"
                            placeholder="Ваш логин"
                            autoComplete="username"
                            autoFocus
                            fullWidth
                            disabled={mutation.isPending}
                            error={!!errors.username}
                            helperText={errors.username?.message}
                            {...register("username")}
                            InputProps={{
                                sx: {
                                    height: "44px",
                                    borderRadius: "10px",
                                    "& input": { padding: "0 14px" },
                                },
                            }}
                        />
                    </FormControl>

                    <FormControl fullWidth>
                        <TextField
                            id="password"
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••"
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
                                sx: {
                                    height: "44px",
                                    borderRadius: "10px",
                                    "& input": { padding: "0 14px" },
                                },
                            }}
                        />
                    </FormControl>

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={mutation.isPending || isSubmitting}
                        sx={{ height: "44px", borderRadius: "10px", mt: 0.5 }}
                    >
                        {mutation.isPending ? "Входим..." : "Войти"}
                    </Button>

                    <Typography variant="caption" align="center" sx={{ color: "text.secondary", mt: 0.5 }}>
                        Need help? Contact your administrator.
                    </Typography>

                    <Link component="button" onClick={() => { /* TODO: модал восстановления */ }} variant="body2">
                        Забыли пароль?
                    </Link>
                </Box>

                <Divider sx={{ width: "100%" }} />

                <Box sx={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 1 }}>
                    {!!clinic?.brandName && (
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                            {clinic.brandName}
                        </Typography>
                    )}
                    <Button component={RouterLink} to="/register" variant="contained">
                        Зарегистрироваться
                    </Button>
                </Box>
            </Card>
        </Box>
    );
}
