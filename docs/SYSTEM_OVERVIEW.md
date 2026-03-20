# System Overview

> Last updated: 2026-03-18
> Status: Living document — will be updated as decisions are finalized

---

## 1. System Goals

Build a **fullstack portfolio platform** that serves two purposes:

1. **Portfolio website** — A professional personal website to showcase the owner's profile, skills, experience, and projects
2. **Featured project: Watermelon Game** — A playable web-based mini game that demonstrates fullstack engineering capabilities, with its own backend, auth, and data persistence

**Key principle**: The portfolio is the center of the system. The game is a featured project within the portfolio, not a separate product.

---

## 2. Current State (Verified from Code)

> Source: Full codebase audit of `portfolio_nextjs` repo, 2026-03-18

### What exists today

| Area | Status | Details |
|---|---|---|
| Portfolio website | **Functional** | Single-page app: Navbar, Hero, About, Projects, Contact, Footer |
| Tech stack | **Confirmed** | Next.js 16.1.6, React 19.2.3, TypeScript, Tailwind CSS v4 |
| Theme system | **Functional** | Dark/Light mode via next-themes, CSS variable-based |
| Contact form | **Functional** | Client form → Zod validation → Neon Postgres |
| Database | **Functional** | Neon Serverless Postgres, 1 table (`messages`) |
| API routes | **2 routes** | `POST /api/contact`, `GET /api/messages` |
| SEO | **Configured** | Open Graph + Twitter card metadata |
| Component arch | **Clean** | `ui/` primitives, `sections/`, `icons/`, `providers/` |
| Data architecture | **Clean** | `types/` → `config/` → `data/` → `lib/` separation |
| Auth | **None** | No auth system exists |
| Game | **None** | No game code exists |
| Tests | **None** | No test files, no test scripts |
| Deploy config | **None** | No vercel.json, no Dockerfile |
| Admin panel | **None** | No admin routes or dashboard |

### What does NOT exist yet

- Auth system (login, register, session, OAuth)
- Game frontend (gameplay UI, canvas/WebGL)
- Game backend (watermelon-game-api repo)
- Infra repo (platform-infra)
- Leaderboard system
- User profiles / accounts
- Game history tracking
- Admin dashboard
- Tests of any kind
- CI/CD pipeline
- Deploy configuration
- Rate limiting / security hardening

---

## 3. Target Architecture (Stage 1)

### Repo Model: Separate Repos

| Repo | Purpose | Deploy Target |
|---|---|---|
| `portfolio_nextjs` | Main portfolio website + game frontend UI | Vercel |
| `watermelon-game-api` | Game backend, auth, leaderboard, game data | PaaS (Render / Railway / Fly.io — **pending owner decision**) |
| `platform-infra` | DB migrations, infra config, deploy docs | Not a deployed service in stage 1 |

**Decision source**: Confirmed by owner
**Rationale**: Owner wants to demonstrate fullstack architecture skills; clean separation between frontend and backend; game backend can apply clean architecture independently

### System Diagram (Stage 1)

```
┌─────────────────────────────────────────────────────┐
│                    Vercel                            │
│  ┌───────────────────────────────────────────────┐  │
│  │            portfolio_nextjs                    │  │
│  │                                               │  │
│  │  ┌──────────┐  ┌──────────┐  ┌────────────┐  │  │
│  │  │ Portfolio │  │   Game   │  │  Contact   │  │  │
│  │  │  Sections │  │ Frontend │  │   Form     │  │  │
│  │  └──────────┘  └────┬─────┘  └─────┬──────┘  │  │
│  │                     │              │          │  │
│  │              ┌──────┴──────────────┘          │  │
│  │              │  /api/contact (existing)        │  │
│  └──────────────┼────────────────────────────────┘  │
│                 │                                    │
└─────────────────┼────────────────────────────────────┘
                  │ HTTPS
                  ▼
┌─────────────────────────────────────────────────────┐
│              PaaS (Render/Railway/Fly.io)            │
│  ┌───────────────────────────────────────────────┐  │
│  │          watermelon-game-api                   │  │
│  │                                               │  │
│  │  ┌────────┐  ┌────────────┐  ┌────────────┐  │  │
│  │  │  Auth  │  │ Game Logic │  │ Leaderboard│  │  │
│  │  │ Module │  │   Module   │  │   Module   │  │  │
│  │  └───┬────┘  └─────┬──────┘  └─────┬──────┘  │  │
│  │      └─────────────┼────────────────┘         │  │
│  └────────────────────┼─────────────────────────┘  │
│                       │                             │
└───────────────────────┼─────────────────────────────┘
                        │
                        ▼
              ┌──────────────────┐
              │   Neon Postgres  │
              │   (Managed DB)   │
              └──────────────────┘
```

