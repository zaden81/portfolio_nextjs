# Current State Audit

> Last updated: 2026-03-24
> Source: Full source code audit of `portfolio_nextjs` repo
> Method: Every file read and analyzed

---

## 1. Project Identity

| Field | Value |
|---|---|
| Repo | portfolio_nextjs |
| Framework | Next.js 16.1.6 (App Router) |
| UI | React 19.2.3 |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 |
| Database | Neon Serverless Postgres |
| Physics Engine | matter-js 0.20.0 |
| Font | DM Sans (Google Fonts via next/font) |
| Package manager | npm |
| Total source files (excl. node_modules) | ~70 files |

---

## 2. Directory Structure Audit

```
portfolio_nextjs/
├── app/                    ✅ Clean App Router structure
│   ├── layout.tsx          ✅ Root layout with font, metadata, theme, AuthProvider
│   ├── page.tsx            ✅ Single page composing all sections
│   ├── globals.css         ✅ Theme tokens via CSS variables
│   ├── login/page.tsx      ✅ Login page (email + password, Suspense-wrapped)
│   ├── register/page.tsx   ✅ Register page (name + email + password)
│   ├── auth/callback/      ✅ OAuth callback handler (Suspense-wrapped)
│   ├── game/               ✅ Game page + GameClient + error boundary
│   │   ├── page.tsx        ✅ Server wrapper with metadata
│   │   ├── GameClient.tsx  ✅ Full game UI with canvas + overlays
│   │   └── error.tsx       ✅ Game-specific error boundary
│   ├── error.tsx            ✅ Global error boundary
│   └── api/
│       └── contact/route.ts    ✅ POST endpoint with validation + rate limiting
│
├── components/
│   ├── icons/              ✅ 7 SVG icon components
│   ├── providers/          ✅ ThemeProvider (next-themes wrapper)
│   ├── sections/           ✅ 7 sections, each with barrel export
│   │   ├── Auth/           ✅ LoginForm, RegisterForm
│   │   ├── Navbar/         ✅ Server + Client split, auth-aware, page-link-aware
│   │   ├── Hero/           ✅ Hero + HeroScrollButton + WaveDivider
│   │   ├── About/          ✅ About + MyStory + InfoCard + SkillsGrid
│   │   ├── Projects/       ✅ Projects + ProjectCard
│   │   ├── Contact/        ✅ Contact + ContactForm + ContactInfo + SocialLinks
│   │   └── Footer/         ✅ Footer
│   └── ui/                 ✅ 10 reusable primitives
│
├── config/                 ✅ Static site config, well-separated
├── data/                   ✅ Typed content data constants
├── lib/
│   ├── utils.ts            ✅ cn() utility
│   ├── api/                ✅ Response helpers + game API client
│   ├── auth/               ✅ AuthProvider, useAuth, authFetch, authApi
│   ├── game/               ✅ Engine, physics, levels, scoring, types
│   ├── db/                 ✅ Client, queries
│   └── validations/        ✅ Env + contact schema (Zod)
│
├── types/                  ✅ 9 type files with barrel export (incl. auth + game)
└── public/                 ✅ Images organized in subfolders
```

---

## 3. Module Audit

### 3.1 Presentation Layer (components/)

| Component | Type | Client? | Notes |
|---|---|---|---|
| Navbar → NavbarClient | Section | Yes | Scroll detection, mobile menu toggle, page link routing |
| MobileMenu | Section | No (props-driven) | Rendered by NavbarClient, handles page vs anchor links |
| Hero | Section | No | Server component |
| HeroScrollButton | Section | Yes | Smooth scroll click handler |
| WaveDivider | Section | No | SVG wave divider |
| About | Section | No | Composes MyStory, InfoCard, SkillsGrid |
| MyStory | Section | No | Reads from config |
| InfoCard | Section | No | Reads from config |
| SkillsGrid | Section | No | Reads from data |
| Projects | Section | No | Reads from data |
| ProjectCard | Section | No | Image + hover overlay + external link |
| Contact | Section | No | Composes ContactForm, ContactInfo |
| ContactForm | Section | Yes | Form state, fetch POST /api/contact |
| ContactInfo | Section | No | Email + phone + social links |
| SocialLinks | Section | No | Reads from data |
| Footer | Section | No | Copyright with dynamic year |
| LoginForm | Auth | Yes | Email + password form, link to register |
| RegisterForm | Auth | Yes | Name + email + password form, link to login |
| GameClient | Game | Yes | Full game: canvas, physics engine, overlays, auth integration |
| LoadingScreen | UI | Yes | Min 2s loading + fade-out |
| ThemeToggle | UI | Yes | next-themes toggle |
| Button | UI | No | Variant/size system |
| Card | UI | No | Wrapper with bg-tertiary |
| Input | UI | No | Styled input |
| Textarea | UI | No | Styled textarea |
| Container | UI | No | Max-width wrapper |
| SectionHeader | UI | No | Image + title pattern |
| StatusAlert | UI | No | Success/error alert |
| SocialLinkButton | UI | No | Icon link button |

