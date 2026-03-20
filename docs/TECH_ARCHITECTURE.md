# Technical Architecture

> Last updated: 2026-03-18
> Status: Stage 1 architecture — some decisions pending owner confirmation

---

## 1. Overall Architecture

**Pattern**: Multi-repo fullstack with managed infrastructure

```
User's Browser
     │
     ├──→ portfolio_nextjs (Vercel)
     │       ├── Static portfolio pages (SSR/SSG)
     │       ├── Game frontend UI (client-side)
     │       └── /api/contact (serverless function)
     │
     └──→ watermelon-game-api (PaaS)
             ├── Auth module (OAuth + email/password)
             ├── Game logic module
             ├── Leaderboard module
             └── Database access
                    │
                    ▼
              Neon Postgres (managed)
```

**Communication**: portfolio_nextjs game frontend → HTTPS → watermelon-game-api REST API

---

## 2. Repo Model

### Confirmed by owner: Separate repos

| Repo | Responsibility | Runtime |
|---|---|---|
| `portfolio_nextjs` | Portfolio website + game frontend UI | Vercel (Next.js) |
| `watermelon-game-api` | Game backend, auth, leaderboard | PaaS (Node.js — **pending: see PD-009**) |
| `platform-infra` | DB migrations, env templates, infra docs | Not deployed — tooling repo |

### Repo Dependency Direction

```
portfolio_nextjs ──calls──→ watermelon-game-api ──queries──→ Neon Postgres
                                                                ▲
platform-infra ──migrations──────────────────────────────────────┘
```

- `portfolio_nextjs` depends on `watermelon-game-api` API contract
- `watermelon-game-api` depends on database schema
- `platform-infra` manages database schema (migrations)
- No circular dependencies

---

## 3. Frontend Architecture (portfolio_nextjs)

### Current Architecture (verified from code)

```
app/
├── layout.tsx          → Root: font, metadata, ThemeProvider, LoadingScreen
├── page.tsx            → Composes: Navbar → Hero → About → Projects → Contact → Footer
├── globals.css         → Theme tokens (CSS variables for Tailwind v4)
└── api/
    ├── contact/        → POST: validate + insert message
    └── messages/       → GET: fetch all messages (needs auth)

components/
├── ui/                 → Stateless primitives (Button, Card, Input, etc.)
├── sections/           → Page sections (each self-contained folder)
├── icons/              → SVG components
└── providers/          → ThemeProvider

config/                 → Site metadata, navigation, personal info
data/                   → Projects, skills, social links (typed constants)
types/                  → TypeScript interfaces
lib/                    → Utilities, DB access, validation
```

### Target Architecture Additions for Stage 1

```
app/
├── (existing sections)
├── game/               → Game page/route (TBD: embedded or separate page)
└── api/
    ├── contact/        → (existing)
    └── messages/       → (needs auth protection or removal)

lib/
├── (existing)
└── api-client/         → HTTP client for watermelon-game-api calls (recommendation)
```

**Recommendation**: Create a thin API client (`lib/api-client/`) that wraps fetch calls to watermelon-game-api. This prevents game components from hardcoding API URLs and centralizes auth token handling.

**Pending decision**: Should the game be embedded in the portfolio page or have its own `/game` route?

---

## 4. Backend Architecture (watermelon-game-api)

### Recommended Structure (recommendation — not owner decision)

```
watermelon-game-api/
├── src/
│   ├── app.ts                  → Express/Fastify setup, middleware
│   ├── server.ts               → Entry point
│   ├── config/                 → Environment config, constants
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.routes.ts
│   │   │   ├── strategies/     → Google, GitHub, email/password
│   │   │   └── auth.types.ts
│   │   ├── game/
│   │   │   ├── game.controller.ts
│   │   │   ├── game.service.ts
│   │   │   ├── game.routes.ts
│   │   │   └── game.types.ts
│   │   └── leaderboard/
│   │       ├── leaderboard.controller.ts
│   │       ├── leaderboard.service.ts
│   │       ├── leaderboard.routes.ts
│   │       └── leaderboard.types.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts   → JWT/session verification
│   │   ├── error.middleware.ts  → Global error handler
│   │   └── rate-limit.middleware.ts
│   ├── shared/
│   │   ├── db.ts               → Database client
│   │   ├── types.ts            → Shared types
│   │   └── errors.ts           → Custom error classes
│   └── utils/
├── tests/
├── package.json
├── tsconfig.json
└── .env.example
```

**Pattern**: Modular monolith — modules are organized by domain (auth, game, leaderboard) but deployed as a single service. Each module has controller → service → data access layers.

**Tech stack pending** (PD-009): Recommended Node.js + TypeScript + Express or Fastify. Owner must confirm.

---

## 5. Clean Architecture Boundaries

### Layer Rules

```
┌─────────────────────────────────────┐
│          Controllers / Routes       │  ← HTTP concerns only
├─────────────────────────────────────┤
│          Services                   │  ← Business logic
├─────────────────────────────────────┤
│          Data Access / Queries      │  ← Database queries
├─────────────────────────────────────┤
│          Database                   │  ← Neon Postgres
└─────────────────────────────────────┘
```

| Rule | Description |
|---|---|
| Controllers don't query DB directly | Controllers call services, services call data access |
| Services don't know about HTTP | No `req`/`res` objects in service layer |
| Data access returns plain objects | No ORM entities leaking into services |
| Validation at controller boundary | Zod schemas validate input before passing to services |

### Cross-Cutting Concerns

