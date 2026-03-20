# Open Questions

> Last updated: 2026-03-18
> Status: Questions organized by category. Owner must answer before relevant phase begins.

---

## Product

| ID | Question | Impact | Blocks |
|---|---|---|---|
| PD-001 | **What is the game genre / gameplay type?** (e.g., puzzle, arcade, clicker, merge, physics-based) | Determines frontend tech, game logic, scoring, schema | Phase 1B entirely |
| PD-002 | **Is the game real-time or turn-based?** | Determines if WebSocket is needed, API design pattern | Phase 1B |
| PD-003 | **Can guests view the leaderboard (read-only)?** | Affects leaderboard API auth rules, frontend UX | Phase 1C |
| PD-008 | **What is the admin panel scope?** Should admin see: contact messages only? User accounts? Game data? All of the above? | Whether to build admin routes, what data to expose | Phase 2 (or late Phase 1) |
| PD-015 | **Should the game page have its own URL (e.g., `/game`) or be embedded in the portfolio?** | Frontend routing, SEO, shareability | Phase 1B |

---

## Auth

| ID | Question | Impact | Blocks |
|---|---|---|---|
| PD-010 | **What is the password reset flow for email auth?** Options: (a) "Forgot password" email with reset link, (b) No reset in stage 1 — user must create new account, (c) Owner manually resets | Requires email provider (SendGrid, Resend, etc.), token management, UI | Phase 1A (email/password part) |
| PD-011 | **Token strategy: JWT, session+cookie, or JWT+refresh token?** | Auth implementation, security, Redis dependency | Phase 1A |
| PD-016 | **Is email verification required for email+password registration?** If yes, need email provider. If no, accept unverified emails. | Email provider, UX flow | Phase 1A |
| PD-017 | **Should auth state persist across portfolio and game?** (i.e., login once, authenticated everywhere?) | Token sharing strategy, CORS cookie setup | Phase 1A |

---

## Leaderboard

| ID | Question | Impact | Blocks |
|---|---|---|---|
| PD-004 | **Leaderboard type: all-time, daily, weekly, or combination?** | DB schema (need timestamp filtering), query complexity | Phase 1C |
| PD-005 | **What is the scoring metric?** (e.g., highest score, fastest time, longest survival, most items merged) | Depends on game genre, affects schema and sorting | Phase 1B, 1C |
| PD-006 | **Anti-cheat strategy?** Options: (a) server-side score validation, (b) client trust with rate limiting, (c) replay verification, (d) none in stage 1 | Backend complexity, game logic placement | Phase 1C |
| PD-018 | **Should leaderboard show user display names or anonymous IDs?** | Privacy policy, user profile requirements | Phase 1C |

---

## Guest Mode

| ID | Question | Impact | Blocks |
|---|---|---|---|
| PD-019 | **Should guest scores be shown temporarily in the UI during their session?** (local state only, not saved) | Frontend game state management | Phase 1B |
| PD-020 | **Should there be a prompt encouraging guests to log in after playing?** (e.g., "Log in to save your score!") | UX design, conversion flow | Phase 1B |

---

## Infrastructure

| ID | Question | Impact | Blocks |
|---|---|---|---|
| PD-007 | **Which PaaS provider for watermelon-game-api?** Render / Railway / Fly.io | Deploy pipeline, CI/CD, environment setup | Phase 1D |
| PD-009 | **Backend tech stack for watermelon-game-api?** Recommendation: Node.js + TypeScript. Alternatives: Python, Go. | Repo scaffolding, dependencies, hiring | Phase 0 |
| PD-013 | **Backend framework?** Recommendation: Fastify. Alternatives: Express, Hono, NestJS. | Performance, DX, middleware ecosystem | Phase 0 |
| PD-021 | **Migration tool for platform-infra?** Options: (a) Raw SQL files, (b) dbmate, (c) Prisma Migrate, (d) Drizzle Migrate | Migration workflow, developer experience | Phase 0 |
| PD-022 | **Redis provider (if using session-based auth)?** Options: Upstash (serverless), Railway Redis, Render Redis | Auth session storage, potential caching | Phase 1A |

---

## Security

| ID | Question | Impact | Blocks |
|---|---|---|---|
| PD-023 | **Should `/api/messages` be kept (with auth) or removed?** | Security of existing contact data, admin scope | Phase 0 |
| PD-024 | **Rate limiting strategy: by IP, by user, or both?** | Implementation approach, abuse prevention | Phase 0 |

---

## Future Expansion

| ID | Question | Impact | Blocks |
|---|---|---|---|
| PD-025 | **Will future projects also need backends, or are they frontend-only?** | Whether to generalize the platform architecture | Not blocking stage 1 |
| PD-026 | **Is a custom domain planned for the portfolio?** | Vercel config, OAuth callback URLs | Phase 1D |
| PD-027 | **Will there be user profiles visible to other users?** | User schema design, privacy policy | Phase 2 |

---

## Summary: What Must Be Answered Before Each Phase

### Before Phase 0 can complete:
- PD-009 (backend tech stack)
- PD-013 (backend framework)
- PD-021 (migration tool)
- PD-023 (/api/messages fate)

### Before Phase 1A can complete:
- PD-011 (token strategy)
- PD-016 (email verification required?)
- PD-017 (auth state persistence across repos)
- PD-022 (Redis provider, if session-based)

### Before Phase 1B can start:
- PD-001 (game genre) — **critical blocker**
- PD-002 (real-time vs turn-based)
- PD-015 (game route strategy)

### Before Phase 1C can complete:
- PD-003 (guests view leaderboard?)
- PD-004 (leaderboard type)
- PD-005 (scoring metric)
- PD-006 (anti-cheat)

### Before Phase 1D can complete:
- PD-007 (PaaS provider)
- PD-026 (custom domain)