---

## 4. User Types

| User Type | Description | Capabilities |
|---|---|---|
| **Visitor** | Anyone visiting the portfolio website | View portfolio, read about owner, view projects, submit contact form |
| **Guest Player** | Visitor who plays the game without logging in | Play the game, see own score in current session |
| **Authenticated Player** | User who has registered/logged in | Play the game, save official history, appear on official leaderboard |
| **Admin** | Owner/developer | Manage messages, view data (scope TBD — **pending owner decision**) |

---

## 5. Guest Mode vs Authenticated Mode

| Feature | Guest | Authenticated |
|---|---|---|
| Play the game | Yes | Yes |
| See own score (current session) | Yes | Yes |
| Save official game history | **No** | Yes |
| Appear on official leaderboard | **No** | Yes |
| View leaderboard | **Pending owner decision** | Yes |

**Decision source**: Confirmed by owner
**Open question**: Can guests view the leaderboard (read-only) even without logging in? → **Pending owner decision**

---

## 6. Auth Strategy (Stage 1)

| Method | Status | Priority |
|---|---|---|
| Google OAuth | **Confirmed** | Implement first |
| GitHub OAuth | **Confirmed** | Implement first |
| Email + Password | **Confirmed** | Phase 1, after OAuth |
| Facebook OAuth | **Not in stage 1** | — |

**Location**: Auth lives inside `watermelon-game-api`, not a separate auth service
**Decision source**: Confirmed by owner

**Technical note** (recommendation, not owner decision):
Email/password auth adds significant complexity compared to OAuth-only:
- Password hashing (bcrypt/argon2)
- Secure password storage
- Password reset flow (email sending, token management)
- Email verification
- Account recovery
- Brute force protection

This is documented here as a complexity note per owner's instruction. Scope remains as owner confirmed.

---

## 7. Leaderboard Rules

> **Status: Mostly pending owner decision**

| Question | Answer |
|---|---|
| Who can submit scores? | Authenticated users only — **Confirmed** |
| Who can view the leaderboard? | **Pending owner decision** |
| Scoring metric | **Pending owner decision** (depends on game genre) |
| Leaderboard type (all-time, daily, weekly) | **Pending owner decision** |
| Anti-cheat measures | **Pending owner decision** |
| Max entries shown | **Pending owner decision** |

---

## 8. Deploy Model (Stage 1)

| Component | Target | Status |
|---|---|---|
| portfolio_nextjs | Vercel | **Confirmed** |
| watermelon-game-api | PaaS (Render / Railway / Fly.io) | **Confirmed PaaS, specific provider pending** |
| Neon Postgres | Managed (neon.tech) | **Confirmed** (already in use) |
| Redis (if needed) | Managed service | **Confirmed** — no self-hosting in stage 1 |
| platform-infra | Not a deployed service | **Confirmed** — config/migrations/docs repo only |

---

## 9. Pending Owner Decisions

These items MUST be decided by the owner before implementation can proceed in relevant areas:

| ID | Topic | Impact |
|---|---|---|
| PD-001 | Game genre / gameplay type | Affects frontend tech (Canvas/WebGL), game logic module, scoring |
| PD-002 | Real-time vs turn-based | Affects whether WebSocket is needed |
| PD-003 | Can guests view leaderboard (read-only)? | Affects API permissions, frontend routing |
| PD-004 | Leaderboard type (all-time / daily / weekly) | Affects DB schema, query design |
| PD-005 | Scoring metric | Affects game logic, leaderboard schema |
| PD-006 | Anti-cheat strategy | Affects backend validation, score submission flow |
| PD-007 | Backend PaaS provider | Affects deploy pipeline, CI/CD setup |
| PD-008 | Admin panel scope | Affects whether to build admin routes, what data admin can see |
| PD-009 | Game backend tech stack (Node/Python/Go?) | Affects watermelon-game-api repo setup |
| PD-010 | Password reset flow for email auth | Affects email provider choice, complexity |
