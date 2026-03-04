# VITAENT — Implementation Rules for Codex Agents

Status: Active  
Scope: All implementation tasks executed by Codex agents.

This document defines strict execution rules when implementing tickets from `docs/TASKS.md`.

The purpose is to:

- preserve system architecture
- prevent uncontrolled refactors
- keep implementation predictable
- ensure safe parallel development

If a task conflicts with this document, the agent must stop and explain the conflict.

---

# 1. Mandatory Documents

Before implementing any task, agents MUST read:

docs/Architecture.md  
docs/VITAENT_UX_UI_GUIDELINES.md  
docs/TASKS.md  
docs/IMPLEMENTATION_RULES.md

These documents define system boundaries.

---

# 2. Ticket Execution Model

All work must originate from tickets defined in:

docs/TASKS.md

Agents must NOT invent new work outside a ticket.

Each ticket must contain:

Ticket ID  
Owner Agent  
Scope  
Dependencies  
Deliverable  
Acceptance criteria

If a ticket is unclear, the agent must ask for clarification before implementing.

---

# 3. Change Scope Rules

Agents must modify **only files inside the declared ticket scope**.

Example:

Scope:
backend/auth

Allowed:

backend/auth/*
backend/application/auth/*

Forbidden:

unrelated modules  
global architecture refactors

---

# 4. Architecture Protection

Agents must not change architectural boundaries.

The following layers must remain intact:

API layer  
Application layer  
Domain layer  
Infrastructure layer

Forbidden actions:

moving domain rules into controllers  
bypassing services to access database  
embedding authorization logic in UI

---

# 5. Multi-Tenant Safety Rules

Tenant isolation is a hard requirement.

All tenant-bound tables MUST include:

tenant_id

All queries must include tenant filtering.

Forbidden:

cross-tenant joins without tenant filter  
global reads of tenant data

---

# 6. Authorization Rules

Authorization must be enforced in backend services.

Frontend checks are allowed only for UI convenience.

Server must enforce:

RBAC  
policy rules  
tenant boundaries

---

# 7. Frontend Implementation Rules

Frontend agents must follow:

docs/VITAENT_UX_UI_GUIDELINES.md

Mandatory primitives:

AppLayout  
PageContainer  
SoftCard

Forbidden:

creating alternative layout wrappers  
changing global theme  
introducing new color schemes

---

# 8. API Contract Rules

Backend responses must follow stable shapes.

Success responses:

JSON DTOs

Error responses:

ProblemDetails  
ValidationProblemDetails

Dates must use ISO format.

Breaking DTO changes are forbidden without updating mocks.

---

# 9. Mock Compatibility

Frontend may run in mock mode.

Environment variable:

VITE_API_MOCKS=true

Mock responses must match backend DTO structure.

This ensures seamless transition from mock to real API.

---

# 10. DevOps Rules

Local development must work with:

docker compose up --build

Agents must not introduce environment requirements that break local startup.

All services must have clear environment variable contracts.

---

# 11. Refactoring Policy

Refactors are forbidden unless:

1. explicitly requested by ticket
2. required to fix a critical issue

If refactor is required:

agent must justify the change.

---

# 12. Definition of Done

A ticket is considered complete only if:

application builds successfully  
no new lint/type errors  
tenant isolation rules respected  
API responses match contracts  
UI layout follows UX guidelines

---

# 13. Reviewer Gate

All completed tickets must be reviewed by:

ReviewerAgent

ReviewerAgent must validate:

architecture compliance  
tenant safety  
API contract stability  
UI guideline adherence

Tickets cannot be accepted without reviewer approval.

---

# 14. Documentation Updates

If implementation introduces new modules or rules:

agents must update relevant documentation.

Examples:

Architecture.md  
TASKS.md  
environment setup docs

---

# 15. Forbidden Behaviors

Agents must NOT:

rewrite large modules  
introduce new frameworks  
change project structure  
ignore tenant rules  
break API contracts  
invent new design systems

If unsure, the agent must stop and ask for guidance.

## 16. EF Migration Integrity

All EF migrations must contain both files:

MigrationName.cs  
MigrationName.Designer.cs

Migrations missing the designer file are invalid.

Before committing migrations, agents must verify:

dotnet ef migrations list

## 17. Localization Rule

The Vitaent system is Russian-language.

All user-facing content must be written in Russian.

Agents must NOT introduce English UI text.

Allowed English:

- code
- API routes
- technical logs
- internal identifiers

All visible UI strings must be Russian.

---

End of document.