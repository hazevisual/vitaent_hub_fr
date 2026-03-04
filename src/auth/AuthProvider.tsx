import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { AuthResponse } from "types/Auth/AuthResponse";
import type { RegisterRequest } from "types/Auth/RegisterRequest";
import { getMe, registerUser as apiRegisterUser, signIn as apiSignIn, signOut as apiSignOut, type AuthRequest } from "@/api/auth";
import { getAccessToken, setAccessToken } from "@/api/client";

type User = AuthResponse["user"] | null;

type AuthContextShape = {
    user: User;
    isLoading: boolean;
    signIn: (p: AuthRequest) => Promise<void>;
    registerByInvite: (p: RegisterRequest) => Promise<void>;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextShape | null>(null);

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
    return ctx;
};

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [user, setUser] = useState<User>(null);
    const [isLoading, setIsLoading] = useState(true);
    const qc = useQueryClient();

    const resolveUser = React.useCallback((me: Awaited<ReturnType<typeof getMe>>): NonNullable<User> => ({
        userId: me.userId ?? "",
        userName: me.username ?? "vitaent",
        urlHospital: me.tenantSlug ?? "",
        tenantId: me.tenantId ?? null,
        tenantSlug: me.tenantSlug ?? null,
        membershipId: me.membershipId ?? null,
        roles: me.roles ?? [],
        patientId: me.patientId ?? null,
        doctorId: me.doctorId ?? null,
    }), []);

    useEffect(() => {
        (async () => {
            const token = getAccessToken();
            if (!token) {
                setUser(null);
                setIsLoading(false);
                return;
            }

            try {
                const me = await getMe();
                setUser(resolveUser(me));
            } catch {
                setAccessToken(null);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        })();
    }, [resolveUser]);

    const signIn = async (p: AuthRequest) => {
        const data = await apiSignIn(p);
        setUser(data.user ?? null);
        await qc.invalidateQueries();
    };

    const registerByInvite = async (p: RegisterRequest) => {
        const data = await apiRegisterUser(p);
        setUser(data.user ?? null);
        await qc.invalidateQueries();
    };

    const signOut = async () => {
        await apiSignOut();
        setUser(null);
        await qc.clear();
    };

    const value: AuthContextShape = { user, isLoading, signIn, registerByInvite, signOut };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
