# Master Plan

> Last updated: 2026-03-18
> Status: Stage 1 master plan. Phases are sequential with defined gates.

---

## Overview

| Attribute | Value |
|---|---|
| **Product** | Thuong's Portfolio Platform + Watermelon Game |
| **Repos** | portfolio_nextjs, watermelon-game-api, platform-infra |
| **Deploy** | Vercel (frontend) + PaaS (backend) + Neon Postgres (DB) |
| **Target** | Stage 1 — Functional portfolio with playable game, auth, and leaderboard |

---

## Phase 0 — Foundation & Planning

### Goal
Resolve all blocking decisions. Set up all repos. Establish migration tooling. Harden existing portfolio for production.

### Prerequisites
- Owner available for decision-making

### Work Items

**Owner decisions (blocking):**
1. Confirm backend tech stack → PD-009
2. Confirm backend framework → PD-013
3. Confirm API format → PD-014
4. Confirm migration tool → PD-021
5. Confirm /api/messages fate → PD-023
6. Confirm rate limiting strategy → PD-024

**Dev work (parallel where possible):**
1. Create & scaffold watermelon-game-api repo
2. Create & scaffold platform-infra repo
3. Set up migration tooling in platform-infra
4. Migrate existing `messages` schema to proper migration
5. Remove `ensureSchema()` from portfolio_nextjs
6. Protect/remove `/api/messages`
7. Add rate limiting to `/api/contact`
8. Add .env.example files to all repos
9. Set up Vercel project for portfolio_nextjs
10. Clean up minor issues (dead gitignore entry, duplicate constants)

### Expected Output
- 3 repos created and scaffolded
- Migration tooling working
- Portfolio hardened
- Vercel deploy working for portfolio

### Gate Criteria
- [ ] All Phase 0 owner decisions confirmed
- [ ] All 3 repos exist with proper structure
- [ ] Migrations work against Neon
- [ ] Portfolio deploys on Vercel
- [ ] No known security issues in portfolio

### Risks
| Risk | Mitigation |
|---|---|
| Owner decisions delayed | Prioritize decisions that block most work first |
| Migration tool choice impacts later phases | Choose simple tool (dbmate) that doesn't lock in ORM |

---

## Phase 1A — Backend Core (Auth)

### Goal
Working auth system in watermelon-game-api. Users can register/login via Google, GitHub, or email.

### Prerequisites
- Phase 0 complete
- PD-009, PD-011, PD-013 confirmed
- PD-010, PD-016, PD-017 confirmed (auth detail decisions)

### Work Items

1. Create `users` table migration
2. Implement Google OAuth flow (register app, endpoints, callback)
3. Implement GitHub OAuth flow (register app, endpoints, callback)
4. Implement email + password registration (hashing, validation)
5. Implement email + password login
6. Implement auth middleware (token verification)
7. Implement `GET /auth/me` and `POST /auth/logout`
8. Configure CORS for portfolio_nextjs origin
9. Add rate limiting to auth endpoints
10. Add global error handling middleware

### Expected Output
- Auth endpoints functional (6 endpoints minimum)
- Token generation and verification working
- CORS configured correctly
- Auth tested end-to-end

### Gate Criteria
- [ ] All 3 auth methods working (Google, GitHub, email/password)
- [ ] Auth middleware correctly blocks unauthenticated requests
- [ ] CORS allows only portfolio_nextjs origin
- [ ] Rate limiting active on auth endpoints
- [ ] No security issues identified in auth review

### Risks
| Risk | Mitigation |
|---|---|
| OAuth provider setup complexity | Document setup steps clearly, test with localhost first |
| Email/password complexity (hashing, verification, reset) | Start with minimal flow, defer password reset to later |
| Cross-origin auth (Vercel ↔ PaaS) | Test CORS early, decide cookie vs header auth early |

### Owner Decisions Required
- PD-010 (password reset), PD-016 (email verification), PD-017 (cross-origin auth)

---

## Phase 1B — Game MVP

### Goal
Playable game in browser. Authenticated users can submit and save scores.

### Prerequisites
- Phase 1A complete
- **PD-001 (game genre) confirmed — CRITICAL BLOCKER**
- PD-002, PD-005, PD-015 confirmed

### Work Items

1. Design game data schema based on genre
2. Create `game_sessions` table migration
3. Implement game logic API endpoints
4. Build game UI in portfolio_nextjs (route per PD-012)
5. Create API client layer in portfolio_nextjs
6. Integrate auth in game page (login prompt, guest toggle)
7. Implement score submission flow
8. Guest mode: play without persistence

### Expected Output
- Game playable in browser from portfolio
- Guest can play (no save)
- Authenticated user can play and scores are saved
- API client abstraction in place

### Gate Criteria
- [ ] Game loads and is playable
- [ ] Guest plays without errors, no data saved
- [ ] Authenticated user's score saved to database
- [ ] API calls from portfolio to game backend work correctly
- [ ] No auth bypass possible on score submission

### Risks
| Risk | Mitigation |
|---|---|
| PD-001 not decided → blocks entire phase | Escalate to owner as critical blocker |
| Game frontend tech choice (Canvas, WebGL, DOM) depends on genre | Wait for genre decision before choosing |
| Complex game logic may expand scope | Keep MVP minimal — basic gameplay + score |

### Owner Decisions Required
- PD-001 (genre), PD-002 (real-time/turn-based), PD-005 (scoring), PD-006 (anti-cheat)

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
