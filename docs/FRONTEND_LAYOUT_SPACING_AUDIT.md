# Frontend Layout And Spacing Audit

Phase: `F2-LAYOUT-SPACING-AUDIT`  
Scope: mounted auth screens, patient shell, dashboard shell, shared layout primitives, and mounted patient legacy pages.

## Summary

The frontend layout is functional but inconsistent. The main issue is not a single broken page but a pattern of local spacing overrides that bypass a stable shared system.

Observed problems:

- Shared primitives define one spacing model, but pages frequently override it with custom values.
- Multiple pages redefine content width even though `PageContainer` already defines max width and horizontal padding.
- The codebase mixes spacing tokens aligned with the `8 / 12 / 16 / 24 / 32` system with off-scale values such as `20px`, `22px`, `30px`, `34px`, `0.75`, `1.1`, `1.25`, `2.5`, and `3.75`.
- Large-screen behavior is implemented per page with ad hoc `@media (min-width:2000px)` rules instead of a shared pattern.
- Several mounted legacy pages use deeply nested boxes and duplicate width constraints, which makes alignment harder to stabilize.
- Card heights and internal spacing vary significantly between pages, especially in patient legacy pages.

## Shared Primitive Findings

### `src/components/ui/PageContainer.tsx`

Current behavior:

- `maxWidth: 1920`
- horizontal padding:
  - `16px` on `xs`
  - `24px` on `sm`
  - `32px` on `md`
  - `48px` on `lg` and `xl`
- vertical spacing:
  - `pt`: `16 / 24 / 32`
  - `pb`: `32 / 40 / 48`

Issues:

- `48px` horizontal padding is outside the requested normalized spacing set.
- Many pages wrap `PageContainer` with another full-width constrained container, duplicating width control.
- The primitive is correct in intent, but it is not consistently treated as the single source of layout spacing.

### `src/components/ui/SoftCard.tsx`

Current behavior:

- card border radius: `16px`
- content padding:
  - `16px` on `xs`
  - `20px` on `sm`
  - `24px` on `md`
- header gap: `12px`
- header bottom margin: `17.6px`
- 2K override:
  - `20px`, `24px`, `30px`

Issues:

- `20px`, `30px`, and `17.6px` are outside the requested spacing scale.
- The card component already carries a spacing system, but pages still override it heavily.
- Large-screen card padding is inconsistent with the target system.

### `src/pages/app/AppLayout.tsx`

Current shell behavior:

- app bar horizontal padding uses mixed scale:
  - `10px`, `20px`, `24px`
- nav item spacing:
  - `gap: 1.4`
  - `py: 1.1`
  - `px: 1.4`
- top-right action gap:
  - `0.75` and `1.5`
- sign-out button height:
  - `34px`

Issues:

- Shell spacing is not aligned to the requested `8 / 12 / 16 / 24 / 32` system.
- `34px` button height conflicts with the theme’s minimum button height of `44px`.
- App bar and drawer spacing use fractional values that are hard to standardize.
- Header and drawer spacing will not remain visually consistent across roles if each detail uses custom values.

## Auth Screen Findings

### `src/pages/login/SignIn/sigin.tsx`

Current behavior:

- outer page padding:
  - `16 / 24 / 32`
- auth card:
  - `maxWidth: 440`
  - `minHeight: 560`
  - card padding: `32px`
  - gap: `24px`
- form gap: `16px`
- footer top padding: `24px`

Issues:

- The auth card is relatively stable, but it uses a separate local card component instead of shared spacing tokens from the shell/card system.
- The success dialog uses default MUI spacing instead of the same auth spacing rhythm.
- The card minimum height may create excessive empty space on medium-height screens.

### `src/pages/login/SignUp/signup.tsx`

Current behavior:

- very similar to sign-in card
- no explicit min-height

Issues:

- Sign-in and sign-up are similar but not fully normalized.
- Sign-in uses a fixed min-height and dialog handling; sign-up does not.
- The clinic checkbox row uses raw HTML input plus label text, which causes spacing inconsistency relative to the rest of the MUI form controls.

## Patient Shell And Mounted Legacy Page Findings

### General patient shell

Issues:

- Patient shell navigation now points to legacy sections, but those pages were not built against the current shell spacing model.
- Mounted legacy pages frequently define their own `maxWidth: 1920`, even though `PageContainer` already does.
- This duplication makes large-screen behavior harder to reason about and risks inconsistent centering.

### `src/pages/app/HomePage.tsx`

Current behavior:

- duplicated width control via both `PageContainer` and an inner container with `maxWidth: 1920`
- custom 2K media query everywhere
- grid gaps:
  - `16 / 24 / 32 / 40`
- custom card min-heights:
  - `260`, `340`, `425`, `240`, `300`
- internal spacing includes values such as:
  - `1`
  - `2.1`
  - `3.75`
  - `40px` icon columns

Issues:

- This page is a major source of spacing inconsistency.
- The page duplicates width and spacing control at several levels.
- Card sizes are heavily hand-tuned and may not remain stable with text changes.
- 2K adjustments are page-specific rather than system-driven.
- Internal card layout mixes spacing scale values and arbitrary pixel dimensions.

### `src/pages/app/MessagesPage.tsx`

Current behavior:

