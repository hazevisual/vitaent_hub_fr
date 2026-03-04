# Vitaent Task Board

This board follows:

- `docs/Architecture.md`
- `docs/VITAENT_UX_UI_GUIDELINES.md`

## Phase 0 - Platform Bootstrap

### Ticket ID
`D0-1`

### Owner Agent
`DevOpsAgent`

### Phase
`Phase 0 - Platform Bootstrap`

### Depends on
`None`

### Scope
Inventory current runtime assets for frontend, backend, database, Docker, environment files, and CI.

### Deliverable
A gap report listing existing bootstrap assets, missing pieces, and repo paths that affect local runtime setup.

### Acceptance
- Frontend, backend, Docker, env, and CI assets are identified.
- Missing bootstrap artifacts are listed.
- Later bootstrap tickets do not rely on unverified structure assumptions.

### Reviewer checkpoint
Verify the inventory matches the repository state and covers all required local services: `frontend`, `backend`, `postgres`.

---

### Ticket ID
`B0-1`

### Owner Agent
`BackendAgent`

### Phase
`Phase 0 - Platform Bootstrap`

### Depends on
`None`

### Scope
Inventory backend structure, configuration, and architectural gaps against the required layered design.

### Deliverable
A backend gap report with current project paths, missing layers, and bootstrap risks.

### Acceptance
- Existing backend structure is cataloged.
- Gaps against API, Application, Domain, and Infrastructure layers are identified.
- No later backend ticket depends on unverified assumptions.

### Reviewer checkpoint
Verify the backend inventory reflects the repo and highlights all conflicts with the architecture contract.

---

### Ticket ID
`F0-1`

### Owner Agent
`FrontendAgent`

### Phase
`Phase 0 - Platform Bootstrap`

### Depends on
`None`

### Scope
Inventory frontend structure, layout primitives, routing roots, and UI conflicts against the UX guidelines.

### Deliverable
A frontend gap report listing app entry points, primitive locations, existing data patterns, and UX compliance risks.

### Acceptance
- Existing frontend structure is cataloged.
- `AppLayout`, `PageContainer`, and `SoftCard` are located or marked missing.
- Conflicts with the UX/UI guidelines are identified.

### Reviewer checkpoint
Verify the inventory is accurate and explicitly checks for forbidden layout and styling patterns.

---

### Ticket ID
`DB0-1`

### Owner Agent
`DatabaseAgent`

### Phase
`Phase 0 - Platform Bootstrap`

### Depends on
`None`

### Scope
Define database conventions for naming, IDs, timestamps, tenant ownership, and migration standards.

### Deliverable
A database conventions spec covering tables, columns, keys, indexes, timestamps, and `tenant_id` rules.

### Acceptance
- Naming conventions are explicit.
- `tenant_id` requirements for tenant-owned tables are documented.
- Migration naming and review standards are defined.

### Reviewer checkpoint
Verify conventions align with Postgres use, EF migration flow, and tenant isolation requirements.

---

### Ticket ID
`D0-2`

### Owner Agent
`DevOpsAgent`

### Phase
`Phase 0 - Platform Bootstrap`

### Depends on
`D0-1`

### Scope
Define the local service topology for `frontend`, `backend`, and `postgres`.

### Deliverable
A local runtime specification covering service names, ports, dependencies, health expectations, and startup order.

### Acceptance
- All three required services are defined.
- Service responsibilities do not overlap.
- Startup and dependency order are explicit.

### Reviewer checkpoint
Verify the topology supports `docker compose up --build` and matches the architecture document.

---

### Ticket ID
`D0-3`

### Owner Agent
`DevOpsAgent`

### Phase
`Phase 0 - Platform Bootstrap`

### Depends on
`D0-2`

### Scope
Define the shared environment variable contract for local development and containers.

### Deliverable
An environment contract documenting required, optional, default, and secret-backed variables by service.

### Acceptance
- Frontend, backend, and database variables are defined.
- Secret handling is separated from sample values.
- `VITE_API_MOCKS` and backend database settings are explicitly covered.

### Reviewer checkpoint
Verify env definitions are complete, non-conflicting, and sufficient for local bootstrap.

---

### Ticket ID
`B0-2`

### Owner Agent
`BackendAgent`

### Phase
`Phase 0 - Platform Bootstrap`

### Depends on
`B0-1`

### Scope
Define the target layered backend architecture and dependency boundaries.

### Deliverable
A backend structure spec mapping responsibilities across API, Application, Domain, and Infrastructure layers.

### Acceptance
- Layer ownership is explicit.
- Dependency direction is documented.
- DTO mapping, validation, domain rules, and persistence placement are defined.

### Reviewer checkpoint
Verify the structure prevents cross-layer leakage and matches Architecture.md.

---

### Ticket ID
`DB0-2`

### Owner Agent
`DatabaseAgent`

### Phase
`Phase 0 - Platform Bootstrap`

### Depends on
`DB0-1`

### Scope
Define which schema groups are bootstrap-critical and which are deferred to later phases.

### Deliverable
A schema boundary map separating identity and tenant core from later domain modules.

### Acceptance
- Bootstrap schema scope is explicit.
- Identity and tenant entities are prioritized first.
- Deferred modules are listed intentionally.

### Reviewer checkpoint
Verify the schema boundary supports phased delivery without accidental early coupling.

---

### Ticket ID
`DB0-3`

### Owner Agent
`DatabaseAgent`

### Phase
`Phase 0 - Platform Bootstrap`

### Depends on
`DB0-1`

### Scope
Define non-destructive migration safety rules before any schema implementation begins.

### Deliverable
A migration safety policy covering prohibited operations, review requirements, rollback expectations, and drift handling.

### Acceptance
- Destructive bootstrap migration behavior is explicitly restricted.
- Review expectations are documented.
- Local and CI migration expectations are defined.

### Reviewer checkpoint
Verify the policy protects data integrity and matches Architecture.md migration rules.

---

### Ticket ID
`DB0-5`

### Owner Agent
`DatabaseAgent`

### Phase
`Phase 0 - Platform Bootstrap`

### Depends on
`DB0-1`, `DB0-2`

### Scope
Define indexing rules for tenant-safe and identity-related query paths.

### Deliverable
An indexing baseline covering `tenant_id`, foreign keys, memberships, and composite tenant-scoped access paths.

### Acceptance
- `tenant_id` indexing rules are defined.
- Foreign key indexing expectations are documented.
- Early identity and membership lookup paths are covered.

### Reviewer checkpoint
Verify the indexing baseline supports tenant filtering and avoids obvious query bottlenecks.

---

### Ticket ID
`B0-3`

### Owner Agent
`BackendAgent`

