VITAENT UX/UI GUIDELINES

Version 1.0
Status: Active
Scope: All Frontend UI Work

1. Design Philosophy

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

The UI must never feel aggressive, colorful, or decorative.

2. Color System
2.1 Base Colors

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

2.2 Accent Blue

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

2.3 Neutral Selection Style

For selected list items and neutral highlights:

Background:
#F5F5F7

Border:
1px solid #C9C9CB

Border Radius:
12px

No blue background for selection.

3. Card System
3.1 Border Radius

Large cards:
16px

Inner blocks:
12px

Small elements (inputs, badges):
8px

Strict rule:
Do NOT globally modify borderRadius.

3.2 Shadows

Use minimal shadows.

Preferred visual style:
Border + clean background instead of heavy drop shadow.

No aggressive elevation.

4. Typography
4.1 Card Titles

Font size:
16–18px

Font weight:
500–600

4.2 Large Metrics (e.g., “100%”)

Font size:
48–72px

Font weight:
600

4.3 Recommendation Text

Font size:
24–28px

Font weight:
500

Must not appear oversized or visually heavy.

5. States & Interaction
5.1 Active List Item

Never use blue background.

Always use:

Light grey background

Thin neutral border

Soft hover

5.2 Hover State

Background shift must be subtle (3–5% darker).

No strong contrast jumps.

5.3 Disabled State

Opacity:
0.5–0.6

Layout must not shift.

5.4 Error State

Red text only

No red card background

6. Buttons
6.1 Primary Button

Blue background

White text

Border radius: 12px

No heavy shadow

6.2 Secondary Button

Transparent background

Blue text

1px blue border

6.3 Dangerous Button

Red color allowed only for:

Errors

Critical destructive actions

7. Layout Rules
7.1 Max Content Width

1440–1600px

margin: 0 auto;
7.2 2K Screens (2560px)

Allowed:

Increase card padding by 20–25%

Forbidden:

Scaling text

Using transform scale

Changing layout structure

8. Spacing System

Spacing must follow 4px scale:

8px – Small
12px – Compact
16px – Default
24px – Section spacing
32px – Large spacing

No random spacing values.

9. Icons

Monochrome

Blue only when active

No decorative colored icons

10. Visual Hierarchy

Priority order:

Structure (cards and layout)

Content

Interaction

Accent

Accent must never overpower structure.

11. Strictly Forbidden

Global borderRadius changes

Random color additions

Decorative gradients

Bright card backgrounds

Excessive accent usage

Blue selection backgrounds

12. Implementation Rule for Codex / AI Agents

All UI-related tasks must:

Follow this document strictly

Avoid introducing new colors

Avoid global theme overrides

Avoid scaling typography

Maintain behavior consistency at 1920px and 2560px

If a change conflicts with this file, the agent must stop and explain the conflict before proceeding.