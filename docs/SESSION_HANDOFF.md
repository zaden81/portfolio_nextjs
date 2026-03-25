# Session Handoff — 2026-03-25

> Tạo lúc kết thúc session. Dùng để resume context khi bắt đầu session mới.

---

## Trạng thái hiện tại

**Phase 0, Phase 1A (Auth — full code), Phase 1B (Game MVP), Phase 1C (Leaderboard & Polish) hoàn thành. Sẵn sàng cho Phase 1D (Deploy).**

### Session 1 (2026-03-18) — Foundation & Planning

| Step | Mô tả | Repo |
|---|---|---|
| 0.1 | Xóa `/api/messages` (security hole) | portfolio_nextjs |
| 0.2 | Thêm rate limiting IP-based cho `/api/contact` (5 req/min) | portfolio_nextjs |
| 0.3 | Cleanup: xóa Prisma gitignore, gộp PHONE constant, xóa LOGO_TEXT | portfolio_nextjs |
| 0.4 | Tạo `.env.example` | portfolio_nextjs |
| 0.5 | Scaffold toàn bộ `watermelon-game-api` (Fastify + TS, 20 files) | watermelon-game-api |
| 0.6 | Scaffold `platform-infra` (dbmate config, initial migration) | platform-infra |
| 0.7 | Tạo 12 doc files (system overview, architecture, roadmap, etc.) | portfolio_nextjs/docs |
| 0.8 | Remove `ensureSchema()` auto-migration | portfolio_nextjs |
| 0.9 | Tạo `messages` migration | platform-infra |

### Session 2 (2026-03-20) — Auth Implementation

| Step | Mô tả | Repo |
|---|---|---|
| 1A.1 | Tạo `users` + `refresh_tokens` migrations | platform-infra |
| 1A.2 | Chạy `dbmate up` — tạo tables trên Neon | platform-infra |
| 1A.3 | Thêm `bcryptjs`, `jsonwebtoken` dependencies | watermelon-game-api |
| 1A.4 | Implement auth module: types, schemas, JWT, service, routes | watermelon-game-api |
| 1A.5 | Implement `requireAuth` middleware + Fastify type augmentation | watermelon-game-api |
| 1A.6 | Thêm Zod error handling vào global error handler | watermelon-game-api |
| 1A.7 | Thêm `--env-file=.env` vào dev/start scripts | watermelon-game-api |
| 1A.8 | Implement frontend auth: AuthProvider, useAuth hook, authFetch | portfolio_nextjs |
| 1A.9 | Tạo `/login` + `/register` pages (reuse existing UI components) | portfolio_nextjs |
| 1A.10 | Update Navbar + MobileMenu: show user name/logout khi authenticated | portfolio_nextjs |
| 1A.11 | Test toàn bộ 8 auth endpoints bằng curl — tất cả pass | watermelon-game-api |

### Session 3 (2026-03-21) — Game MVP (Phase 1B)

| Step | Mô tả | Repo |
|---|---|---|
| 1B.1 | Tạo `game_sessions` migration | platform-infra |
| 1B.2 | Chạy `dbmate up` — tạo game_sessions table trên Neon | platform-infra |
| 1B.3 | Implement game module: types, schemas, service, routes (6 endpoints) | watermelon-game-api |
| 1B.4 | Install `matter-js` + `@types/matter-js` | portfolio_nextjs |
| 1B.5 | Tạo game engine (`lib/game/engine.ts`) — Matter.js physics, slingshot, game loop, canvas rendering | portfolio_nextjs |
| 1B.6 | Tạo physics helpers (`lib/game/physics.ts`) — ground, walls, blocks, projectile, slingshot | portfolio_nextjs |
| 1B.7 | Tạo 3 levels (`lib/game/levels.ts`) — Simple Tower, Double Stack, Pyramid | portfolio_nextjs |
| 1B.8 | Tạo scoring system (`lib/game/scoring.ts`) — block score × level, bonuses | portfolio_nextjs |
| 1B.9 | Tạo game types + renderer (`lib/game/types.ts`, `renderer.ts`) | portfolio_nextjs |
| 1B.10 | Tạo game API client (`lib/api/game.ts`) — dùng authFetch | portfolio_nextjs |
| 1B.11 | Tạo `/game` page + GameClient component — full game UI với overlays | portfolio_nextjs |
| 1B.12 | Update navigation — thêm "Game" link, xử lý page links vs anchor links | portfolio_nextjs |
| 1B.13 | Export game types từ `types/index.ts` | portfolio_nextjs |

### Session 4 (2026-03-23) — OAuth Implementation (Phase 1A complete)