### Phase
`Phase 0 - Platform Bootstrap`

### Depends on
`B0-2`, `DB0-2`

### Scope
Define the mandatory `TenantContext` contract and request resolution flow.

### Deliverable
A tenant resolution spec describing context shape, resolution point, failure behavior, and downstream usage.

### Acceptance
- Every request path has a defined tenant resolution strategy.
- `TenantContext` is mandatory in design.
- Missing or invalid tenant resolution has explicit failure behavior.

### Reviewer checkpoint
Verify tenant enforcement is designed for API, service, and query layers with no implicit cross-tenant access.

---

### Ticket ID
`DB0-4`

### Owner Agent
`DatabaseAgent`

### Phase
`Phase 0 - Platform Bootstrap`

### Depends on
`DB0-2`, `DB0-3`

### Scope
Define the seed strategy for core roles and permissions.

### Deliverable
A seed data policy covering seeded roles, permission growth strategy, idempotency, and execution timing.

### Acceptance
- Core seeded roles are identified.
- Seed execution is idempotent by design.
- Local and CI seed timing is defined.

### Reviewer checkpoint
Verify the seed strategy supports the identity model and future authorization expansion.

---

### Ticket ID
`B0-4`

### Owner Agent
`BackendAgent`

### Phase
`Phase 0 - Platform Bootstrap`

### Depends on
`B0-2`, `B0-3`, `DB0-2`

### Scope
Define the bootstrap authentication and session contract for login, refresh, and current-user retrieval.

### Deliverable
An auth/session spec covering `POST /api/auth/login`, `POST /api/auth/refresh`, `GET /api/me`, DTO expectations, and error behavior.

### Acceptance
- Required bootstrap auth endpoints are specified.
- The global user plus membership model is reflected in session planning.
- DTO expectations are stable enough for frontend mocks.

### Reviewer checkpoint
Verify the auth contract aligns with minimal API requirements and membership-aware identity resolution.

---

### Ticket ID
`B0-5`

### Owner Agent
`BackendAgent`

### Phase
`Phase 0 - Platform Bootstrap`

### Depends on
`B0-3`, `B0-4`, `DB0-4`

### Scope
Define the bootstrap authorization model using RBAC plus policy-based enforcement.

### Deliverable
An authorization spec covering roles, permissions, policy boundaries, enforcement layers, and SystemAdmin exceptions.

### Acceptance
- RBAC and policy checks are both defined.
- Enforcement points are documented for endpoint, service, and query layers.
- SystemAdmin cross-tenant access is narrow and explicit.

### Reviewer checkpoint
Verify the model prevents tenant leakage by default and matches Architecture.md authorization rules.

---

### Ticket ID
`F0-2`

### Owner Agent
`FrontendAgent`

### Phase
`Phase 0 - Platform Bootstrap`

### Depends on
`F0-1`, `B0-4`

### Scope
Define the application shell and top-level route groups without implementing feature pages.

### Deliverable
A route and shell spec covering auth, patient, doctor, clinic admin, shared sections, and route guard expectations.

### Acceptance
- Route groups match the product module structure.
- Only approved layout primitives are used in the plan.
- Route-level loading and error shell behavior is defined.

### Reviewer checkpoint
Verify the shell plan complies with the UX guidelines and does not introduce layout redesign.

---

### Ticket ID
`F0-3`

### Owner Agent
`FrontendAgent`

### Phase
`Phase 0 - Platform Bootstrap`

### Depends on
`F0-1`, `B0-4`, `B0-5`

### Scope
Define the single frontend API client and TanStack Query integration contract.

### Deliverable
A frontend data integration spec covering API client usage, query ownership, mutation handling, and `ProblemDetails` handling.

### Acceptance
- A single API client strategy is defined.
- TanStack Query responsibilities are explicit.
- Error handling aligns with backend API conventions.

### Reviewer checkpoint
Verify the contract avoids ad hoc fetch patterns and matches Architecture.md frontend rules.

---

### Ticket ID
`F0-5`

### Owner Agent
`FrontendAgent`

### Phase
`Phase 0 - Platform Bootstrap`

### Depends on
`F0-1`

### Scope
Define a frontend UX compliance checklist based on the Vitaent UI guidelines.

### Deliverable
A checklist covering allowed primitives, spacing, colors, state handling, scroll behavior, and large-screen constraints.

### Acceptance
- Mandatory UI rules are summarized into a reviewable checklist.
- Forbidden patterns are explicitly listed.
- Layout behavior at `1920px` and `2560px` is covered.

### Reviewer checkpoint
Verify the checklist reflects the UX/UI guide and can be used as a review gate for later frontend work.

---

### Ticket ID
`F0-4`

### Owner Agent
`FrontendAgent`

### Phase
`Phase 0 - Platform Bootstrap`

### Depends on
`F0-3`, `D0-3`, `B0-4`

### Scope
Define the frontend mock mode contract for backend-independent development.

### Deliverable
A mock mode spec covering `VITE_API_MOCKS`, initial DTO scope, contract parity rules, and switching between mock and live modes.

### Acceptance
- Mock mode is treated as a first-class workflow.
- Initial mocked DTOs cover session bootstrap.
- Contract drift prevention rules are documented.

### Reviewer checkpoint
Verify mock contracts mirror backend DTO expectations and preserve parallel development safety.

---

### Ticket ID
`D0-4`

### Owner Agent
`DevOpsAgent`

### Phase
`Phase 0 - Platform Bootstrap`

### Depends on
`D0-2`, `D0-3`, `F0-4`

### Scope
Define the contributor runbook for local startup, rebuild, shutdown, and troubleshooting.

### Deliverable
A local development runbook covering prerequisites, startup flow, healthy-state expectations, mock/live modes, and common failures.

### Acceptance
- A contributor can follow the documented local workflow end to end.
- Service health expectations are explicit.
- Mock mode and live mode differences are documented.

### Reviewer checkpoint
Verify the runbook is complete, practical, and consistent with the runtime and env contracts.

---

### Ticket ID
`D0-5`

### Owner Agent
`DevOpsAgent`

### Phase
`Phase 0 - Platform Bootstrap`

### Depends on
`D0-1`, `D0-2`, `B0-2`, `F0-3`

### Scope
Define the CI validation baseline for frontend, backend, and container bootstrap integrity.

### Deliverable
A CI validation spec covering frontend build, backend compile, and container validation gates with failure ownership.

### Acceptance
- Frontend build validation is included.
- Backend compile validation is included.
- Container validation timing and ownership are defined.

### Reviewer checkpoint
Verify the CI baseline enforces the architecture definition of done without adding unrelated checks.

## Phase 1 - Role-Based Frontend Routing Enablement

