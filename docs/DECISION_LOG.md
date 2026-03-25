# Decision Log

> Last updated: 2026-03-25
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
| D-015 | Backend tech stack | Node.js + TypeScript | Owner (confirmed R-001) | Same language as frontend; fastest to ship; strong ecosystem | All backend development |
| D-016 | Backend framework | Fastify | Owner (confirmed R-002) | Fast, typed, good plugin system, not over-engineered | Backend DX, middleware, performance |
| D-017 | API format | REST | Owner (confirmed R-003) | Simplest, sufficient for stage 1 | API design, documentation |
| D-018 | Migration tool | dbmate (raw SQL migrations) | Owner (confirmed R-006) | Simple, language-agnostic, fits platform-infra | Migration workflow |
| D-019 | /api/messages | Remove for now, add back with auth later | Owner (confirmed R-007) | Security hole, no admin panel to consume it | Immediate security improvement |
| D-020 | Rate limiting strategy (Phase 0) | By IP for /api/contact | Owner (confirmed recommendation) | No auth yet; simplest baseline; can expand to IP+user later | Abuse prevention on contact form |
| D-021 | Token strategy | JWT access token (15m) + rotating refresh token (7d) | Owner (confirmed R-004) | Stateless auth with revocation via token rotation; no Redis needed | Auth implementation core |
| D-022 | Password hashing | bcryptjs, 12 salt rounds | Dev | Industry standard, good security/performance balance | Auth registration/login |
| D-023 | Refresh token storage | SHA-256 hash in `refresh_tokens` table | Dev | Never store raw tokens; hash allows lookup without exposing secret | Database schema, token validation |
| D-024 | Frontend token storage | Access token in memory, refresh token in localStorage | Dev | Access token not persisted = more secure; refresh in localStorage allows session restoration on page reload | Frontend auth flow |
| D-025 | Email verification | Not required in Phase 1A | Owner | Reduces scope; no email provider needed | Unverified emails accepted |
| D-026 | Password reset | Deferred to later | Owner | Reduces Phase 1A scope; users can create new account | No reset flow in stage 1 |
| D-027 | Game genre | Angry Birds style physics game (slingshot + block destruction) | Owner | Physics-based gameplay showcases Canvas/matter.js skills; engaging and replayable | Drives all game-specific decisions |
| D-028 | Real-time vs turn-based | Real-time physics simulation (client-side, matter.js) | Owner (resolved PD-002) | Physics game requires real-time simulation; no WebSocket needed — client runs physics, server tracks sessions/scores | Frontend game architecture |
| D-029 | Scoring metric | Points: blocks destroyed × 100 × level, bonus for remaining projectiles (200 each) + 500 level clear bonus | Owner (resolved PD-005) | Simple, transparent scoring that rewards skill and efficiency | Game scoring, leaderboard sorting |
| D-030 | Game route | Dedicated `/game` route in portfolio_nextjs | Owner (confirmed R-005) | Clean URL, shareable, better SEO | Frontend routing |
| D-031 | Game frontend technology | HTML5 Canvas + matter.js physics engine | Dev | Best fit for physics-based game; lightweight, no WebGL needed | Game rendering, performance |
| D-032 | Game levels | 3 levels: Simple Tower, Double Stack, Pyramid — static data served from API | Dev | Progressive difficulty; enough for MVP; easy to add more later | Game content, API contract |
| D-033 | Guest leaderboard viewing | Guests can view leaderboard (public, read-only) | Owner (resolved PD-003) | Increases engagement; no data sensitivity on scores | Leaderboard endpoint is public, no auth required |
| D-034 | Leaderboard type | All-time leaderboard only | Owner (resolved PD-004) | Simplest for stage 1; small dataset; easy to extend later | Single query, no time filtering |
| D-035 | Anti-cheat strategy | Client trust + rate limiting (no server-side validation in stage 1) | Owner (resolved PD-006) | Sufficient for portfolio project; server validation adds significant complexity | Rate limit on score submission endpoints |
| D-036 | Leaderboard display names | Show user display names from `users.name` column | Owner (resolved PD-018) | Users enter name at registration; no privacy concern for public leaderboard | Leaderboard JOIN users table for name |

---

## Recommended Decisions (Awaiting Owner Confirmation)

> No pending recommendations at this time.

---

## Pending Decisions (Owner Must Decide)

| ID | Title | Options | Blocks | Notes |
|---|---|---|---|---|
| PD-007 | PaaS provider | Render, Railway, Fly.io | Phase 1D | Each has different pricing/DX |
| PD-008 | Admin panel scope | Contact messages, user accounts, game data, all | Phase 2 | Not blocking stage 1 |
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
| DD-006 | Email verification | Stage 1 later or Stage 2 | No email provider needed for MVP |
| DD-007 | Password reset flow | Stage 1 later or Stage 2 | Users can create new account for now |
