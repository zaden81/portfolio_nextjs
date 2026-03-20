# Session Handoff — 2026-03-20

> Tạo lúc kết thúc session. Dùng để resume context khi bắt đầu session mới.

---

## Trạng thái hiện tại

**Phase 0 hoàn thành. Phase 1A (Auth — Email/Password) hoàn thành.**

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

### Đã push lên remote

Tất cả 3 repos đã push. Commits:

| Repo | Commit | Message |
|---|---|---|
| platform-infra | `56fc6c3` | feat: add users and refresh_tokens migrations |
| watermelon-game-api | `4a14762` | feat: implement email/password auth with JWT |
| watermelon-game-api | `f21d106` | fix: load .env via --env-file flag in dev and start scripts |
| portfolio_nextjs | `da73c9c` | feat: add auth UI (login, register, auth context) |

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
- Access token: JWT signed với `JWT_SECRET`, chứa `sub`, `email`, `name`
- Refresh token: random 40 bytes hex, lưu SHA-256 hash trong DB
- Rotation: mỗi lần refresh → xóa token cũ, tạo token mới

**Security:**
- Password: bcryptjs với salt rounds = 12
- Rate limiting per route (10 req/min cho register/login, 30 cho refresh/logout, 100 cho /me)
- Zod validation trên tất cả request bodies
- Global error handler: AppError → status code, ZodError → 400, FastifyError → appropriate status

### Frontend (portfolio_nextjs)

**Auth flow:**
- `AuthProvider` wraps app — tự động refresh token on mount
- Access token lưu in-memory (JS variable) — không persist
- Refresh token lưu trong `localStorage`
- `authFetch()` wrapper tự attach `Authorization: Bearer` header
- Login/Register forms reuse existing `Input`, `Button`, `StatusAlert` components

**Pages:**
- `/login` — email + password form, link tới register
- `/register` — name + email + password form, link tới login

**Navbar:**
- Authenticated: hiện user name + "Logout" button
- Unauthenticated: hiện "Login" link

---

## Decisions đã chốt trong session 2

| ID | Decision |
|---|---|
| D-021 | Token strategy: JWT + refresh token rotation (xác nhận R-004) |
| D-022 | Password hashing: bcryptjs, 12 rounds |
| D-023 | Refresh token storage: SHA-256 hash trong `refresh_tokens` table |
| D-024 | Frontend token storage: access in memory, refresh in localStorage |
| D-025 | No email verification trong Phase 1A (PD-016 resolved: No) |
| D-026 | No password reset trong Phase 1A (PD-010 resolved: deferred) |

## Pending decisions quan trọng

| ID | Quyết định | Ảnh hưởng |
|---|---|---|
| **PD-001** | **Game genre / gameplay** | **Blocks toàn bộ Phase 1B** |
| PD-002 | Real-time vs turn-based | Blocks Phase 1B |
| PD-007 | PaaS provider (Render/Railway/Fly.io) | Blocks Phase 1D |
| D-002 | Google + GitHub OAuth | Phase 1A chưa hoàn thành phần OAuth |

---

## Chưa xong — cần thao tác trên server

| Step | Việc cần làm | Ghi chú |
|---|---|---|
| 1 | Chạy `dbmate up` trên production | Tạo users + refresh_tokens tables |
| 2 | Set `JWT_SECRET` env var trên server | Cho watermelon-game-api |
| 3 | Set `NEXT_PUBLIC_API_URL` trên Vercel | Trỏ tới API URL production |
| 4 | Test auth flow end-to-end trên production | Register → Login → /auth/me |

---

## Khi resume session mới

1. Đọc file này để lấy context
2. Đọc `docs/EXECUTION_CHECKLIST.md` để biết chi tiết checklist
3. Đọc `docs/DECISION_LOG.md` để biết decisions đã chốt vs pending
4. **Nếu tiếp tục Phase 1A**: implement Google + GitHub OAuth
5. **Nếu chuyển Phase 1B**: cần PD-001 (game genre) đã chốt
6. **Nếu deploy**: thực hiện các bước server ở trên