| Step | Mô tả | Repo |
|---|---|---|
| 1A.12 | Tạo `add_oauth_to_users` migration (oauth_provider, oauth_id) | platform-infra |
| 1A.13 | Chạy `dbmate up` — alter users table | platform-infra |
| 1A.14 | Implement OAuth module (`auth.oauth.ts`) — Google + GitHub exchange | watermelon-game-api |
| 1A.15 | Update `auth.types.ts` — thêm oauth_provider, oauth_id | watermelon-game-api |
| 1A.16 | Update `auth.service.ts` — thêm `findOrCreateOAuthUser` | watermelon-game-api |
| 1A.17 | Implement 4 OAuth routes: `/auth/google`, `/auth/google/callback`, `/auth/github`, `/auth/github/callback` | watermelon-game-api |
| 1A.18 | Update `env.ts` — thêm GOOGLE/GITHUB credentials (optional) | watermelon-game-api |
| 1A.19 | Tạo `/auth/callback` page — handle OAuth tokens | portfolio_nextjs |
| 1A.20 | Update `AuthContext` — thêm `setTokens` method | portfolio_nextjs |
| 1A.21 | Thêm OAuth buttons vào LoginForm + RegisterForm | portfolio_nextjs |

### Session 5 (2026-03-24) — Phase 1C Polish

| Step | Mô tả | Repo |
|---|---|---|
| 1C.1 | Thêm error boundaries (error.tsx) cho root, /game, /login, /register | portfolio_nextjs |
| 1C.2 | Bật Next.js image optimization (xóa `unoptimized: true`) | portfolio_nextjs |
| 1C.3 | Xóa dead code: `lib/game/renderer.ts`, `isWithinSlingshotRange()` | portfolio_nextjs |
| 1C.4 | Thêm Block Smasher game vào Projects section (featured, vị trí đầu) | portfolio_nextjs |
| 1C.5 | Update `ProjectCard` hỗ trợ internal links (Next.js `Link`) | portfolio_nextjs |
| 1C.6 | Thêm `isInternal` field vào `Project` type | portfolio_nextjs |
| 1C.7 | Fix Suspense boundary cho `/auth/callback` (build error) | portfolio_nextjs |
| 1C.8 | Fix Suspense boundary cho `/login` page (build error) | portfolio_nextjs |
| 1C.9 | Update tất cả docs (PHASES_ROADMAP, MASTER_PLAN, CURRENT_STATE_AUDIT, EXECUTION_CHECKLIST, FRONTEND, SESSION_HANDOFF) | portfolio_nextjs |

### Session 6 (2026-03-25) — Phase 1C Leaderboard (Phase 1C Complete)

| Step | Mô tả | Repo |
|---|---|---|
| 1C.10 | Tạo `leaderboard.types.ts` — LeaderboardEntry interface | watermelon-game-api |
| 1C.11 | Tạo `leaderboard.service.ts` — getLeaderboard() with DISTINCT ON query | watermelon-game-api |
| 1C.12 | Update `leaderboard.routes.ts` — GET /leaderboard (public, 60/min rate limit) | watermelon-game-api |
| 1C.13 | Update `leaderboard/index.ts` — thêm type export | watermelon-game-api |
| 1C.14 | Tạo `lib/api/leaderboard.ts` — frontend API client | portfolio_nextjs |
| 1C.15 | Tạo `app/game/Leaderboard.tsx` — leaderboard UI component (table, loading/error/empty states) | portfolio_nextjs |
| 1C.16 | Update `GameClient.tsx` — thêm leaderboard + refresh trigger | portfolio_nextjs |
| 1C.17 | Update docs: DECISION_LOG, EXECUTION_CHECKLIST, OPEN_QUESTIONS, PHASES_ROADMAP, SESSION_HANDOFF | portfolio_nextjs |

### Đã push lên remote

Tất cả 3 repos đã push. Commits (session 4 chưa push):

| Repo | Commit | Message |
|---|---|---|
| platform-infra | `56fc6c3` | feat: add users and refresh_tokens migrations |
| platform-infra | `45d421e` | feat: add game_sessions table migration |
| platform-infra | (pending) | feat: add OAuth columns to users table |
| watermelon-game-api | `4a14762` | feat: implement email/password auth with JWT |
| watermelon-game-api | `f21d106` | fix: load .env via --env-file flag in dev and start scripts |
| watermelon-game-api | `be71218` | feat: implement game module (sessions, scores, levels) |
| watermelon-game-api | (pending) | feat: implement Google and GitHub OAuth |
| portfolio_nextjs | `da73c9c` | feat: add auth UI (login, register, auth context) |
| portfolio_nextjs | `8cb4a44` | feat: add Angry Birds style physics game (Phase 1B) |
| portfolio_nextjs | (pending) | feat: add OAuth login buttons and callback page |

---

## Game System — Tóm tắt kỹ thuật

### Game: Block Smasher (Angry Birds style)

**Gameplay**: Kéo slingshot để bắn projectile, phá hủy tất cả blocks đỏ. 3 levels với độ khó tăng dần.

**Tech stack**: HTML5 Canvas + matter.js (physics engine)

### Backend (watermelon-game-api)

**Game endpoints:**

