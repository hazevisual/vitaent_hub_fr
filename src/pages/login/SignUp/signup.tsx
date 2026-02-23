// src/pages/auth/SignUp.tsx
import * as React from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
    Box, Button, Divider, FormControl, TextField, Typography,
    Card as MuiCard, Link, Alert
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { Hospital } from "types/Hospital";
import type { RegisterRequest } from "types/Auth/RegisterRequest";
import type { AuthResponse } from "types/Auth/AuthResponse";
import { api } from "@/api/client";
import { registerUser } from "@/api/auth";
import { AxiosError } from "axios";

const Card = styled(MuiCard)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignSelf: "center",
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

const SignUp = () => {
    const navigate = useNavigate();
    const [chooseClinic, setChooseClinic] = React.useState(false);
    const [selectedClinic, setSelectedClinic] = React.useState<number | "">("");
    const [errorMessage, setErrorMessage] = React.useState<string>("");
    const [openSnackbar, setOpenSnackbar] = React.useState(false);

    // клиники — через общий api-клиент
    const fetchHospitals = async (): Promise<Hospital[]> => {
        const { data } = await api.get<Hospital[]>("/hospitals");
        return data;
    };

    const { data: clinics = [], isLoading: clinicsLoading } = useQuery<Hospital[]>({
        queryKey: ["hospitals"],
        queryFn: fetchHospitals,
    });

    const mutation = useMutation<AuthResponse, Error, RegisterRequest>({
        mutationFn: registerUser,
        onSuccess: (data) => {
            const url = data.user?.urlHospital;
            if (url && url.startsWith("http")) {
                // внешний адрес
                window.location.href = url;
            } else {
                // внутри SPA
                navigate(url || "/app", { replace: true });
            }
        },
        onError: (error) => {
            console.log(error);
            const axiosError = error as AxiosError<{ errorMessage: string }>;
            //setErrorMessage(error.response.data.errorMessage || "Ошибка при регистрации");
            setErrorMessage(axiosError.response?.data?.errorMessage?? "Ошибка при регистрации");
            setOpenSnackbar(true);
        },
    });

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);

        const login = (form.get("login") || "").toString().trim();
        const password = (form.get("password") || "").toString();
        const confirmPassword = (form.get("confirmPassword") || "").toString();

        if (!login || !password) {
            setErrorMessage("Логин и пароль не должны быть пустыми");
            setOpenSnackbar(true);
            return;
        }
        if (password !== confirmPassword) {
            setErrorMessage("Пароли не совпадают");
            setOpenSnackbar(true);
            return;
        }

        mutation.mutate({
            login,
            password,
            confirmPassword,
            hospitalId: chooseClinic && selectedClinic ? Number(selectedClinic) : undefined,
        });
    };

    return (
        <Card variant="outlined">
            <Typography variant="h4" align="center">Регистрация</Typography>
            <Typography variant="body2" align="center" sx={{ opacity: 0.6 }}>
                Создайте аккаунт, заполнив данные ниже
            </Typography>

            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ display: "flex", flexDirection: "column", width: "100%", gap: 2, alignItems: "center" }}
            >
                <FormControl>
                    <TextField
                        name="login"
                        placeholder="Ваш логин"
                        required
                        fullWidth
                        variant="outlined"
                        disabled={mutation.isPending}
                        InputProps={{
                            sx: {
                                width: "clamp(280px, 50vw, 357px)",
                                height: "clamp(40px, 5vw, 44px)",
                                borderRadius: "10px",
                                "& .MuiOutlinedInput-notchedOutline": { borderRadius: "10px" },
                                "& input": { height: "100%", boxSizing: "border-box", padding: "0 14px" },
                            },
                        }}
                    />
                </FormControl>

                <FormControl>
                    <TextField
                        name="password"
                        placeholder="Пароль"
                        type="password"
                        required
                        fullWidth
                        variant="outlined"
                        disabled={mutation.isPending}
                        InputProps={{
                            sx: {
                                width: "clamp(280px, 50vw, 357px)",
                                height: "clamp(40px, 5vw, 44px)",
                                borderRadius: "10px",
                                "& .MuiOutlinedInput-notchedOutline": { borderRadius: "10px" },
                                "& input": { height: "100%", boxSizing: "border-box", padding: "0 14px" },
                            },
                        }}
                    />
                </FormControl>

                <FormControl>
                    <TextField
                        name="confirmPassword"
                        placeholder="Подтвердите пароль"
                        type="password"
                        required
                        fullWidth
                        variant="outlined"
                        disabled={mutation.isPending}
                        InputProps={{
                            sx: {
                                width: "clamp(280px, 50vw, 357px)",
                                height: "clamp(40px, 5vw, 44px)",
                                borderRadius: "10px",
                                "& .MuiOutlinedInput-notchedOutline": { borderRadius: "10px" },
                                "& input": { height: "100%", boxSizing: "border-box", padding: "0 14px" },
                            },
                        }}
                    />
                </FormControl>

                <FormControl
                    sx={{ width: "clamp(280px, 50vw, 357px)", display: "flex", alignItems: "flex-start" }}
                >
                    <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                        <input
                            type="checkbox"
                            checked={chooseClinic}
                            onChange={(e) => setChooseClinic(e.target.checked)}
                            style={{ margin: 0 }}
                        />
                        <span>Выбрать клинику</span>
                    </label>
                </FormControl>

                {chooseClinic && (
                    <FormControl sx={{ width: "clamp(280px, 50vw, 357px)" }}>
                        <TextField
                            select
                            value={selectedClinic}
                            onChange={(e) => {
                                const v = e.target.value;
                                setSelectedClinic(v === "" ? "" : Number(v));
                            }}
                            SelectProps={{ native: true }}
                            disabled={clinicsLoading || mutation.isPending}
                            sx={{
                                "& .MuiOutlinedInput-root": { height: "clamp(48px, 5vw, 50px)", borderRadius: "10px" },
                                "& .MuiSelect-select": {
                                    display: "flex",
                                    alignItems: "center",
                                    height: "100%",
                                    padding: "0 14px",
                                    boxSizing: "border-box",
                                },
                            }}
                            InputProps={{ sx: { borderRadius: "10px" } }}
                        >
                            <option value="">Не выбрано</option>
                            {clinics.map((clinic) => (
                                <option key={clinic.id} value={clinic.id}>
                                    {clinic.name}
                                </option>
                            ))}
                        </TextField>
                    </FormControl>
                )}

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={mutation.isPending}
                    sx={{
                        width: "clamp(280px, 50vw, 357px)",
                        height: "clamp(40px, 5vw, 44px)",
                        borderRadius: "10px",
                        fontWeight: "bold",
                    }}
                >
                    {mutation.isPending ? "Создаём..." : "Зарегистрироваться"}
                </Button>

                {openSnackbar && (
                    <Box sx={{ width: "100%" }}>
                        <Alert severity="error" onClose={() => setOpenSnackbar(false)}>
                            {errorMessage}
                        </Alert>
                    </Box>
                )}
            </Box>

            <Divider sx={{ width: "100%" }} />
            <Typography sx={{ textAlign: "center" }}>
                Уже есть аккаунт?
                <Link component={RouterLink} to="/" sx={{ ml: 1 }}>
                    Войти
                </Link>
            </Typography>
        </Card>
    );
};

export default SignUp;