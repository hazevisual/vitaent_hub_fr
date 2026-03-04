export type AuthResponse = {
    success: boolean;
    token?: string;
    accessToken?: string;
    refreshToken?: string;
    errorMessage?: string;
    user?: {
        userId: string;
        userName: string;
        urlHospital: string;
        tenantId?: string | null;
        tenantSlug?: string | null;
        membershipId?: string | null;
        roles?: string[];
        patientId?: string | null;
        doctorId?: string | null;
    };
};
