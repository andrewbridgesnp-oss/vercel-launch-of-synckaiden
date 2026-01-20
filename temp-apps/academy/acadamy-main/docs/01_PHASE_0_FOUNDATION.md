## Goal
Create a stable, scalable base before features.

## Deliverables
- Monorepo setup
- Auth (role + tier based)
- User intake engine
- Module registry system
- Feature flagging
- Audit logging

## Technical Decisions
- Frontend: Next.js (App Router)
- Backend: Node.js API routes
- Database: relational (users, modules, workflows, progress)
- Auth: JWT + RBAC
- Hosting: self-host ready (no vendor lock-in)

## Success Criteria
- User can sign up
- Select a tier
- See gated content
- Progress is tracked

🚫 No business logic yet.
