# VITAENT — Codex Agent Guide (Architecture + Task Rules)

This document is a hard contract for Codex when implementing tasks in this repository.
If a task conflicts with this doc, this doc wins unless the task explicitly overrides it.

---

## 1) Goals

1) Build a multi-tenant medical information system with clear separation of:
- Identity (login, sessions)
- Tenancy (clinic/tenant boundaries)
- Authorization (roles, permissions, policies)
- Domain data (patients, doctors, appointments, records, chat)

2) Enable parallel development:
- Frontend can ship screens using mocks/stubs
- Backend can be built incrementally without breaking UI contracts
- Contracts (DTO + error shapes) stay stable

---

## 2) Non-negotiables (Must Always Hold)

### Tenancy
- Every domain record that belongs to a clinic MUST have `tenant_id`.
- Every request MUST execute within a resolved TenantContext.
- Never allow cross-tenant reads/writes.

### Roles are per tenant membership
- Roles are NOT global for a user.
- A user can have different roles in different tenants.

### Authorization is enforced on server
- Frontend can hide UI, but server is the source of truth.
- Authorization must be enforced:
  1) at endpoint (coarse)
  2) inside service/domain operation (true rules)
  3) by data filtering (tenant + ownership/assignment)

### UI Contract
- Follow `docs/VITAENT_UX_UI_GUIDELINES.md` strictly.
- Use existing primitives: `PageContainer`, `SoftCard`, existing app layout patterns.
- Do NOT introduce new page architecture or redesign.
- Do NOT add new libraries unless task explicitly allows.

### Quality & Scope
- Keep changes minimal and localized.
- List changed files at the end of the task.
- Provide concrete acceptance steps (what to click, what should happen).

---

## 3) Architecture Overview

### Backend (recommended layering)
- API layer: controllers/handlers, DTO mapping, endpoint-level auth checks
- Application layer: use-cases/services, orchestration, policies
- Domain layer: entities, invariants, domain rules
- Infrastructure: EF Core/Postgres, repositories, integrations

### Frontend
- React + TS + Vite + MUI + TanStack Query
- Stable layout: prevent overflow issues (`minWidth: 0`, scroll containers, fixed headers when required)
- A single API client module; no ad-hoc fetch scattered across pages

---

## 4) Identity, Tenancy, and Access Control

### 4.1 Entities (conceptual)
- User: global login identity
- Tenant: clinic/organization
- Membership: user inside a tenant
- Roles: Patient / Doctor / ClinicAdmin / (optional) SystemAdmin
- Permissions: granular capabilities (strings)
- Policies: ABAC rules based on tenant + ownership/assignment

### 4.2 Recommended minimal DB tables
Identity:
- `users` (global)
  - id, email/phone, password_hash (or SSO), status, created_at
Tenancy:
- `tenants`
  - id, slug/subdomain, name, status
- `memberships`
  - id, user_id, tenant_id, status (invited/active/blocked), created_at
RBAC:
- `roles` (seed)
  - id, name (Patient/Doctor/ClinicAdmin/SystemAdmin)
- `membership_roles`
  - membership_id, role_id
- `permissions` (seed)
  - id, name (appointments.create, records.read, users.manage, ...)
- `role_permissions`
  - role_id, permission_id

Domain profiles:
- `patients`
  - id, tenant_id, membership_id (unique per tenant), display fields
- `doctors`
  - id, tenant_id, membership_id (unique per tenant), specialty, experience, etc.
Relationships for policies:
- `care_team` (doctor ↔ patient assignment)
  - tenant_id, doctor_id, patient_id, role, start_at, end_at
Core domain:
- `appointments`
  - id, tenant_id, patient_id, doctor_id, status, starts_at, ends_at
- `medical_records`
  - id, tenant_id, patient_id, created_by_doctor_id, type, payload, created_at
Chat (later):
- `chat_threads`
  - id, tenant_id, patient_id, doctor_id (or participants)
- `chat_messages`
  - id, tenant_id, thread_id, sender_membership_id, text, created_at

Constraints:
- All domain tables must have `tenant_id` + indexes on `(tenant_id, id)`.
- `memberships`: unique `(tenant_id, user_id)`.
- `patients/doctors`: unique `(tenant_id, membership_id)`.

### 4.3 JWT / Session Claims (minimum viable)
- `sub` = userId
- `membershipId` (active tenant membership)
- `tenantId` (active tenant)
- `roles` (optional; can also be loaded server-side)
- optionally `patientId` / `doctorId` if resolved cheaply and stable

Token strategy:
- Access token short-lived
- Refresh token/session stored server-side (or rotating refresh)

