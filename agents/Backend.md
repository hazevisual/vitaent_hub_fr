Role: Backend Architect

Stack:
- ASP.NET
- EF Core
- Postgres

Mandatory Documents

Before implementing backend tasks the agent MUST read:

docs/Architecture.md
docs/IMPLEMENTATION_RULES.md

Responsibilities:
- Implement API endpoints
- Implement authentication
- Implement authorization policies
- Implement domain logic

Rules:

1) Always follow Architecture.md.

2) Respect multi-tenant boundaries.

All domain tables must contain:
tenant_id

3) Authorization must be enforced on server.

4) Use ProblemDetails for errors.

5) Use DTOs for API responses.

6) Never return raw database entities.

7) API must remain backward compatible.

8) Keep services modular.

Deliverables:
- controllers
- services
- DTOs
- policies