**Assessment**: Clean component architecture. Proper server/client split. Barrel exports throughout. Auth and game modules well-integrated.

### 3.2 Data Layer

| Module | Location | Responsibility |
|---|---|---|
| Site config | `config/site.ts` | Site name, description, OG/Twitter metadata |
| Navigation config | `config/navigation.ts` | Nav links (Home, About, Projects, Game), phone number |
| Personal config | `config/personal.ts` | Name, birthday, phone, email, bio |
| Projects data | `data/projects.ts` | Project list (2 projects) |
| Skills data | `data/skills.ts` | Skill categories (4 categories) |
| Social links data | `data/social-links.ts` | Social media links (4 links) |

**Assessment**: Clean separation of configuration vs content data. All typed. No CMS — all hardcoded constants.

### 3.3 Database Layer

| Component | File | Responsibility |
|---|---|---|
| Client | `lib/db/client.ts` | Lazy singleton Neon client |
| Queries | `lib/db/queries.ts` | `insertMessage()` |

**Schema** (managed by dbmate in platform-infra):
- `messages` — Contact form submissions
- `users` — User accounts (email/password auth)
- `refresh_tokens` — JWT refresh token hashes
- `game_sessions` — Game play sessions with scores

**Assessment**: Clean separation. Migrations managed externally via dbmate in platform-infra repo.

### 3.4 Auth Layer

| Component | File | Responsibility |
|---|---|---|
| AuthProvider | `lib/auth/provider.tsx` | React Context — manage auth state, auto-refresh on mount |
| authFetch | `lib/auth/api.ts` | Fetch wrapper with Bearer token attachment |
| authApi | `lib/auth/api.ts` | API client for auth endpoints (login, register, refresh, logout, me) |
| useAuth | `lib/auth/index.ts` | Hook to access auth state |

**Assessment**: Well-structured auth client. Token refresh handled transparently. Clean separation of concerns.

### 3.5 Game Layer

| Component | File | Responsibility |
|---|---|---|
| Engine | `lib/game/engine.ts` | Matter.js world, game loop, rendering, input |
| Physics | `lib/game/physics.ts` | Body creation (ground, walls, blocks, projectile, slingshot) |
| Levels | `lib/game/levels.ts` | 3 level definitions with block layouts |
| Scoring | `lib/game/scoring.ts` | Score calculation with bonuses |
| Types | `lib/game/types.ts` | Block, Level, GamePhase, GameState |
| API Client | `lib/api/game.ts` | Game session CRUD via authFetch |

### 3.6 API Layer

| Route | Method | Auth | Validation | Notes |
|---|---|---|---|---|
| `/api/contact` | POST | None | Zod | Inserts contact message to DB, rate limited 5/min |

**Assessment**: Single API route in portfolio_nextjs. Game and auth endpoints are in watermelon-game-api (separate repo).

### 3.7 Validation Layer

| Schema | File | Purpose |
|---|---|---|
| `envSchema` | `lib/validations/env.ts` | Validates `DATABASE_URL` |
| `contactSchema` | `lib/validations/contact.ts` | Validates contact form input |

**Assessment**: Good pattern. Zod used consistently. Easy to extend.

---

## 4. Strengths