### 4.4 Authorization model
Use RBAC + Policies:
- RBAC: “who you are” in this tenant
- Policy: “can you act on THIS resource” (tenant + ownership/assignment)

Examples (must be enforced server-side):
- Patient can read ONLY own patient data (`patient_id == actor.patientId`)
- Doctor can read/write ONLY assigned patients OR patients with appointments relationship
- ClinicAdmin can manage users within tenant, not across tenants
- SystemAdmin can cross-tenant (must be audited)

---

## 5) API Conventions

### 5.1 Tenant resolution
Preferred order:
1) Subdomain/host → tenant
2) Explicit `tenant` query param (legacy / current project pattern)
3) Header `X-Tenant` if needed

Within this project tasks may use:
- `?tenant=clinic1` (if already used in existing endpoints)

### 5.2 Stable response shapes
Success:
- JSON DTOs with stable field naming
- Use ISO strings for dates

Errors (mandatory):
- Validation: `ValidationProblemDetails` (field errors)
- Other: `ProblemDetails` (title, detail, status, traceId)

HTTP status conventions:
- 400 validation / bad request
- 401 unauthenticated
- 403 forbidden (auth ok, policy fails)
- 404 not found (resource missing in tenant scope)
- 409 conflict (invalid transition, double submit)

### 5.3 Minimal endpoints to enable frontend integration early
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `GET /api/me` → `{ user, tenant, roles, patientId?, doctorId? }`
- `GET /api/patients/me`
- `GET /api/appointments?mine=1`

When implementing new endpoints:
- Always include tenant scope rules
- Always return ProblemDetails/ValidationProblemDetails on errors

---

## 6) Frontend Conventions (Vitaent UI)

### 6.1 Layout rules
- Use `PageContainer` and `SoftCard` (existing primitives).
- Keep headers that must be static as non-scrolling; use internal scroll areas for long content.
- Prevent layout shift from long text:
  - `minWidth: 0` on flex/grid children
  - Use `overflow: hidden` / `overflowY: auto` on scrollable sub-blocks
  - Avoid global scaling hacks

### 6.2 Data fetching
- Use TanStack Query for all server state.
- Mutations:
  - disable buttons while in-flight
  - show simple inline error per row or page-level error
  - invalidate/refetch on success

### 6.3 Mock strategy (parallel development)
If backend endpoint is not available yet:
- Use a single switch: `VITE_API_MOCKS=true`
- Implement mocks via MSW or a thin mock adapter inside the API client.
- Mock data MUST follow intended DTO shape so replacing with real API is painless.

---

## 7) Task Authoring Rules (How Codex Must Execute Tasks)

### 7.1 Task format (must follow)
Use this structure:

Task N: <Short title>

Follow docs/VITAENT_UX_UI_GUIDELINES.md strictly

Scope:
- <List primary file paths>
- (If needed) <Secondary file paths, keep minimal>

Do:
1) <Explicit bullet steps>
2) <Exact endpoint/contracts if relevant>
3) <UX rules (disable, errors, scroll behavior)>

Do NOT:
- <No new libraries>
- <No redesign / no routing changes / no global theme changes unless required>

Acceptance:
- <Concrete steps to verify in UI/API>
- <Expected results>
- <Build/test commands if applicable>

At the end:
1) List changed files
2) Short summary of what changed and where

### 7.2 Change discipline
- Prefer minimal edits in existing modules over adding new global abstractions.
- Avoid refactors unless task explicitly asks.
- If touching shared styles/layout, justify by concrete bug + keep impact narrow.

### 7.3 Definition of Done
A task is done only if:
- App builds successfully (frontend `npm run build`)
- No new lint/type errors introduced
- UI contract is preserved (no layout regressions at common breakpoints)
- Tenant boundaries are not violated (backend rules or mock parity)

---

## 8) Recommended permission seeds (starter set)

Patient-facing:
- `patients.read.own`
- `appointments.read.own`
- `appointments.create`
- `appointments.cancel.own`
- `chat.read.own`
- `chat.write.own`
- `records.read.own`

Doctor-facing:
- `patients.read.assigned`
- `appointments.read.assigned`
- `appointments.manage.assigned`
- `records.write.assigned`
- `chat.read.assigned`
- `chat.write.assigned`

Clinic admin:
- `users.invite`
- `users.manage`
- `roles.assign`
- `catalog.manage`

System admin (optional):
- `tenants.manage`
- `tenants.read.any`
- `users.read.any`

Policies still required for resource-level access (tenant + ownership/assignment).

---

## 9) Notes for future modules

Medical records and admin actions should be auditable:
- log: actor membershipId, tenantId, action, resourceId, timestamp
- consider separate audit table later

---

End of document.