| Method | Path | Auth | Mô tả |
|---|---|---|---|
| POST | `/game/sessions` | Bearer | Tạo game session mới |
| PATCH | `/game/sessions/:id/score` | Bearer | Update score (ownership check) |
| POST | `/game/sessions/:id/complete` | Bearer | Hoàn thành session |
| GET | `/game/sessions/me` | Bearer | Lịch sử sessions của user |
| GET | `/game/levels` | No | Trả static level data (3 levels) |
| GET | `/game/health` | No | Health check |

**Database schema:**
```sql
game_sessions (
  id UUID PK,
  user_id UUID FK → users(id) ON DELETE CASCADE,
  score INTEGER DEFAULT 0,
  levels_completed INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active',  -- active | completed | abandoned
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
```

### Frontend (portfolio_nextjs)

**Game engine architecture:**
```
lib/game/
├── engine.ts       → Main engine: Matter.js physics, game loop, canvas 2D rendering, input handling
├── physics.ts      → Body creation (ground, walls, blocks, projectile, slingshot constraint)
├── levels.ts       → 3 levels: Simple Tower (3 blocks), Double Stack (5), Pyramid (8)
├── scoring.ts      → Score = blocks × 100 × level + bonus (projectiles left × 200 + 500 clear)
├── types.ts        → Block, Level, GamePhase, GameState interfaces
└── renderer.ts     → Re-export canvas constants
```

**Game flow:**
1. Start → tạo session (nếu authenticated)
2. Load level → setup physics bodies + slingshot
3. Drag/release slingshot → launch projectile → physics simulation
4. Blocks destroyed → score tính → level complete hoặc fail
5. Next level / retry / end game
6. Kết thúc → update score trên server → complete session

**Guest mode**: Guests chơi được nhưng không save score. Hiện login prompt.

---

## Auth System — Tóm tắt kỹ thuật

### Backend (watermelon-game-api)

**Endpoints hoạt động:**

| Method | Path | Auth | Mô tả |
|---|---|---|---|
| POST | `/auth/register` | No | Tạo user mới, trả user + tokens |
| POST | `/auth/login` | No | Login bằng email/password |
| POST | `/auth/logout` | No | Xóa refresh token |
| POST | `/auth/refresh` | No | Rotate refresh token, trả token pair mới |
| GET | `/auth/me` | Bearer | Trả thông tin user hiện tại |
| GET | `/auth/health` | No | Health check cho auth module |

**Token strategy:** JWT access token (15m) + rotating refresh token (7d)

### Frontend (portfolio_nextjs)

**Auth flow:**
- `AuthProvider` wraps app — tự động refresh token on mount
- Access token lưu in-memory, refresh token lưu localStorage
- `authFetch()` wrapper tự attach `Authorization: Bearer` header

---

## Decisions đã chốt trong session 3

| ID | Decision |
|---|---|
| D-027 | Game genre: Angry Birds style physics game (slingshot + block destruction) |
| D-028 | Real-time physics simulation (client-side, matter.js) — không cần WebSocket |
| D-029 | Scoring: blocks × 100 × level + bonuses (projectiles left × 200 + level clear 500) |
| D-030 | Game route: `/game` (confirmed R-005) |
| D-031 | Game technology: HTML5 Canvas + matter.js |
| D-032 | 3 levels: Simple Tower, Double Stack, Pyramid |

## Pending decisions quan trọng

| ID | Quyết định | Ảnh hưởng |
|---|---|---|
| PD-007 | PaaS provider (Render/Railway/Fly.io) | Phase 1D |
| PD-026 | Custom domain? | Phase 1D |

---

## Chưa xong — cần thao tác trên server / owner

| Step | Việc cần làm | Ghi chú |
|---|---|---|
| 1 | Chạy `dbmate up` trên production | Tạo users + refresh_tokens + game_sessions + oauth columns |
| 2 | Set `JWT_SECRET` env var trên server | Cho watermelon-game-api |
| 3 | Set `NEXT_PUBLIC_API_URL` trên Vercel | Trỏ tới API URL production |
| 4 | Tạo Google OAuth app | [Google Cloud Console](https://console.cloud.google.com/apis/credentials) |
| 5 | Tạo GitHub OAuth app | [GitHub Developer Settings](https://github.com/settings/developers) |
| 6 | Set OAuth env vars | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` |
| 7 | Test auth flow end-to-end trên production | Register → Login → /auth/me |
| 8 | Test OAuth flow end-to-end | Google/GitHub login → callback → tokens saved |
| 9 | Test game flow end-to-end trên production | Login → Play → Score saved |

---

## Khi resume session mới

1. Đọc file này để lấy context
2. Đọc `docs/EXECUTION_CHECKLIST.md` để biết chi tiết checklist
3. Đọc `docs/DECISION_LOG.md` để biết decisions đã chốt vs pending
4. **Phase 1C đã hoàn thành** — sẵn sàng cho Phase 1D (Deploy)
5. **Nếu deploy**: thực hiện các bước server ở trên, cần chốt PD-007 (PaaS) và PD-026 (domain)