| Concern | Location |
|---|---|
| Authentication | Middleware (before controller) |
| Authorization | Service layer (business rule) |
| Validation | Controller layer (Zod) |
| Error handling | Middleware (global error handler) |
| Logging | Middleware + service layer |

---

## 6. Auth Boundary

### Auth Flow (Stage 1)

```
┌──────────────────────────────────────────────────┐
│               portfolio_nextjs                    │
│                                                  │
│  Game UI → "Login" button → redirect to OAuth    │
│         → OR show email/password form            │
│         → Receive token → store in cookie/       │
│           localStorage → attach to API calls     │
└────────────────────┬─────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────┐
│           watermelon-game-api                    │
│                                                  │
│  Auth Module:                                    │
│  ├── POST /auth/google    → Google OAuth flow    │
│  ├── POST /auth/github    → GitHub OAuth flow    │
│  ├── POST /auth/register  → Email + password     │
│  ├── POST /auth/login     → Email + password     │
│  ├── POST /auth/logout    → Invalidate session   │
│  └── GET  /auth/me        → Current user info    │
│                                                  │
│  Auth Middleware:                                 │
│  └── Verifies token on protected endpoints       │
└──────────────────────────────────────────────────┘
```

### Token Strategy — Pending decision

| Option | Pros | Cons |
|---|---|---|
| JWT (stateless) | Simple, no server state | Can't revoke easily, token size |
| Session + cookie | Revocable, smaller payload | Needs session store (Redis) |
| JWT + refresh token | Balance of both | More complex implementation |

**Status**: **Pending owner decision** — Recommendation is JWT + refresh token for stage 1 if Redis is available (owner confirmed managed Redis), otherwise plain JWT with short expiry.

---

## 7. Data Boundary

### Database: Neon Postgres (shared)

All repos share one Neon Postgres instance. Schema is managed by `platform-infra`.

### Current Schema (from code)

```sql
-- Only table that exists today
messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
)
```

### Target Schema (Stage 1 — recommendation)

```sql
-- Existing
messages (...)

-- New: Auth
users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),           -- NULL for OAuth-only users
  display_name VARCHAR(100) NOT NULL,
  avatar_url TEXT,
  auth_provider VARCHAR(20) NOT NULL,   -- 'google', 'github', 'email'
  provider_id VARCHAR(255),             -- External provider user ID
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
)

-- New: Game (schema depends on game genre — PENDING PD-001)
game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),   -- NULL for guest sessions
  score INTEGER NOT NULL,
  duration_seconds INTEGER,
  completed_at TIMESTAMPTZ DEFAULT NOW()
)

-- New: Leaderboard (may be a view or materialized view)
-- Schema depends on PD-004 (leaderboard type) and PD-005 (scoring metric)
```

**Note**: Final game-related schema depends on game genre (PD-001) and scoring metric (PD-005). Above is a minimal starting point.

---

## 8. Security Baseline (Stage 1)

| Measure | Location | Status |
|---|---|---|
| Input validation (Zod) | API boundaries | ✅ Exists for contact, needed for all new endpoints |
| HTTPS | Vercel + PaaS | Provided by platform |
| CORS | watermelon-game-api | **To configure** — allow only portfolio_nextjs origin |
| Rate limiting | Both APIs | **To implement** |
| Password hashing | watermelon-game-api | **To implement** — bcrypt or argon2 |
| SQL injection prevention | All DB queries | ✅ Using parameterized queries (Neon tagged templates) |
| XSS prevention | portfolio_nextjs | ✅ React auto-escapes by default |
| Auth token security | watermelon-game-api | **To implement** — httpOnly cookies or secure storage |
| OAuth state parameter | watermelon-game-api | **To implement** — CSRF protection for OAuth flows |
| Environment variable protection | All repos | ✅ .env in .gitignore |
| `/api/messages` protection | portfolio_nextjs | **To fix** — currently unprotected |

---

## 9. Scalability Baseline (Stage 1)

Stage 1 is NOT designed for scale. It's designed for correctness and clean architecture.

| Aspect | Stage 1 Approach | Scale-up Path |
|---|---|---|
| Database | Single Neon Postgres | Neon supports autoscaling; add read replicas later |
| Backend | Single PaaS instance | Scale horizontally on PaaS |
| Frontend | Vercel Edge | Already globally distributed |
| Caching | No caching layer | Add Redis for session + leaderboard caching |
| CDN | Vercel CDN for static assets | Already handled |
| File storage | Local public/ folder | Move to S3/Cloudflare R2 if needed |

---

## 10. Technical Decisions Requiring Owner Input

| ID | Decision | Options | Recommendation | Impact |
|---|---|---|---|---|
| PD-009 | Backend tech stack | Node.js (Express/Fastify), Python (FastAPI), Go | **Node.js + TypeScript + Fastify** — same language as frontend, fastest to ship | Repo setup, hiring, maintenance |
| PD-011 | Token strategy | JWT, Session+Cookie, JWT+Refresh | **JWT + refresh token** if Redis available | Auth implementation, security |
| PD-012 | Game embedded or separate route? | Embed in portfolio page, `/game` route, separate subdomain | **`/game` route** — clean URL, easy to share | Frontend routing, SEO |
| PD-013 | Backend framework | Express, Fastify, Hono, NestJS | **Fastify** — fast, typed, not over-engineered | Backend DX, performance |
| PD-014 | API contract format | REST, GraphQL, tRPC | **REST** — simplest, sufficient for stage 1 | API design, client complexity |
