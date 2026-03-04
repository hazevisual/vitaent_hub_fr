# Frontend UI Language Audit

Phase: `F2-UI-LANGUAGE-AUDIT`  
Scope: mounted frontend UI plus still-reachable shared/auth components.

## Summary

The frontend is not language-consistent. The mounted patient legacy UI is mostly Russian, but the auth flow, shell navigation, admin diagnostics page, and doctor/admin placeholder routes still contain substantial English text.

Main patterns found:

- Auth screens are still largely English.
- Patient shell navigation is English even though mounted patient pages are mostly Russian.
- Doctor and admin route placeholders are entirely English.
- Admin diagnostic page is entirely English.
- Mock-mode hint text is English.
- Dialog and validation text is mixed between English and Russian.
- Some disconnected but still user-facing components, especially the forgot-password dialog, remain fully English.

## Mounted Screens

### Auth

File: `src/pages/login/SignIn/sigin.tsx`

English user-facing text found:

- `Sign in`
- `Access the active tenant workspace.`
- `Mock accounts: ...`
- `Username`
- `Password`
- `Hide password`
- `Show password`
- `Signing in...`
- `Sign in`
- `Need help? Contact your clinic administrator.`
- `Forgot password?`
- `Create a new account if your clinic supports self-registration.`
- `Register`
- `Signed in`
- `Continue`

English validation and error text found:

- `Password must be at least 6 characters.`
- `Unable to sign in. Check your username and password.`
- `Enter your username.`

Notes:

- This page is one of the highest-priority normalization targets because it is the first visible screen.

File: `src/pages/login/SignUp/signup.tsx`

English user-facing text found:

- `Register`
- `Create an account for the active clinic workspace.`
- `Username`
- `Password`
- `Confirm password`
- `Select clinic`
- `Clinic`
- `Not selected`
- `Creating account...`
- `Register`
- `Already have an account?`
- `Sign in`

English error text found:

- `Registration failed.`
- `Username and password are required.`
- `Passwords do not match.`

### Shared auth dialog

File: `src/pages/login/SignIn/components/ForgotPassword.tsx`

English user-facing text found:

- `Reset password`
- `Enter your account's email address, and we'll send you a link to reset your password.`
- `Email address`
- `Cancel`
- `Continue`

Notes:

- This component is still user-facing and must be normalized even if it is not currently the primary auth path.

### Patient shell navigation

File: `src/pages/app/AppLayout.tsx`

English navigation labels found in patient shell:

- `Portal`
- `Week`
- `Sleep`
- `Emotions`
- `Medicines`
- `Chat`
- `Profile`

Other English shell text found:

- `No tenant`
- `Profile` in icon `aria-label`
- `Sign out`

Notes:

- Patient legacy pages are mostly Russian, so the shell is currently mixed-language.

### Doctor shell placeholders

File: `src/main.tsx`

English placeholder text found under doctor routes:

- `Doctor Workspace`
- `Doctor-facing workspace for schedule, assigned patients, records, and secure communication.`
- `Doctor schedule placeholder`
- `Assigned patient overview placeholder`
- `Record authoring entry point placeholder`
- `Next implementation`
- `Doctor appointment queries`
- `Assigned patient access rules`
- `Doctor record write flow`

- `Doctor Appointments`
- `Doctor schedule and patient appointment workflow placeholder.`
- `Schedule list placeholder`
- `Appointment status placeholder`
- `Doctor day view placeholder`
- `Dependencies`
- `Doctor appointment API`
- `Appointment filtering by doctor`
- `Calendar-ready DTOs`

- `Doctor Patients`
- `Assigned patient access area for care-team and appointment-linked patients.`
- `Assigned patient list placeholder`
- `Patient context panel placeholder`
- `Care-team status placeholder`
- `Care-team table`
- `Assigned patient query`
- `Doctor access policy`

- `Doctor Records`
- `Medical record authoring and review area for assigned patients.`
- `Record composer placeholder`
- `Recent records placeholder`
- `Assigned-patient selector placeholder`
- `Medical records API`
- `Doctor write permission`
- `Assigned access checks`

- `Doctor Chat`
- `Doctor communication area for patient threads within the active tenant.`
- `Thread list placeholder`
- `Message timeline placeholder`
- `Patient thread context placeholder`
- `Chat thread API`
- `Chat message API`
- `Patient-doctor authorization policy`

