# Vitaent

Vitaent is a multi-tenant medical platform with:

- patient portal
- doctor interface
- clinic administration
- appointments
- medical records
- chat

This repository currently contains:

- React + TypeScript + Vite frontend
- ASP.NET backend
- Postgres local runtime through Docker Compose

The architecture source of truth is [docs/Architecture.md](docs/Architecture.md).
Frontend UI work must follow [docs/VITAENT_UX_UI_GUIDELINES.md](docs/VITAENT_UX_UI_GUIDELINES.md).

## Local Development

### Prerequisites

- Docker Desktop or equivalent Docker engine with Compose support

Optional local tooling outside containers:

- Node 20+
- .NET 8 SDK

### Environment

Copy `.env.example` to `.env` and adjust values if needed.

Available local variables:

- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `ASPNETCORE_ENV`
- `JWT_KEY`
- `JWT_EXP_MINUTES`
- `VITE_API_URL`
- `VITE_API_MOCKS`

### Start the stack

```bash
docker compose up --build
```

Expected startup order:

1. `postgres`
2. `backend`
3. `frontend`

Expected local ports:

- `5432` -> Postgres
- `5163` -> Backend API
- `3001` -> Frontend

### Health checks

- Backend health endpoint: `http://localhost:5163/health`
- Frontend: `http://localhost:3001`

### Modes

Live API mode:

- `VITE_API_URL=http://localhost:5163`
- `VITE_API_MOCKS=false`

Frontend mock-capable mode:

- `VITE_API_MOCKS=true`

Phase 0 only wires the environment contract for mock mode. Feature-complete mock adapters are still pending.

### Rebuild and shutdown

Rebuild:

```bash
docker compose up --build
```

Stop containers:

```bash
docker compose down
```

Stop containers and remove local database volume:

```bash
docker compose down -v
```

### Troubleshooting

Port conflict:

- Ensure ports `3001`, `5163`, and `5432` are free.

Backend cannot connect to database:

- Verify Postgres is healthy.
- Verify `.env` values match the Compose configuration.

Backend healthcheck fails:

- Inspect backend logs for migration or connection failures.
- Confirm the backend can reach `postgres:5432`.

Frontend points to the wrong API:

- Check `VITE_API_URL`.
- Rebuild the frontend container after environment changes.

Frontend-only work without backend:

- Set `VITE_API_MOCKS=true`.
- Mock adapter implementation is planned but not fully delivered yet.

## Validation Baseline

Frontend:

```bash
npm run build
```

Backend:

```bash
dotnet build backend/backend.csproj
```

Containers:

```bash
docker compose build
```
