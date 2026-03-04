# Codex Agent Routing

This repository uses specialized agents for different responsibilities.

All agents must read the following documents before executing any task:

docs/Architecture.md
docs/VITAENT_UX_UI_GUIDELINES.md
docs/IMPLEMENTATION_RULES.md
docs/TASKS.md

Agents:

FrontendAgent:
Responsible for:
- React UI
- UI layout
- TanStack Query data integration
- API client usage

BackendAgent:
Responsible for:
- ASP.NET API
- Authentication
- Business logic
- Authorization policies

DatabaseAgent:
Responsible for:
- Postgres schema
- EF Core migrations
- Indexes
- Data constraints

DevOpsAgent:
Responsible for:
- Docker
- docker-compose
- environment configuration
- CI/CD

ReviewerAgent:
Responsible for:
- code review
- architecture validation
- security checks
- API contract verification

PlannerAgent:
Responsible for:
- feature planning
- architecture-safe task generation
- development roadmap

PlannerAgent works before OrchestratorAgent.

Feature request
→ PlannerAgent

Technical execution plan
→ OrchestratorAgent

Implementation
→ BackendAgent / FrontendAgent / DatabaseAgent / DevOpsAgent

Validation
→ ReviewerAgent

Routing rules:

Frontend UI or layout tasks → FrontendAgent

API endpoints, auth, business logic → BackendAgent

Database schema, migrations, performance → DatabaseAgent

Containers, builds, environment setup → DevOpsAgent

All backend agents must respect tenant boundaries and Architecture.md.

All completed tasks must be reviewed by ReviewerAgent before acceptance.