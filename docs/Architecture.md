# VITAENT — System Architecture & Codex Agent Contract

This document defines the **core architecture of the Vitaent system** and the **rules Codex agents must follow when modifying the repository**.

This file acts as the **single source of truth** for:

- system architecture
- data model
- API contracts
- multi-tenant rules
- frontend integration rules
- agent implementation constraints

If a task conflicts with this document, **Architecture.md takes precedence** unless the task explicitly overrides it.

---

# 1. System Overview

Vitaent is a **multi-tenant medical information system**.

Primary domains:

- patient portal
- doctor interface
- clinic administration
- medical records
- appointment scheduling
- doctor–patient communication

Core system layers:


Frontend (React)

↓ API

Backend (ASP.NET)

↓ ORM

Postgres


The system must support:

- multiple clinics (tenants)
- multiple roles per user
- strict data isolation between tenants
- extensible domain modules

---

# 2. Multi-Tenant Architecture (Critical)

Multi-tenancy is **non-negotiable**.

Every domain object that belongs to a clinic **must contain**:


tenant_id


Rules:

1) Every request must run inside a resolved **TenantContext**.

2) Queries must always filter by tenant.

Correct:


WHERE tenant_id = currentTenant


Incorrect:


SELECT * FROM patients


3) Cross-tenant data access is forbidden unless explicitly allowed for **SystemAdmin**.

4) Tenant isolation must be enforced at:

- API layer
- application service layer
- database queries

---

# 3. Identity Model

Users are **global identities**.

A user becomes part of a clinic through a **membership**.


User
↓
Membership
↓
Tenant


Example:

User A  
→ Doctor in Clinic A  
→ Patient in Clinic B

Roles are **assigned to memberships**, not users.

---

# 4. Core Entities

## Identity

### users
Global login identity.

Fields:


id
email
password_hash
status
created_at


---

## Tenants

### tenants


id
slug
name
status
created_at


Tenant slug may be used for:


clinic1.vitaent.app


---

## Memberships

### memberships

Represents a user belonging to a tenant.


id
user_id
tenant_id
status
created_at


Constraints:


UNIQUE (tenant_id, user_id)


---

# 5. Roles & Permissions

Roles define **high level responsibilities**.

Permissions define **specific actions**.

## Roles

Seeded roles:


Patient
Doctor
ClinicAdmin
SystemAdmin


Stored in:


roles
membership_roles


---

## Permissions

Permissions represent actions:

Examples:


appointments.create
appointments.read.own
patients.read.assigned
records.write.assigned
users.manage
chat.write


Stored in:


permissions
role_permissions


---

# 6. Domain Profiles

Membership may create domain profiles.

## patients


id
tenant_id
membership_id
display_name
birth_date
sex
created_at


Constraint:


UNIQUE (tenant_id, membership_id)


---

## doctors


id
tenant_id
membership_id
specialty
experience
created_at


Constraint:


UNIQUE (tenant_id, membership_id)


---

# 7. Core Domain Tables

## appointments


id
tenant_id
patient_id
doctor_id
status
starts_at
ends_at
created_at


---

## medical_records


id
tenant_id
patient_id
created_by_doctor_id
type
payload
created_at


---

# 8. Relationship Tables

## care_team

Defines doctor ↔ patient relationship.


tenant_id
doctor_id
patient_id
role
start_at
end_at


Used by authorization policies.

---

# 9. Chat Module (Future)

## chat_threads


id
tenant_id
patient_id
doctor_id
created_at


---

## chat_messages


id
tenant_id
thread_id
sender_membership_id
text
created_at


---

# 10. Authorization Model

Vitaent uses:


RBAC + Policy-based authorization


RBAC determines **who the user is**.

Policies determine **whether the user can access specific resources**.

Examples:

Patient:


patient_id == actor.patientId


Doctor:


doctor assigned to patient
OR
doctor has appointment with patient


ClinicAdmin:


can manage users inside tenant


SystemAdmin:


cross-tenant operations (must be audited)


Authorization must be enforced:

1) endpoint
2) service layer
3) query filtering

---

# 11. Backend Architecture

Backend must follow layered architecture.


API Layer
↓
Application Layer
↓
Domain Layer
↓
Infrastructure Layer


## API Layer

Responsibilities:

- controllers
- DTO mapping
- request validation
- authentication

---

## Application Layer

Responsibilities:

- use cases
- orchestration
- authorization policies

---

## Domain Layer

Responsibilities:

- entities
- domain invariants
- domain rules

---

## Infrastructure

Responsibilities:

- EF Core
- Postgres
- repositories
- integrations

---

# 12. API Conventions

All APIs must follow consistent contracts.

## Success responses

Return JSON DTOs.

Dates must be ISO strings.

---

## Errors

Must use:


ProblemDetails
ValidationProblemDetails


Status codes:


400 validation
401 unauthenticated
403 forbidden
404 not found
409 conflict


---

# 13. Minimal API Set

Required endpoints for frontend integration:


POST /api/auth/login
POST /api/auth/refresh

GET /api/me
GET /api/patients/me
GET /api/appointments?mine=1


These endpoints enable frontend development while backend evolves.

---

# 14. Frontend Architecture

Stack:


React
TypeScript
Vite
MUI
TanStack Query


Rules:

1) Use existing layout primitives:


PageContainer
SoftCard


2) Do not redesign layout.

3) Prevent layout shift:


minWidth: 0
overflow containers


4) Use TanStack Query for server state.

5) Use a **single API client module**.

---

# 15. Mock Strategy (Parallel Development)

Frontend must support running without backend.

Environment variable:


VITE_API_MOCKS=true


Mock strategy:

- MSW or local API adapter
- mock DTO shapes must match real API responses

---

# 16. Database Rules

All domain tables must include:


tenant_id


Required indexes:


tenant_id
foreign keys


Migrations must:

- avoid destructive operations
- preserve data integrity

---

# 17. DevOps Rules

Local development must run with:


docker compose up --build


Required services:


frontend
backend
postgres


Environment variables must be documented.

---

# 18. Codex Agent Rules

All Codex agents must:

1) Read **Architecture.md before implementing tasks**.

2) Preserve tenant isolation.

3) Avoid breaking API contracts.

4) Avoid introducing new libraries without explicit task approval.

5) Avoid UI redesign unless task requires it.

6) Keep changes minimal and localized.

---

# 19. Definition of Done

A task is complete only if:

- frontend builds successfully


npm run build


- backend compiles

- no lint or type errors

- tenant isolation is preserved

- API contracts remain stable

---

# 20. Future Extensions

Planned modules:


analytics
billing
audit logging
lab integrations
notifications


Medical actions should eventually be audited:


actor_membership_id
tenant_id
action
resource_id
timestamp


---

End of document.