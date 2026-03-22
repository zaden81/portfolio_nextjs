# Master Plan

> Last updated: 2026-03-21
> Status: Stage 1 master plan. Phase 0 complete, Phase 1A email/password done, Phase 1B complete.

---

## Overview

| Attribute | Value |
|---|---|
| **Product** | Thuong's Portfolio Platform + Watermelon Game |
| **Repos** | portfolio_nextjs, watermelon-game-api, platform-infra |
| **Deploy** | Vercel (frontend) + PaaS (backend) + Neon Postgres (DB) |
| **Target** | Stage 1 — Functional portfolio with playable game, auth, and leaderboard |

---

## Phase 0 — Foundation & Planning ✅ COMPLETE

### Goal
Resolve all blocking decisions. Set up all repos. Establish migration tooling. Harden existing portfolio for production.

### Gate Criteria
- [x] All Phase 0 owner decisions confirmed
- [x] All 3 repos exist with proper structure
- [x] Migrations work against Neon
- [ ] Portfolio deploys on Vercel
- [x] No known security issues in portfolio

---

## Phase 1A — Backend Core (Auth) — EMAIL/PASSWORD DONE

### Goal
Working auth system in watermelon-game-api. Users can register/login via Google, GitHub, or email.

### Progress (as of 2026-03-21)

**Completed:**
- ✅ `users` + `refresh_tokens` table migrations created and applied
- ✅ Email + password registration (bcryptjs, Zod validation)
- ✅ Email + password login with JWT access + refresh tokens
- ✅ Auth middleware (`requireAuth`)
- ✅ `GET /auth/me`, `POST /auth/logout`, `POST /auth/refresh` (token rotation)
- ✅ CORS configured, rate limiting on all auth routes
- ✅ Global error handler (AppError, ZodError, FastifyError)
- ✅ Frontend: AuthProvider, useAuth hook, login/register pages, navbar integration

**Remaining:**
- [ ] Google OAuth flow (requires Google Cloud Console setup by owner)
- [ ] GitHub OAuth flow (requires GitHub OAuth app setup by owner)

### Gate Criteria
- [x] Email/password auth working
- [x] Auth middleware correctly blocks unauthenticated requests
- [x] CORS allows only portfolio_nextjs origin
- [x] Rate limiting active on auth endpoints
- [ ] Google OAuth working
- [ ] GitHub OAuth working

---

## Phase 1B — Game MVP ✅ COMPLETE

### Goal
Playable game in browser. Authenticated users can submit and save scores.

### Progress (as of 2026-03-21)

**All tasks completed:**
- ✅ Game genre decided: Angry Birds style physics game (D-027)
- ✅ `game_sessions` table migration created and applied
- ✅ Game module in watermelon-game-api (types, schemas, service, routes — 6 endpoints)
- ✅ Game engine in portfolio_nextjs (Matter.js physics, Canvas 2D, slingshot mechanics)
- ✅ 3 levels: Simple Tower, Double Stack, Pyramid
- ✅ Scoring system with level multiplier + bonuses
- ✅ Game API client using authFetch
- ✅ GameClient component with full game UI + overlays
- ✅ Auth integration (login prompt for guests, score saving for auth users)
- ✅ Navigation updated with `/game` link

### Gate Criteria
- [x] Game loads and is playable
- [x] Guest plays without errors, no data saved
- [x] Authenticated user's score saved to database
- [x] API calls from portfolio to game backend work correctly
- [x] Navigation to /game works from both desktop and mobile nav

---

## Phase 1C — Leaderboard & Polish

### Goal
Official leaderboard working. Portfolio integration polished. Security hardened.

### Prerequisites
- Phase 1B complete
- PD-003, PD-004, PD-005 confirmed

### Work Items

1. Create leaderboard schema/view migration
2. Implement leaderboard API endpoints
3. Build leaderboard UI in portfolio_nextjs
4. Integrate game as featured project in portfolio Projects section
5. Security audit of all endpoints
6. Add React error boundaries
7. Review image optimization setting
8. Clean up any remaining issues

### Expected Output
- Leaderboard visible and functional
- Game prominently featured in portfolio
- All endpoints security-reviewed
- Code clean and production-ready

### Gate Criteria
- [ ] Leaderboard displays correctly with real data
- [ ] Auth rules enforced on leaderboard (per PD-003)
- [ ] Security audit complete, no issues found
- [ ] Game appears in portfolio Projects section
- [ ] All docs updated

### Owner Decisions Required
- PD-003 (guest leaderboard viewing), PD-004 (leaderboard type), PD-018 (display names)

---

## Phase 1D — Deploy & Launch

### Goal
Everything deployed to production. System working end-to-end.

### Prerequisites
- Phase 1C complete
- PD-007 (PaaS provider) confirmed

### Work Items

1. Configure Vercel production deployment
2. Configure PaaS production deployment for watermelon-game-api
3. Set up / verify production Neon database
4. Run all migrations on production
5. Configure production environment variables
6. Update OAuth callback URLs for production domain
7. End-to-end smoke test
8. Document deploy process in platform-infra
9. Update all READMEs

### Expected Output
- System live in production
- All features working
- Deploy process documented

### Gate Criteria
- [ ] Portfolio accessible at production URL
- [ ] Game playable in production
- [ ] All auth methods work in production
- [ ] Leaderboard works in production
- [ ] Contact form works in production
- [ ] HTTPS verified everywhere
- [ ] Deploy documented

### Owner Decisions Required
- PD-007 (PaaS provider), PD-026 (custom domain)

---

## Decision Dependency Map

```
Phase 0:
  PD-009 (tech stack) ──→ repo scaffolding
  PD-013 (framework) ──→ repo scaffolding
  PD-021 (migration tool) ──→ platform-infra setup

Phase 1A:
  PD-011 (token strategy) ──→ auth implementation
  PD-016 (email verification) ──→ email auth flow
  PD-017 (cross-origin auth) ──→ CORS + token sharing

Phase 1B:
  PD-001 (game genre) ──→ EVERYTHING in this phase
  PD-002 (real-time/turn) ──→ API pattern
  PD-005 (scoring) ──→ schema + game logic

Phase 1C:
  PD-003 (guest leaderboard) ──→ API auth rules
  PD-004 (leaderboard type) ──→ schema
  PD-006 (anti-cheat) ──→ validation logic

Phase 1D:
  PD-007 (PaaS provider) ──→ deploy pipeline
  PD-026 (custom domain) ──→ OAuth callbacks
```

---

## Timeline Note

No timeline estimates are provided. Phases are ordered by dependency, not by calendar. The critical path is:

```
Owner decisions (PD-009, PD-013) → Phase 0 → Phase 1A → PD-001 (game genre) → Phase 1B → Phase 1C → PD-007 (PaaS) → Phase 1D
```

**PD-001 (game genre) is the single biggest blocker for the project.** It can be decided any time before Phase 1B starts, but delaying it delays everything game-related.

**UPDATE 2026-03-21**: PD-001 has been resolved (Angry Birds style physics game). Phase 1B is complete. The remaining critical path is:

```
Phase 1A OAuth → Phase 1C (PD-003, PD-004, PD-006) → PD-007 (PaaS) → Phase 1D
```
