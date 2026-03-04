# Phase 0 Batch C Specs

This document records execution output for:

- `DB0-2`
- `DB0-3`
- `DB0-5`
- `B0-3`

It follows:

- `docs/Architecture.md`

## DB0-2 - Bootstrap Schema Boundary

### Phase 0 schema intent

Phase 0 does not implement full feature schema. It defines the order in which schema groups must be introduced so the system can move from a user-only model to the required multi-tenant model safely.

### Schema group order

#### Group 1 - Identity and tenant core

- `users`
- `tenants`
- `memberships`
- `roles`
- `permissions`
- `membership_roles`
- `role_permissions`

This is the first required schema group because the architecture depends on global users, tenant membership, and membership-based roles before any domain module can be correct.

#### Group 2 - Domain profiles

- `patients`
- `doctors`

This group depends on Group 1 because patient and doctor profiles are membership-derived.

#### Group 3 - Authorization relationship tables

- `care_team`

This group depends on Groups 1 and 2 because doctor-patient relationships use tenant-local profile identities.

#### Group 4 - Operational domain tables

- `appointments`
- `medical_records`

This group depends on Groups 2 and 3 because domain access and authorization policies reference patient, doctor, and care-team relationships.

#### Group 5 - Communication tables

- `chat_threads`
- `chat_messages`

This group depends on Groups 2, 3, and 4 because chat authorization will rely on patient-doctor relationships and possibly appointment-linked access.

### Deferred from bootstrap execution

- analytics
- billing
- audit logging
- lab integrations
- notifications

### Current repo mismatch

- Current schema contains only `Users`
- Current schema does not contain any tenant-aware identity or role model

### Boundary rule

No ticket before Group 1 completion may implement tenant-owned domain tables, because doing so would create schema that cannot satisfy the architecture identity and authorization model.

## DB0-3 - Migration Safety Policy

### Core rules

- Migrations must avoid destructive operations
- Migrations must preserve existing data integrity
- Schema transitions from the current user-only model must be staged
- Breaking renames or column drops require explicit review and a safe migration path

### Prohibited by default

- Dropping tables without explicit migration plan and review
- Dropping columns that contain live data
- Renaming columns or tables without a compatibility strategy
- Backfilling tenant-owned data without an explicit tenant mapping plan
- Mixing structural schema replacement with unrelated feature changes in one migration

### Required review checks

- Does the migration preserve tenant isolation assumptions?
- Does the migration preserve auth continuity or provide a safe cutover?
- Are indexes added for new tenant filters and foreign keys?
- Can the migration run repeatedly across local, CI, and future environments without ambiguity?

### Current-state transition policy

Because the current model uses `Users.Username` and no tenant membership:

1. Introduce new architecture-aligned tables before retiring legacy assumptions.
2. Avoid immediate destructive replacement of the `Users` table.
3. Move auth and session logic in stages after schema support exists.
4. Defer removal of legacy columns or assumptions until the new path is proven.

### Execution policy

- Development startup may auto-apply safe migrations
- CI should validate migration application on a clean database
- Seed execution must remain idempotent and separated from destructive schema operations

## DB0-5 - Indexing Baseline

### Required base rules

- Every tenant-owned table must include `tenant_id`
- Every tenant-owned table must index `tenant_id`
- Foreign keys must be indexed when used for lookups or joins

### Identity and access indexing baseline

#### `users`

- unique index on login identity field

#### `memberships`

- unique composite index on `(tenant_id, user_id)`
- index on `user_id`
- index on `tenant_id`

#### `membership_roles`

- index on `membership_id`
- index on `role_id`
- composite uniqueness rules to prevent duplicate assignments

#### `role_permissions`

- index on `role_id`
- index on `permission_id`
- composite uniqueness rules to prevent duplicate mappings

### Domain indexing baseline

#### `patients`

- unique composite index on `(tenant_id, membership_id)`
- index on `tenant_id`

#### `doctors`

- unique composite index on `(tenant_id, membership_id)`
- index on `tenant_id`

#### `appointments`

- index on `tenant_id`
- index on `patient_id`
- index on `doctor_id`
- composite tenant-scoped access indexes to support doctor and patient appointment queries

#### `medical_records`

- index on `tenant_id`
- index on `patient_id`
- index on `created_by_doctor_id`

#### `care_team`

- index on `tenant_id`
- index on `doctor_id`
- index on `patient_id`

#### `chat_threads`

- index on `tenant_id`
- index on `patient_id`
- index on `doctor_id`

#### `chat_messages`

- index on `tenant_id`
- index on `thread_id`
- index on `sender_membership_id`

### Query safety rule

Indexes must support the architecture requirement that queries filter by tenant. A query path that depends on `tenant_id` filtering but lacks a practical supporting index should be treated as incomplete.

## B0-3 - TenantContext Contract

### Purpose

Every request must run inside a resolved `TenantContext`. This is mandatory per Architecture.md and must exist before tenant-owned modules are implemented.

### Minimum `TenantContext` shape

- `tenantId`
- `tenantSlug`
- `membershipId` when a user is acting within a tenant
- active role set for the resolved membership
- actor user ID
- actor scope indicator for `SystemAdmin` exception handling

### Resolution model

#### Authenticated tenant-scoped requests

- Resolve actor identity from the authenticated token
- Resolve the target tenant from an approved tenant input
- Resolve membership for `(user, tenant)`
- Resolve membership roles within that tenant

#### System-level requests

- Allow exceptional cross-tenant behavior only for `SystemAdmin`
- Require explicit tenant targeting even for cross-tenant admin actions
- Treat cross-tenant capability as auditable and exceptional, not default

### Approved resolution inputs

The exact transport mechanism can be finalized later, but the contract must support a single canonical tenant input, such as:

- tenant slug in route, host, or header

The system must not rely on implicit tenant inference from username or token alone when a user may belong to multiple tenants.

### Failure behavior

- Missing tenant input: reject request
- Invalid tenant: reject request
- Authenticated user with no membership in resolved tenant: reject request
- Insufficient tenant-local role or policy: reject request

### Enforcement path

1. Resolve tenant context near the request boundary
2. Pass resolved tenant context into application services
3. Require tenant context for query construction and filtering
4. Do not allow repository or query methods to silently skip tenant filtering

### Current repo mismatch

- JWT currently includes user ID and username only
- No tenant identifier is present in token or request contract
- `/api/me` currently resolves only a username identity
- Backend has no membership model and no tenant-aware authorization path

### Design rule

`TenantContext` is mandatory for tenant-owned resources. No new patient, doctor, appointment, record, or chat endpoint should be implemented without first defining how that endpoint receives and enforces tenant context.

## Batch C Result

Batch C is complete as a specification pass.

## Recommended next tickets

- `DB0-4`
- `B0-4`
- `B0-5`
