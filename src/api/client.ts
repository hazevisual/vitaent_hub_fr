import axios from "axios";
import { clearMockSession, mockAdapter } from "./mockAdapter";

const TOKEN_STORAGE_KEY = "vitaent.accessToken";
const apiMocksEnabled = (import.meta.env.VITE_API_MOCKS as string | undefined)?.toLowerCase() === "true";

let accessToken: string | null = localStorage.getItem(TOKEN_STORAGE_KEY);

export const setAccessToken = (token: string | null) => {
    accessToken = token;

    if (token) {
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        if (apiMocksEnabled) {
            clearMockSession();
        }
    }
};

export const getAccessToken = () => accessToken;

const envApiUrl = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
const normalizedEnvApiUrl = envApiUrl ? envApiUrl.replace(/\/+$/, "") : "";
const apiBaseUrl = normalizedEnvApiUrl || (import.meta.env.DEV ? "" : "http://localhost:5163");

export const api = axios.create({
    baseURL: apiBaseUrl || undefined,
    withCredentials: false,
    adapter: apiMocksEnabled ? mockAdapter : undefined,
});

api.interceptors.request.use((config) => {
    if (accessToken) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});
