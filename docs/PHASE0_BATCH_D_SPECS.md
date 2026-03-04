# Phase 0 Batch D Specs

This document records execution output for:

- `DB0-4`
- `B0-4`
- `B0-5`

It follows:

- `docs/Architecture.md`

## DB0-4 - Seed Data Strategy

### Seeded roles

The architecture defines these seeded roles:

- `Patient`
- `Doctor`
- `ClinicAdmin`
- `SystemAdmin`

### Seed scope

#### Phase 1 required seeds

- core roles
- minimum permissions required for auth bootstrap and tenant-safe access checks

#### Later module seeds

- module-specific permissions introduced with each domain module
- no need to seed all future permissions in one initial migration

### Permission growth model

Permissions should be introduced incrementally by module, but under a stable naming convention such as:

- `appointments.create`
- `appointments.read.own`
- `patients.read.assigned`
- `records.write.assigned`
- `users.manage`
- `chat.write`

### Idempotency rules

- Seed execution must be idempotent
- Re-running seeds must not create duplicate roles
- Re-running seeds must not create duplicate permissions
- Re-running seeds must not create duplicate role-permission mappings

### Execution timing

- local development: seed during safe startup or controlled seed step
- CI: seed on clean database after schema application
- production later: seed through controlled migration or deployment-safe initialization path

### Current repo mismatch

- Current startup seeds a single default user
- No role or permission seed structure exists

### Rule for future implementation

Core role seeds must exist before authorization logic is treated as complete, but user seeds and dev-only bootstrap accounts must remain separate from canonical role and permission seeds.

## B0-4 - Auth and Session Bootstrap Contract

### Required bootstrap endpoints

- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `GET /api/me`

These are the required architecture-aligned bootstrap endpoints.

### Current repo mismatch

- Current auth endpoint is `POST /api/auth/sign-in`
- No refresh endpoint exists
- `/api/me` returns only username identity

### Auth model

- `users` remain global login identities
- tenant participation is resolved through `memberships`
- session bootstrap must support users with membership in one or more tenants

### Login contract intent

#### Request

- login credential input
- password
- optional tenant selection input if required by the final resolution flow

#### Response

- access token
- refresh token or refresh contract handle
- expiration metadata
- current actor identity summary
- current tenant context when the login flow resolves a tenant
- membership and role summary sufficient for UI bootstrapping

### Refresh contract intent

#### Request

- refresh token or refresh credential

#### Response

- renewed access token
- renewed expiration metadata
- stable actor identity summary
- stable current tenant context if applicable

### `/api/me` contract intent

#### Response must support

- global user identifier
- active tenant identifier
- active tenant slug
- active membership identifier
- active roles for the tenant
- basic actor profile fields needed by the frontend shell

### Error behavior

- validation errors use `ValidationProblemDetails`
- auth failures use `401`
- tenant resolution or membership failures use `403` when authenticated but not authorized for the target tenant
- contract remains JSON DTO based

### Frontend contract notes

- current frontend `AuthResponse` shape is legacy and not architecture-aligned
- frontend bootstrap must move away from assuming a single numeric `userId` plus `userName` only
- DTO shape must support tenant-aware route guards and role-aware navigation

### Compatibility rule

If a temporary compatibility path is needed, it must be treated as transitional. New frontend work should target the architecture-aligned endpoint set and DTO contract, not the legacy `sign-in` shape.

## B0-5 - Authorization Enforcement Model

### Required model

Authorization is:

- `RBAC`
- plus policy-based authorization

Both are required.

### RBAC responsibilities

RBAC determines high-level capability from tenant-local membership roles.

Examples:

- `Patient`
- `Doctor`
- `ClinicAdmin`
- `SystemAdmin`

### Policy responsibilities

Policies determine access to specific resources inside the tenant scope.

Examples:

- patient accesses only own resources
- doctor accesses assigned patient resources
- doctor accesses patient resources when linked by appointment or care-team rule
- clinic admin manages users only inside tenant

### Enforcement layers

#### Endpoint layer

- reject unauthenticated requests
- enforce coarse role requirements
- reject missing tenant context

#### Application layer

- enforce use-case authorization
- evaluate membership, role, and policy conditions
- prevent orchestration paths from bypassing policy checks

#### Query layer

- enforce tenant filtering
- constrain result sets to allowed actor scope
- do not rely on post-query filtering for protected resources

### SystemAdmin rule

- cross-tenant access is exceptional
- cross-tenant access must require explicit administrative intent
- cross-tenant access should be treated as auditable behavior
- SystemAdmin must not become a default bypass path for normal tenant flows

### Bootstrap endpoint classification

#### `POST /api/auth/login`

- authentication flow
- no prior tenant resource authorization, but must respect tenant resolution rules if tenant-scoped login is used

#### `POST /api/auth/refresh`

- session continuation flow
- must preserve actor and tenant integrity

#### `GET /api/me`

- authenticated
- tenant-aware
- must reflect resolved membership and roles for the active tenant context

### Current repo mismatch

- current authorization is effectively authentication-only
- no role model exists
- no policy model exists
- no tenant query filtering exists

### Non-negotiable rule

No future tenant-owned endpoint should be considered complete unless authorization exists at endpoint, application, and query layers together.

## Batch D Result

Batch D is complete as a specification pass.

## Recommended next tickets

- `F0-2`
- `F0-3`
- `F0-5`
