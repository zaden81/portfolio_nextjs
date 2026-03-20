# Skill Agents & Roles

> Last updated: 2026-03-18
> Identifies the specialized roles needed to analyze and implement this system

---

## 1. Full Role Registry

### Role 1: Codebase Auditor

| Field | Value |
|---|---|
| **Mission** | Audit existing code for architecture quality, security issues, tech debt, boundary violations |
| **Output** | CURRENT_STATE_AUDIT.md, security findings, tech debt inventory |
| **Phase** | Phase 0 |
| **Why needed** | Must understand what exists before planning what to build. Prevents building on top of unknown problems. |

### Role 2: Product Scope Analyst

| Field | Value |
|---|---|
| **Mission** | Define clear product boundaries, distinguish stage 1 vs future, identify all pending owner decisions |
| **Output** | PRODUCT_SCOPE.md, OPEN_QUESTIONS.md, feature boundary matrix |
| **Phase** | Phase 0 |
| **Why needed** | Prevents scope creep and over-engineering. Ensures owner decisions are captured before code starts. |

### Role 3: System Architect

| Field | Value |
|---|---|
| **Mission** | Design overall system: repo model, communication patterns, data flow, module boundaries |
| **Output** | SYSTEM_OVERVIEW.md, TECH_ARCHITECTURE.md (overall sections), system diagrams |
| **Phase** | Phase 0, advisory in Phase 1A-1D |
| **Why needed** | Multi-repo architecture with separate frontend/backend needs clear contracts and boundaries from the start. |

### Role 4: Frontend Next.js Architect

| Field | Value |
|---|---|
| **Mission** | Design frontend architecture: game integration in portfolio, routing, API client layer, auth UX flow |
| **Output** | Frontend architecture section of TECH_ARCHITECTURE.md, component design specs, route planning |
| **Phase** | Phase 0 (design), Phase 1B-1C (implementation guidance) |
| **Why needed** | Game integration into existing portfolio requires careful routing, state management, and cross-origin auth handling. |

### Role 5: Backend Clean Architecture Planner

| Field | Value |
|---|---|
| **Mission** | Design watermelon-game-api: module structure, controller/service/data layers, middleware chain |
| **Output** | Backend architecture section of TECH_ARCHITECTURE.md, module specs, API contract |
| **Phase** | Phase 0 (design), Phase 1A (implementation guidance) |
| **Why needed** | Owner explicitly wants to demonstrate clean architecture. Backend structure must be exemplary. |

### Role 6: Auth & Session Security Planner

| Field | Value |
|---|---|
| **Mission** | Design auth flows: OAuth integration, email/password security, token management, cross-origin auth |
| **Output** | Auth boundary section of TECH_ARCHITECTURE.md, OAuth flow diagrams, security checklist |
| **Phase** | Phase 0 (design), Phase 1A (implementation guidance) |
| **Why needed** | 3 auth methods + guest mode + cross-origin (Vercel ↔ PaaS) is the most complex part of stage 1. Getting this wrong means security holes. |

### Role 7: Database Schema Designer

| Field | Value |
|---|---|
| **Mission** | Design database schema: users, game sessions, leaderboard. Plan migration strategy. |
| **Output** | Schema diagrams, migration files, data boundary section of TECH_ARCHITECTURE.md |
| **Phase** | Phase 0 (design), Phase 1A-1C (migrations) |
| **Why needed** | Shared database across repos. Schema must support auth, game data, and leaderboard without being over-designed for unknown game genre. |

### Role 8: DevOps / Infra Planner

| Field | Value |
|---|---|
| **Mission** | Plan deploy pipeline: Vercel config, PaaS setup, environment management, CORS, domain config |
| **Output** | Deploy docs in platform-infra, environment templates, deploy checklist |
| **Phase** | Phase 0 (planning), Phase 1D (execution) |
| **Why needed** | Multi-repo deploy to different platforms (Vercel + PaaS) with shared database needs careful coordination. |

### Role 9: QA / Risk Reviewer

| Field | Value |
|---|---|
| **Mission** | Review each phase's output for security holes, missing edge cases, auth bypass risks, data leaks |
| **Output** | Risk reports, security review notes, test scenarios |
| **Phase** | End of each phase (review gate) |
| **Why needed** | Auth + guest mode + leaderboard create edge cases (guest submitting scores, token replay, CORS bypass). Catch these before production. |

### Role 10: Documentation & Execution Planner

| Field | Value |
|---|---|
| **Mission** | Maintain docs, track decisions, update checklists, ensure nothing falls through cracks |
| **Output** | All docs maintained, DECISION_LOG.md updated, EXECUTION_CHECKLIST.md current |
| **Phase** | All phases |
| **Why needed** | Multi-phase project with many pending decisions needs a single source of truth that stays current. |

---

## 2. Minimum Set for Stage 1

Not all roles need to be separate people/agents. For a solo developer project, roles can be combined.

### Recommended minimum: 4 combined roles

| Combined Role | Covers | Phase Active |
|---|---|---|
| **Architect + Auditor** | Roles 1, 3, 5 — Audit existing code, design overall architecture, plan backend structure | Phase 0 |
| **Auth + Security Specialist** | Roles 6, 9 — Design auth flows, review security at each phase gate | Phase 0, 1A, review gates |
| **Fullstack Implementer** | Roles 4, 7 — Frontend architecture, database schema, actual implementation | Phase 1A-1D |
| **Ops + Docs** | Roles 8, 10 — Deploy pipeline, documentation, execution tracking | Phase 0, 1D, ongoing |

### For this project (solo developer with AI assistance)

The developer acts as all roles. The AI assistant can fill:
- **Codebase Auditor** — Already done (this planning session)
- **Product Scope Analyst** — Already done (this planning session)
- **System Architect** — Already done (docs created)
- **Backend Clean Architecture Planner** — Provide module specs when Phase 1A starts
- **Auth & Session Security Planner** — Provide auth flow details when owner confirms decisions
- **Database Schema Designer** — Provide schema when game genre is decided
- **QA / Risk Reviewer** — Review at each phase gate
- **Documentation & Execution Planner** — Maintain docs throughout

The developer must:
- Make all owner decisions
- Implement the code
- Configure deploy environments
- Register OAuth apps with Google/GitHub
- Manage secrets and credentials

---

## 3. Agent Activation Schedule

| Phase | Agents Active | Trigger |
|---|---|---|
| Phase 0 | Architect, Auditor, Scope Analyst, Docs | Now (in progress) |
| Phase 1A | Auth Specialist, Backend Planner, Schema Designer | After Phase 0 owner decisions confirmed |
| Phase 1B | Frontend Architect, Backend Planner | After game genre decided (PD-001) |
| Phase 1C | QA Reviewer, Schema Designer | After Phase 1B complete |
| Phase 1D | DevOps Planner, QA Reviewer | After Phase 1C complete |