- duplicated width control with `PageContainer` plus inner `maxWidth: 1920`
- main grid shifts from one column to custom `2.2fr / 0.9fr`
- inner chat layout uses custom split `0.9fr / 2.1fr`
- numerous off-scale spacing values:
  - `2.5`
  - `1.25`
  - `0.75`
  - `13.5px`
  - `34px`

Issues:

- Complex nested layout is vulnerable to text-length drift.
- Doctor list items, chat bubbles, and header controls all use local spacing logic.
- The pinned-message button has a custom minimum width that can destabilize the header area.
- Scroll behavior is correct in principle, but the amount of local tuning indicates future overflow risk.

### `src/pages/Medicines/MedicinesHomePage.tsx`

Current behavior:

- `PageContainer` is overridden with `maxWidth: "100%"`
- nested wrapper also forces full width
- MUI `Grid` is used with explicit `m: 0` and multiple manual width resets
- custom card override uses `3.75` on large screens
- row and card spacing are mixed between the grid system and custom stacks

Issues:

- This page bypasses the default max content width entirely.
- It is one of the clearest violations of consistent content width rules.
- The card grid is likely to behave inconsistently between `1920px` and `2560px`.
- There is no single stable content column behavior.

### `src/pages/Medicines/MedicationUpsertPage.tsx`

Observed from structure and previous review:

- large, multi-section form with many stacked controls
- likely to be sensitive to inconsistent vertical rhythm and field grouping

Issues:

- Needs spacing normalization for section breaks, action rows, and grouped controls.
- High probability of inconsistent spacing between form sections because of many local stack declarations.

### `src/pages/app/EmotionsPage.tsx`

Observed from structure:

- three-column responsive layout with many nested cards and local stack spacing

Issues:

- Needs alignment review for cross-column balance.
- Likely to drift visually because the center card and side cards do not share a strict height strategy.

### `src/pages/app/WeekDayPage.tsx`

Observed from earlier review:

- seven-column layout with tall selectable cards
- hover transform and fixed large heights

Issues:

- Grid cell width and height balance should be reviewed for large screens.
- Hover motion plus fixed heights can create uneven perceived spacing.

### `src/pages/app/SleepPage.tsx`

Observed from earlier review:

- relatively simple page, but wraps content again inside `PageContainer`

Issues:

- Lower risk than `HomePage`, but still part of the duplicated-width pattern.

## Doctor/Admin Placeholder Screen Findings

### `src/pages/app/SectionPlaceholderPage.tsx`

Current behavior:

- `Stack spacing={3}`
- page title block with `mb: 1`
- content grid gap `3`
- list stacks use `spacing={1.25}`

Issues:

- `1.25` is outside the required spacing scale.
- This component is shared across doctor/admin placeholder pages, so any spacing inconsistency is multiplied across multiple routes.

### `src/pages/app/AdminContextPage.tsx`

Current behavior:

- single `SoftCard` with stacked metadata rows
- loading state uses `py: 4`
- info rows use `Stack spacing={2}`

Issues:

- Relatively stable, but still needs language normalization and width review.
- The page is structurally simpler than patient legacy pages and should be easy to align to the shared spacing system.

## Global Pattern Findings

### Spacing scale violations

Common non-standard values found:

- `20px`
- `22px`
- `30px`
- `34px`
- `40px`
- `0.45`
- `0.75`
- `1.1`
- `1.25`
- `1.4`
- `2.1`
- `2.2`
- `2.5`
- `3.75`
- `48px`

These should be normalized toward:

- `8`
- `12`
- `16`
- `24`
- `32`

### Width inconsistency

Problems:

- `PageContainer` already establishes `maxWidth: 1920`, but several pages add another `maxWidth: 1920`.
- Some pages override `PageContainer` to `maxWidth: "100%"`, which breaks consistent content width behavior.
- Shell, page, and card width systems are not cleanly layered.

### Large-screen instability risk

Problems:

- Many pages add custom `@media (min-width:2000px)` rules.
- Large-screen behavior is handled page by page rather than centrally.
- This is likely to produce visual inconsistency between `1920px` and `2560px`.

### Overflow and scroll risk

High-risk areas:

- `MessagesPage` nested chat layout
- `MedicinesHomePage` full-width grid and list columns
- `HomePage` nested grids and fixed-height cards

Lower-risk but still relevant:

- `MedicationUpsertPage`
- `EmotionsPage`
- shell drawer/header spacing

## Recommended Fix Order

1. Normalize shared primitives:
   - `PageContainer`
   - `SoftCard`
   - shell spacing in `AppLayout`
2. Normalize auth spacing.
3. Normalize patient shell width behavior.
4. Normalize `HomePage` grid and card spacing.
5. Harden `MessagesPage` overflow and internal spacing.
6. Fix `MedicinesHomePage` width and card grid behavior.
7. Normalize placeholder page spacing for doctor/admin routes.
8. Recheck large-screen behavior at `1920px` and `2560px`.

## Acceptance Mapping

This audit satisfies `F2-LAYOUT-SPACING-AUDIT` by identifying:

- spacing-system violations
- shared primitive inconsistencies
- shell-level spacing issues
- page-level width duplication
- card alignment risk
- overflow and scroll risk
- large-screen stability risk

Next tickets:

- `F2-LAYOUT-SPACING-NORMALIZATION`
- `F2-CARD-ALIGNMENT-STABILIZATION`
- `F2-OVERFLOW-AND-SCROLL-HARDENING`
- `F2-SHELL-WIDTH-AND-CONSISTENCY-FIXES`
