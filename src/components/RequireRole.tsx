import * as React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/auth/AuthProvider";
import { resolveAppHomePath } from "@/auth/roleRouting";
import { Paths } from "@/paths";

type RequireRoleProps = {
    allowedRoles: string[];
};

export default function RequireRole({ allowedRoles }: RequireRoleProps) {
    const { user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return null;
    }

    if (!user) {
        return <Navigate to={Paths.login} replace state={{ from: location }} />;
    }

    const roles = user.roles ?? [];
    const isAllowed = allowedRoles.some((role) => roles.includes(role));

    if (!isAllowed) {
        return <Navigate to={resolveAppHomePath(user)} replace state={{ from: location }} />;
    }

    return <Outlet />;
}
