export type RegisterRequest = {
    login: string;
    password: string;
    confirmPassword: string;
    hospitalId?: number;
}