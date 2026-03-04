# VITAENT UX/UI GUIDELINES

Version 2.0  
Status: Active  
Scope: All Frontend UI Work

This document defines the **visual design rules and UI implementation constraints** for Vitaent.

All frontend agents and developers must follow this document strictly.

If a task conflicts with this document, the agent must **stop and explain the conflict before proceeding**.

---

# 1. Design Philosophy

Vitaent is a medical system.

The interface must feel:

Calm  
Clean  
Structured  
Neutral  
Stable

Priorities:

Readability  
Structure  
Clarity  
Minimal visual noise

The UI must **never feel decorative, colorful, or playful**.

Medical software must emphasize clarity and stability.

---

# 2. Color System

## 2.1 Base Colors

Primary Text  
#000000

Secondary Text  
#6B6B6B

Page Background  
#F5F5F7

Card Background  
#FFFFFF

Borders  
#C9C9CB

Dividers  
#E5E5E7

---

## 2.2 Accent Blue

Blue is used ONLY for:

Primary buttons  
Active navigation items  
Links  
Progress indicators  
Interactive active icons

Blue must NOT be used for:

Card backgrounds  
Large content blocks  
Selection backgrounds  
Decorative UI

---

## 2.3 Neutral Selection Style

Selected items must use neutral highlight.

Background:

#F5F5F7

Border:

1px solid #C9C9CB

Border Radius:

12px

Blue selection backgrounds are strictly forbidden.

---

# 3. Card System

## 3.1 Border Radius

Large cards

16px

Inner blocks

12px

Small elements (inputs, badges)

8px

Strict rule:

Do NOT globally modify borderRadius.

Local overrides are allowed only if they match these values exactly.

---

## 3.2 Shadows

Use minimal shadows.

Preferred visual style:

Border + clean background

Avoid heavy elevation effects.

---

# 4. Typography

## Card Titles

Font size

16–18px

Font weight

500–600

---

## Large Metrics

Examples: “100%”, key statistics

Font size

48–72px

Font weight

600

---

## Recommendation Text

Font size

24–28px

Font weight

500

Must remain visually balanced.

Typography scaling based on screen width is forbidden.

---

# 5. States & Interaction

## Active List Item

Never use blue background.

Always use:

Light grey background  
Thin neutral border  
Soft hover

---

## Hover State

Background shift must be subtle.

Recommended change:

3–5% darker background

No strong contrast jumps.

---

## Disabled State

Opacity

0.5–0.6

Layout must not shift.

---

## Error State

Use:

Red text only

Forbidden:

Red card backgrounds.

---

# 6. Buttons

## Primary Button

Blue background  
White text  
Border radius 12px

No heavy shadows.

---

## Secondary Button

Transparent background  
Blue text  
1px blue border

---

## Dangerous Button

Red color allowed only for:

Critical destructive actions  
Errors

---

# 7. Layout Rules

## Max Content Width

Max width:

1440–1600px

Use:

margin: 0 auto

The layout must remain visually consistent on:

1920px  
2560px

---

## Large Screen Behavior (2560px)

Allowed:

Increase internal card padding by 20–25%

Use existing spacing scale values only.

Forbidden:

Scaling typography  
Using transform: scale  
Changing layout structure  
Increasing max width beyond defined range

---

# 8. Spacing System

Spacing must follow the **4px scale**.

Allowed values:

8px — Small  
12px — Compact  
16px — Default  
24px — Section spacing  
32px — Large spacing

Random spacing values are forbidden.

---

# 9. Icons

Icons must be:

Monochrome  
Neutral

Blue only when active.

No decorative colored icons.

---

# 10. Visual Hierarchy

Priority order:

1 Structure (cards and layout)  
2 Content  
3 Interaction  
4 Accent

Accent must never overpower structure.

---

# 11. UI Primitives (MANDATORY)

All pages must use existing primitives.

Core primitives:

PageContainer  
SoftCard  
AppLayout

These define:

Page padding  
Card styling  
Content width  
Spacing

Agents must NOT create alternative layout wrappers.

If layout changes are required:

Modify primitives instead of creating new layout components.

---

# 12. Standard Page Layout

All pages must follow this structure:

AppLayout  
 └ PageContainer  
      ├ Page Header  
      └ Page Content

Typical content layout:

Two-column layout.

Left column:

Primary content cards.

Right column:

Information / secondary cards.

Avoid deeply nested containers.

---

# 13. Grid System

Preferred layout method:

display: grid

Typical page grid:

grid-template-columns:

2fr 1fr

or

3fr 1fr

Avoid unnecessary nested flex containers when grid is sufficient.

---

# 14. Scroll Behavior

Page headers must remain fixed.

Scrollable content must exist inside internal containers.

Correct pattern:

PageContainer  
 ├ Header (fixed)  
 └ Scrollable content inside cards

Never allow text expansion to push layout beyond page bounds.

---

# 15. Content Width Protection

Cards must not grow based on text length.

Use:

min-width: 0  
overflow-wrap: break-word

Long content must scroll inside containers:

overflow-y: auto

---

# 16. Data Loading States

All API-driven UI must support:

Loading state  
Error state  
Success state

Use TanStack Query for data fetching.

Mutation rules:

Disable buttons during requests.

Display inline errors when operations fail.

---

# 17. Component Reuse

Before creating a new component agents must:

1 Check existing components  
2 Reuse existing UI primitives  
3 Extend existing components if appropriate

Creating duplicate components is forbidden.

---

# 18. Strictly Forbidden

Global borderRadius changes  
Random color additions  
Decorative gradients  
Bright card backgrounds  
Excessive accent usage  
Blue selection backgrounds  
Typography scaling  
Layout refactors outside task scope

---

# 19. Implementation Rules for Codex Agents

All frontend tasks must:

Follow this document strictly  
Avoid introducing new colors  
Avoid global theme overrides  
Avoid scaling typography  
Preserve layout behavior at 1920px and 2560px  
Fix layout issues locally before modifying shared components  
Avoid refactoring unrelated code

If a change conflicts with this document:

The agent must stop and explain the conflict before proceeding.

---

End of document.