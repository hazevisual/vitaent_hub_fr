import * as React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/auth/AuthProvider";

export default function RequireAuth() {
    const { user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return null;
    }

    if (!user) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <Outlet />;
}
