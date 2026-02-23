// src/main.tsx (или src/index.tsx)
import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Paths } from "./paths";
import SignIn from "./pages/login/SignIn/sigin";
import SignUp from "./pages/login/SignUp/signup";
import { AuthProvider } from "@/auth/AuthProvider"; // <= важно: правильный путь
import "./index.css";

const router = createBrowserRouter([
    { path: Paths.sigin, element: <SignIn /> },     // провайдер будет СВЕРХУ
    { path: Paths.register, element: <SignUp /> },
    // ... остальные маршруты
]);

const queryClient = new QueryClient();

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <RouterProvider router={router} />
            </AuthProvider>
        </QueryClientProvider>
    </React.StrictMode>
);