### Ticket ID
`B1-ROLE-API`

### Owner Agent
`BackendAgent`

### Phase
`Phase 1 - Role-Based Frontend Routing Enablement`

### Depends on
`B0-4`, `B0-5`

### Scope
Extend `GET /api/me` so frontend role routing can rely on `roles`, `patientId`, and `doctorId` from the active tenant membership.

### Deliverable
An updated `/api/me` response contract and backend mapping logic that returns role and profile identifiers without changing authentication flow.

### Acceptance
- `/api/me` returns `roles` for authenticated tenant members.
- `/api/me` returns `patientId` when the active membership maps to a patient profile.
- `/api/me` returns `doctorId` when the active membership maps to a doctor profile.
- Non-applicable IDs are returned as `null`.
- Login, refresh, and tenant resolution semantics remain unchanged.

### Reviewer checkpoint
Verify the DTO is explicit, null-safe, and aligned with `docs/Architecture.md` for tenant membership and profile ownership.

---

### Ticket ID
`F1-ROLE-ROUTER`

### Owner Agent
`FrontendAgent`

### Phase
`Phase 1 - Role-Based Frontend Routing Enablement`

### Depends on
`B1-ROLE-API`, `F0-2`, `F0-3`

### Scope
Introduce centralized role-aware routing so patient users enter the legacy patient UI while doctor and admin roles enter the new dashboard interface.

### Deliverable
A role router integrated into the authenticated route tree that resolves destination experience from `/api/me`.

### Acceptance
- Patient users are routed to the patient route tree.
- Doctor users are routed to the doctor route tree.
- ClinicAdmin and SystemAdmin users are routed to the admin route tree.
- Routing decisions are based on server-provided identity data.
- Unknown or incomplete role state fails safely.

### Reviewer checkpoint
Verify routing logic is centralized, deterministic, and does not duplicate role branching across pages.

---

### Ticket ID
`F1-APP-SHELL-SEPARATION`

### Owner Agent
`FrontendAgent`

### Phase
`Phase 1 - Role-Based Frontend Routing Enablement`

### Depends on
`F1-ROLE-ROUTER`

### Scope
Split the authenticated experience into separate shell boundaries for patient legacy UI, doctor dashboard, and admin dashboard.

### Deliverable
A route-shell structure that isolates patient, doctor, and admin app shells while preserving the current auth/session flow.

### Acceptance
- Patient routes render inside a dedicated patient shell boundary.
- Doctor routes render inside the dashboard shell.
- Admin routes render inside the admin or dashboard shell boundary.
- Existing layout primitives and spacing rules remain intact.
- No visual redesign is introduced.

### Reviewer checkpoint
Verify shell separation respects `docs/VITAENT_UX_UI_GUIDELINES.md`, especially width, scroll, spacing, and primitive usage constraints.

---

### Ticket ID
`F1-LEGACY-PATIENT-MOUNT`

### Owner Agent
`FrontendAgent`

### Phase
`Phase 1 - Role-Based Frontend Routing Enablement`

### Depends on
`B1-ROLE-API`, `F1-APP-SHELL-SEPARATION`

### Scope
Mount the legacy patient frontend inside the current React application as the patient-role experience.

### Deliverable
A patient route subtree that renders the legacy patient UI inside the current router and authenticated app container.

### Acceptance
- The legacy patient UI is mounted inside the current React application.
- Only patient users reach the legacy patient mount through normal app routing.
- Legacy patient screens can consume the current authenticated context they require.
- Doctor and admin flows are not regressed by the patient integration.
- Only compatibility changes are introduced, not redesign work.

### Reviewer checkpoint
Verify the integration reuses the legacy patient UI, preserves auth context, and does not introduce conflicting wrappers or theme resets.

---

### Ticket ID
`F1-ROLE-GUARDS`

### Owner Agent
`FrontendAgent`

### Phase
`Phase 1 - Role-Based Frontend Routing Enablement`

### Depends on
`F1-ROLE-ROUTER`, `F1-APP-SHELL-SEPARATION`

### Scope
Harden route protection so patient users cannot access doctor or admin routes, and doctor or admin users cannot access patient routes.

### Deliverable
Centralized route guards for patient, doctor, and admin route trees based on the authenticated role payload.

### Acceptance
- Patient users are redirected away from doctor and admin route trees.
- Doctor users are redirected away from patient route trees.
- ClinicAdmin and SystemAdmin users are redirected away from patient route trees.
- Redirect behavior is deterministic and safe.
- Guard logic is centralized and consistent with `/api/me`.

### Reviewer checkpoint
Verify there are no cross-role entry points left in the route tree and that redirect targets are stable.

---

### Ticket ID
`F1-MOCK-CONTRACT-ALIGNMENT`

### Owner Agent
`FrontendAgent`

### Phase
`Phase 1 - Role-Based Frontend Routing Enablement`

### Depends on
`B1-ROLE-API`, `F1-ROLE-ROUTER`, `F0-4`

### Scope
Align frontend mock mode with the expanded `/api/me` contract so role routing and shell selection can be tested without the backend.

### Deliverable
Updated mock auth/bootstrap payloads and routing behavior for patient, doctor, and admin sessions.

### Acceptance
- Mock mode returns `roles`, `patientId`, and `doctorId` in the same shape as live `/api/me`.
- Mock patient sessions enter the patient shell.
- Mock doctor sessions enter the doctor shell.
- Mock clinic-admin and system-admin sessions enter the admin shell.
- Mock behavior stays on the shared API client path.

### Reviewer checkpoint
Verify mock and live identity contracts stay in sync and support local testing of all routing branches.

## Phase 2 - Frontend Language And Layout Normalization

### Ticket ID
`F2-UI-LANGUAGE-AUDIT`

### Owner Agent
`FrontendAgent`

### Phase
`Phase 2 - Frontend Language And Layout Normalization`

### Depends on
`F1-LEGACY-PATIENT-MOUNT`

### Scope
Audit all visible frontend text and build a complete inventory of English, mixed-language, inconsistent, and placeholder user-facing strings.

### Deliverable
A frontend text inventory covering auth, patient, doctor, admin, dialogs, forms, navigation, empty states, helper text, and shared components.

### Acceptance
- All visible text sources are mapped.
- Auth, patient, doctor, admin, dialogs, forms, navigation, placeholders, and page states are covered.
- Mixed-language and inconsistent Russian text are explicitly listed.
- The audit is detailed enough to drive direct replacement work without additional discovery.

### Reviewer checkpoint
Verify the audit covers all route-mounted pages, shared shells, and reusable components with visible user-facing text.

---

### Ticket ID
`F2-LAYOUT-SPACING-AUDIT`

