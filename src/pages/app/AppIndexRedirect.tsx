import { Navigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthProvider";
import { resolveAppHomePath } from "@/auth/roleRouting";

export default function AppIndexRedirect() {
    const { user } = useAuth();
    return <Navigate to={resolveAppHomePath(user)} replace />;
}
