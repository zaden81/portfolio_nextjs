# Execution Checklist

> Last updated: 2026-03-23
> Status: Master checklist for stage 1 execution. Update as work progresses.

---

## Phase 0 — Foundation & Planning ✅ COMPLETE

### Owner Decisions (must complete before dev work)
- [x] PD-001: Decide game genre / gameplay type — **Still pending, does not block Phase 0**
- [x] PD-002: Decide real-time vs turn-based — **Still pending, does not block Phase 0**
- [x] PD-009: Confirm backend tech stack — **Confirmed: Node.js + TypeScript** (D-015)
- [x] PD-011: Confirm token strategy — **Confirmed: JWT + refresh token rotation** (D-021)
- [x] PD-012: Confirm game route strategy — **Recommended: `/game` route** (R-005)
- [x] PD-013: Confirm backend framework — **Confirmed: Fastify** (D-016)
- [x] PD-014: Confirm API format — **Confirmed: REST** (D-017)
- [x] PD-021: Confirm migration tool — **Confirmed: dbmate** (D-018)
- [x] PD-023: Confirm /api/messages fate — **Confirmed: removed** (D-019)
- [x] PD-024: Confirm rate limiting strategy — **Confirmed: by IP** (D-020)

### Repo Setup
- [x] Create `watermelon-game-api` repo on GitHub — **Created by owner**
- [x] Scaffold watermelon-game-api project (package.json, tsconfig, src/ structure) — **Done**
- [x] Create `platform-infra` repo on GitHub — **Created by owner**
- [x] Scaffold platform-infra (migrations/ folder, .env templates, README) — **Done**
- [x] Add .env.example to portfolio_nextjs — **Created**
- [x] Add .env.example to watermelon-game-api — **Created**

### Portfolio Hardening
- [x] Protect or remove `/api/messages` endpoint — **Removed** (D-019)
- [x] Add rate limiting to `POST /api/contact` — **IP-based, 5 req/min** (D-020)
- [x] Clean up dead .gitignore entry (Prisma) — **Removed**
- [x] Clean up duplicate PHONE_NUMBER / PHONE constants — **Consolidated to PHONE in personal.ts**
- [x] Remove unused LOGO_TEXT export (or use it) — **Removed**

### Database & Migrations
- [x] Set up migration tool in platform-infra — **dbmate configured**
- [x] Create initial migration from existing `messages` table schema — **Done**
- [x] Verify migration runs correctly against Neon — **Done (2026-03-20)**
- [x] Remove `ensureSchema()` auto-migration from portfolio_nextjs — **Done** (commit `58374d5`)

### Deploy Baseline
- [ ] Set up Vercel project for portfolio_nextjs
- [ ] Verify Vercel deploy works with current codebase
- [ ] Document deploy process in platform-infra README

---

## Phase 1A — Backend Core (Auth) ✅ COMPLETE

### Owner Decisions
- [x] PD-011: Token strategy — **JWT + refresh token rotation** (D-021)
- [x] PD-016: Email verification required? — **No, deferred** (D-025)
- [x] PD-010: Password reset flow — **Deferred to later** (D-026)
- [x] PD-017: Auth persistence across repos — **Resolved**: JWT Bearer in Authorization header, CORS configured
- [x] PD-022: Redis provider — **Not needed**: using DB-backed refresh tokens instead of sessions

### Database
- [x] Create migration: `users` table — **Done** (`20260320000001_create_users_table.sql`)
- [x] Create migration: `refresh_tokens` table — **Done** (`20260320000002_create_refresh_tokens_table.sql`)
- [x] Run migrations against Neon — **Done (2026-03-20)**

### Auth Implementation — Email/Password ✅
- [x] Implement email + password registration
  - [x] Password hashing (bcryptjs, 12 rounds)
  - [x] `POST /auth/register` endpoint
  - [x] Input validation (Zod)
  - [x] Test registration flow — **Passed**
- [x] Implement email + password login
  - [x] `POST /auth/login` endpoint
  - [x] Password verification
  - [x] Token generation (JWT access + refresh)
  - [x] Test login flow — **Passed**
