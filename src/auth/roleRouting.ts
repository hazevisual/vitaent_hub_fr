import type { AuthResponse } from "types/Auth/AuthResponse";
import { Paths } from "@/paths";

type AuthUser = AuthResponse["user"];

export function hasRole(user: AuthUser, role: string) {
    return user?.roles?.includes(role) ?? false;
}

export function isAdminUser(user: AuthUser) {
    return hasRole(user, "ClinicAdmin") || hasRole(user, "SystemAdmin");
}

export function isDoctorUser(user: AuthUser) {
    return hasRole(user, "Doctor");
}

export function isPatientUser(user: AuthUser) {
    return hasRole(user, "Patient");
}

export function resolveAppHomePath(user: AuthUser) {
    if (isAdminUser(user)) {
        return Paths.adminHome;
    }

    if (isDoctorUser(user)) {
        return Paths.doctorHome;
    }

    return Paths.patientHome;
}
