import * as React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/auth/AuthProvider";
import { Paths } from "@/paths";

export default function RequireAuth() {
    const { user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return null;
    }

    if (!user || !user.tenantSlug || !user.membershipId) {
        return <Navigate to={Paths.login} replace state={{ from: location }} />;
    }

    return <Outlet />;
}