### Owner Agent
`FrontendAgent`

### Phase
`Phase 2 - Frontend Language And Layout Normalization`

### Depends on
`F1-APP-SHELL-SEPARATION`, `F1-LEGACY-PATIENT-MOUNT`

### Scope
Audit spacing, padding, alignment, overflow, and large-screen stability issues across auth, patient, doctor, and admin interfaces.

### Deliverable
A layout audit grouped by spacing, alignment, overflow, scroll behavior, max-width inconsistency, and large-screen instability.

### Acceptance
- Spacing issues are identified across auth, patient, doctor, admin, cards, forms, and shells.
- Violations of the `8 / 12 / 16 / 24 / 32` spacing system are documented.
- Width, padding, and overflow issues are clearly separated by shell-level and page-level scope.
- The audit covers stability at `1920px` and `2560px`.

### Reviewer checkpoint
Verify the audit aligns with `docs/VITAENT_UX_UI_GUIDELINES.md` and captures all major layout inconsistencies before implementation starts.

---

### Ticket ID
`F2-UI-LANGUAGE-NORMALIZATION`

### Owner Agent
`FrontendAgent`

### Phase
`Phase 2 - Frontend Language And Layout Normalization`

### Depends on
`F2-UI-LANGUAGE-AUDIT`

### Scope
Replace all English user-facing text with correct Russian equivalents across the frontend while preserving interaction flow and meaning.

### Deliverable
Russian-localized user-facing text across auth, patient, doctor, admin, shared shells, and dialogs.

### Acceptance
- No visible English UI text remains.
- Navigation labels, page titles, buttons, labels, helper text, and informational text are Russian.
- Empty states, dialog text, and inline action text are Russian.
- User-facing wording remains clear and consistent with the medical platform context.

### Reviewer checkpoint
Verify the UI is fully Russian for end users and that no technical identifiers or English placeholders remain visible.

---

### Ticket ID
`F2-VALIDATION-AND-STATE-TEXT-CONSISTENCY`

### Owner Agent
`FrontendAgent`

### Phase
`Phase 2 - Frontend Language And Layout Normalization`

### Depends on
`F2-UI-LANGUAGE-NORMALIZATION`

### Scope
Normalize validation, loading, success, empty, and error-state wording so it is consistent, concise, and medically appropriate across the interface.

### Deliverable
A consistent Russian wording pass for validation messages and UI state text across all major flows.

### Acceptance
- Validation messages use consistent Russian phrasing.
- Error states use consistent Russian wording and tone.
- Empty, success, and informational states are concise and non-contradictory.
- Similar UI states use the same wording pattern across auth, patient, doctor, and admin sections.

### Reviewer checkpoint
Verify state messages are consistent across screens and do not switch tone, wording style, or language.

---

### Ticket ID
`F2-LAYOUT-SPACING-NORMALIZATION`

### Owner Agent
`FrontendAgent`

### Phase
`Phase 2 - Frontend Language And Layout Normalization`

### Depends on
`F2-LAYOUT-SPACING-AUDIT`

### Scope
Normalize page, section, form, and card spacing to the approved `8 / 12 / 16 / 24 / 32` spacing system without redesigning the interface.

### Deliverable
A spacing normalization pass across shells, pages, forms, dialogs, and cards.

### Acceptance
- Gaps and padding follow the `8 / 12 / 16 / 24 / 32` spacing system.
- Page density is consistent across auth, patient, doctor, and admin screens.
- Inconsistent padding and gap values are normalized.
- No new layout wrappers or redesign patterns are introduced.

### Reviewer checkpoint
Verify the implementation respects the spacing system and preserves the existing visual language defined in the UI guidelines.

---

### Ticket ID
`F2-CARD-ALIGNMENT-STABILIZATION`

### Owner Agent
`FrontendAgent`

### Phase
`Phase 2 - Frontend Language And Layout Normalization`

### Depends on
`F2-LAYOUT-SPACING-NORMALIZATION`

### Scope
Fix card alignment, uneven heights, inconsistent internal padding, and text-driven layout drift across patient, doctor, and admin screens.

### Deliverable
Aligned card layouts and consistent internal card spacing across the interface.

### Acceptance
- Cards align consistently in grid and flex layouts.
- Card internal padding is stable and spacing-system compliant.
- Long text does not cause visible card misalignment or control drift.
- Card layouts remain stable at `1920px` and `2560px`.

### Reviewer checkpoint
Verify card rows remain visually stable across large screens and that fixes preserve `SoftCard` and approved layout primitives.

---

### Ticket ID
`F2-OVERFLOW-AND-SCROLL-HARDENING`

### Owner Agent
`FrontendAgent`

### Phase
`Phase 2 - Frontend Language And Layout Normalization`

### Depends on
`F2-LAYOUT-SPACING-AUDIT`

### Scope
Fix horizontal overflow, clipping, unstable scroll regions, and container escapes across all major screens and shared layouts.

### Deliverable
A hardened overflow and scroll pass covering flex/grid containers, cards, lists, forms, and message layouts.

### Acceptance
- No major page introduces unintended horizontal overflow.
- Long text and controls stay within their containers.
- Scrollable regions are explicit and stable.
- `minWidth: 0`, width constraints, and overflow behavior are applied consistently where required.
- Layout remains stable at `1920px` and `2560px` without scaling artifacts.

### Reviewer checkpoint
Verify overflow and scroll fixes eliminate clipping and horizontal scroll without introducing unstable nested scroll behavior.

---

### Ticket ID
`F2-SHELL-WIDTH-AND-CONSISTENCY-FIXES`

### Owner Agent
`FrontendAgent`

### Phase
`Phase 2 - Frontend Language And Layout Normalization`

### Depends on
`F2-LAYOUT-SPACING-NORMALIZATION`, `F2-OVERFLOW-AND-SCROLL-HARDENING`

### Scope
Normalize shell-level width behavior, content column stability, and large-screen consistency across patient, doctor, admin, and auth interfaces.

### Deliverable
A shell-level layout consistency pass covering content width, alignment, and large-screen stability.

### Acceptance
- Max content width is consistent across shells and page containers.
- Content does not scale unpredictably on large displays.
- Shell header, drawer, and content regions remain aligned across roles.
- Large-screen layout remains stable at `1920px` and `2560px`.
- The implementation follows the UI guideline rules for width, spacing, and scroll containment.

### Reviewer checkpoint
Verify shell-level width and alignment are consistent across all role experiences and remain compliant with the UI guidelines.

## Phase 3 - Patient Invite Registration And Doctor Invite Generation

### Ticket ID
`DB3-INVITE-CODE-SCHEMA`

### Owner Agent
`DatabaseAgent`