| # | Strength | Evidence |
|---|---|---|
| 1 | **Clean modular architecture** | Clear separation: types → config → data → lib → components → app |
| 2 | **Proper TypeScript usage** | Strict mode, typed interfaces for all data structures, barrel exports |
| 3 | **Server/Client component awareness** | Only components that need interactivity are marked `"use client"` |
| 4 | **Theme system well-implemented** | CSS variables + Tailwind v4 @theme + next-themes, clean dark/light |
| 5 | **Validation at API boundary** | Zod schema for contact form, env validation |
| 6 | **UI primitives are reusable** | Button with variants/sizes, Card, Input, etc. — ready for extension |
| 7 | **Data-driven content** | Projects, skills, social links all from typed constants — easy to update |
| 8 | **Consistent code style** | Uniform patterns across all files |

---

## 5. Weaknesses & Risks

| # | Issue | Severity | Category | Status |
|---|---|---|---|---|
| 1 | ~~`/api/messages` has no auth~~ | ~~High~~ | ~~Security~~ | ✅ Removed (D-019) |
| 2 | No tests of any kind | **Medium** | Quality | Open |
| 3 | ~~`ensureSchema()` auto-migration won't scale~~ | ~~Medium~~ | ~~Database~~ | ✅ Migrated to dbmate |
| 4 | ~~`images.unoptimized: true` in next.config~~ | ~~Low~~ | ~~Performance~~ | ✅ Fixed — enabled Next.js image optimization |
| 5 | ~~No rate limiting on `/api/contact`~~ | ~~Medium~~ | ~~Security~~ | ✅ Added (5 req/min by IP) |
| 6 | No CSRF protection on contact form | **Low** | Security | Open |
| 7 | ~~No deploy configuration~~ | ~~Medium~~ | ~~DevOps~~ | Partial — Vercel pending |
| 8 | No CI/CD pipeline | **Medium** | DevOps | Open (deferred to Stage 2) |
| 9 | No error monitoring / logging infrastructure | **Low** | Observability | Open |
| 10 | ~~`.gitignore` has Prisma entry~~ | ~~Trivial~~ | ~~Cleanup~~ | ✅ Removed |
| 11 | ~~Duplicate PHONE constants~~ | ~~Trivial~~ | ~~Consistency~~ | ✅ Consolidated |
| 12 | ~~Unused `LOGO_TEXT` export~~ | ~~Trivial~~ | ~~Cleanup~~ | ✅ Removed |
| 13 | Game score validation is client-side only | **Medium** | Security | Open — deferred to Phase 1C anti-cheat |
| 14 | ~~Google + GitHub OAuth not yet implemented~~ | ~~Medium~~ | ~~Auth~~ | ✅ Code done — pending owner OAuth app credentials |

---

## 6. Boundary Analysis

### Clear Boundaries ✅

| Boundary | Quality |
|---|---|
| Types ↔ Config | Clean — types imported, config uses types |
| Config ↔ Components | Clean — components import from config via barrel |
| Data ↔ Components | Clean — components import from data via barrel |
| UI primitives ↔ Sections | Clean — sections compose UI primitives |
| Validation ↔ API routes | Clean — Zod schema used at API boundary |
| DB client ↔ Queries | Clean — queries use client via getClient() |

### Blurred Boundaries ⚠️

| Boundary | Issue |
|---|---|
| Config vs Data | `personal.ts` exports `EMAIL` and `PHONE` separately AND also inside `PERSONAL_INFO_ITEMS` — minor duplication |

---

## 7. Potential Technical Debt

| # | Item | When it becomes debt | Recommended action |
|---|---|---|---|
| 1 | ~~Auto-migration via `ensureSchema()`~~ | ~~When adding more tables~~ | ✅ Done — migrated to dbmate |
| 2 | ~~No API client abstraction~~ | ~~When game needs API calls~~ | ✅ Done — `lib/api/game.ts` + `lib/auth/api.ts` |
| 3 | ~~Unprotected `/api/messages`~~ | ~~Before production~~ | ✅ Done — removed |
| 4 | ~~No rate limiting~~ | ~~Before production~~ | ✅ Done — IP-based rate limiting |
| 5 | ~~No error boundaries~~ | ~~When users encounter runtime errors~~ | ✅ Done — error.tsx in root, /game, /login, /register |
| 6 | ~~Image optimization disabled~~ | ~~When page performance matters~~ | ✅ Done — enabled Next.js optimization |
| 7 | No test coverage | When codebase grows further | Add unit + integration tests |
| 8 | Client-side score validation only | When leaderboard goes live | Server-side validation (Phase 1C anti-cheat) |
