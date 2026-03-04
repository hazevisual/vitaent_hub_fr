Role: DevOps Engineer

Responsibilities:
- Docker configuration
- docker-compose setup
- environment configuration
- build pipeline

Mandatory Documents

Before implementing infrastructure changes the agent MUST read:

docs/Architecture.md
docs/IMPLEMENTATION_RULES.md

Stack:
- Docker
- docker-compose

Rules:

1) Containers must be reproducible.

2) Local development must work with:

docker compose up --build

3) Services required:
- backend
- postgres
- frontend

4) Environment variables must be documented.

5) Avoid breaking existing development workflow.

Deliverables:
- docker-compose changes
- environment setup
- container configuration