### Admin shell placeholders

File: `src/main.tsx`

English placeholder text found under admin routes:

- `Clinic Administration`
- `Clinic administration area for tenant memberships, user oversight, and role management.`
- `Tenant user management placeholder`
- `Role assignment placeholder`
- `Membership overview placeholder`
- `Next implementation`
- `Membership management API`
- `Role assignment API`
- `Clinic admin policy coverage`

- `Tenant Users`
- `Clinic-local user and membership overview for the active tenant.`
- `Tenant user list placeholder`
- `Membership state placeholder`
- `User detail placeholder`
- `Dependencies`
- `Tenant user query`
- `Membership status updates`
- `Clinic admin authorization`

- `Role Assignments`
- `Role and permission administration for tenant memberships.`
- `Membership role list placeholder`
- `Role assignment placeholder`
- `Permission summary placeholder`
- `Roles seed data`
- `Membership role API`
- `Permission presentation contract`

- `Memberships`
- `Membership lifecycle area for inviting, activating, and reviewing tenant members.`
- `Membership table placeholder`
- `Membership status controls placeholder`
- `Tenant onboarding placeholder`
- `Membership create/update API`
- `Clinic admin workflow`
- `Tenant membership validation`

### Admin diagnostic page

File: `src/pages/app/AdminContextPage.tsx`

English user-facing text found:

- `Admin Context`
- `Resolved tenant and role information for the current session.`
- `Failed to load admin context.`
- `Tenant slug`
- `Not resolved`
- `Tenant ID`
- `Membership ID`
- `Roles`
- `No roles`
- `System admin`
- `Yes`
- `No`

### Shared placeholder wrapper

File: `src/pages/app/SectionPlaceholderPage.tsx`

English shared text found:

- `Current scope`
- `Phase 0 route and shell placeholder`

Notes:

- This component affects all doctor/admin placeholder routes.

## Mostly Russian Mounted Legacy Patient Pages

These pages are predominantly Russian and do not need a full language rewrite, but they still require review during normalization:

- `src/pages/app/HomePage.tsx`
- `src/pages/app/WeekDayPage.tsx`
- `src/pages/app/WeekDayViewContent.tsx`
- `src/pages/app/SleepPage.tsx`
- `src/pages/app/EmotionsPage.tsx`
- `src/pages/app/MessagesPage.tsx`
- `src/pages/app/DiseasePage.tsx`
- `src/pages/Medicines/MedicinesHomePage.tsx`
- `src/pages/Medicines/MedicationUpsertPage.tsx`

Audit note:

- These pages appear mostly Russian but contain mojibake/encoding corruption in many text literals and should be reviewed during the normalization pass.

## Lower-Priority Or Internal-Only Mixed Language

These items are not primary user-visible surface text, but should still be reviewed if exposed:

- Type labels in `src/types/Medication.ts` such as `Daily`, `Weekly`, `Interval`, `Prn`
- Error payload text in `src/api/mockAdapter.ts`:
  - `Validation failed`
  - `Username and password are required.`
  - `Unauthorized`
  - `Unable to refresh session`
  - `Forbidden`

Notes:

- These can surface in the UI through error display, so they should be normalized as part of the next ticket.

## Replacement Priorities

Priority 1:

- `src/pages/login/SignIn/sigin.tsx`
- `src/pages/login/SignUp/signup.tsx`
- `src/pages/login/SignIn/components/ForgotPassword.tsx`
- `src/pages/app/AppLayout.tsx`
- `src/pages/app/AdminContextPage.tsx`

Priority 2:

- `src/main.tsx` doctor/admin placeholder route copy
- `src/pages/app/SectionPlaceholderPage.tsx`
- `src/api/mockAdapter.ts` surfaced error messages

Priority 3:

- Review mounted legacy patient pages for corrupted or inconsistent Russian wording.

## Acceptance Mapping

This audit satisfies `F2-UI-LANGUAGE-AUDIT` by identifying:

- auth text
- patient shell text
- doctor/admin placeholder text
- admin diagnostic text
- dialog text
- validation and surfaced error text
- shared placeholder wrapper text

Next ticket: `F2-UI-LANGUAGE-NORMALIZATION`
