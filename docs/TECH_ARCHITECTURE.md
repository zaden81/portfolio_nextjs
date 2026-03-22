# Technical Architecture

> Last updated: 2026-03-21
> Status: Stage 1 architecture — auth (email/password) implemented, OAuth pending, game MVP complete

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

### Current Architecture (verified from code — updated 2026-03-21)

```
app/
├── layout.tsx          → Root: font, metadata, ThemeProvider, AuthProvider, LoadingScreen
├── page.tsx            → Composes: Navbar → Hero → About → Projects → Contact → Footer
├── globals.css         → Theme tokens (CSS variables for Tailwind v4)
├── login/page.tsx      → Login page (email + password)
├── register/page.tsx   → Register page (name + email + password)
├── game/
│   ├── page.tsx        → Game page (server component wrapper with metadata)
│   └── GameClient.tsx  → Full game UI: canvas, overlays, auth integration
└── api/
    └── contact/        → POST: validate + insert message

components/
├── ui/                 → Stateless primitives (Button, Card, Input, etc.)
├── sections/           → Page sections (each self-contained folder)
│   ├── Auth/           → LoginForm, RegisterForm
│   └── Navbar/         → NavbarClient (auth-aware, page-link-aware), MobileMenu
├── icons/              → SVG components
└── providers/          → ThemeProvider

config/                 → Site metadata, navigation (incl. Game link), personal info
data/                   → Projects, skills, social links (typed constants)
types/                  → TypeScript interfaces (including auth + game types)
lib/
├── utils.ts            → cn() utility
├── api/                → Response helpers + game API client
├── auth/               → AuthProvider, useAuth hook, authFetch, authApi client
├── game/               → Game engine, physics, levels, scoring, types, renderer
├── db/                 → Client, queries
└── validations/        → Env + contact schema (Zod)
```

### Target Architecture Additions for Stage 1

```
app/
├── (existing sections + auth pages + game) ✅
└── (leaderboard integration — Phase 1C)
```

**Auth client**: Implemented in `lib/auth/`.
**Game API client**: Implemented in `lib/api/game.ts` — uses `authFetch`.
**Game engine**: Implemented in `lib/game/` — Matter.js physics + Canvas 2D rendering.

**Pending**: Leaderboard UI (Phase 1C).

---

## 4. Backend Architecture (watermelon-game-api)

### Recommended Structure (recommendation — not owner decision)

```
watermelon-game-api/
├── src/
│   ├── app.ts                  → Fastify setup, middleware, CORS, rate limiting
│   ├── server.ts               → Entry point
│   ├── config/                 → Environment config, constants
│   ├── modules/
│   │   ├── auth/               → ✅ Implemented
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.schemas.ts
│   │   │   ├── auth.types.ts
│   │   │   ├── jwt.ts
│   │   │   └── index.ts
│   │   ├── game/               → ✅ Implemented
│   │   │   ├── game.service.ts
│   │   │   ├── game.routes.ts
│   │   │   ├── game.schemas.ts
│   │   │   ├── game.types.ts
│   │   │   └── index.ts
│   │   └── leaderboard/        → TODO (Phase 1C)
│   │       ├── leaderboard.service.ts
│   │       ├── leaderboard.routes.ts
│   │       └── leaderboard.types.ts
│   ├── middleware/
│   │   ├── auth.ts             → JWT verification (requireAuth)
│   │   └── error-handler.ts    → Global error handler
│   ├── shared/
│   │   ├── db.ts               → Database client
│   │   ├── types.ts            → Shared types
│   │   └── errors.ts           → Custom error classes (AppError, NotFoundError, etc.)
│   └── utils/
├── package.json
├── tsconfig.json
└── .env.example
```

**Pattern**: Modular monolith — modules are organized by domain (auth, game, leaderboard) but deployed as a single service. Routes call service functions directly (no controller layer — kept simple for stage 1).

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

### Auth Flow (Stage 1) — Implemented

