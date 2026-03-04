import axios, { AxiosError } from "axios";
import type { AxiosAdapter, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";

const MOCK_ACCESS_TOKEN = "mock-access-token";
const MOCK_REFRESH_TOKEN = "mock-refresh-token";
const MOCK_SESSION_STORAGE_KEY = "vitaent.mock.session";

type MockSession = {
  accessToken: string;
  refreshToken: string;
  userId: string;
  email: string;
  username: string;
  tenantId: string;
  tenantSlug: string;
  membershipId: string;
  roles: string[];
  patientId: string | null;
  doctorId: string | null;
};

type LoginRequestBody = {
  username?: string;
  password?: string;
  tenantSlug?: string | null;
};

type RegisterByInviteRequestBody = {
  inviteCode?: string;
  email?: string;
  password?: string;
  fullName?: string;
  birthDate?: string;
  sex?: string;
};

type MockInvite = {
  code: string;
  tenantId: string;
  tenantSlug: string;
  doctorId: string;
  membershipId: string;
  createdAt: string;
  expiresAt: string;
  status: "active" | "used" | "revoked" | "expired";
  usedAt?: string | null;
};

type MockPatientMedicine = {
  id: string;
  tenantId: string;
  patientId: string;
  name: string;
  strength: string | null;
  form: string | null;
  note: string | null;
  createdAt: string;
};

type MockPatientMedicationSlotItem = {
  id: string;
  medicineId: string;
  doseAmount: number;
  instructions: string | null;
  createdAt: string;
};

type MockPatientMedicationSlot = {
  id: string;
  tenantId: string;
  patientId: string;
  timeOfDay: string;
  createdAt: string;
  items: MockPatientMedicationSlotItem[];
};

type MockDashboardBlockState = {
  completion: number;
  completionDayLabel: string;
  recommendation: string;
  appointmentTime: string;
  appointmentDate: string;
  summaryDate: string;
  summaryRows: number[];
  updatedAt: string;
};

const mockInvites: MockInvite[] = [
  {
    code: "VITA1-PAT01",
    tenantId: "00000000-0000-0000-0000-000000000010",
    tenantSlug: "vita-west",
    doctorId: "00000000-0000-0000-0000-000000000203",
    membershipId: "00000000-0000-0000-0000-000000000401",
    createdAt: "2026-03-01T09:00:00Z",
    expiresAt: "2030-12-31T12:00:00Z",
    status: "active",
    usedAt: null,
  },
];

const mockPatientMedicines: MockPatientMedicine[] = [
  {
    id: "00000000-0000-0000-0000-000000000701",
    tenantId: "00000000-0000-0000-0000-000000000010",
    patientId: "00000000-0000-0000-0000-000000000304",
    name: "Парацетамол",
    strength: "500 мг",
    form: "Таблетки",
    note: "После еды",
    createdAt: "2026-03-01T08:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000702",
    tenantId: "00000000-0000-0000-0000-000000000010",
    patientId: "00000000-0000-0000-0000-000000000304",
    name: "Омепразол",
    strength: "20 мг",
    form: "Капсулы",
    note: "За 30 минут до еды",
    createdAt: "2026-03-01T09:00:00Z",
  },
];

const mockPatientMedicationSlots: MockPatientMedicationSlot[] = [
  {
    id: "00000000-0000-0000-0000-000000000801",
    tenantId: "00000000-0000-0000-0000-000000000010",
    patientId: "00000000-0000-0000-0000-000000000304",
    timeOfDay: "08:00",
    createdAt: "2026-03-01T08:00:00Z",
    items: [
      {
        id: "00000000-0000-0000-0000-000000000901",
        medicineId: "00000000-0000-0000-0000-000000000701",
        doseAmount: 1,
        instructions: "После еды",
        createdAt: "2026-03-01T08:00:00Z",
      },
    ],
  },
  {
    id: "00000000-0000-0000-0000-000000000802",
    tenantId: "00000000-0000-0000-0000-000000000010",
    patientId: "00000000-0000-0000-0000-000000000304",
    timeOfDay: "20:00",
    createdAt: "2026-03-01T20:00:00Z",
    items: [
      {
        id: "00000000-0000-0000-0000-000000000902",
        medicineId: "00000000-0000-0000-0000-000000000702",
        doseAmount: 1,
        instructions: "За 30 минут до еды",
        createdAt: "2026-03-01T20:00:00Z",
      },
    ],
  },
];

const mockDashboardBlockByPatient: Record<string, MockDashboardBlockState> = {};

function createDefaultDashboardBlockState(): MockDashboardBlockState {
  return {
    completion: 100,
    completionDayLabel: "Среду",
    recommendation: "За последнюю неделю вы спите меньше, чем обычно. Обратите внимание на режим сна.",
    appointmentTime: "11:30",
    appointmentDate: "27.01.2026",
    summaryDate: "16.02.2026",
    summaryRows: [62, 44, 57, 39, 51, 36, 28],
    updatedAt: new Date().toISOString(),
  };
}

function createResponse<T>(
  config: InternalAxiosRequestConfig,
  status: number,
  data: T,
): AxiosResponse<T> {
  return {
    data,
    status,
    statusText: status >= 400 ? "Error" : "OK",
    headers: {},
    config,
  };
}

function createAxiosError(
  config: InternalAxiosRequestConfig,
  status: number,
  data: { title: string; message?: string; errors?: Record<string, string[]> },
): AxiosError {
  return new AxiosError(
    data.message ?? data.title,
    undefined,
    config,
    undefined,
    createResponse(config, status, data),
  );
}

function getStoredSession(): MockSession | null {
  const raw = localStorage.getItem(MOCK_SESSION_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as MockSession;
  } catch {
    localStorage.removeItem(MOCK_SESSION_STORAGE_KEY);
    return null;
  }
}

function setStoredSession(session: MockSession | null) {
  if (!session) {
    localStorage.removeItem(MOCK_SESSION_STORAGE_KEY);
    return;
  }

  localStorage.setItem(MOCK_SESSION_STORAGE_KEY, JSON.stringify(session));
}

function getSessionFromAuthHeader(config: InternalAxiosRequestConfig): MockSession | null {
  const authorization = config.headers?.Authorization ?? config.headers?.authorization;
  const headerValue = Array.isArray(authorization) ? authorization[0] : authorization;

  if (!headerValue || typeof headerValue !== "string") {
    return null;
  }

  const token = headerValue.replace(/^Bearer\s+/i, "").trim();
  const session = getStoredSession();

  if (!session || session.accessToken !== token) {
    return null;
  }

  return session;
}

type MockAccount = {
  login: string[];
  password: string;
  userId: string;
  email: string;
  username: string;
  membershipId: string;
  roles: string[];
  patientId: string | null;
  doctorId: string | null;
};

const mockAccounts: MockAccount[] = [
  {
    login: ["admin", "admin@vitaent.local"],
    password: "Admin123!",
    userId: "00000000-0000-0000-0000-000000000001",
    email: "admin@vitaent.local",
    username: "admin",
    membershipId: "00000000-0000-0000-0000-000000000101",
    roles: ["SystemAdmin"],
    patientId: null,
    doctorId: null,
  },
  {
    login: ["clinic", "clinic@vitaent.local"],
    password: "Clinic123!",
    userId: "00000000-0000-0000-0000-000000000002",
    email: "clinic@vitaent.local",
    username: "clinic",
    membershipId: "00000000-0000-0000-0000-000000000102",
    roles: ["ClinicAdmin"],
    patientId: null,
    doctorId: null,
  },
  {
    login: ["doctor", "doctor@vitaent.local"],
    password: "Doctor123!",
    userId: "00000000-0000-0000-0000-000000000003",
    email: "doctor@vitaent.local",
    username: "doctor",
    membershipId: "00000000-0000-0000-0000-000000000103",
    roles: ["Doctor"],
    patientId: null,
    doctorId: "00000000-0000-0000-0000-000000000203",
  },
  {
    login: ["patient", "patient@vitaent.local"],
    password: "Patient123!",
    userId: "00000000-0000-0000-0000-000000000004",
    email: "patient@vitaent.local",
    username: "patient",
    membershipId: "00000000-0000-0000-0000-000000000104",
    roles: ["Patient"],
    patientId: "00000000-0000-0000-0000-000000000304",
    doctorId: null,
  },
];

function resolveMockAccount(username: string, password: string) {
  const normalizedLogin = username.trim().toLowerCase();
  return mockAccounts.find(
    (account) =>
      account.password === password &&
      account.login.some((login) => login.toLowerCase() === normalizedLogin),
  );
}

function buildSession(account: MockAccount, tenantSlug?: string | null): MockSession {
  const resolvedTenantSlug = tenantSlug?.trim() || "vita-west";

  return {
    accessToken: `${MOCK_ACCESS_TOKEN}-${account.username}`,
    refreshToken: `${MOCK_REFRESH_TOKEN}-${account.username}`,
    userId: account.userId,
    email: account.email,
    username: account.username,
    tenantId: "00000000-0000-0000-0000-000000000010",
    tenantSlug: resolvedTenantSlug,
    membershipId: account.membershipId,
    roles: account.roles,
    patientId: account.patientId,
    doctorId: account.doctorId,
  };
}

function buildPatientInviteSession(body: RegisterByInviteRequestBody, invite: MockInvite): MockSession {
  return {
    accessToken: `${MOCK_ACCESS_TOKEN}-invite-patient`,
    refreshToken: `${MOCK_REFRESH_TOKEN}-invite-patient`,
    userId: "00000000-0000-0000-0000-000000000099",
    email: body.email ?? "patient.invited@vitaent.local",
    username: body.email ?? "patient.invited@vitaent.local",
    tenantId: invite.tenantId,
    tenantSlug: invite.tenantSlug,
    membershipId: invite.membershipId,
    roles: ["Patient"],
    patientId: "00000000-0000-0000-0000-000000000399",
    doctorId: null,
  };
}

function createMockInvite(session: MockSession): MockInvite {
  const now = new Date();
  const expiresAt = new Date(now);
  expiresAt.setDate(expiresAt.getDate() + 30);

  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const createPart = () =>
    Array.from({ length: 5 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");

  return {
    code: `${createPart()}-${createPart()}`,
    tenantId: session.tenantId,
    tenantSlug: session.tenantSlug,
    doctorId: session.doctorId ?? "00000000-0000-0000-0000-000000000203",
    membershipId: `${session.membershipId}-invite-${Date.now()}`,
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    status: "active",
    usedAt: null,
  };
}

async function handleLogin(config: InternalAxiosRequestConfig): Promise<AxiosResponse> {
  const body = (config.data ? JSON.parse(config.data as string) : {}) as LoginRequestBody;

  if (!body.username || !body.password) {
    throw createAxiosError(config, 400, {
      title: "Ошибка валидации",
      message: "Логин и пароль обязательны.",
    });
  }

  const account = resolveMockAccount(body.username, body.password);
  if (!account) {
    throw createAxiosError(config, 401, {
      title: "Не удалось выполнить вход",
      message: "Проверьте тестовые учетные данные.",
    });
  }

  const session = buildSession(account, body.tenantSlug);
  setStoredSession(session);

  return createResponse(config, 200, {
    accessToken: session.accessToken,
    expiresIn: 3600,
    refreshToken: session.refreshToken,
  });
}

async function handleRegisterByInvite(config: InternalAxiosRequestConfig): Promise<AxiosResponse> {
  const body = (config.data ? JSON.parse(config.data as string) : {}) as RegisterByInviteRequestBody;
  const validationErrors: Record<string, string[]> = {};

  if (!body.inviteCode?.trim()) {
    validationErrors.inviteCode = ["Введите код приглашения."];
  }

  if (!body.email?.trim()) {
    validationErrors.email = ["Введите адрес электронной почты."];
  }

  if (!body.password?.trim()) {
    validationErrors.password = ["Введите пароль."];
  }

  if (!body.fullName?.trim()) {
    validationErrors.fullName = ["Введите имя пациента."];
  }

  if (!body.birthDate?.trim()) {
    validationErrors.birthDate = ["Укажите дату рождения."];
  }

  if (!body.sex?.trim()) {
    validationErrors.sex = ["Укажите пол."];
  }

  if (Object.keys(validationErrors).length > 0) {
    throw createAxiosError(config, 400, {
      title: "Проверьте корректность заполнения полей.",
      errors: validationErrors,
    });
  }

  const normalizedCode = body.inviteCode.trim().toUpperCase();
  const invite = mockInvites.find((item) => item.code === normalizedCode);

  if (!invite) {
    throw createAxiosError(config, 404, {
      title: "Код приглашения не найден.",
    });
  }

  if (invite.status === "used") {
    throw createAxiosError(config, 409, {
      title: "Код приглашения уже использован.",
    });
  }

  if (invite.status === "revoked") {
    throw createAxiosError(config, 409, {
      title: "Код приглашения отозван.",
    });
  }

  if (invite.status === "expired" || new Date(invite.expiresAt).getTime() <= Date.now()) {
    invite.status = "expired";
    throw createAxiosError(config, 409, {
      title: "Срок действия кода приглашения истек.",
    });
  }

  invite.status = "used";
  invite.usedAt = new Date().toISOString();
  const session = buildPatientInviteSession(body, invite);
  setStoredSession(session);

  return createResponse(config, 200, {
    accessToken: session.accessToken,
    expiresIn: 3600,
    refreshToken: session.refreshToken,
  });
}

async function handleRefresh(config: InternalAxiosRequestConfig): Promise<AxiosResponse> {
  const session = getSessionFromAuthHeader(config);
  if (!session) {
    throw createAxiosError(config, 401, {
      title: "Не удалось обновить сессию",
      message: "Текущая сессия недействительна.",
    });
  }

  return createResponse(config, 200, {
    accessToken: session.accessToken,
    expiresIn: 3600,
    refreshToken: session.refreshToken,
  });
}

async function handleMe(config: InternalAxiosRequestConfig): Promise<AxiosResponse> {
  const session = getSessionFromAuthHeader(config);
  if (!session) {
    throw createAxiosError(config, 401, {
      title: "Не авторизован",
      message: "Сначала выполните вход.",
    });
  }

  return createResponse(config, 200, {
    userId: session.userId,
    username: session.username,
    tenantId: session.tenantId,
    tenantSlug: session.tenantSlug,
    membershipId: session.membershipId,
    roles: session.roles,
    patientId: session.patientId,
    doctorId: session.doctorId,
  });
}

async function handleDoctorInvitesGet(config: InternalAxiosRequestConfig): Promise<AxiosResponse> {
  const session = getSessionFromAuthHeader(config);
  if (!session) {
    throw createAxiosError(config, 401, {
      title: "Не авторизован",
      message: "Сначала выполните вход.",
    });
  }

  if (!session.roles.includes("Doctor")) {
    throw createAxiosError(config, 403, {
      title: "Доступ запрещен",
      message: "Только врач может просматривать коды приглашения.",
    });
  }

  const invites = mockInvites
    .filter((invite) => invite.tenantSlug === session.tenantSlug && invite.doctorId === session.doctorId)
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
    .map((invite) => ({
      code: invite.code,
      status: invite.status,
      createdAt: invite.createdAt,
      expiresAt: invite.expiresAt,
      usedAt: invite.usedAt ?? null,
    }));

  return createResponse(config, 200, invites);
}

async function handleDoctorInvitesPost(config: InternalAxiosRequestConfig): Promise<AxiosResponse> {
  const session = getSessionFromAuthHeader(config);
  if (!session) {
    throw createAxiosError(config, 401, {
      title: "Не авторизован",
      message: "Сначала выполните вход.",
    });
  }

  if (!session.roles.includes("Doctor")) {
    throw createAxiosError(config, 403, {
      title: "Доступ запрещен",
      message: "Только врач может генерировать коды приглашения.",
    });
  }

  const invite = createMockInvite(session);
  mockInvites.unshift(invite);

  return createResponse(config, 200, {
    code: invite.code,
    expiresAt: invite.expiresAt,
  });
}

async function handleAdminContext(config: InternalAxiosRequestConfig): Promise<AxiosResponse> {
  const session = getSessionFromAuthHeader(config);
  if (!session) {
    throw createAxiosError(config, 401, {
      title: "Не авторизован",
      message: "Сначала выполните вход.",
    });
  }

  const isAdmin = session.roles.includes("ClinicAdmin") || session.roles.includes("SystemAdmin");
  if (!isAdmin) {
    throw createAxiosError(config, 403, {
      title: "Доступ запрещен",
      message: "У вас недостаточно прав для просмотра этого раздела.",
    });
  }

  return createResponse(config, 200, {
    tenantId: session.tenantId,
    tenantSlug: session.tenantSlug,
    membershipId: session.membershipId,
    roles: session.roles,
    isSystemAdmin: session.roles.includes("SystemAdmin"),
  });
}

function getPatientSessionOrThrow(config: InternalAxiosRequestConfig): MockSession {
  const session = getSessionFromAuthHeader(config);
  if (!session) {
    throw createAxiosError(config, 401, {
      title: "Не авторизован",
      message: "Сначала выполните вход.",
    });
  }

  if (!session.roles.includes("Patient") || !session.patientId) {
    throw createAxiosError(config, 403, {
      title: "Доступ запрещен",
      message: "Только пациент может работать со своими лекарствами.",
    });
  }

  return session;
}

function getDashboardStateForSession(session: MockSession): MockDashboardBlockState {
  const key = `${session.tenantId}:${session.patientId}`;
  const existing = mockDashboardBlockByPatient[key];

  if (existing) {
    return existing;
  }

  const initial = createDefaultDashboardBlockState();
  mockDashboardBlockByPatient[key] = initial;
  return initial;
}

function normalizeDashboardSummaryRows(rawRows: unknown): number[] {
  if (!Array.isArray(rawRows) || rawRows.length === 0) {
    return [];
  }

  const result: number[] = [];
  for (const rawValue of rawRows) {
    const parsed = Number(rawValue);
    if (!Number.isFinite(parsed)) {
      return [];
    }

    result.push(Math.min(100, Math.max(0, Math.round(parsed))));
  }

  return result;
}

function normalizeDashboardPayload(config: InternalAxiosRequestConfig) {
  const body = (config.data ? JSON.parse(config.data as string) : {}) as {
    data?: {
      completion?: unknown;
      completionDayLabel?: unknown;
      recommendation?: unknown;
      appointmentTime?: unknown;
      appointmentDate?: unknown;
      summaryDate?: unknown;
      summaryRows?: unknown;
    };
  };

  const data = body.data;
  const validationErrors: Record<string, string[]> = {};

  if (!data) {
    throw createAxiosError(config, 400, {
      title: "Проверьте корректность заполнения полей.",
      errors: { data: ["Передайте данные блока для сохранения."] },
    });
  }

  const completion = Number(data.completion);
  if (!Number.isFinite(completion) || completion < 0 || completion > 100) {
    validationErrors["data.completion"] = ["Процент заполнения должен быть в диапазоне от 0 до 100."];
  }

  const completionDayLabel = typeof data.completionDayLabel === "string" ? data.completionDayLabel.trim() : "";
  const recommendation = typeof data.recommendation === "string" ? data.recommendation.trim() : "";
  const appointmentTime = typeof data.appointmentTime === "string" ? data.appointmentTime.trim() : "";
  const appointmentDate = typeof data.appointmentDate === "string" ? data.appointmentDate.trim() : "";
  const summaryDate = typeof data.summaryDate === "string" ? data.summaryDate.trim() : "";
  const summaryRows = normalizeDashboardSummaryRows(data.summaryRows);

  if (!completionDayLabel) {
    validationErrors["data.completionDayLabel"] = ["Название дня не должно быть пустым."];
  } else if (completionDayLabel.length > 64) {
    validationErrors["data.completionDayLabel"] = ["Название дня не должно превышать 64 символа."];
  }

  if (!recommendation) {
    validationErrors["data.recommendation"] = ["Рекомендация не должна быть пустой."];
  } else if (recommendation.length > 1024) {
    validationErrors["data.recommendation"] = ["Рекомендация не должна превышать 1024 символа."];
  }

  if (!appointmentTime) {
    validationErrors["data.appointmentTime"] = ["Время приема не должно быть пустым."];
  } else if (appointmentTime.length > 16) {
    validationErrors["data.appointmentTime"] = ["Время приема не должно превышать 16 символов."];
  }

  if (!appointmentDate) {
    validationErrors["data.appointmentDate"] = ["Дата приема не должна быть пустой."];
  } else if (appointmentDate.length > 32) {
    validationErrors["data.appointmentDate"] = ["Дата приема не должна превышать 32 символа."];
  }

  if (!summaryDate) {
    validationErrors["data.summaryDate"] = ["Дата сводки не должна быть пустой."];
  } else if (summaryDate.length > 32) {
    validationErrors["data.summaryDate"] = ["Дата сводки не должна превышать 32 символа."];
  }

  if (summaryRows.length === 0) {
    validationErrors["data.summaryRows"] = ["Передайте хотя бы одно значение интенсивности симптома."];
  }

  if (Object.keys(validationErrors).length > 0) {
    throw createAxiosError(config, 400, {
      title: "Проверьте корректность заполнения полей.",
      errors: validationErrors,
    });
  }

  return {
    completion: Math.round(completion),
    completionDayLabel,
    recommendation,
    appointmentTime,
    appointmentDate,
    summaryDate,
    summaryRows,
  };
}

async function handlePatientDashboardBlocksGet(config: InternalAxiosRequestConfig): Promise<AxiosResponse> {
  const session = getPatientSessionOrThrow(config);
  const state = getDashboardStateForSession(session);

  return createResponse(config, 200, {
    data: {
      completion: state.completion,
      completionDayLabel: state.completionDayLabel,
      recommendation: state.recommendation,
      appointmentTime: state.appointmentTime,
      appointmentDate: state.appointmentDate,
      summaryDate: state.summaryDate,
      summaryRows: [...state.summaryRows],
    },
    updatedAt: state.updatedAt,
  });
}

async function handlePatientDashboardBlocksPut(config: InternalAxiosRequestConfig): Promise<AxiosResponse> {
  const session = getPatientSessionOrThrow(config);
  const payload = normalizeDashboardPayload(config);
  const state = getDashboardStateForSession(session);

  state.completion = payload.completion;
  state.completionDayLabel = payload.completionDayLabel;
  state.recommendation = payload.recommendation;
  state.appointmentTime = payload.appointmentTime;
  state.appointmentDate = payload.appointmentDate;
  state.summaryDate = payload.summaryDate;
  state.summaryRows = [...payload.summaryRows];
  state.updatedAt = new Date().toISOString();

  return createResponse(config, 200, {
    data: {
      completion: state.completion,
      completionDayLabel: state.completionDayLabel,
      recommendation: state.recommendation,
      appointmentTime: state.appointmentTime,
      appointmentDate: state.appointmentDate,
      summaryDate: state.summaryDate,
      summaryRows: [...state.summaryRows],
    },
    updatedAt: state.updatedAt,
  });
}

function normalizeMedicinePayload(config: InternalAxiosRequestConfig) {
  const body = (config.data ? JSON.parse(config.data as string) : {}) as {
    name?: string;
    strength?: string;
    form?: string;
    note?: string;
  };

  const validationErrors: Record<string, string[]> = {};
  const normalizedName = body.name?.trim() ?? "";
  const normalizedStrength = body.strength?.trim() ?? "";
  const normalizedForm = body.form?.trim() ?? "";
  const normalizedNote = body.note?.trim() ?? "";

  if (!normalizedName) {
    validationErrors.name = ["Введите название лекарства."];
  } else if (normalizedName.length > 256) {
    validationErrors.name = ["Название лекарства не должно превышать 256 символов."];
  }

  if (normalizedStrength.length > 128) {
    validationErrors.strength = ["Поле дозировки не должно превышать 128 символов."];
  }

  if (normalizedForm.length > 128) {
    validationErrors.form = ["Поле формы выпуска не должно превышать 128 символов."];
  }

  if (normalizedNote.length > 1024) {
    validationErrors.note = ["Примечание не должно превышать 1024 символа."];
  }

  if (Object.keys(validationErrors).length > 0) {
    throw createAxiosError(config, 400, {
      title: "Проверьте корректность заполнения полей.",
      errors: validationErrors,
    });
  }

  return {
    name: normalizedName,
    strength: normalizedStrength || null,
    form: normalizedForm || null,
    note: normalizedNote || null,
  };
}

async function handlePatientMedicinesGet(config: InternalAxiosRequestConfig): Promise<AxiosResponse> {
  const session = getPatientSessionOrThrow(config);
  const medicines = mockPatientMedicines
    .filter((item) => item.tenantId === session.tenantId && item.patientId === session.patientId)
    .sort((left, right) => left.name.localeCompare(right.name, "ru"))
    .map((item) => ({
      id: item.id,
      name: item.name,
      strength: item.strength,
      form: item.form,
      note: item.note,
      createdAt: item.createdAt,
    }));

  return createResponse(config, 200, medicines);
}

async function handlePatientMedicineGetById(config: InternalAxiosRequestConfig, id: string): Promise<AxiosResponse> {
  const session = getPatientSessionOrThrow(config);
  const medicine = mockPatientMedicines.find(
    (item) => item.id === id && item.tenantId === session.tenantId && item.patientId === session.patientId,
  );

  if (!medicine) {
    throw createAxiosError(config, 404, {
      title: "Лекарство не найдено.",
    });
  }

  return createResponse(config, 200, {
    id: medicine.id,
    name: medicine.name,
    strength: medicine.strength,
    form: medicine.form,
    note: medicine.note,
    createdAt: medicine.createdAt,
  });
}

async function handlePatientMedicinesPost(config: InternalAxiosRequestConfig): Promise<AxiosResponse> {
  const session = getPatientSessionOrThrow(config);
  const payload = normalizeMedicinePayload(config);

  const medicine: MockPatientMedicine = {
    id: crypto.randomUUID(),
    tenantId: session.tenantId,
    patientId: session.patientId!,
    name: payload.name,
    strength: payload.strength,
    form: payload.form,
    note: payload.note,
    createdAt: new Date().toISOString(),
  };

  mockPatientMedicines.push(medicine);

  return createResponse(config, 200, {
    id: medicine.id,
    name: medicine.name,
    strength: medicine.strength,
    form: medicine.form,
    note: medicine.note,
    createdAt: medicine.createdAt,
  });
}

async function handlePatientMedicinePut(config: InternalAxiosRequestConfig, id: string): Promise<AxiosResponse> {
  const session = getPatientSessionOrThrow(config);
  const payload = normalizeMedicinePayload(config);
  const medicine = mockPatientMedicines.find(
    (item) => item.id === id && item.tenantId === session.tenantId && item.patientId === session.patientId,
  );

  if (!medicine) {
    throw createAxiosError(config, 404, {
      title: "Лекарство не найдено.",
    });
  }

  medicine.name = payload.name;
  medicine.strength = payload.strength;
  medicine.form = payload.form;
  medicine.note = payload.note;

  return createResponse(config, 200, {
    id: medicine.id,
    name: medicine.name,
    strength: medicine.strength,
    form: medicine.form,
    note: medicine.note,
    createdAt: medicine.createdAt,
  });
}

async function handlePatientMedicineDelete(config: InternalAxiosRequestConfig, id: string): Promise<AxiosResponse> {
  const session = getPatientSessionOrThrow(config);
  const index = mockPatientMedicines.findIndex(
    (item) => item.id === id && item.tenantId === session.tenantId && item.patientId === session.patientId,
  );

  if (index < 0) {
    throw createAxiosError(config, 404, {
      title: "Лекарство не найдено.",
    });
  }

  mockPatientMedicines.splice(index, 1);
  mockPatientMedicationSlots.forEach((slot) => {
    slot.items = slot.items.filter((item) => item.medicineId !== id);
  });
  return createResponse(config, 204, null);
}

function mapSlotForResponse(slot: MockPatientMedicationSlot) {
  return {
    id: slot.id,
    timeOfDay: slot.timeOfDay,
    createdAt: slot.createdAt,
    items: slot.items.map((item) => {
      const medicine = mockPatientMedicines.find((candidate) => candidate.id === item.medicineId);
      return {
        id: item.id,
        medicineId: item.medicineId,
        medicineName: medicine?.name ?? "Неизвестное лекарство",
        medicineStrength: medicine?.strength ?? null,
        medicineForm: medicine?.form ?? null,
        doseAmount: item.doseAmount,
        instructions: item.instructions,
        createdAt: item.createdAt,
      };
    }),
  };
}

async function handlePatientMedicationSlotsGet(config: InternalAxiosRequestConfig): Promise<AxiosResponse> {
  const session = getPatientSessionOrThrow(config);
  const slots = mockPatientMedicationSlots
    .filter((item) => item.tenantId === session.tenantId && item.patientId === session.patientId)
    .sort((left, right) => left.timeOfDay.localeCompare(right.timeOfDay))
    .map(mapSlotForResponse);

  return createResponse(config, 200, slots);
}

async function handlePatientMedicationSlotsPost(config: InternalAxiosRequestConfig): Promise<AxiosResponse> {
  const session = getPatientSessionOrThrow(config);
  const body = (config.data ? JSON.parse(config.data as string) : {}) as { timeOfDay?: string };
  const timeOfDay = body.timeOfDay?.trim() ?? "";

  if (!timeOfDay) {
    throw createAxiosError(config, 400, {
      title: "Проверьте корректность заполнения полей.",
      errors: { timeOfDay: ["Укажите время приема."] },
    });
  }

  if (!/^\d{2}:\d{2}$/.test(timeOfDay)) {
    throw createAxiosError(config, 400, {
      title: "Проверьте корректность заполнения полей.",
      errors: { timeOfDay: ["Укажите время в формате ЧЧ:ММ."] },
    });
  }

  const slot: MockPatientMedicationSlot = {
    id: crypto.randomUUID(),
    tenantId: session.tenantId,
    patientId: session.patientId!,
    timeOfDay,
    createdAt: new Date().toISOString(),
    items: [],
  };

  mockPatientMedicationSlots.push(slot);
  return createResponse(config, 200, mapSlotForResponse(slot));
}

async function handlePatientMedicationSlotDelete(config: InternalAxiosRequestConfig, slotId: string): Promise<AxiosResponse> {
  const session = getPatientSessionOrThrow(config);
  const index = mockPatientMedicationSlots.findIndex(
    (item) => item.id === slotId && item.tenantId === session.tenantId && item.patientId === session.patientId,
  );

  if (index < 0) {
    throw createAxiosError(config, 404, {
      title: "Временной слот не найден.",
    });
  }

  mockPatientMedicationSlots.splice(index, 1);
  return createResponse(config, 204, null);
}

async function handlePatientMedicationSlotItemPost(
  config: InternalAxiosRequestConfig,
  slotId: string,
): Promise<AxiosResponse> {
  const session = getPatientSessionOrThrow(config);
  const body = (config.data ? JSON.parse(config.data as string) : {}) as {
    medicineId?: string;
    doseAmount?: number;
    instructions?: string;
  };

  const validationErrors: Record<string, string[]> = {};
  if (!body.medicineId) {
    validationErrors.medicineId = ["Выберите лекарство."];
  }
  if (!body.doseAmount || Number(body.doseAmount) <= 0) {
    validationErrors.doseAmount = ["Количество должно быть больше нуля."];
  }
  if (body.instructions && body.instructions.trim().length > 1024) {
    validationErrors.instructions = ["Инструкция не должна превышать 1024 символа."];
  }

  if (Object.keys(validationErrors).length > 0) {
    throw createAxiosError(config, 400, {
      title: "Проверьте корректность заполнения полей.",
      errors: validationErrors,
    });
  }

  const slot = mockPatientMedicationSlots.find(
    (item) => item.id === slotId && item.tenantId === session.tenantId && item.patientId === session.patientId,
  );
  if (!slot) {
    throw createAxiosError(config, 404, { title: "Временной слот не найден." });
  }

  const medicine = mockPatientMedicines.find(
    (item) => item.id === body.medicineId && item.tenantId === session.tenantId && item.patientId === session.patientId,
  );
  if (!medicine) {
    throw createAxiosError(config, 404, { title: "Лекарство не найдено." });
  }

  if (slot.items.some((item) => item.medicineId === body.medicineId)) {
    throw createAxiosError(config, 409, {
      title: "Это лекарство уже добавлено в выбранный временной слот.",
    });
  }

  const item: MockPatientMedicationSlotItem = {
    id: crypto.randomUUID(),
    medicineId: medicine.id,
    doseAmount: Number(body.doseAmount),
    instructions: body.instructions?.trim() || null,
    createdAt: new Date().toISOString(),
  };

  slot.items.push(item);

  return createResponse(config, 200, {
    id: item.id,
    medicineId: medicine.id,
    medicineName: medicine.name,
    medicineStrength: medicine.strength,
    medicineForm: medicine.form,
    doseAmount: item.doseAmount,
    instructions: item.instructions,
    createdAt: item.createdAt,
  });
}

async function handlePatientMedicationSlotItemDelete(
  config: InternalAxiosRequestConfig,
  slotId: string,
  itemId: string,
): Promise<AxiosResponse> {
  const session = getPatientSessionOrThrow(config);
  const slot = mockPatientMedicationSlots.find(
    (item) => item.id === slotId && item.tenantId === session.tenantId && item.patientId === session.patientId,
  );

  if (!slot) {
    throw createAxiosError(config, 404, { title: "Временной слот не найден." });
  }

  const nextItems = slot.items.filter((item) => item.id !== itemId);
  if (nextItems.length === slot.items.length) {
    throw createAxiosError(config, 404, { title: "Связь лекарства со временным слотом не найдена." });
  }

  slot.items = nextItems;
  return createResponse(config, 204, null);
}

export const mockAdapter: AxiosAdapter = async (config: AxiosRequestConfig) => {
  const internalConfig = config as InternalAxiosRequestConfig;
  const method = (internalConfig.method ?? "get").toLowerCase();
  const url = internalConfig.url ?? "";
  const patientMedicineIdMatch = url.match(/^\/api\/patient\/medicines\/([0-9a-fA-F-]+)$/);
  const patientMedicationSlotIdMatch = url.match(/^\/api\/patient\/medication-slots\/([0-9a-fA-F-]+)$/);
  const patientMedicationSlotItemMatch = url.match(
    /^\/api\/patient\/medication-slots\/([0-9a-fA-F-]+)\/items\/([0-9a-fA-F-]+)$/,
  );
  const patientMedicationSlotItemsCreateMatch = url.match(
    /^\/api\/patient\/medication-slots\/([0-9a-fA-F-]+)\/items$/,
  );

  if (method === "post" && url === "/api/auth/login") {
    return handleLogin(internalConfig);
  }

  if (method === "post" && url === "/api/auth/register-by-invite") {
    return handleRegisterByInvite(internalConfig);
  }

  if (method === "post" && url === "/api/auth/refresh") {
    return handleRefresh(internalConfig);
  }

  if (method === "get" && url === "/api/me") {
    return handleMe(internalConfig);
  }

  if (method === "get" && url === "/api/doctor/invites") {
    return handleDoctorInvitesGet(internalConfig);
  }

  if (method === "post" && url === "/api/doctor/invites") {
    return handleDoctorInvitesPost(internalConfig);
  }

  if (method === "get" && url === "/api/admin/context") {
    return handleAdminContext(internalConfig);
  }

  if (method === "get" && url === "/api/patient/dashboard-blocks") {
    return handlePatientDashboardBlocksGet(internalConfig);
  }

  if (method === "put" && url === "/api/patient/dashboard-blocks") {
    return handlePatientDashboardBlocksPut(internalConfig);
  }

  if (method === "get" && url === "/api/patient/medicines") {
    return handlePatientMedicinesGet(internalConfig);
  }

  if (method === "post" && url === "/api/patient/medicines") {
    return handlePatientMedicinesPost(internalConfig);
  }

  if (patientMedicineIdMatch && method === "get") {
    return handlePatientMedicineGetById(internalConfig, patientMedicineIdMatch[1]);
  }

  if (patientMedicineIdMatch && method === "put") {
    return handlePatientMedicinePut(internalConfig, patientMedicineIdMatch[1]);
  }

  if (patientMedicineIdMatch && method === "delete") {
    return handlePatientMedicineDelete(internalConfig, patientMedicineIdMatch[1]);
  }

  if (method === "get" && url === "/api/patient/medication-slots") {
    return handlePatientMedicationSlotsGet(internalConfig);
  }

  if (method === "post" && url === "/api/patient/medication-slots") {
    return handlePatientMedicationSlotsPost(internalConfig);
  }

  if (patientMedicationSlotIdMatch && method === "delete") {
    return handlePatientMedicationSlotDelete(internalConfig, patientMedicationSlotIdMatch[1]);
  }

  if (patientMedicationSlotItemsCreateMatch && method === "post") {
    return handlePatientMedicationSlotItemPost(internalConfig, patientMedicationSlotItemsCreateMatch[1]);
  }

  if (patientMedicationSlotItemMatch && method === "delete") {
    return handlePatientMedicationSlotItemDelete(
      internalConfig,
      patientMedicationSlotItemMatch[1],
      patientMedicationSlotItemMatch[2],
    );
  }

  throw createAxiosError(internalConfig, 501, {
    title: "Мок-эндпоинт не реализован",
    message: `Нет мок-обработчика для ${method.toUpperCase()} ${url}`,
  });
};

export function clearMockSession() {
  setStoredSession(null);
}

export function isMockSessionActive() {
  return getStoredSession() !== null;
}
