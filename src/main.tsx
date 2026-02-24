import React from "react";
import { createRoot } from "react-dom/client";
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Paths } from "./paths";
import SignIn from "./pages/login/SignIn/sigin";
import SignUp from "./pages/login/SignUp/signup";
import { AuthProvider } from "@/auth/AuthProvider";
import RequireAuth from "@/components/RequireAuth";
import AppLayout from "@/pages/app/AppLayout";
import HomePage from "@/pages/app/HomePage";
import ProfilePage from "@/pages/app/ProfilePage";
import SleepPage from "@/pages/app/SleepPage";
import WeekDayPage from "@/pages/app/WeekDayPage";
import EmotionsPage from "@/pages/app/EmotionsPage";
import MessagesPage from "@/pages/app/MessagesPage";
import MedicationUpsertPage from "@/pages/Medicines/MedicationUpsertPage";
import MedicinesHomePage from "@/pages/Medicines/MedicinesHomePage";
import { vitaentTheme } from "@/theme/vitaentTheme";
import "./index.css";

const router = createBrowserRouter([
  { path: "/", element: <Navigate to={Paths.login} replace /> },
  { path: Paths.login, element: <SignIn /> },
  { path: Paths.register, element: <SignUp /> },
  {
    element: <RequireAuth />,
    children: [
      {
        path: Paths.app,
        element: <AppLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: "sleep", element: <SleepPage /> },
          { path: "calendar-week", element: <WeekDayPage /> },
          { path: "emotions", element: <EmotionsPage /> },
          { path: "profile", element: <ProfilePage /> },
          { path: "messages", element: <MessagesPage /> },
          { path: "medicines", element: <MedicinesHomePage /> },
          { path: "medicines/add", element: <MedicationUpsertPage /> },
          { path: "medicines/:id/edit", element: <MedicationUpsertPage /> },
        ],
      },
    ],
  },
]);

const queryClient = new QueryClient();

const container = document.getElementById("root")!;

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ThemeProvider theme={vitaentTheme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>
);
