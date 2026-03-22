# Phases Roadmap

> Last updated: 2026-03-21
> Status: Living document — Phase 0 complete, Phase 1A email/password done (OAuth pending), Phase 1B complete

---

## Phase Overview

| Phase | Name | Goal | Depends On | Status |
|---|---|---|---|---|
| **Phase 0** | Foundation & Planning | Finalize all pending decisions, set up repos, migrations, CI baseline | Owner decisions | ✅ Complete |
| **Phase 1A** | Backend Core | Auth + basic API structure in watermelon-game-api | Phase 0 | 🔄 Email/password done, OAuth pending |
| **Phase 1B** | Game MVP | Game frontend + game logic + score submission | Phase 1A + PD-001 (game genre) | ✅ Complete |
| **Phase 1C** | Leaderboard & Polish | Leaderboard, security hardening, portfolio integration | Phase 1B | Pending |
| **Phase 1D** | Deploy & Launch | Production deploy, monitoring, final QA | Phase 1C | Pending |
| **Phase 2** | Expansion | Additional projects, admin panel, analytics, etc. | Phase 1D | Future |

---

## Phase 0 — Foundation & Planning ✅ COMPLETE

### Goal
Resolve all blocking decisions. Set up repo scaffolding. Establish migration tooling. Harden existing portfolio.

### Input
- Current codebase (portfolio_nextjs)
- Owner decisions from this planning session
- Pending decisions that need owner confirmation

### Tasks

| # | Task | Owner | Status |
|---|---|---|---|
| 0.1 | Owner confirms game genre (PD-001) | Owner | **Blocking** |
| 0.2 | Owner confirms backend tech stack (PD-009) | Owner | **Blocking** |
| 0.3 | Owner confirms token strategy (PD-011) | Owner | **Blocking** |
| 0.4 | Owner confirms game route strategy (PD-012) | Owner | **Pending** |
| 0.5 | Owner confirms backend framework (PD-013) | Owner | **Pending** |
| 0.6 | Owner confirms API format (PD-014) | Owner | **Pending** |
| 0.7 | Create `watermelon-game-api` repo with scaffolding | Dev | Blocked by 0.2, 0.5 |
| 0.8 | Create `platform-infra` repo with migration tooling | Dev | Blocked by 0.2 |
| 0.9 | Move DB schema to migrations (replace ensureSchema) | Dev | Blocked by 0.8 |
| 0.10 | Protect or remove `/api/messages` endpoint | Dev | Ready |
| 0.11 | Add rate limiting to `/api/contact` | Dev | Ready |
| 0.12 | Add .env.example to portfolio_nextjs | Dev | Ready |
| 0.13 | Set up Vercel project for portfolio_nextjs | Dev | Ready |

### Output
- All blocking decisions resolved
- 3 repos created and scaffolded
- Migration tooling working
- Portfolio hardened for production

### Risks
- Owner decisions may take time → delays Phase 1A
- Game genre not decided → blocks game-specific schema design

### Owner Decisions Required
- PD-001, PD-002, PD-009, PD-011, PD-012, PD-013, PD-014

---

## Phase 1A — Backend Core — IN PROGRESS

### Goal
Auth system working in watermelon-game-api. Users can register, login, and authenticate.

### Input
- Scaffolded watermelon-game-api repo ✅
- Confirmed tech stack and framework ✅
- Database migrations for users table ✅

### Tasks

| # | Task | Depends On | Status |
|---|---|---|---|
| 1A.1 | Database migration: create `users` + `refresh_tokens` tables | Phase 0 | ✅ Done |
| 1A.2 | Implement email + password registration | 1A.1 | ✅ Done |
| 1A.3 | Implement email + password login | 1A.2 | ✅ Done |
| 1A.4 | Implement auth middleware (JWT verification) | 1A.2 | ✅ Done |
| 1A.5 | Implement `GET /auth/me` endpoint | 1A.4 | ✅ Done |
| 1A.6 | Implement `POST /auth/logout` | 1A.4 | ✅ Done |
| 1A.7 | Implement `POST /auth/refresh` (token rotation) | 1A.4 | ✅ Done |
| 1A.8 | Frontend: AuthProvider, login/register pages | 1A.2 | ✅ Done |
| 1A.9 | Frontend: Navbar auth integration | 1A.8 | ✅ Done |
| 1A.10 | CORS configuration (allow portfolio_nextjs origin) | — | ✅ Already in scaffold |
| 1A.11 | Rate limiting on auth endpoints | — | ✅ Done |
| 1A.12 | Implement Google OAuth flow | 1A.1 | TODO |
| 1A.13 | Implement GitHub OAuth flow | 1A.1 | TODO |

### Output
- ✅ Email/password auth fully working (register, login, logout, refresh, me)
- ✅ Frontend auth UI (login, register pages, navbar integration)
- ✅ CORS + rate limiting configured
- TODO: Google + GitHub OAuth flows

