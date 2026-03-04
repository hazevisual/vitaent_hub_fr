# Phase 0 Batch F Specs

This document records execution output for:

- `F0-4`
- `D0-4`
- `D0-5`

It follows:

- `docs/Architecture.md`
- `docs/VITAENT_UX_UI_GUIDELINES.md`

## F0-4 - Frontend Mock Mode Contract

### Purpose

Frontend development must remain unblocked when backend endpoints are incomplete or unavailable.

### Required switch

- `VITE_API_MOCKS=true`

### Behavior rules

#### Mock mode enabled

- frontend starts without requiring backend availability
- API reads and writes resolve through a mock adapter or MSW-compatible mock layer
- mocked DTOs must match real backend contracts exactly

#### Mock mode disabled

- frontend targets the live backend using `VITE_API_URL`
- auth and data flows use real HTTP endpoints

### Initial mock scope

The first required mock contracts are:

- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `GET /api/me`

These must be enough to support:

- login flow
- session bootstrap
- role-aware shell rendering
- tenant-aware navigation planning

### Mock ownership rules

- `FrontendAgent` owns mock adapter integration and mock DTO parity on the client side
- `BackendAgent` owns real DTO contract definition
- when backend DTO contracts change, mock DTOs must be updated in the same planning window before related frontend work is considered complete

### Current repo mismatch

- mock mode is not currently defined in runtime configuration
- current frontend auth code targets legacy endpoints
- no explicit mock adapter contract exists

### Review rule

Mock mode is valid only if frontend feature work can switch between mock and live API modes without per-page contract differences.

## D0-4 - Contributor Runbook Contract

### Purpose

Contributors need one clear local workflow for bootstrap, rebuild, shutdown, and troubleshooting.

### Required runbook sections

#### Prerequisites

- Docker and Docker Compose availability
- Node and .NET local tooling only if non-container workflows are documented

#### Startup

- canonical command: `docker compose up --build`
- expected startup order: `postgres`, `backend`, `frontend`
- expected host ports:
  - `5432`
  - `5163`
  - `3001`

#### Healthy state

- `postgres` accepts connections
- `backend` responds on `/health`
- `frontend` serves the application shell

#### Mode selection

- live API mode uses `VITE_API_URL`
- mock mode uses `VITE_API_MOCKS=true`
- explain when backend may be optional for frontend-only work

#### Rebuild and shutdown

- rebuild flow for container changes
- shutdown flow
- expected persistence behavior for database volume

#### Troubleshooting

- port conflicts
- backend cannot connect to database
- failed healthcheck
- frontend points to wrong API base URL
- mock mode not enabled when backend is unavailable

### Current repo mismatch

- no repo runbook exists for the defined three-service local workflow
- current `README.md` is template content and not useful for project onboarding

### Review rule

The runbook is complete only if a new contributor can determine how to start, validate, and troubleshoot local bootstrap without reading source files.

## D0-5 - CI Validation Baseline

### Purpose

CI must block structurally broken work before feature phases expand.

### Required baseline checks

#### Frontend

- install dependencies
- run frontend build

#### Backend

- restore dependencies
- compile backend

#### Container integrity

- validate container build path for frontend and backend

### Optional later checks

- frontend lint
- backend tests
- integration tests
- migration smoke tests

These can be added later, but the baseline must at least enforce build integrity.

### Failure ownership

- frontend build failure -> `FrontendAgent`
- backend compile failure -> `BackendAgent`
- container build failure -> owning agent plus `DevOpsAgent`
- env or pipeline wiring failure -> `DevOpsAgent`

### Current repo mismatch

- no repository CI workflow exists
- build validation is not currently enforced outside local manual execution

### Review rule

The baseline is sufficient only if it enforces the architecture definition of done at the minimum bootstrap level:

- frontend builds
- backend compiles
- API contracts are not silently broken by missing compile/build coverage

## Batch F Result

Batch F is complete as a specification pass.

## Phase 0 Result

Phase 0 planning is complete across all tickets in the Phase 0 task board.

## Recommended next step

- move to implementation of Phase 0 tickets or expand Phase 1 tickets with the same execution-board format
