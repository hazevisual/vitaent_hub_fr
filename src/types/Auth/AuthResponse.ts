export type AuthResponse = {
    success: boolean;
    token?: string;
    refreshToken?: string;
    errorMessage?: string;
    user?: {
        userId: number;
        userName: string;
        urlHospital: string;
    };
}