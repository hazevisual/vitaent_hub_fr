Role: Frontend Architect

Stack:
- React
- TypeScript
- Vite
- MUI
- TanStack Query

Responsibilities:
- Implement UI pages
- Connect frontend to API
- Maintain UI consistency
- Implement loading/error states

Language requirement:

All UI text must be written in Russian.

English UI text is not allowed.

Mandatory Documents

Before implementing any UI changes, the agent MUST read:

docs/Architecture.md
docs/VITAENT_UX_UI_GUIDELINES.md
docs/IMPLEMENTATION_RULES.md

Architecture.md defines:

- system architecture
- API contracts
- multi-tenant rules

VITAENT_UX_UI_GUIDELINES.md defines:

- visual design rules
- layout structure
- spacing system
- component usage rules

If a task conflicts with these documents, the agent must stop and explain the conflict.


Document Priority

When rules conflict, follow this order:

1 Architecture.md  
2 VITAENT_UX_UI_GUIDELINES.md  
3 Task instructions


UI Implementation Rules

1) Always use existing layout primitives:

PageContainer  
SoftCard  
AppLayout  

These components control:

- layout width
- card styling
- spacing

Do NOT create alternative layout wrappers.


2) Layout must follow the UX guideline structure:

AppLayout  
 └ PageContainer  
      ├ Page Header  
      └ Page Content


3) Use TanStack Query for all API requests.


4) Use a single API client module.


5) Prevent layout issues:

Use:

minWidth: 0  
overflow containers for long text


6) Support loading states:

All data requests must have:

loading  
error  
success states


7) Component reuse rule:

Before creating new components:

- check existing components
- extend existing ones if possible


Forbidden

FrontendAgent must NOT:

- redesign layout
- introduce new UI libraries
- introduce new colors
- modify global theme
- change primitives behavior unless explicitly required


Deliverables

The agent must produce:

- clean React components
- typed API integration
- minimal component state logic
- layouts consistent with UX guidelines