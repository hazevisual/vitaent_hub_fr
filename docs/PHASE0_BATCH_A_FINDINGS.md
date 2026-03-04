# Phase 0 Batch A Findings

This document records execution output for:

- `D0-1`
- `B0-1`
- `F0-1`
- `DB0-1`

It follows:

- `docs/Architecture.md`
- `docs/VITAENT_UX_UI_GUIDELINES.md`

## D0-1 - DevOps Inventory

### Existing assets

- Root `docker-compose.yml`
- Root `Dockerfile` for frontend
- `backend/Dockerfile`
- Frontend `package.json`
- Backend `backend/backend.csproj`
- Root `README.md`

### Current runtime shape

- `postgres` service exists in `docker-compose.yml`
- `backend` service exists in `docker-compose.yml`
- `frontend` service exists in `docker-compose.yml`
- Backend exposes `5163`
- Frontend exposes `3001`
- Postgres exposes `5432`

### Current gaps

- No repo CI workflow exists outside `node_modules`
- No documented `.env.example` or explicit env contract was found
- Compose uses inline defaults for secrets and database settings
- Frontend service does not yet expose `VITE_API_MOCKS`
- Local runbook is not aligned to the Phase 0 board

## B0-1 - Backend Inventory

### Existing assets

- Single backend project at `backend/backend.csproj`
- Entry point at `backend/Program.cs`
- Folders: `Controllers`, `Data`, `Migrations`, `Models`, `Services`, `Settings`
- Controllers present: `AuthController.cs`, `MeController.cs`
- EF Core context present: `backend/Data/ApplicationDbContext.cs`
- Initial migration present in `backend/Migrations`

### Current backend shape

- Backend is currently organized as a monolith, not explicit API/Application/Domain/Infrastructure layers
- Authentication already exists with JWT bearer setup
- Health endpoint exists at `/health`
- Development startup applies migrations automatically
- Development startup seeds a default user

### Current gaps

- No `TenantContext`
- No multi-tenant request resolution
- No membership, tenant, role, or permission model
- Current auth endpoint is `POST /api/auth/sign-in`, not the architecture target `POST /api/auth/login`
- Current persistence model is user-only and not aligned with the architecture identity model

## F0-1 - Frontend Inventory

### Existing assets

- React + TypeScript + Vite app in `src`
- Shared API client at `src/api/client.ts`
- Auth API wrapper at `src/api/auth.ts`
- Auth provider at `src/auth/AuthProvider.tsx`
- Layout primitives found:
  - `src/pages/app/AppLayout.tsx`
  - `src/components/ui/PageContainer.tsx`
  - `src/components/ui/SoftCard.tsx`
- TanStack Query is already wired in `src/main.tsx`

### Current frontend shape

- Routing is defined centrally in `src/main.tsx`
- Protected app routes already exist under `/app`
- Existing pages are not aligned to the Vitaent medical platform module map
- Single API client pattern already exists

### Current UX and architecture gaps

- Current route structure is oriented around wellness pages, not patient, doctor, clinic admin, appointments, records, and chat
- Theme conflicts with the UX guide:
  - global `borderRadius` set to `8`
  - heavy shadow usage
  - colors differ from required neutral palette
  - typography and accent usage do not match the medical UI guidance
- Login theme assets include extra theme customization that may conflict with the no-redesign rule
- No documented mock mode path using `VITE_API_MOCKS`

## DB0-1 - Database Inventory

### Existing assets

- Postgres is the active database in Compose
- EF Core database context exists
- Initial migration exists

### Current schema shape

- Only `Users` table is represented in the current EF model
- `User` uses a username-based login model
- Unique index exists on `Username`

### Current gaps

- No `tenants` table
- No `memberships` table
- No `roles`, `permissions`, `membership_roles`, or `role_permissions`
- No domain tables for patients, doctors, appointments, medical records, care teams, or chat
- No `tenant_id` strategy exists because tenant-owned tables do not yet exist
- Current schema does not match the architecture identity model, which requires global users plus tenant memberships

## Batch A Result

Batch A is complete as an inventory pass.

## Recommended next tickets

- `D0-2`
- `D0-3`
- `B0-2`
- `DB0-2`
- `DB0-3`
- `DB0-5`
