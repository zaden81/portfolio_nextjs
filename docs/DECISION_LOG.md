# Decision Log

> Last updated: 2026-03-18
> Status: Living document — updated as decisions are made

---

## Status Legend

| Status | Meaning |
|---|---|
| **Confirmed** | Decided by owner, final |
| **Recommended** | Suggested by technical team, awaiting owner confirmation |
| **Pending** | Owner must decide, no recommendation yet |
| **Deferred** | Intentionally postponed to a later stage |

---

## Confirmed Decisions

| ID | Title | Decision | Source | Rationale | Impact |
|---|---|---|---|---|---|
| D-001 | Repo model | Separate repos (portfolio_nextjs, watermelon-game-api, platform-infra) | Owner | Demonstrate fullstack architecture; clean separation; game backend can apply clean architecture independently | 3 repos to maintain, cross-repo coordination needed |
| D-002 | Auth strategy (stage 1) | Google OAuth + GitHub OAuth + Email/Password | Owner | OAuth prioritized first; email/password as fallback for users without social accounts | Significant implementation scope for 3 auth methods |
| D-003 | Facebook OAuth | Not in stage 1 | Owner | Deferred intentionally | Reduces stage 1 scope |
| D-004 | Guest mode | Enabled — guests can play without login | Owner | Lower barrier to entry for game | Need to handle guest vs authenticated state in game frontend |
| D-005 | Official history | Authenticated users only | Owner | Guests play casually; official tracking requires identity | Score submission API must verify auth |
| D-006 | Official leaderboard | Authenticated users only (for submission) | Owner | Prevent anonymous spam on leaderboard | Auth middleware on score submission endpoint |
| D-007 | Auth location | Inside watermelon-game-api, no separate auth service | Owner | Avoid over-engineering in stage 1 | If auth needs to serve multiple backends later, may need extraction |
| D-008 | Frontend deploy | Vercel | Owner | Best platform for Next.js, free tier adequate | Vercel project setup needed |
| D-009 | Backend deploy | PaaS (specific provider pending) | Owner | Managed, simple, fits separate repos | Need to choose between Render/Railway/Fly.io |
| D-010 | Database | Neon Serverless Postgres (existing) | Owner + Code | Already in use, working | Shared between portfolio and game backend |
| D-011 | Redis | Managed service, no self-hosting in stage 1 | Owner | Avoid ops burden | Provider not yet chosen |
| D-012 | Platform-infra purpose | Config/migrations/docs repo, not a deployed service in stage 1 | Owner | Repo for infra tooling only | No deploy pipeline needed for this repo |
| D-013 | Game type | Web-based browser game | Owner | Portfolio showcases web skills | Must be playable in browser, no native/download |
| D-014 | Game architecture (stage 1) | Single featured mini game, flexible architecture | Owner | Genre not decided, keep architecture open | Cannot design game-specific schema yet |
| D-015 | Backend tech stack | Node.js + TypeScript | Owner (confirmed recommendation R-001) | Same language as frontend; fastest to ship; strong ecosystem | All backend development |
| D-016 | Backend framework | Fastify | Owner (confirmed recommendation R-002) | Fast, typed, good plugin system, not over-engineered | Backend DX, middleware, performance |
| D-017 | API format | REST | Owner (confirmed recommendation R-003) | Simplest, sufficient for stage 1 | API design, documentation |
| D-018 | Migration tool | dbmate (raw SQL migrations) | Owner (confirmed recommendation R-006) | Simple, language-agnostic, fits platform-infra | Migration workflow |
| D-019 | /api/messages | Remove for now, add back with auth later | Owner (confirmed recommendation R-007) | Security hole, no admin panel to consume it | Immediate security improvement |
| D-020 | Rate limiting strategy (Phase 0) | By IP for /api/contact | Owner (confirmed recommendation) | No auth yet; simplest baseline; can expand to IP+user later | Abuse prevention on contact form |

---

## Recommended Decisions (Awaiting Owner Confirmation)

| ID | Title | Recommendation | Rationale | Alternatives | Impact |
|---|---|---|---|---|---|
| R-004 | Token strategy (PD-011) | JWT + refresh token | Stateless auth with revocation capability via refresh token rotation | Plain JWT (can't revoke), Session+cookie (needs Redis from start) | Auth implementation, security posture |
| R-005 | Game route (PD-012) | Dedicated `/game` route in portfolio_nextjs | Clean URL, shareable, better SEO, clear separation from portfolio sections | Embedded in page (cluttered), subdomain (complex setup) | Frontend routing |

---

## Pending Decisions (Owner Must Decide)

| ID | Title | Options | Blocks | Notes |
|---|---|---|---|---|
| PD-001 | Game genre / gameplay | Puzzle, arcade, clicker, merge, physics, etc. | Phase 1B entirely | **Critical blocker** — everything game-related depends on this |
| PD-002 | Real-time vs turn-based | Real-time (needs game loop), Turn-based (request/response) | Phase 1B | Affects WebSocket decision |
| PD-003 | Guest leaderboard viewing | (a) Guests can view, (b) Login required to view | Phase 1C | UX and conversion trade-off |
| PD-004 | Leaderboard type | All-time, daily, weekly, combination | Phase 1C | DB schema impact |
| PD-005 | Scoring metric | Depends on game genre | Phase 1B, 1C | Cannot design until PD-001 decided |
| PD-006 | Anti-cheat | Server validation, rate limiting, replay verification, none | Phase 1C | Complexity vs integrity trade-off |
| PD-007 | PaaS provider | Render, Railway, Fly.io | Phase 1D | Each has different pricing/DX |
| PD-008 | Admin panel scope | Contact messages, user accounts, game data, all | Phase 2 | Not blocking stage 1 |
| PD-010 | Password reset flow | Email reset link, no reset, manual reset | Phase 1A | Needs email provider if automated |
| PD-011 | Token strategy | JWT, Session+cookie, JWT+refresh | Phase 1A | Recommendation: JWT + refresh token |
| PD-012 | Game route strategy | /game route, embedded, subdomain | Phase 1B | Recommendation: /game route |
| PD-016 | Email verification required? | Yes (needs email provider), No | Phase 1A | Affects sign-up flow complexity |
| PD-017 | Auth persistence across repos | Shared cookie, shared JWT, separate auth per service | Phase 1A | Cross-origin auth is complex |
| PD-022 | Redis provider | Upstash, Railway Redis, Render Redis, Fly Redis | Phase 1A (if session-based) | Only needed if session-based auth chosen |
| PD-026 | Custom domain? | Yes (which domain?), No (use Vercel default) | Phase 1D | OAuth callback URLs, Vercel config |

---

## Deferred Decisions

| ID | Title | Deferred To | Reason |
|---|---|---|---|
| DD-001 | Facebook OAuth | Stage 2+ | Owner explicitly deferred |
| DD-002 | CI/CD pipeline | Stage 2+ | Manual deploy acceptable for stage 1 |
| DD-003 | Admin dashboard | Stage 2+ | Scope not defined |
| DD-004 | User profiles (public) | Stage 2+ | Not in stage 1 scope |
| DD-005 | Analytics/monitoring | Stage 2+ | Not in stage 1 scope |
