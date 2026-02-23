// src/auth/AuthProvider.tsx
import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { AuthResponse } from "types/Auth/AuthResponse";
import { refreshSession, signIn as apiSignIn, signOut as apiSignOut, type AuthRequest } from "@/api/auth";

/** Пример пользовательского типа; подгоните под ваш AuthResponse.user */
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

    // Попытка авто-входа с refresh-cookie при первом рендере
    useEffect(() => {
        (async () => {
            try {
                const data = await refreshSession();
                setUser(data.user ?? null);
            } catch {
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    const signIn = async (p: AuthRequest) => {
        const data = await apiSignIn(p);
        setUser(data.user ?? null);
        await qc.invalidateQueries(); // при необходимости обновить кэш
    };

    const signOut = async () => {
        await apiSignOut();
        setUser(null);
        await qc.clear();
    };

    const value: AuthContextShape = { user, isLoading, signIn, signOut };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};