```
┌──────────────────────────────────────────────────────┐
│               portfolio_nextjs                        │
│                                                      │
│  AuthProvider (React Context)                         │
│  ├── On mount: try refresh token from localStorage    │
│  ├── Login page → POST /auth/login → receive tokens   │
│  ├── Register page → POST /auth/register → tokens     │
│  ├── Access token stored in JS memory (not persisted)  │
│  ├── Refresh token stored in localStorage              │
│  └── authFetch() wrapper → auto-attaches Bearer token  │
│                                                      │
│  Navbar: shows user name + logout when authenticated   │
└────────────────────┬─────────────────────────────────┘
                     │ HTTPS + Authorization: Bearer <JWT>
                     ▼
┌──────────────────────────────────────────────────────┐
│           watermelon-game-api                        │
│                                                      │
│  Auth Module (implemented):                           │
│  ├── POST /auth/register  → Create user, return JWT   │
│  ├── POST /auth/login     → Verify password, JWT      │
│  ├── POST /auth/logout    → Revoke refresh token      │
│  ├── POST /auth/refresh   → Rotate refresh token      │
│  └── GET  /auth/me        → Current user (protected)  │
│                                                      │
│  Auth Module (TODO — OAuth):                          │
│  ├── POST /auth/google    → Google OAuth flow          │
│  └── POST /auth/github    → GitHub OAuth flow          │
│                                                      │
│  Auth Middleware:                                      │
│  └── requireAuth → verifies JWT, sets request.user     │
└──────────────────────────────────────────────────────┘
```

### Token Strategy — Confirmed (D-021)

**JWT access token (15 min) + rotating refresh token (7 days)**

| Component | Implementation |
|---|---|
| Access token | JWT signed with HS256, contains `sub`, `email`, `name` |
| Refresh token | Random 40 bytes hex, stored as SHA-256 hash in DB |
| Rotation | Each refresh deletes old token, creates new pair |
| Password hashing | bcryptjs, 12 salt rounds |
| Validation | Zod schemas on all request bodies |
| Rate limiting | Per-route (10/min auth, 30/min token ops, 100/min read) |

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

### Target Schema (Stage 1)

```sql
-- Existing
messages (...)

-- Implemented (2026-03-20)
users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
)
-- Index: idx_users_email ON users(email)

refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(64) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
)
-- Index: idx_refresh_tokens_hash ON refresh_tokens(token_hash)

-- Implemented (2026-03-21)
game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL DEFAULT 0,
  levels_completed INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'active',  -- active | completed | abandoned
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
)
-- Index: idx_game_sessions_user_id ON game_sessions(user_id)
-- Index: idx_game_sessions_status ON game_sessions(status)

-- TODO: Leaderboard (may be a view or materialized view)
-- Schema depends on PD-004 (leaderboard type)
```

**Note**: `users` table currently only supports email/password auth. When Google/GitHub OAuth is added, columns like `auth_provider`, `provider_id`, `avatar_url` may be added via new migration.

---

## 8. Security Baseline (Stage 1)

| Measure | Location | Status |
|---|---|---|
| Input validation (Zod) | API boundaries | ✅ portfolio contact + all auth endpoints |
| HTTPS | Vercel + PaaS | Provided by platform |
| CORS | watermelon-game-api | ✅ Configured — allows only portfolio_nextjs origin |
| Rate limiting | Both APIs | ✅ portfolio /api/contact (5/min) + all auth routes (10-100/min) |
| Password hashing | watermelon-game-api | ✅ bcryptjs, 12 salt rounds |
| SQL injection prevention | All DB queries | ✅ Using parameterized queries (Neon tagged templates) |
| XSS prevention | portfolio_nextjs | ✅ React auto-escapes by default |
| Auth token security | watermelon-game-api | ✅ JWT access (15m) + refresh rotation; refresh stored as SHA-256 hash |
| OAuth state parameter | watermelon-game-api | **To implement** — CSRF protection for OAuth flows |
| Environment variable protection | All repos | ✅ .env in .gitignore |
| `/api/messages` protection | portfolio_nextjs | ✅ Removed (D-019) |

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
