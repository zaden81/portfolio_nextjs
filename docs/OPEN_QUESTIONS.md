# Open Questions

> Last updated: 2026-03-20
> Status: Questions organized by category. Owner must answer before relevant phase begins.

---

## Product

| ID | Question | Impact | Blocks | Status |
|---|---|---|---|---|
| PD-001 | **What is the game genre / gameplay type?** (e.g., puzzle, arcade, clicker, merge, physics-based) | Determines frontend tech, game logic, scoring, schema | Phase 1B entirely | **OPEN — Critical** |
| PD-002 | **Is the game real-time or turn-based?** | Determines if WebSocket is needed, API design pattern | Phase 1B | **OPEN** |
| PD-003 | **Can guests view the leaderboard (read-only)?** | Affects leaderboard API auth rules, frontend UX | Phase 1C | **OPEN** |
| PD-008 | **What is the admin panel scope?** Should admin see: contact messages only? User accounts? Game data? All of the above? | Whether to build admin routes, what data to expose | Phase 2 (or late Phase 1) | **OPEN** |
| PD-015 | **Should the game page have its own URL (e.g., `/game`) or be embedded in the portfolio?** | Frontend routing, SEO, shareability | Phase 1B | Recommended: `/game` route (R-005) |

---

## Auth — MOSTLY RESOLVED

| ID | Question | Impact | Blocks | Status |
|---|---|---|---|---|
| ~~PD-010~~ | ~~Password reset flow~~ | ~~Requires email provider~~ | ~~Phase 1A~~ | **Deferred** (DD-007) |
| ~~PD-011~~ | ~~Token strategy~~ | ~~Auth implementation~~ | ~~Phase 1A~~ | **Resolved**: JWT + refresh token (D-021) |
| ~~PD-016~~ | ~~Email verification required?~~ | ~~Email provider, UX flow~~ | ~~Phase 1A~~ | **Resolved**: No (D-025) |
| ~~PD-017~~ | ~~Auth state persist across repos?~~ | ~~Token sharing strategy~~ | ~~Phase 1A~~ | **Resolved**: JWT Bearer header + CORS |

---

## Leaderboard

| ID | Question | Impact | Blocks | Status |
|---|---|---|---|---|
| PD-004 | **Leaderboard type: all-time, daily, weekly, or combination?** | DB schema (need timestamp filtering), query complexity | Phase 1C | **OPEN** |
| PD-005 | **What is the scoring metric?** (e.g., highest score, fastest time, longest survival, most items merged) | Depends on game genre, affects schema and sorting | Phase 1B, 1C | **OPEN** (blocked by PD-001) |
| PD-006 | **Anti-cheat strategy?** Options: (a) server-side score validation, (b) client trust with rate limiting, (c) replay verification, (d) none in stage 1 | Backend complexity, game logic placement | Phase 1C | **OPEN** |
| PD-018 | **Should leaderboard show user display names or anonymous IDs?** | Privacy policy, user profile requirements | Phase 1C | **OPEN** |

---

## Guest Mode

| ID | Question | Impact | Blocks | Status |
|---|---|---|---|---|
| PD-019 | **Should guest scores be shown temporarily in the UI during their session?** (local state only, not saved) | Frontend game state management | Phase 1B | **OPEN** |
| PD-020 | **Should there be a prompt encouraging guests to log in after playing?** (e.g., "Log in to save your score!") | UX design, conversion flow | Phase 1B | **OPEN** |

---

## Infrastructure

| ID | Question | Impact | Blocks | Status |
|---|---|---|---|---|
| PD-007 | **Which PaaS provider for watermelon-game-api?** Render / Railway / Fly.io | Deploy pipeline, CI/CD, environment setup | Phase 1D | **OPEN** |
| ~~PD-009~~ | ~~Backend tech stack~~ | ~~Repo scaffolding~~ | ~~Phase 0~~ | **Resolved**: Node.js + TypeScript (D-015) |
| ~~PD-013~~ | ~~Backend framework~~ | ~~Performance, DX~~ | ~~Phase 0~~ | **Resolved**: Fastify (D-016) |
| ~~PD-021~~ | ~~Migration tool~~ | ~~Migration workflow~~ | ~~Phase 0~~ | **Resolved**: dbmate (D-018) |
| ~~PD-022~~ | ~~Redis provider~~ | ~~Session storage~~ | ~~Phase 1A~~ | **Not needed**: DB-backed refresh tokens |

---

## Security — MOSTLY RESOLVED

| ID | Question | Impact | Blocks | Status |
|---|---|---|---|---|
| ~~PD-023~~ | ~~`/api/messages` kept or removed?~~ | ~~Security~~ | ~~Phase 0~~ | **Resolved**: Removed (D-019) |
| ~~PD-024~~ | ~~Rate limiting strategy~~ | ~~Abuse prevention~~ | ~~Phase 0~~ | **Resolved**: By IP (D-020) |

---

## Future Expansion

| ID | Question | Impact | Blocks | Status |
|---|---|---|---|---|
| PD-025 | **Will future projects also need backends, or are they frontend-only?** | Whether to generalize the platform architecture | Not blocking stage 1 | **OPEN** |
| PD-026 | **Is a custom domain planned for the portfolio?** | Vercel config, OAuth callback URLs | Phase 1D | **OPEN** |
| PD-027 | **Will there be user profiles visible to other users?** | User schema design, privacy policy | Phase 2 | **OPEN** |

---

## Summary: What Must Be Answered Before Each Phase

### Before Phase 1A can complete (OAuth part):
- Google OAuth app setup (owner must register on Google Cloud Console)
- GitHub OAuth app setup (owner must register on GitHub Settings)

### Before Phase 1B can start:
- PD-001 (game genre) — **critical blocker**
- PD-002 (real-time vs turn-based)
- PD-015 (game route strategy)

### Before Phase 1C can complete:
- PD-003 (guests view leaderboard?)
- PD-004 (leaderboard type)
- PD-005 (scoring metric)
- PD-006 (anti-cheat)

### Before Phase 1D can complete:
- PD-007 (PaaS provider)
- PD-026 (custom domain)