- [x] Implement auth middleware
  - [x] Token verification middleware (`requireAuth`)
  - [x] Fastify type augmentation for `request.user`
- [x] Implement `GET /auth/me` — **Done, tested**
- [x] Implement `POST /auth/logout` — **Done, tested**
- [x] Implement `POST /auth/refresh` — **Done, tested** (with token rotation)

### Auth Implementation — OAuth ✅
- [x] Implement Google OAuth flow
  - [x] Implement `/auth/google` redirect endpoint
  - [x] Implement `/auth/google/callback` endpoint
  - [ ] Register Google OAuth app (Google Cloud Console) — **Owner task**
  - [ ] Test end-to-end Google login — **Pending credentials**
- [x] Implement GitHub OAuth flow
  - [x] Implement `/auth/github` redirect endpoint
  - [x] Implement `/auth/github/callback` endpoint
  - [ ] Register GitHub OAuth app (GitHub Settings) — **Owner task**
  - [ ] Test end-to-end GitHub login — **Pending credentials**
- [x] Create migration: `add_oauth_to_users` (oauth_provider, oauth_id columns)
- [x] Frontend OAuth callback page (`/auth/callback`)
- [x] OAuth buttons in Login and Register forms

### Frontend Auth ✅
- [x] AuthProvider + useAuth hook (React Context)
- [x] authFetch wrapper + authApi client
- [x] Login page (`/login`)
- [x] Register page (`/register`)
- [x] Navbar integration (user name + logout / login link)
- [x] MobileMenu auth support

### Security ✅
- [x] CORS configuration (allow only portfolio_nextjs origin) — **Already configured in scaffold**
- [x] Rate limiting on auth endpoints — **Per-route: 10/min register+login, 30/min refresh+logout, 100/min me**
- [x] Global error handling middleware — **AppError + ZodError + FastifyError**
- [x] Zod validation on all auth request bodies

---

## Phase 1B — Game MVP ✅ COMPLETE

### Owner Decisions
- [x] PD-001: Game genre confirmed — **Angry Birds style physics game** (D-027)
- [x] PD-002: Real-time vs turn-based — **Real-time physics simulation (client-side)** (D-028)
- [x] PD-005: Scoring metric — **Points: blocks destroyed × level multiplier + bonuses** (D-029)
- [x] PD-006: Anti-cheat strategy — **Server-side session tracking, client calculates score** (deferred full validation to Phase 1C)
- [x] PD-015: Game route — **Dedicated `/game` route** (R-005 confirmed → D-030)

### Database
- [x] Create migration: `game_sessions` table — **Done** (`20260321000001_create_game_sessions_table.sql`)
- [x] Run migration against Neon — **Done (2026-03-21)**

### Backend (watermelon-game-api)
- [x] Implement game types (`game.types.ts`) — **GameSession interface**
- [x] Implement game schemas (`game.schemas.ts`) — **Zod: updateScoreSchema**
- [x] Implement game service (`game.service.ts`) — **createSession, updateScore, completeSession, getUserSessions**
- [x] Implement game routes (`game.routes.ts`) — **6 endpoints: health, sessions CRUD, levels**
- [x] POST /game/sessions — Create new game session (auth required)
- [x] PATCH /game/sessions/:id/score — Update score (auth required, ownership check)
- [x] POST /game/sessions/:id/complete — Complete session (auth required, ownership check)
- [x] GET /game/sessions/me — Get user's sessions (auth required)
- [x] GET /game/levels — Get static level data (public)
- [x] Guest mode: guests can play locally, no score save (no backend call without auth)