### Phase
`Phase 3 - Patient Invite Registration And Doctor Invite Generation`

### Depends on
`DB0-1`, `DB0-2`, `DB0-3`

### Scope
Add a tenant-safe `patient_invite_codes` table with the required fields, constraints, statuses, and indexes for one-time patient registration invites.

### Deliverable
A migration-backed invite code schema that supports doctor-issued, tenant-bound, expiring, one-time registration codes.

### Acceptance
- A `patient_invite_codes` table exists with:
  - `id`
  - `tenant_id`
  - `code`
  - `status`
  - `created_by_doctor_id`
  - `created_at`
  - `expires_at`
  - `used_at`
  - `used_by_membership_id`
- `UNIQUE (tenant_id, code)` is enforced.
- Indexes exist for:
  - `(tenant_id, status)`
  - `(expires_at)`
  - `(created_by_doctor_id)`
- `tenant_id` is required.
- `used_by_membership_id` is nullable.
- Migration integrity is preserved, including the `.Designer.cs` file.

### Reviewer checkpoint
Verify tenant isolation at schema level, correct foreign key ownership, and no schema path that allows invite reuse after `used`.

---

### Ticket ID
`DB3-PATIENT-PROFILE-COMPAT`

### Owner Agent
`DatabaseAgent`

### Phase
`Phase 3 - Patient Invite Registration And Doctor Invite Generation`

### Depends on
`DB3-INVITE-CODE-SCHEMA`

### Scope
Ensure `patients` and `doctors` persistence is fully compatible with invite-based patient registration and doctor-based invite ownership.

### Deliverable
A schema state where patient profiles can be created from tenant memberships and doctor profiles can safely own invite codes.

### Acceptance
- `patients` supports:
  - `tenant_id`
  - `membership_id`
  - `display_name`
  - `birth_date`
  - `sex`
  - `created_at`
- `doctors` supports tenant-bound doctor profiles.
- `UNIQUE (tenant_id, membership_id)` is enforced for both `patients` and `doctors`.
- Foreign keys and indexes support:
  - patient profile creation from membership
  - doctor-owned invite code creation
- Cross-tenant profile binding is structurally impossible.

### Reviewer checkpoint
Verify patient and doctor profiles are membership-bound inside the same tenant and safe for atomic invite registration.

---

### Ticket ID
`B3-DOCTOR-INVITE-API`

### Owner Agent
`BackendAgent`

### Phase
`Phase 3 - Patient Invite Registration And Doctor Invite Generation`

### Depends on
`DB3-INVITE-CODE-SCHEMA`, `DB3-PATIENT-PROFILE-COMPAT`, `B0-3`, `B0-5`

### Scope
Implement doctor-only tenant-scoped invite generation and minimal invite retrieval endpoints.

### Deliverable
`POST /api/doctor/invites` and `GET /api/doctor/invites` with tenant-safe doctor authorization and secure invite generation.

### Acceptance
- `POST /api/doctor/invites` is implemented.
- `GET /api/doctor/invites` is implemented as a minimal recent-code listing endpoint.
- Only a `Doctor` membership in the current tenant can create invite codes for that tenant.
- Generated codes are sufficiently unguessable and human-enterable.
- One-time use is the default behavior.
- Default expiry is 30 days and is configurable.
- `POST /api/doctor/invites` returns:
  - `code`
  - `expiresAt`
- Invite codes are not logged in production.
- Invite codes may be logged in Development only.
- All reads and writes are tenant-scoped.

### Reviewer checkpoint
Verify doctor authorization is tenant-bound, no cross-tenant invite creation is possible, and production logging does not expose codes.

---

### Ticket ID
`B3-REGISTER-BY-INVITE`

### Owner Agent
`BackendAgent`

### Phase
`Phase 3 - Patient Invite Registration And Doctor Invite Generation`

### Depends on
`DB3-INVITE-CODE-SCHEMA`, `DB3-PATIENT-PROFILE-COMPAT`, `B3-DOCTOR-INVITE-API`, `B0-4`

### Scope
Implement patient registration exclusively through invite codes with atomic creation of user, membership, patient profile, and invite consumption.

### Deliverable
`POST /api/auth/register-by-invite` with transaction-safe tenant resolution from the invite code and Russian error behavior.

### Acceptance
- `POST /api/auth/register-by-invite` accepts:
  - `inviteCode`
  - `email`
  - `password`
  - `fullName`
  - `birthDate`
  - `sex`
- Tenant is resolved only from the invite code.
- Patient cannot freely choose a clinic.
- In a single transaction the system:
  - validates the code
  - creates the user
  - creates the tenant membership
  - assigns the `Patient` role
  - creates the patient profile
  - marks the invite as `used`
  - stores `used_at`
  - stores `used_by_membership_id`
- Invalid, expired, used, or revoked invites fail without partial writes.
- Invalid input uses `ValidationProblemDetails`.
- Invalid, expired, used, or revoked invite states use `ProblemDetails`.
- All user-facing error messages are Russian.
- Success returns:
  - `accessToken`
  - `refreshToken`

### Reviewer checkpoint
Verify transactional correctness, no partial persistence on failure, and strict tenant binding from invite to membership and profile creation.

---

### Ticket ID
`B3-AUTH-ME-INVITE-INTEGRATION`

### Owner Agent
`BackendAgent`

### Phase
`Phase 3 - Patient Invite Registration And Doctor Invite Generation`

### Depends on
`B3-REGISTER-BY-INVITE`, `B1-ROLE-API`

### Scope
Integrate invite-based patient registration into the existing token and `/api/me` flow.

### Deliverable
An auth integration path where a newly registered invited patient receives a valid session and correct tenant-aware `/api/me` payload.

### Acceptance
- Invite registration returns working tokens.
- `/api/me` reflects:
  - `Patient` role
  - invite-derived tenant
  - `membershipId`
  - `patientId`
- The registered patient enters the normal auth flow without a special-case client path.
- Refresh behavior remains consistent.

### Reviewer checkpoint
Verify newly registered patients cannot escape tenant boundaries and that `/api/me` remains contract-stable and profile-aware.

---

### Ticket ID
`B3-DEV-SEED-CLINICS-AND-DOCTORS`

### Owner Agent
`BackendAgent`

### Phase
`Phase 3 - Patient Invite Registration And Doctor Invite Generation`

### Depends on
`DB3-PATIENT-PROFILE-COMPAT`, `B3-DOCTOR-INVITE-API`

### Scope
Add Development-only test clinics and doctor accounts so invite generation can be used immediately in local development.

### Deliverable
Development seed data for four clinics and at least one doctor per clinic, plus developer-facing credential documentation.