### Risks
- OAuth provider setup complexity (callback URLs, client IDs)
- Email/password adds password hashing, potential reset flow complexity
- Token strategy affects session management

### Owner Decisions Required
- PD-010 (password reset flow — can be deferred to later in stage 1)

---

## Phase 1B — Game MVP ✅ COMPLETE

### Goal
Playable game in browser. Authenticated users can submit scores.

### Input
- Working auth from Phase 1A ✅
- Game genre decided: Angry Birds style physics game (D-027) ✅
- Game frontend technology: HTML5 Canvas + matter.js (D-031) ✅

### Tasks

| # | Task | Depends On | Status |
|---|---|---|---|
| 1B.1 | Database migration: `game_sessions` table | Phase 0 | ✅ Done |
| 1B.2 | Implement game types, schemas, service | 1B.1 | ✅ Done |
| 1B.3 | Implement game routes (6 endpoints) | 1B.2 | ✅ Done |
| 1B.4 | Install matter-js physics engine | — | ✅ Done |
| 1B.5 | Build game engine (physics, rendering, input) | 1B.4 | ✅ Done |
| 1B.6 | Define 3 levels (Simple Tower, Double Stack, Pyramid) | — | ✅ Done |
| 1B.7 | Build scoring system | — | ✅ Done |
| 1B.8 | Create game API client | 1B.3 | ✅ Done |
| 1B.9 | Build GameClient component + /game page | 1B.5, 1B.8 | ✅ Done |
| 1B.10 | Integrate auth in game page (login prompt, guest mode) | 1B.9 | ✅ Done |
| 1B.11 | Update navigation for /game route | 1B.9 | ✅ Done |

### Output
- ✅ Playable physics game (3 levels) in browser at /game
- ✅ Guest can play (no save)
- ✅ Authenticated user's scores saved to database
- ✅ API client abstraction in place
- ✅ Navigation updated

### Risks (resolved)
- ~~PD-001 not decided → blocks entire phase~~ → **Resolved: Angry Birds style (D-027)**
- ~~Frontend game tech choice depends on genre~~ → **Resolved: Canvas + matter.js (D-031)**

---

## Phase 1C — Leaderboard & Polish

### Goal
Official leaderboard working. Portfolio integration polished. Security hardened.

### Input
- Working game with score submission from Phase 1B
- Leaderboard decisions confirmed

### Tasks

| # | Task | Depends On |
|---|---|---|
| 1C.1 | Database migration: leaderboard schema/view | PD-004, PD-005 |
| 1C.2 | Implement leaderboard API endpoints | 1C.1 |
| 1C.3 | Build leaderboard UI in portfolio_nextjs | 1C.2 |
| 1C.4 | Integrate game as featured project in portfolio | Phase 1B |
| 1C.5 | Security audit: all endpoints reviewed | Phase 1B |
| 1C.6 | Add error boundaries to React app | Phase 1B |
| 1C.7 | Enable image optimization (or confirm unoptimized is intentional) | — |
| 1C.8 | Clean up dead code (unused exports, Prisma gitignore) | — |

### Output
- Working leaderboard visible from portfolio
- Game fully integrated as portfolio project
- Security hardened

### Risks
- Leaderboard design depends on multiple pending decisions
- Anti-cheat complexity could grow scope

### Owner Decisions Required
- PD-003 (can guests view leaderboard?)
- PD-004 (leaderboard type)
- PD-005 (scoring metric — if not decided in 1B)
- PD-006 (anti-cheat)

---

## Phase 1D — Deploy & Launch

### Goal
Everything deployed to production. System working end-to-end.

### Input
- All features from Phase 1A-1C complete
- PaaS provider decided (PD-007)

### Tasks

| # | Task | Depends On |
|---|---|---|
| 1D.1 | Configure Vercel deployment for portfolio_nextjs | — |
| 1D.2 | Configure PaaS deployment for watermelon-game-api | PD-007 |
| 1D.3 | Set up production database + run migrations | 1D.2 |
| 1D.4 | Configure production environment variables | 1D.1, 1D.2 |
| 1D.5 | End-to-end smoke test | 1D.4 |
| 1D.6 | Set up basic monitoring/alerts (if applicable) | 1D.5 |
| 1D.7 | Document deploy process in platform-infra | 1D.2 |

### Output
- System live in production
- Portfolio accessible publicly
- Game playable by anyone
- Deploy process documented

### Risks
- CORS issues between Vercel and PaaS in production
- OAuth callback URLs need updating for production domain
- Database connection from PaaS to Neon

### Owner Decisions Required
- PD-007 (PaaS provider — must be decided before this phase)

---

## Phase 2 — Expansion (Future)

> Not in scope for current planning. Noted here for context.

Potential items:
- Additional projects in portfolio
- Admin dashboard
- Analytics
- Facebook OAuth
- CI/CD pipeline
- Email verification + password reset flow improvements
- Social features
- Performance optimization
