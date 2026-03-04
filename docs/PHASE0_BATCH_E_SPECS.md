# Phase 0 Batch E Specs

This document records execution output for:

- `F0-2`
- `F0-3`
- `F0-5`

It follows:

- `docs/Architecture.md`
- `docs/VITAENT_UX_UI_GUIDELINES.md`

## F0-2 - Frontend Shell and Route Skeleton

### Shell rule

The frontend shell must use only the approved layout primitives:

- `AppLayout`
- `PageContainer`
- `SoftCard`

No alternative layout wrapper should be introduced for core page structure.

### Target top-level route groups

#### Public

- `/login`
- authentication recovery or onboarding routes only if required by the auth contract

#### Authenticated application

- patient portal routes
- doctor workspace routes
- clinic administration routes
- shared session/account routes

### Recommended route skeleton

#### Shared authenticated root

- `/app`

This remains the authenticated shell root unless tenant routing later requires a tenant-prefixed structure.

#### Patient portal

- `/app/patient`
- `/app/patient/appointments`
- `/app/patient/records`
- `/app/patient/chat`
- `/app/patient/profile`

#### Doctor workspace

- `/app/doctor`
- `/app/doctor/appointments`
- `/app/doctor/patients`
- `/app/doctor/records`
- `/app/doctor/chat`

#### Clinic administration

- `/app/admin`
- `/app/admin/memberships`
- `/app/admin/roles`
- `/app/admin/users`

#### Shared account/session

- `/app/me`

### Route guard rules

- unauthenticated users are redirected to login
- authenticated users must not enter role-restricted areas without tenant-aware role checks
- role-aware navigation must depend on the active tenant membership, not only login state

### Page structure rule

All major pages follow:

- `AppLayout`
- `PageContainer`
- page header section
- page content section

Typical content layout should use:

- grid-based two-column layouts such as `2fr 1fr` or `3fr 1fr`

### Loading and error shell rules

- route-level loading state must render inside the approved shell, not as a blank page
- route-level error state must preserve structure and avoid layout shift
- auth bootstrapping must not leave the protected shell partially rendered without resolved session state

### Current repo mismatch

- current route tree is centered on wellness pages
- current `RequireAuth` checks only whether a user exists
- current route model is not tenant-aware and not role-aware

## F0-3 - Frontend API and Server-State Contract

### Single API client rule

The existing shared client approach remains the required pattern:

- one API client module
- one auth token storage strategy
- no ad hoc `fetch` or per-page client creation

### Query ownership rules

- route-level pages own primary data loading
- leaf components receive prepared data or query hooks, not raw endpoint wiring spread arbitrarily
- repeated resource access should use shared query definitions rather than duplicating request logic

### TanStack Query rules

- use TanStack Query for server state
- loading, error, and success states must be explicit
- mutations must disable related actions while pending
- inline error presentation is required for failed mutations

### Error handling contract

Backend errors are expected to use:

- `ProblemDetails`
- `ValidationProblemDetails`

Frontend integration must therefore:

- parse structured backend errors centrally where possible
- avoid page-specific ad hoc error-shape assumptions
- distinguish validation, auth, forbidden, not found, and conflict failures

### Auth/session client rules

- session bootstrap must target `POST /api/auth/login`, `POST /api/auth/refresh`, and `GET /api/me`
- client auth state must include tenant-aware actor context once backend contract is implemented
- route visibility and navigation items must derive from the active membership role set

### Mock compatibility rule

- mocked DTOs must match the same shapes as real backend contracts
- frontend query contracts should be written to support both mock and live adapters without per-page branching

### Current repo mismatch

- current auth client targets `POST /api/auth/sign-in`
- current `/api/me` handling assumes only username-level identity
- current `AuthResponse` is not aligned with the architecture-required tenant-aware session model

## F0-5 - UX Compliance Checklist

### Layout primitives

- use `AppLayout`
- use `PageContainer`
- use `SoftCard`
- do not introduce alternative page wrappers for core layouts

### Visual system

- page background: neutral
- card background: white
- borders and dividers: neutral grey values
- blue accent only for primary actions, links, active nav, progress, and active interactive icons
- no decorative gradients
- no bright content surfaces

### Shape and spacing

- large cards: `16px`
- inner blocks: `12px`
- small controls: `8px`
- spacing must follow the `4px` scale
- avoid random spacing values
- avoid global border radius overrides that conflict with the guide

### Typography

- maintain calm, stable medical UI hierarchy
- avoid typography scaling by screen width
- keep titles and metrics within the guide ranges

### Interaction states

- selected items use neutral background and border
- no blue selection backgrounds
- hover state must be subtle
- disabled state uses opacity without layout shift
- error state uses red text, not red card backgrounds

### Layout behavior

- max content width must stay within the architecture of `1440-1600px` target range
- preserve stable behavior at `1920px` and `2560px`
- do not use `transform: scale`
- keep headers fixed where required
- keep scroll inside internal containers
- use `min-width: 0` and overflow protection for long content

### Review blockers

The following should block review:

- global borderRadius changes that violate the guide
- non-approved accent usage
- heavy card shadows
- layout refactors outside task scope
- alternate shell wrappers
- decorative or playful visual treatment
- default Vite root styles that conflict with the medical UI baseline

### Current repo mismatch

- `src/index.css` still contains default Vite styles including dark/light color scheme behavior
- `src/theme/vitaentTheme.ts` contains palette, shadow, and global shape decisions that conflict with the UX guide
- current app routes and page taxonomy do not reflect the medical platform modules

## Batch E Result

Batch E is complete as a specification pass.

## Recommended next tickets

- `F0-4`
- `D0-4`
- `D0-5`
