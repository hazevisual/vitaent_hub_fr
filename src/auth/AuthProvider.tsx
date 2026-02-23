import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { AuthResponse } from "types/Auth/AuthResponse";
import { getMe, signIn as apiSignIn, signOut as apiSignOut, type AuthRequest } from "@/api/auth";
import { getAccessToken, setAccessToken } from "@/api/client";

type User = AuthResponse["user"] | null;

type AuthContextShape = {
    user: User;
    isLoading: boolean;
    signIn: (p: AuthRequest) => Promise<void>;
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
                const resolvedUserName = me.email ?? me.userName ?? me.username ?? "vitaent";
                setUser({
                    userId: 1,
                    userName: resolvedUserName,
                    urlHospital: "",
                });
            } catch {
                setAccessToken(null);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    const signIn = async (p: AuthRequest) => {
        const data = await apiSignIn(p);
        setUser(data.user ?? null);
        await qc.invalidateQueries();
    };

    const signOut = async () => {
        await apiSignOut();
        setUser(null);
        await qc.clear();
    };

    const value: AuthContextShape = { user, isLoading, signIn, signOut };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
