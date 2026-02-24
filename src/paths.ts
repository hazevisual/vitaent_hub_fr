export const Paths = {
    login: "/login",
    register: "/register",
    app: "/app",
    profile: "/app/profile",
    sleep: "/app/sleep",
    emotions: "/app/emotions",
    medicines: "/app/medicines",
    medicinesAdd: "/app/medicines/add",
    messages: "/app/messages",
    weekDays: "/app/calendar-week",
    diseaseDetails: (id: string | number) => `/app/diseases/${id}`,
} as const;
