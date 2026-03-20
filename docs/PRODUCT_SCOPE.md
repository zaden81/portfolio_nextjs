# Product Scope

> Last updated: 2026-03-18
> Status: Stage 1 scope confirmed by owner with noted pending decisions

---

## 1. Product Vision

A professional portfolio platform that:
1. Showcases the owner as a fullstack developer / AI engineer
2. Features a playable web game as a standout project demonstrating backend architecture skills
3. Serves as a living, extensible platform for future projects

---

## 2. Stage 1 Scope — What We ARE Building

### 2.1 Portfolio Website (portfolio_nextjs)

| Feature | Status | Notes |
|---|---|---|
| Hero section | **Already built** | — |
| About section (bio, info, skills) | **Already built** | — |
| Projects section | **Already built** | Currently 2 projects |
| Contact form → database | **Already built** | Zod validation, Neon Postgres |
| Dark/Light theme | **Already built** | — |
| Responsive design | **Already built** | Mobile menu included |
| Loading screen | **Already built** | — |
| SEO (OG, Twitter cards) | **Already built** | — |
| Game as featured project | **To build** | Embedded or linked within Projects section |
| Security hardening (rate limiting, protect /api/messages) | **To build** | Before production |
| Deploy to Vercel | **To build** | — |

### 2.2 Watermelon Game Backend (watermelon-game-api)

| Feature | Status | Notes |
|---|---|---|
| Auth: Google OAuth | **To build** | Priority 1 |
| Auth: GitHub OAuth | **To build** | Priority 1 |
| Auth: Email + Password | **To build** | Priority 2 (after OAuth) |
| Guest play mode | **To build** | Play without login, no persistence |
| Score submission (authenticated) | **To build** | Game genre affects implementation |
| Official game history | **To build** | Authenticated users only |
| Official leaderboard | **To build** | Authenticated users only |
| Game logic API | **To build** | Depends on game genre (pending) |

### 2.3 Infra (platform-infra)

| Feature | Status | Notes |
|---|---|---|
| Database migrations | **To build** | Replace ensureSchema() pattern |
| Deploy configuration docs | **To build** | Vercel + PaaS setup |
| Environment config templates | **To build** | .env templates for each repo |

---

## 3. Stage 1 Scope — What We Are NOT Building

| Feature | Reason |
|---|---|
| Facebook OAuth | Owner deferred to later stage |
| Separate auth microservice | Over-engineering for stage 1 |
| Self-hosted infrastructure | Using managed services (Vercel, PaaS, Neon) |
| Admin dashboard | Scope not defined yet (pending owner decision) |
| Real-time multiplayer / WebSocket | Not confirmed by owner |
| Email verification flow | Complexity note — included in stage 1 as minimal form, full flow pending |
| Password reset via email | Complexity note — depends on email provider decision |
| CMS integration | Content managed via code constants |
| i18n / multi-language | Not requested |
| Analytics / monitoring dashboards | Not in scope for stage 1 |
| Mobile app | Not in scope |
| Payment / monetization | Not in scope |
| Social features (comments, sharing) | Not in scope |
| CI/CD pipeline | Recommended but not required before manual deploy works |

---

## 4. Anti-Over-Engineering Principles

These principles guide all technical decisions in stage 1:

1. **No premature abstraction** — Don't create a generic "GameEngine" when we have one game. Don't create an auth SDK when we have one consumer.

2. **No service splitting before pain** — Auth stays in watermelon-game-api. Don't create auth-service, user-service, score-service separately until there's a real scaling or organizational reason.

3. **Managed services over self-hosted** — Use Neon (DB), Vercel (frontend), PaaS (backend), managed Redis. Don't run your own Postgres or Redis in stage 1.

4. **No speculative features** — Don't build WebSocket support "just in case". Don't build a plugin system for future games. Build what's confirmed.

5. **Simple over clever** — A straightforward Express/Fastify API is fine. No need for event sourcing, CQRS, or hexagonal architecture gymnastics unless the domain genuinely demands it.

6. **Ship, then improve** — A working game with basic auth and leaderboard > a perfectly architected system that doesn't ship.

7. **Owner decides scope** — Technical team recommends, owner decides. Never add scope without owner confirmation.

---

## 5. Definition of Done — Stage 1

Stage 1 is considered **done** when:

### Portfolio
- [ ] Portfolio website deployed on Vercel with custom domain (if applicable)
- [ ] `/api/messages` is either protected or removed
- [ ] Contact form rate-limited
- [ ] Game appears as a featured project in the Projects section
- [ ] Game is playable directly from the portfolio (embedded or linked)

### Game
- [ ] Watermelon Game is playable in browser as a guest
- [ ] Users can register/login via Google OAuth
- [ ] Users can register/login via GitHub OAuth
- [ ] Users can register/login via email + password
- [ ] Authenticated users' scores are saved
- [ ] Official leaderboard shows authenticated users' scores
- [ ] Guest scores are NOT saved to official history/leaderboard

### Backend
- [ ] watermelon-game-api deployed on PaaS
- [ ] Auth endpoints functional (register, login, logout, OAuth callbacks)
- [ ] Game score submission endpoint functional
- [ ] Leaderboard query endpoint functional
- [ ] Database schema managed via migrations (platform-infra)

### Infrastructure
- [ ] Database migrations in platform-infra work correctly
- [ ] All repos have proper .env.example files
- [ ] README in each repo explains setup and deploy

---

## 6. Decisions Pending for Stage 1

These decisions block or affect specific implementation work:

| ID | Decision | Blocks |
|---|---|---|
| PD-001 | Game genre / gameplay type | Game frontend, game logic API, scoring metric |
| PD-002 | Real-time vs turn-based | WebSocket decision, API design |
| PD-003 | Can guests view leaderboard? | Leaderboard API permissions |
| PD-004 | Leaderboard type | DB schema, query design |
| PD-005 | Scoring metric | Game logic, leaderboard schema |
| PD-006 | Anti-cheat strategy | Score validation flow |
| PD-007 | Backend PaaS provider | Deploy pipeline |
| PD-008 | Admin panel scope | Whether to build admin routes |
| PD-009 | Game backend tech stack | watermelon-game-api repo setup |
| PD-010 | Password reset flow details | Email provider, token management |
