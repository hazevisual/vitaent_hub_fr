export type AuthResponse = {
    success: boolean;
    token?: string;
    accessToken?: string;
    refreshToken?: string;
    errorMessage?: string;
    user?: {
        userId: number;
        userName: string;
        urlHospital: string;
    };
};