### Frontend (portfolio_nextjs)
- [x] Install matter-js physics engine + @types/matter-js
- [x] Create `/game` route (`app/game/page.tsx`)
- [x] Build game engine (`lib/game/engine.ts`) — Matter.js physics, slingshot, game loop, canvas rendering
- [x] Build physics helpers (`lib/game/physics.ts`) — Ground, walls, blocks, projectile, slingshot
- [x] Define 3 levels (`lib/game/levels.ts`) — Simple Tower, Double Stack, Pyramid
- [x] Scoring system (`lib/game/scoring.ts`) — Block score × level, bonuses for remaining projectiles
- [x] Game types (`lib/game/types.ts`) — Block, Level, GamePhase, GameState
- [x] Game API client (`lib/api/game.ts`) — createSession, updateScore, completeSession, getHistory
- [x] GameClient component (`app/game/GameClient.tsx`) — Full game UI with overlays
- [x] Auth integration in game page — Login prompt, score saving for authenticated users
- [x] Guest mode — Guests can play, no score saved, login prompt shown
- [x] Update navigation — Added "Game" link, handle page links vs anchor links
- [x] Export game types from `types/index.ts`

### Integration
- [x] End-to-end: guest plays game → no backend calls (local only)
- [x] End-to-end: login → play game → session created → score saved → session completed
- [x] Navigation links work (both anchor #links and page /links)

---

## Phase 1C — Leaderboard & Polish

### Owner Decisions
- [ ] PD-003: Can guests view leaderboard?
- [ ] PD-004: Leaderboard type (all-time / daily / weekly)
- [ ] PD-018: Display names or anonymous on leaderboard?

### Database
- [ ] Create migration: leaderboard view/table
- [ ] Run migration

### Backend
- [ ] Implement `GET /leaderboard` endpoint
- [ ] Apply auth rules per PD-003 decision
- [ ] Implement anti-cheat measures per PD-006

### Frontend
- [ ] Build leaderboard UI component
- [ ] Integrate leaderboard in game page or dedicated section
- [ ] Update Projects section to feature game prominently

### Polish
- [ ] Security audit: review all endpoints
- [ ] Add React error boundaries
- [ ] Review image optimization setting
- [ ] Clean up any remaining dead code
- [ ] Review and update all documentation

---

## Phase 1D — Deploy & Launch

### Owner Decisions
- [ ] PD-007: Choose PaaS provider (Render / Railway / Fly.io)
- [ ] PD-026: Custom domain decision

### Deploy
- [ ] Configure Vercel for production deploy
- [ ] Configure PaaS for watermelon-game-api production deploy
- [ ] Set up production Neon database (or use existing)
- [ ] Run all migrations on production database
- [ ] Configure production environment variables (all repos)
- [ ] Update OAuth callback URLs for production domain

### Verification
- [ ] End-to-end smoke test on production
  - [ ] Portfolio loads correctly
  - [ ] Contact form works
  - [ ] Game loads and is playable
  - [ ] Email registration + login works
  - [ ] Google OAuth works (when implemented)
  - [ ] GitHub OAuth works (when implemented)
  - [ ] Score submission works
  - [ ] Leaderboard displays correctly
- [ ] CORS working correctly in production
- [ ] HTTPS verified on all services
- [ ] Rate limiting verified

### Documentation
- [ ] Document deploy process in platform-infra
- [ ] Update README in each repo with production URLs
- [ ] Final docs review and update

---

## Cross-Phase Tracking

### Documents Status
- [x] SYSTEM_OVERVIEW.md — Created
- [x] CURRENT_STATE_AUDIT.md — Created, updated 2026-03-21
- [x] PRODUCT_SCOPE.md — Created
- [x] TECH_ARCHITECTURE.md — Created, updated 2026-03-21
- [x] PHASES_ROADMAP.md — Created, updated 2026-03-21
- [x] OPEN_QUESTIONS.md — Created, updated 2026-03-21
- [x] DECISION_LOG.md — Created, updated 2026-03-21
- [x] EXECUTION_CHECKLIST.md — Created (this file), updated 2026-03-21
- [x] MASTER_PLAN.md — Created, updated 2026-03-21
- [x] SKILL_AGENTS.md — Created
- [x] FRONTEND.md — Created, updated 2026-03-21
- [x] SESSION_HANDOFF.md — Created, updated 2026-03-21
