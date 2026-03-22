# Session Handoff — 2026-03-21

> Tạo lúc kết thúc session. Dùng để resume context khi bắt đầu session mới.

---

## Trạng thái hiện tại

**Phase 0 hoàn thành. Phase 1A (Auth — Email/Password) hoàn thành. Phase 1B (Game MVP) hoàn thành.**

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

### Đã push lên remote

Tất cả 3 repos đã push. Commits:

| Repo | Commit | Message |
|---|---|---|
| platform-infra | `56fc6c3` | feat: add users and refresh_tokens migrations |
| platform-infra | `45d421e` | feat: add game_sessions table migration |
| watermelon-game-api | `4a14762` | feat: implement email/password auth with JWT |
| watermelon-game-api | `f21d106` | fix: load .env via --env-file flag in dev and start scripts |
| watermelon-game-api | `be71218` | feat: implement game module (sessions, scores, levels) |
| portfolio_nextjs | `da73c9c` | feat: add auth UI (login, register, auth context) |
| portfolio_nextjs | `8cb4a44` | feat: add Angry Birds style physics game (Phase 1B) |

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
| PD-003 | Guest có xem leaderboard không? | Phase 1C |
| PD-004 | Leaderboard type (all-time/daily/weekly) | Phase 1C |
| PD-006 | Anti-cheat strategy | Phase 1C |
| PD-007 | PaaS provider (Render/Railway/Fly.io) | Phase 1D |
| D-002 | Google + GitHub OAuth | Phase 1A chưa hoàn thành phần OAuth |

---

## Chưa xong — cần thao tác trên server

| Step | Việc cần làm | Ghi chú |
|---|---|---|
| 1 | Chạy `dbmate up` trên production | Tạo users + refresh_tokens + game_sessions tables |
| 2 | Set `JWT_SECRET` env var trên server | Cho watermelon-game-api |
| 3 | Set `NEXT_PUBLIC_API_URL` trên Vercel | Trỏ tới API URL production |
| 4 | Test auth flow end-to-end trên production | Register → Login → /auth/me |
| 5 | Test game flow end-to-end trên production | Login → Play → Score saved |

---

## Khi resume session mới

1. Đọc file này để lấy context
2. Đọc `docs/EXECUTION_CHECKLIST.md` để biết chi tiết checklist
3. Đọc `docs/DECISION_LOG.md` để biết decisions đã chốt vs pending
4. **Nếu tiếp tục Phase 1A**: implement Google + GitHub OAuth
5. **Nếu chuyển Phase 1C**: implement leaderboard (cần PD-003, PD-004, PD-006)
6. **Nếu deploy**: thực hiện các bước server ở trên
