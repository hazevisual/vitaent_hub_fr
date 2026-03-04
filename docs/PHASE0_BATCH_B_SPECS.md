# Phase 0 Batch B Specs

This document records execution output for:

- `D0-2`
- `D0-3`
- `B0-2`

It follows:

- `docs/Architecture.md`
- `docs/VITAENT_UX_UI_GUIDELINES.md`

## D0-2 - Local Service Topology

### Required local services

- `frontend`
- `backend`
- `postgres`

### Target topology

#### `postgres`

- Role: primary relational database for all backend persistence
- Container name: `vitaent-postgres`
- Internal port: `5432`
- Host port: `5432`
- Network: `vitaent-network`
- Persistence: named volume for database state
- Health gate: backend must wait for healthy database before startup

#### `backend`

- Role: ASP.NET API for auth, tenant-aware application logic, and future domain modules
- Container name: `vitaent-backend`
- Internal port: `5163`
- Host port: `5163`
- Network: `vitaent-network`
- Depends on: `postgres`
- Health gate: frontend may depend on backend startup, but frontend must also support mock mode

#### `frontend`

- Role: React application for patient, doctor, clinic admin, and shared UI
- Container name: `vitaent-frontend`
- Internal port: `3001`
- Host port: `3001`
- Network: `vitaent-network`
- Depends on: `backend` in live mode
- Exception: frontend must remain runnable with mock mode even if backend is unavailable

### Startup order

1. `postgres`
2. `backend`
3. `frontend`

### Runtime rules

- Local development entrypoint remains `docker compose up --build`
- `postgres` is mandatory for live backend mode
- `frontend` must support both live API mode and mock mode
- Service names in Compose are the canonical local integration names
- Host-exposed ports remain stable unless explicitly re-planned

### Current repo alignment

- Current `docker-compose.yml` already defines `postgres`, `backend`, and `frontend`
- Existing ports align with the target topology
- Healthchecks already exist for all three services

### Open gap

- Mock-mode behavior is not yet represented in the Compose/env contract

## D0-3 - Environment Contract

### Shared principles

- Environment variables must be documented by service
- Secrets must not be hardcoded as production values
- Sample defaults may exist for local bootstrap only
- Frontend and backend must share a stable API base URL contract

### `postgres` variables

#### Required

- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`

#### Local default intent

- `DB_NAME=vitaent`
- `DB_USER=vitaent`
- `DB_PASSWORD=vitaent`

### `backend` variables

#### Required

- `ASPNETCORE_ENVIRONMENT`
- `ASPNETCORE_URLS`
- `ConnectionStrings__DefaultConnection`
- `JwtSettings__Key`
- `JwtSettings__ExpirationMinutes`

#### Local default intent

- `ASPNETCORE_ENVIRONMENT=Development`
- `ASPNETCORE_URLS=http://+:5163`
- `ConnectionStrings__DefaultConnection=Host=postgres;Port=5432;Database=${DB_NAME};Username=${DB_USER};Password=${DB_PASSWORD}`
- `JwtSettings__ExpirationMinutes=60`

#### Secret-backed

- `JwtSettings__Key`

### `frontend` variables

#### Required in live API mode

- `VITE_API_URL`

#### Required in mock-capable frontend

- `VITE_API_MOCKS`

#### Local default intent

- `VITE_API_URL=http://localhost:5163`
- `VITE_API_MOCKS=false`

### Variable ownership

- `DevOpsAgent`: variable naming, documentation, local/CI wiring
- `BackendAgent`: backend configuration consumption
- `FrontendAgent`: frontend configuration consumption and mock/live switching
- `DatabaseAgent`: connection and migration assumptions derived from DB variables

### Contract rules

- `VITE_API_URL` must point to the backend host port in local live mode
- `VITE_API_MOCKS=true` must allow frontend startup without backend dependency for feature development
- Compose defaults are acceptable for local bootstrap, but documented contract values take precedence
- Backend must not depend on frontend variables
- Database credentials must be consumed through the backend connection string, not duplicated in business logic

### Current repo alignment

- `docker-compose.yml` already uses `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- `docker-compose.yml` already uses `ASPNETCORE_ENVIRONMENT`, `ASPNETCORE_URLS`, `ConnectionStrings__DefaultConnection`, `JwtSettings__Key`, `JwtSettings__ExpirationMinutes`
- `docker-compose.yml` already uses `VITE_API_URL`

### Open gaps

- `VITE_API_MOCKS` is not yet defined in runtime configuration
- No `.env.example` or equivalent env reference was found
- `backend/appsettings.json` contains local defaults that should be treated as development-only fallback values

## B0-2 - Layered Backend Architecture

### Required target structure

- `API`
- `Application`
- `Domain`
- `Infrastructure`

### Layer responsibilities

#### API

- Controllers
- Request validation
- Authentication entrypoints
- DTO input/output mapping
- HTTP status and `ProblemDetails` handling

#### Application

- Use cases
- Orchestration
- Tenant-aware authorization policies
- Transaction boundaries
- Coordination between domain and infrastructure

#### Domain

- Entities
- Value objects
- Domain invariants
- Domain rules independent of transport and persistence

#### Infrastructure

- EF Core
- Postgres persistence
- Repository implementations if introduced
- External services
- Token and hashing adapters if kept outside pure domain logic

### Dependency direction

1. `API -> Application`
2. `Application -> Domain`
3. `Infrastructure -> Domain`
4. `API` may depend on composition root wiring, but must not contain business rules

### Explicit prohibitions

- Controllers must not contain business orchestration
- EF entities and DbContext concerns must not define application policy
- Domain rules must not depend on HTTP or database frameworks
- Cross-tenant checks must not be left only to controllers

### Current repo alignment

- Current backend has useful assets:
  - controllers
  - EF Core context
  - migrations
  - auth services
  - settings
- Current backend does not separate API, Application, Domain, and Infrastructure layers

### Migration path from current state

1. Preserve current working API surface where needed for bootstrap continuity
2. Introduce clear layer boundaries before new domain modules are added
3. Move auth orchestration out of controllers into application services
4. Keep EF and Postgres concerns inside infrastructure-oriented boundaries
5. Introduce tenant-aware abstractions before implementing tenant-owned modules

### Bootstrap ownership map

- API layer owns controllers, DTO contracts, validation, auth middleware wiring
- Application layer owns login flow orchestration, session resolution, tenant policies, and future use cases
- Domain layer owns user, membership, tenant, role, and authorization invariants
- Infrastructure layer owns database context, migrations, JWT service implementation, password hashing implementation, and persistence mapping

### Open gaps

- No application layer exists yet
- No domain layer exists yet
- No infrastructure boundary is explicit
- Current auth flow is controller-driven
- Tenant isolation is not yet structurally represented

## Batch B Result

Batch B is complete as a specification pass.

## Recommended next tickets

- `DB0-2`
- `DB0-3`
- `DB0-5`
- `B0-3`