### Acceptance
- In Development only, the following clinics are seeded:
  - `VitaWest`
  - `VitaSouth`
  - `VitaNorth`
  - `VitaCentral`
- At least one doctor user exists per clinic.
- Each seeded doctor has:
  - user
  - membership
  - `Doctor` role
  - doctor profile
- Seeds are idempotent.
- Generated invite codes can be created immediately after startup.
- Test credentials are documented in:
  - `docs/TASKS.md`
  - or `docs/SEED_ACCOUNTS.md`

### Reviewer checkpoint
Verify Development-only scope, tenant-correct doctor assignment, and no unsafe seed behavior in non-Development environments.

---

### Ticket ID
`F3-PATIENT-INVITE-REGISTRATION-UI`

### Owner Agent
`FrontendAgent`

### Phase
`Phase 3 - Patient Invite Registration And Doctor Invite Generation`

### Depends on
`B3-REGISTER-BY-INVITE`, `B3-AUTH-ME-INVITE-INTEGRATION`, `F1-ROLE-ROUTER`

### Scope
Replace free patient registration with invite-code-only registration and remove manual clinic selection from the patient flow.

### Deliverable
A patient registration form that uses invite code, patient identity data, and existing auth/routing flow without UI redesign.

### Acceptance
- Patient registration UI contains only:
  - invite code
  - email
  - password
  - full name
  - birth date
  - sex
- Patient cannot select a clinic manually.
- Existing primitives are used:
  - `PageContainer`
  - `SoftCard`
- On success, the patient is logged in and routed to the patient UI.
- On failure, Russian backend error messages are shown.
- Layout remains stable and guideline-compliant.

### Reviewer checkpoint
Verify the frontend does not expose tenant selection, does not bypass invite-only registration, and stays within existing UI primitives and spacing rules.

---

### Ticket ID
`F3-DOCTOR-INVITE-GENERATOR-UI`

### Owner Agent
`FrontendAgent`

### Phase
`Phase 3 - Patient Invite Registration And Doctor Invite Generation`

### Depends on
`B3-DOCTOR-INVITE-API`, `F1-APP-SHELL-SEPARATION`

### Scope
Add a minimal doctor-facing section or page for generating invite codes.

### Deliverable
A small doctor UI that creates an invite code and displays the generated code with its expiry time.

### Acceptance
- A doctor-only UI exists for invite generation.
- The UI includes a button:
  - `Сгенерировать код приглашения`
- After generation, the UI shows:
  - generated code
  - expiry date/time
- The UI is minimal and consistent with the current dashboard interface.
- No layout redesign or new design system is introduced.
- Layout remains stable at `1920px` and `2560px`.

### Reviewer checkpoint
Verify the doctor UI is tenant-safe, role-appropriate, and visually compliant with the Vitaent UI guidelines.

---

### Ticket ID
`F3-INVITE-ERRORS-AND-FLOW-GUARDS`

### Owner Agent
`FrontendAgent`

### Phase
`Phase 3 - Patient Invite Registration And Doctor Invite Generation`

### Depends on
`F3-PATIENT-INVITE-REGISTRATION-UI`, `F3-DOCTOR-INVITE-GENERATOR-UI`, `B3-AUTH-ME-INVITE-INTEGRATION`

### Scope
Align invite registration and invite generation with Russian error handling, success flow, and role-safe routing behavior.

### Deliverable
Frontend flow handling for invite-specific success/error states with stable routing and no tenant inference on the client.

### Acceptance
- Invalid, expired, used, and revoked invite states are shown in Russian.
- Successful invite registration routes into the patient shell.
- Doctor and admin flows continue to work normally.
- Patient registration cannot fall back to clinic self-selection.
- Request states disable buttons and avoid layout shift.
- ProblemDetails and ValidationProblemDetails responses are handled correctly in the UI.

### Reviewer checkpoint
Verify the client does not infer tenant from UI state, that server errors surface cleanly in Russian, and that role routing remains correct after invite registration.

---

### Ticket ID
`D3-INVITE-CONFIG-CONTRACT`

### Owner Agent
`DevOpsAgent`

### Phase
`Phase 3 - Patient Invite Registration And Doctor Invite Generation`

### Depends on
`B3-DOCTOR-INVITE-API`, `B3-DEV-SEED-CLINICS-AND-DOCTORS`

### Scope
Document and wire any required environment/config contract for invite expiry and Development-only invite logging behavior.

### Deliverable
An environment and runtime contract update for invite TTL, Development logging behavior, and local developer documentation.

### Acceptance
- Invite expiry configuration is documented if it is environment-driven.
- Development-only invite logging behavior is documented.
- `docker compose up --build` remains valid.
- Seed doctor credentials are documented alongside the local development setup.

### Reviewer checkpoint
Verify the config contract does not enable production-unsafe logging by default and does not break local runtime behavior.

---

### Ticket ID
`B3-CONTRACT-REFRESH-TOKEN-ALIGNMENT`

### Owner Agent
`BackendAgent`

### Phase
`Phase 3 - Patient Invite Registration And Doctor Invite Generation`

### Depends on
`B3-REGISTER-BY-INVITE`, `B3-AUTH-ME-INVITE-INTEGRATION`

### Scope
Align the success contract of `POST /api/auth/register-by-invite` with the Phase 3 requirements so it returns both `accessToken` and `refreshToken` using the existing auth strategy.

### Deliverable
A localized backend auth update where invite-based registration returns both tokens and remains compatible with the existing refresh flow.

### Acceptance
- `POST /api/auth/register-by-invite` returns:
  - `accessToken`
  - `refreshToken`
- Invite registration uses the same token issuing strategy as the normal login path.
- Short-lived access token behavior is preserved.
- The returned refresh token is compatible with `POST /api/auth/refresh`.
- Existing auth contract compatibility is preserved.
- Changes remain localized to the auth/token surface.

### Reviewer checkpoint
Verify the invite registration response matches the documented contract in `docs/TASKS.md`, remains backward-compatible, and does not weaken tenant-aware auth behavior.

---

### Ticket ID
`F3-DOCTOR-INVITE-ROUTE-GUARD-HARDENING`

### Owner Agent
`FrontendAgent`

### Phase
`Phase 3 - Patient Invite Registration And Doctor Invite Generation`

### Depends on
`F3-DOCTOR-INVITE-GENERATOR-UI`, `F1-ROLE-GUARDS`

### Scope
Restrict doctor invite generation UI so it is visible and routable only for `Doctor` role members.

### Deliverable
A frontend route guard update that prevents `ClinicAdmin` and `SystemAdmin` from opening the doctor invite screen while preserving backend enforcement.

