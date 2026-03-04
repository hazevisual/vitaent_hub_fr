import React from "react";
import { createRoot } from "react-dom/client";
import { Navigate, Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Paths } from "./paths";
import SignIn from "./pages/login/SignIn/sigin";
import SignUp from "./pages/login/SignUp/signup";
import { AuthProvider } from "@/auth/AuthProvider";
import RequireAuth from "@/components/RequireAuth";
import RequireRole from "@/components/RequireRole";
import AppIndexRedirect from "@/pages/app/AppIndexRedirect";
import AppLayout from "@/pages/app/AppLayout";
import AdminContextPage from "@/pages/app/AdminContextPage";
import DiseasePage from "@/pages/app/DiseasePage";
import DoctorInvitesPage from "@/pages/app/DoctorInvitesPage";
import EmotionsPage from "@/pages/app/EmotionsPage";
import HomePage from "@/pages/app/HomePage";
import MessagesPage from "@/pages/app/MessagesPage";
import ProfilePage from "@/pages/app/ProfilePage";
import SleepPage from "@/pages/app/SleepPage";
import SectionPlaceholderPage from "@/pages/app/SectionPlaceholderPage";
import WeekDayPage from "@/pages/app/WeekDayPage";
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
        element: <Outlet />,
        children: [
          { index: true, element: <AppIndexRedirect /> },
          {
            element: <RequireRole allowedRoles={["Patient"]} />,
            children: [
              {
                path: "patient",
                element: <AppLayout variant="patient" />,
                children: [
                  { index: true, element: <HomePage /> },
                  { path: "week-days", element: <WeekDayPage /> },
                  { path: "sleep", element: <SleepPage /> },
                  { path: "emotions", element: <EmotionsPage /> },
                  { path: "medicines", element: <MedicinesHomePage /> },
                  { path: "medicines/add", element: <MedicationUpsertPage /> },
                  { path: "medicines/:id/edit", element: <MedicationUpsertPage /> },
                  { path: "diseases/:id", element: <DiseasePage /> },
                  { path: "chat", element: <MessagesPage /> },
                  { path: "profile", element: <ProfilePage /> },
                ],
              },
            ],
          },
          {
            element: <RequireRole allowedRoles={["Doctor", "ClinicAdmin", "SystemAdmin"]} />,
            children: [
              {
                path: "doctor",
                element: <AppLayout variant="dashboard" />,
                children: [
                  {
                    index: true,
                    element: (
                      <SectionPlaceholderPage
                        title="Рабочее место врача"
                        summary="Рабочая зона врача для расписания, назначенных пациентов, медицинских записей и защищенной коммуникации."
                        primaryPoints={["Временный экран расписания врача", "Временный обзор назначенных пациентов", "Временная точка входа для записи в карту"]}
                        secondaryTitle="Следующая реализация"
                        secondaryPoints={["Запросы приемов врача", "Правила доступа к назначенным пациентам", "Сценарий записи врача в карту"]}
                      />
                    ),
                  },
                  {
                    path: "appointments",
                    element: (
                      <SectionPlaceholderPage
                        title="Приемы врача"
                        summary="Временный экран расписания врача и рабочего процесса по приемам."
                        primaryPoints={["Временный список расписания", "Временный статус приема", "Временный дневной вид врача"]}
                        secondaryTitle="Зависимости"
                        secondaryPoints={["API приемов врача", "Фильтрация приемов по врачу", "DTO для календаря"]}
                      />
                    ),
                  },
                  {
                    path: "patients",
                    element: (
                      <SectionPlaceholderPage
                        title="Пациенты врача"
                        summary="Зона доступа к назначенным пациентам и пациентам, связанным с приемами."
                        primaryPoints={["Временный список назначенных пациентов", "Временная панель контекста пациента", "Временный статус care-team"]}
                        secondaryTitle="Зависимости"
                        secondaryPoints={["Таблица care-team", "Запрос назначенных пациентов", "Политика доступа врача"]}
                      />
                    ),
                  },
                  {
                    path: "records",
                    element: (
                      <SectionPlaceholderPage
                        title="Медицинские записи врача"
                        summary="Зона создания и просмотра медицинских записей назначенных пациентов."
                        primaryPoints={["Временный редактор записи", "Временный список последних записей", "Временный выбор назначенного пациента"]}
                        secondaryTitle="Зависимости"
                        secondaryPoints={["API медицинских записей", "Право врача на запись", "Проверки доступа к назначенным пациентам"]}
                      />
                    ),
                  },
                  {
                    element: <RequireRole allowedRoles={["Doctor"]} />,
                    children: [
                      { path: "invites", element: <DoctorInvitesPage /> },
                    ],
                  },
                  {
                    path: "chat",
                    element: (
                      <SectionPlaceholderPage
                        title="Чат врача"
                        summary="Зона общения врача с пациентами в рамках активной клиники."
                        primaryPoints={["Временный список диалогов", "Временная лента сообщений", "Временный контекст чата пациента"]}
                        secondaryTitle="Зависимости"
                        secondaryPoints={["API диалогов", "API сообщений", "Политика авторизации врач-пациент"]}
                      />
                    ),
                  },
                ],
              },
            ],
          },
          {
            element: <RequireRole allowedRoles={["ClinicAdmin", "SystemAdmin"]} />,
            children: [
              {
                path: "admin",
                element: <AppLayout variant="dashboard" />,
                children: [
                  {
                    index: true,
                    element: (
                      <SectionPlaceholderPage
                        title="Администрирование клиники"
                        summary="Зона администрирования для управления участниками клиники, пользователями и ролями."
                        primaryPoints={["Временное управление пользователями клиники", "Временное назначение ролей", "Временный обзор участников"]}
                        secondaryTitle="Следующая реализация"
                        secondaryPoints={["API управления участниками", "API назначения ролей", "Покрытие политик администратора клиники"]}
                      />
                    ),
                  },
                  {
                    path: "users",
                    element: (
                      <SectionPlaceholderPage
                        title="Пользователи клиники"
                        summary="Локальный обзор пользователей и участников для активной клиники."
                        primaryPoints={["Временный список пользователей клиники", "Временное состояние участия", "Временные данные пользователя"]}
                        secondaryTitle="Зависимости"
                        secondaryPoints={["Запрос пользователей клиники", "Обновление статусов участия", "Авторизация администратора клиники"]}
                      />
                    ),
                  },
                  {
                    path: "roles",
                    element: (
                      <SectionPlaceholderPage
                        title="Назначение ролей"
                        summary="Администрирование ролей и разрешений для участников клиники."
                        primaryPoints={["Временный список ролей участников", "Временное назначение ролей", "Временная сводка разрешений"]}
                        secondaryTitle="Зависимости"
                        secondaryPoints={["Seed-данные ролей", "API ролей участника", "Контракт отображения разрешений"]}
                      />
                    ),
                  },
                  {
                    path: "memberships",
                    element: (
                      <SectionPlaceholderPage
                        title="Участники"
                        summary="Зона жизненного цикла участников для приглашения, активации и проверки пользователей клиники."
                        primaryPoints={["Временная таблица участников", "Временное управление статусами участия", "Временный сценарий онбординга в клинику"]}
                        secondaryTitle="Зависимости"
                        secondaryPoints={["API создания и обновления участия", "Сценарий администратора клиники", "Валидация участия в клинике"]}
                      />
                    ),
                  },
                  { path: "context", element: <AdminContextPage /> },
                ],
              },
            ],
          },
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
