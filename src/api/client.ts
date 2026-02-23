import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

/** access-token живет в памяти */
let accessToken: string | null = null;
export const setAccessToken = (t: string | null) => { accessToken = t; };
export const getAccessToken = () => accessToken;

const envApiUrl = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
const normalizedEnvApiUrl = envApiUrl ? envApiUrl.replace(/\/+$/, "") : "";
const apiBaseUrl = normalizedEnvApiUrl || (import.meta.env.DEV ? "" : "http://localhost:5163");

export const buildApiUrl = (path: string) => {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${apiBaseUrl}${normalizedPath}`;
};

type RetriableConfig = InternalAxiosRequestConfig & { __isRetry?: boolean };

export const api = axios.create({
    baseURL: apiBaseUrl || undefined,
    withCredentials: false,
});

// Подставляем Authorization
api.interceptors.request.use((config) => {
    if (accessToken) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

// ---- тип и guard для ASP.NET ProblemDetails ----
type ValidationProblemDetails = {
    title?: string;
    errors?: Record<string, string[]>;
};
function isValidationProblemDetails(x: unknown): x is ValidationProblemDetails {
    if (!x || typeof x !== "object") return false;
    const obj = x as Record<string, unknown>;
    const hasErrors = "errors" in obj && typeof obj.errors === "object" && obj.errors !== null;
    const hasTitle = "title" in obj && (typeof obj.title === "string" || typeof obj.title === "undefined");
    return hasErrors || hasTitle;
}
// ---------------------------------------------------
let refreshPromise: Promise<string | null> | null = null;

async function performRefresh(): Promise<string | null> {
    const raw = axios.create({ withCredentials: true });

    try {
        const resp = await raw.post(buildApiUrl("/api/auth/refresh"), {});
        return resp.data?.token ?? null;
    } catch (err: unknown) {
        const isAx = axios.isAxiosError(err);
        const status = isAx ? err.response?.status : undefined;
        const respData = isAx ? (err.response?.data as unknown) : undefined;

        const vpd = isValidationProblemDetails(respData) ? respData : undefined;
        const needsBody =
            status === 400 &&
            (
                (vpd?.errors?.refreshToken && vpd.errors.refreshToken.length > 0) ||
                (vpd?.title?.toLowerCase().includes("validation errors") ?? false)
            );

        if (!needsBody) throw err;

        // fallback берем из localStorage
        const stored =
            localStorage.getItem("vitaent.refreshToken") ??
            localStorage.getItem("refreshToken");

        if (!stored) throw err;

        try {
            const objResp = await raw.post(
                buildApiUrl("/api/auth/refresh"),
                { refreshToken: stored },
                { headers: { "Content-Type": "application/json" } }
            );
            return objResp.data?.token ?? null;
        } catch {
            const strResp = await raw.post(
                buildApiUrl("/api/auth/refresh"),
                JSON.stringify(stored),
                { headers: { "Content-Type": "application/json" } }
            );
            return strResp.data?.token ?? null;
        }
    }
}

api.interceptors.response.use(
    (r) => r,
    async (error: AxiosError) => {
        const res = error.response;
        const orig = error.config as RetriableConfig;

        if (!res || res.status !== 401 || orig?.__isRetry) throw error;

        if (!refreshPromise) {
            refreshPromise = performRefresh()
                .then((newToken) => {
                    setAccessToken(newToken);
                    return newToken;
                })
                .catch(() => {
                    setAccessToken(null);
                    return null;
                })
                .finally(() => {
                    refreshPromise = null;
                });
        }

        const newToken = await refreshPromise;

        if (!newToken) throw error;

        orig.__isRetry = true;
        orig.headers = orig.headers ?? {};
        orig.headers.Authorization = `Bearer ${newToken}`;
        return api(orig);
    }
);