### Acceptance
- `DoctorInvitesPage` is accessible only to `Doctor`.
- `ClinicAdmin` and `SystemAdmin` cannot access `/app/doctor/invites`.
- Non-doctor access results in a safe redirect or equivalent deny-flow.
- Backend enforcement remains unchanged.
- The fix is minimal and localized to routing/guards.

### Reviewer checkpoint
Verify the UI no longer exposes doctor-only invite generation to admin users and that the updated route behavior remains consistent with role-based shell separation.

---

### Ticket ID
`F3-INVITE-STATUS-RUSSIAN-MAPPING`

### Owner Agent
`FrontendAgent`

### Phase
`Phase 3 - Patient Invite Registration And Doctor Invite Generation`

### Depends on
`F3-DOCTOR-INVITE-GENERATOR-UI`

### Scope
Replace raw backend invite status values with Russian UI labels and ensure all visible invite-status text on the doctor invite page is Russian.

### Deliverable
A doctor invite page update that maps backend statuses to Russian user-facing text.

### Acceptance
- Invite statuses are rendered through UI mapping:
  - `active` -> `Активен`
  - `used` -> `Использован`
  - `revoked` -> `Отозван`
  - `expired` -> `Просрочен`
- Raw enum values are not shown on `DoctorInvitesPage`.
- All visible invite-status text on the page is Russian.
- Status mapping is centralized or at least consistently implemented in one place.

### Reviewer checkpoint
Verify there are no raw backend status strings left in the doctor invite UI and that all invite-related text is Russian and guideline-compliant.

---

### Ticket ID
`R3-INVITE-FLOW-CLOSURE-REVIEW`

### Owner Agent
`ReviewerAgent`

### Phase
`Phase 3 - Patient Invite Registration And Doctor Invite Generation`

### Depends on
`B3-CONTRACT-REFRESH-TOKEN-ALIGNMENT`, `F3-DOCTOR-INVITE-ROUTE-GUARD-HARDENING`, `F3-INVITE-STATUS-RUSSIAN-MAPPING`

### Scope
Review the remaining invite-flow closure work across backend and frontend: response contract, doctor-only route exposure, and Russian invite-status rendering.

### Deliverable
A focused review result confirming whether the remaining documented gaps in the invite flow are closed.

### Acceptance
- `POST /api/auth/register-by-invite` returns both `accessToken` and `refreshToken`.
- The invite registration response matches the documented Phase 3 contract.
- `ClinicAdmin` and `SystemAdmin` cannot access the doctor invite UI.
- `Doctor` retains access to invite generation.
- `DoctorInvitesPage` shows Russian status labels only.
- Tenant isolation and transactional correctness remain intact after the fixes.

### Reviewer checkpoint
Verify that no new cross-tenant or cross-role exposure was introduced and that the final invite-flow implementation matches the acceptance criteria in Phase 3.

---

## Phase 4 - Patient Medicines And Schedule

### Ticket ID
`DB4-PATIENT-MEDICATION-SCHEMA`

### Owner Agent
`DatabaseAgent`

### Phase
`Phase 4 - Patient Medicines And Schedule`

### Depends on
`None`

### Scope
Add tenant-scoped persistence for patient medicines, medication schedule slots, and slot-medication assignments.

### Deliverable
An EF migration and schema update that creates:
- `patient_medicines`
- `patient_medication_slots`
- `patient_medication_slot_items`

### Acceptance
- `patient_medicines` includes:
  - `id`
  - `tenant_id`
  - `patient_id`
  - `name`
  - `strength`
  - `form`
  - `note`
  - `created_at`
- `patient_medication_slots` includes:
  - `id`
  - `tenant_id`
  - `patient_id`
  - `time_of_day`
  - `created_at`
- `patient_medication_slot_items` includes:
  - `id`
  - `tenant_id`
  - `patient_id`
  - `slot_id`
  - `medicine_id`
  - `dose_amount`
  - `instructions`
  - `created_at`
- All three tables have an index on `(tenant_id, patient_id)`.
- Duplicate assignment of the same medicine to the same slot is prevented.
- All foreign keys are tenant-safe and patient-safe.
- The migration contains both the migration file and the designer file.

### Reviewer checkpoint
Verify the schema cannot bind slot items to another tenant's or another patient's slot or medicine, and that indexing supports tenant-safe patient-scoped queries.

---

### Ticket ID
`B4-PATIENT-MEDICATION-DTOS-AND-POLICIES`

### Owner Agent
`BackendAgent`

### Phase
`Phase 4 - Patient Medicines And Schedule`

### Depends on
`DB4-PATIENT-MEDICATION-SCHEMA`

### Scope
Define stable DTOs and backend ownership enforcement for patient medicines and schedule APIs.

### Deliverable
A backend contract layer for medicine DTOs, slot DTOs, slot item DTOs, and centralized patient ownership checks in the current tenant.

### Acceptance
- Stable DTOs exist for:
  - medicine list/detail/create/update
  - slot list/create/delete
  - slot item create/delete
- All endpoints require authentication.
- All endpoints resolve tenant from backend context, not from query parameters.
- All operations are limited to the current patient profile.
- Errors use `ProblemDetails` and `ValidationProblemDetails`.
- DTOs are stable enough for mock/live parity.

### Reviewer checkpoint
Verify tenant and patient ownership are enforced on the server, and the client is not required to send tenant context manually.

---

### Ticket ID
`B4-PATIENT-MEDICINES-CRUD-API`

### Owner Agent
`BackendAgent`

### Phase
`Phase 4 - Patient Medicines And Schedule`

### Depends on
`B4-PATIENT-MEDICATION-DTOS-AND-POLICIES`

### Scope
Implement CRUD API for patient medicines with real database persistence.

### Deliverable
Patient medicine endpoints:
- `GET /api/patient/medicines`
- `GET /api/patient/medicines/{id}`
- `POST /api/patient/medicines`
- `PUT /api/patient/medicines/{id}`
- `DELETE /api/patient/medicines/{id}`

### Acceptance
- The patient can view only their own medicines in the current tenant.
- The patient can create a medicine.
- The patient can edit `name`, `form`, `strength`, and `note`.
- The patient can delete a medicine.
- Data reloads correctly from the database after refresh.
- Validation failures use `ValidationProblemDetails`.
- Access to another patient's medicine is denied.

### Reviewer checkpoint
Verify all read/write/delete paths are tenant-filtered and patient-filtered, and foreign IDs cannot be used to access another patient's medicines.

---

### Ticket ID
`B4-PATIENT-MEDICATION-SCHEDULE-API`

### Owner Agent
`BackendAgent`

### Phase
`Phase 4 - Patient Medicines And Schedule`

