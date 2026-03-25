# Open Questions

> Last updated: 2026-03-25
> Status: Questions organized by category. Owner must answer before relevant phase begins.

---

## Product

| ID | Question | Impact | Blocks | Status |
|---|---|---|---|---|
| ~~PD-001~~ | ~~What is the game genre?~~ | ~~Drives game architecture~~ | ~~Phase 1B~~ | **Resolved**: Angry Birds style physics game (D-027) |
| ~~PD-002~~ | ~~Real-time or turn-based?~~ | ~~API pattern~~ | ~~Phase 1B~~ | **Resolved**: Real-time physics simulation (D-028) |
| PD-003 | **Can guests view the leaderboard (read-only)?** | Affects leaderboard API auth rules, frontend UX | Phase 1C | **Resolved**: Yes, public read-only (D-033) |
| PD-008 | **What is the admin panel scope?** Should admin see: contact messages only? User accounts? Game data? All of the above? | Whether to build admin routes, what data to expose | Phase 2 (or late Phase 1) | **OPEN** |
| ~~PD-015~~ | ~~Game page URL?~~ | ~~Frontend routing~~ | ~~Phase 1B~~ | **Resolved**: `/game` route (D-030) |

---

## Auth — RESOLVED

| ID | Question | Impact | Blocks | Status |
|---|---|---|---|---|
| ~~PD-010~~ | ~~Password reset flow~~ | ~~Requires email provider~~ | ~~Phase 1A~~ | **Deferred** (DD-007) |
| ~~PD-011~~ | ~~Token strategy~~ | ~~Auth implementation~~ | ~~Phase 1A~~ | **Resolved**: JWT + refresh token (D-021) |
| ~~PD-016~~ | ~~Email verification required?~~ | ~~Email provider, UX flow~~ | ~~Phase 1A~~ | **Resolved**: No (D-025) |
| ~~PD-017~~ | ~~Auth state persist across repos?~~ | ~~Token sharing strategy~~ | ~~Phase 1A~~ | **Resolved**: JWT Bearer header + CORS |

All Phase 1A code is complete including Google + GitHub OAuth. Pending: owner must register OAuth apps and set credentials.

---

## Leaderboard

| ID | Question | Impact | Blocks | Status |
|---|---|---|---|---|
| PD-004 | **Leaderboard type: all-time, daily, weekly, or combination?** | DB schema (need timestamp filtering), query complexity | Phase 1C | **Resolved**: All-time only (D-034) |
| ~~PD-005~~ | ~~Scoring metric~~ | ~~Schema and sorting~~ | ~~Phase 1B, 1C~~ | **Resolved**: Points = blocks × 100 × level + bonuses (D-029) |
| PD-006 | **Anti-cheat strategy?** Options: (a) server-side score validation, (b) client trust with rate limiting, (c) replay verification, (d) none in stage 1 | Backend complexity, game logic placement | Phase 1C | **Resolved**: Client trust + rate limiting (D-035) |
| PD-018 | **Should leaderboard show user display names or anonymous IDs?** | Privacy policy, user profile requirements | Phase 1C | **Resolved**: Show display names from users.name (D-036) |

---

## Guest Mode — MOSTLY RESOLVED

| ID | Question | Impact | Blocks | Status |
|---|---|---|---|---|
| ~~PD-019~~ | ~~Guest scores shown during session?~~ | ~~Frontend state~~ | ~~Phase 1B~~ | **Resolved**: Yes, score shown in UI during play; not saved to backend |
| ~~PD-020~~ | ~~Prompt guests to log in?~~ | ~~UX~~ | ~~Phase 1B~~ | **Resolved**: Yes, login prompt banner shown above game canvas |

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
- ~~Google OAuth app setup (owner must register on Google Cloud Console)~~ — Code done, pending credentials
- ~~GitHub OAuth app setup (owner must register on GitHub Settings)~~ — Code done, pending credentials

### Before Phase 1B can start:
- ~~PD-001 (game genre)~~ — **Resolved** (D-027)
- ~~PD-002 (real-time vs turn-based)~~ — **Resolved** (D-028)
- ~~PD-015 (game route strategy)~~ — **Resolved** (D-030)

**Phase 1B is complete.**

### Before Phase 1C can complete:
- ~~PD-003 (guests view leaderboard?)~~ — **Resolved** (D-033)
- ~~PD-004 (leaderboard type)~~ — **Resolved** (D-034)
- ~~PD-006 (anti-cheat)~~ — **Resolved** (D-035)
- ~~PD-018 (display names)~~ — **Resolved** (D-036)

Note: PD-005 (scoring metric) already resolved (D-029). **Phase 1C is complete.**

### Before Phase 1D can complete:
- PD-007 (PaaS provider)
- PD-026 (custom domain)
