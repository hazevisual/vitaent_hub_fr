// src/pages/auth/SignIn.tsx
import * as React from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
    Box, Button, Divider, FormControl, Link, TextField, Typography,
    Card as MuiCard, Snackbar, Alert, IconButton, InputAdornment
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
    alignItems: "center",
    justifyContent: "center",
    width: "clamp(300px, 50vw, 460px)",
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: "auto",
    backgroundColor: "#FCFCFC",
    borderRadius: "25px",
    boxShadow:
        "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
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
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
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
            setOpenSnackbar(true);
        },
    });

    const onSubmit = (data: FormData) => {
        // защита от двойного сабмита
        if (isSubmitting || mutation.isPending) return;
        mutation.mutate(data);
    };

    return (
        <>
            <Card variant="outlined" sx={{
                backgroundColor: clinic?.backgroundColor,
                color: clinic?.textColor,
            }}>
                <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
                    <img src={signinLogo} alt="Logo" style={{ width: 200 }} />
                </Box>
                <Typography variant="h5" align="center">
                    {clinic?.brandName}
                </Typography>
                <Typography variant="h6" align="center" sx={{ opacity: 0.4 }}>
                    Для входа введите ваш логин и пароль
                </Typography>

                <Box
                    component="form"
                    noValidate
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        width: "100%",
                        alignItems: "center",
                    }}
                >
                    <FormControl>
                        <TextField
                            id="login"
                            placeholder="Ваш логин"
                            autoComplete="username"
                            fullWidth
                            disabled={mutation.isPending}
                            error={!!errors.username}
                            helperText={errors.username?.message}
                            {...register("username")}
                            InputProps={{
                                sx: {
                                    width: "clamp(280px, 50vw, 357px)",
                                    height: "44px",
                                    borderRadius: "10px",
                                    "& input": { padding: "0 14px" },
                                },
                            }}
                        />
                    </FormControl>

                    <FormControl>
                        <TextField
                            id="password"
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
                                    width: "clamp(280px, 50vw, 357px)",
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
                        sx={{ width: "clamp(280px, 50vw, 357px)", height: "44px", borderRadius: "10px" }}
                    >
                        {mutation.isPending ? "Входим..." : "Войти"}
                    </Button>

                    <Link component="button" onClick={() => { /* TODO: модал восстановления */ }} variant="body2">
                        Забыли пароль?
                    </Link>
                </Box>

                <Divider sx={{ width: "100%" }} />

                <Box sx={{ textAlign: "center" }}>
                    <Button component={RouterLink} to="/register" variant="contained">
                        Зарегистрироваться
                    </Button>
                </Box>
            </Card>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
            >
                <Alert onClose={() => setOpenSnackbar(false)} severity="error" sx={{ width: "100%" }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </>
    );
}