### Depends on
`B4-PATIENT-MEDICATION-DTOS-AND-POLICIES`, `B4-PATIENT-MEDICINES-CRUD-API`

### Scope
Implement CRUD API for schedule slots and slot-medication assignments with real database persistence.

### Deliverable
Patient schedule endpoints:
- `GET /api/patient/medication-slots`
- `POST /api/patient/medication-slots`
- `DELETE /api/patient/medication-slots/{id}`
- `POST /api/patient/medication-slots/{slotId}/items`
- `DELETE /api/patient/medication-slots/{slotId}/items/{itemId}`

### Acceptance
- The patient can view only their own slots in the current tenant.
- The patient can create a time slot.
- The patient can delete a time slot.
- The patient can assign multiple medicines to one slot.
- The patient can remove a medicine from a slot.
- Schedule changes persist and reload correctly after refresh.
- Another patient's slot or medicine cannot be referenced.
- Errors use `ProblemDetails` and `ValidationProblemDetails`.

### Reviewer checkpoint
Verify tenant safety and patient ownership at slot and slot-item level, including assignment and delete operations.

---

### Ticket ID
`F4-PATIENT-MEDICINES-REAL-API-INTEGRATION`

### Owner Agent
`FrontendAgent`

### Phase
`Phase 4 - Patient Medicines And Schedule`

### Depends on
`B4-PATIENT-MEDICINES-CRUD-API`

### Scope
Connect the patient medicines pages to the real API instead of hardcoded local state while keeping the current layout primitives and UI rules.

### Deliverable
Frontend integration for:
- medicines list
- medicine create/edit form
- selected medicine detail block

### Acceptance
- `MedicinesHomePage` loads medicines from the real API.
- `MedicationUpsertPage` creates and edits medicines through the real API.
- Medicine deletion uses the real API.
- All visible UI text remains Russian.
- The implementation keeps `AppLayout`, `PageContainer`, and `SoftCard`.
- Mock mode remains compatible with the same DTO shape.

### Reviewer checkpoint
Verify the frontend does not pass tenant via URL or query parameters, does not enforce ownership only in the client, and preserves the existing layout structure.

---

### Ticket ID
`F4-PATIENT-SCHEDULE-REAL-API-INTEGRATION`

### Owner Agent
`FrontendAgent`

### Phase
`Phase 4 - Patient Medicines And Schedule`

### Depends on
`B4-PATIENT-MEDICATION-SCHEDULE-API`, `F4-PATIENT-MEDICINES-REAL-API-INTEGRATION`

### Scope
Connect the medication schedule UI to the real API and remove hardcoded slots and assignments.

### Deliverable
Frontend schedule integration for:
- slot list
- create slot
- delete slot
- add medicine to slot
- remove medicine from slot

### Acceptance
- The patient sees persisted time slots after reload.
- The patient can create a new slot.
- The patient can delete a slot.
- The patient can assign multiple medicines to one slot.
- The patient can remove medicines from a slot.
- The UI remains stable under varying text length.
- All visible UI text is Russian.

### Reviewer checkpoint
Verify the schedule page no longer depends on hardcoded local data and handles API errors through the established UI patterns.

---

### Ticket ID
`F4-MEDICINE-DETAIL-WORKFLOW`

### Owner Agent
`FrontendAgent`

### Phase
`Phase 4 - Patient Medicines And Schedule`

### Depends on
`F4-PATIENT-MEDICINES-REAL-API-INTEGRATION`, `F4-PATIENT-SCHEDULE-REAL-API-INTEGRATION`

### Scope
Make the medicine detail card functional as the workflow bridge between the medicines list and the schedule.

### Deliverable
A functional medicine detail panel with:
- selected medicine data
- note visibility/edit flow
- dose amount input for slot assignment
- add-to-slot action

### Acceptance
- The medicine detail card shows the selected medicine from the API.
- The patient can set `примечание` and `количество` when assigning a medicine to a slot.
- Adding a medicine to a slot uses the real API.
- After success, schedule state and detail state stay synchronized without manual refresh.
- The UI remains Russian and within the existing design system.

### Reviewer checkpoint
Verify the detail workflow does not rely on divergent client-only shadow state and remains consistent with persisted slot-item data.

---

### Ticket ID
`F4-MOCK-PARITY-FOR-PATIENT-MEDICATIONS`

### Owner Agent
`FrontendAgent`

### Phase
`Phase 4 - Patient Medicines And Schedule`

### Depends on
`B4-PATIENT-MEDICATION-DTOS-AND-POLICIES`, `F4-PATIENT-MEDICINES-REAL-API-INTEGRATION`, `F4-PATIENT-SCHEDULE-REAL-API-INTEGRATION`

### Scope
Keep mock-mode compatibility for patient medicines and schedule modules using the same DTO contracts as the real backend.

### Deliverable
Mock adapter and mock API handlers for:
- patient medicines CRUD
- schedule slot CRUD
- slot-medication assignment CRUD

### Acceptance
- Mock responses match backend DTO shapes.
- Patient medicines pages work in `VITE_API_MOCKS=true`.
- The schedule flow works in mock mode through the same UI paths.
- The frontend does not maintain separate UI logic only for mock mode.

### Reviewer checkpoint
Verify mock/live contract parity is preserved and the UI behaves consistently between modes.

---

### Ticket ID
`R4-PATIENT-MEDICATIONS-END-TO-END-REVIEW`

### Owner Agent
`ReviewerAgent`

### Phase
`Phase 4 - Patient Medicines And Schedule`

### Depends on
`DB4-PATIENT-MEDICATION-SCHEMA`, `B4-PATIENT-MEDICINES-CRUD-API`, `B4-PATIENT-MEDICATION-SCHEDULE-API`, `F4-PATIENT-MEDICINES-REAL-API-INTEGRATION`, `F4-PATIENT-SCHEDULE-REAL-API-INTEGRATION`, `F4-MEDICINE-DETAIL-WORKFLOW`

### Scope
Review end-to-end completeness of the patient medicines and schedule modules across database, backend, and frontend.

### Deliverable
A review result covering architecture compliance, tenant safety, patient ownership, API contract stability, persistence after reload, and UI guideline adherence.

### Acceptance
- The patient can create, edit, and delete medicines.
- The patient can create and delete time slots.
- The patient can assign multiple medicines to a slot and remove them.
- All data persists in the database and reloads correctly after refresh.
- The patient cannot read or modify another patient's data.
- The UI is Russian and free of layout regressions.
- Errors use `ProblemDetails` and `ValidationProblemDetails`.

### Reviewer checkpoint
Verify tenant isolation across all three tables and all queries, backend patient ownership enforcement, and real end-to-end behavior against the live API.
