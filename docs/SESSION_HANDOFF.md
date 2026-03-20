# Session Handoff — 2026-03-18

> Tạo lúc kết thúc session. Dùng để resume context khi bắt đầu session mới.

---

## Trạng thái hiện tại

**Phase 0 đang thực hiện — đã hoàn thành 6/10 steps.**

### Đã xong

| Step | Mô tả | Repo |
|---|---|---|
| 0.1 | Xóa `/api/messages` (security hole) | portfolio_nextjs |
| 0.2 | Thêm rate limiting IP-based cho `/api/contact` (5 req/min) | portfolio_nextjs |
| 0.3 | Cleanup: xóa Prisma gitignore, gộp PHONE constant, xóa LOGO_TEXT | portfolio_nextjs |
| 0.4 | Tạo `.env.example` | portfolio_nextjs |
| 0.5 | Scaffold toàn bộ `watermelon-game-api` (Fastify + TS, 20 files) | watermelon-game-api |
| 0.6 | Scaffold `platform-infra` (dbmate config, initial migration) | platform-infra |

### Chưa xong — cần bạn thao tác

| Step | Việc cần làm | Ghi chú |
|---|---|---|
| 0.7 | `cd D:/code/watermelon-game-api && npm install` | Cài dependencies |
| 0.8 | `cd D:/code/platform-infra` → tạo `.env` → `dbmate up` | Verify migration chạy OK với Neon |
| 0.9 | Remove `ensureSchema()` khỏi portfolio_nextjs | Chờ 0.8 thành công |
| 0.10 | Set up Vercel project cho portfolio_nextjs | Cần Vercel account |

### Chưa commit

Các thay đổi trong `portfolio_nextjs` chưa được commit:
- Xóa `app/api/messages/`
- Thêm `lib/rate-limit.ts`
- Sửa `app/api/contact/route.ts` (rate limiting)
- Sửa `lib/db/queries.ts`, `lib/db/index.ts` (remove getMessages)
- Sửa `config/navigation.ts`, `config/index.ts` (remove LOGO_TEXT, PHONE_NUMBER)
- Sửa `components/sections/Navbar/NavbarClient.tsx` (PHONE_NUMBER → PHONE)
- Sửa `.gitignore` (remove Prisma entry)
- Thêm `.env.example`
- Thêm/sửa nhiều files trong `docs/`

Repos `watermelon-game-api` và `platform-infra` cũng chưa commit.

---

## Decisions đã chốt trong session này

| ID | Decision |
|---|---|
| D-001 | Separate repos: portfolio_nextjs, watermelon-game-api, platform-infra |
| D-002 | Auth: Google + GitHub + Email/Password |
| D-008 | Frontend deploy: Vercel |
| D-009 | Backend deploy: PaaS (provider chưa chốt) |
| D-015 | Backend tech: Node.js + TypeScript |
| D-016 | Backend framework: Fastify |
| D-017 | API format: REST |
| D-018 | Migration tool: dbmate |
| D-019 | /api/messages: removed |
| D-020 | Rate limiting: by IP |

## Pending decisions quan trọng

| ID | Quyết định | Ảnh hưởng |
|---|---|---|
| **PD-001** | **Game genre / gameplay** | **Blocks toàn bộ Phase 1B** |
| PD-007 | PaaS provider (Render/Railway/Fly.io) | Blocks Phase 1D |
| PD-011 | Token strategy (JWT/session/refresh) | Blocks Phase 1A auth |

---

## Docs đã tạo

Tất cả nằm trong `portfolio_nextjs/docs/`:

```
SYSTEM_OVERVIEW.md
CURRENT_STATE_AUDIT.md
PRODUCT_SCOPE.md
TECH_ARCHITECTURE.md
PHASES_ROADMAP.md
OPEN_QUESTIONS.md
DECISION_LOG.md
EXECUTION_CHECKLIST.md
MASTER_PLAN.md
SKILL_AGENTS.md
FRONTEND.md
```

---

## Khi resume session mới

1. Đọc file này để lấy context
2. Đọc `docs/EXECUTION_CHECKLIST.md` để biết checklist chi tiết
3. Đọc `docs/DECISION_LOG.md` để biết decisions đã chốt vs pending
4. Tiếp tục Phase 0 steps 0.7-0.10
5. Sau Phase 0 xong → bắt đầu Phase 1A (auth)
