# Execution Checklist

> Last updated: 2026-03-18
> Status: Master checklist for stage 1 execution. Update as work progresses.

---

## Phase 0 — Foundation & Planning

### Owner Decisions (must complete before dev work)
- [ ] PD-001: Decide game genre / gameplay type
- [ ] PD-002: Decide real-time vs turn-based
- [ ] PD-009: Confirm backend tech stack (recommended: Node.js + TypeScript)
- [ ] PD-011: Confirm token strategy (recommended: JWT + refresh token)
- [ ] PD-012: Confirm game route strategy (recommended: `/game` route)
- [ ] PD-013: Confirm backend framework (recommended: Fastify)
- [ ] PD-014: Confirm API format (recommended: REST)
- [ ] PD-021: Confirm migration tool (recommended: dbmate)
- [ ] PD-023: Confirm /api/messages fate (recommended: remove for now)
- [ ] PD-024: Confirm rate limiting strategy

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
- [ ] Verify migration runs correctly against Neon
- [ ] Remove `ensureSchema()` auto-migration from portfolio_nextjs after migration tool is in place

### Deploy Baseline
- [ ] Set up Vercel project for portfolio_nextjs
- [ ] Verify Vercel deploy works with current codebase
- [ ] Document deploy process in platform-infra README

---

## Phase 1A — Backend Core (Auth)

### Owner Decisions
- [ ] PD-010: Decide password reset flow details
- [ ] PD-016: Decide if email verification is required
- [ ] PD-017: Decide auth persistence strategy across repos
- [ ] PD-022: Choose Redis provider (if session-based auth)

### Database
- [ ] Create migration: `users` table
- [ ] Run migration against Neon

### Auth Implementation
- [ ] Implement Google OAuth flow
  - [ ] Register Google OAuth app (Google Cloud Console)
  - [ ] Implement `/auth/google` redirect endpoint
  - [ ] Implement `/auth/google/callback` endpoint
  - [ ] Test end-to-end Google login
- [ ] Implement GitHub OAuth flow
  - [ ] Register GitHub OAuth app (GitHub Settings)
  - [ ] Implement `/auth/github` redirect endpoint
  - [ ] Implement `/auth/github/callback` endpoint
  - [ ] Test end-to-end GitHub login
- [ ] Implement email + password registration
  - [ ] Password hashing (bcrypt or argon2)
  - [ ] `POST /auth/register` endpoint
  - [ ] Input validation (Zod)
  - [ ] Test registration flow
- [ ] Implement email + password login
  - [ ] `POST /auth/login` endpoint
  - [ ] Password verification
  - [ ] Token generation
  - [ ] Test login flow
- [ ] Implement auth middleware
  - [ ] Token verification middleware
  - [ ] Apply to protected routes
- [ ] Implement `GET /auth/me`
- [ ] Implement `POST /auth/logout`

### Security
- [ ] CORS configuration (allow only portfolio_nextjs origin)
- [ ] Rate limiting on auth endpoints
- [ ] Global error handling middleware
- [ ] Secure token storage guidance documented

---

## Phase 1B — Game MVP

### Owner Decisions
- [ ] PD-001: Game genre confirmed (CRITICAL — blocks this phase)
- [ ] PD-002: Real-time vs turn-based confirmed
- [ ] PD-005: Scoring metric confirmed
- [ ] PD-006: Anti-cheat strategy confirmed
- [ ] PD-015: Game route confirmed

### Database
- [ ] Create migration: `game_sessions` table (schema based on game genre)
- [ ] Run migration

### Backend (watermelon-game-api)
- [ ] Implement game logic API endpoints (specific to game genre)
- [ ] Implement score submission endpoint (authenticated only)
- [ ] Implement game session tracking
- [ ] Guest mode: allow unauthenticated game requests (no score save)

### Frontend (portfolio_nextjs)
- [ ] Create `/game` route (or embed per PD-012 decision)
- [ ] Build game UI (technology depends on genre)
- [ ] Create API client layer (`lib/api-client/`)
- [ ] Integrate auth flow in game page (login prompt, guest mode toggle)
- [ ] Implement score submission from game UI
- [ ] Guest mode: local score display (session only, not persisted)

### Integration
- [ ] End-to-end: guest plays game → no score saved
- [ ] End-to-end: login → play game → score saved
- [ ] Cross-origin communication working correctly

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
  - [ ] Google OAuth works
  - [ ] GitHub OAuth works
  - [ ] Email registration + login works
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
- [x] CURRENT_STATE_AUDIT.md — Created
- [x] PRODUCT_SCOPE.md — Created
- [x] TECH_ARCHITECTURE.md — Created
- [x] PHASES_ROADMAP.md — Created
- [x] OPEN_QUESTIONS.md — Created
- [x] DECISION_LOG.md — Created
- [x] EXECUTION_CHECKLIST.md — Created (this file)
- [x] MASTER_PLAN.md — Created
- [x] SKILL_AGENTS.md — Created
