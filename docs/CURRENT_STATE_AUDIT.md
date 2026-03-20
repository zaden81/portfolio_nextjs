# Current State Audit

> Last updated: 2026-03-18
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
| Font | DM Sans (Google Fonts via next/font) |
| Package manager | npm |
| Total source files (excl. node_modules) | ~50 files |

---

## 2. Directory Structure Audit

```
portfolio_nextjs/
├── app/                    ✅ Clean App Router structure
│   ├── layout.tsx          ✅ Root layout with font, metadata, theme
│   ├── page.tsx            ✅ Single page composing all sections
│   ├── globals.css         ✅ Theme tokens via CSS variables
│   └── api/
│       ├── contact/route.ts    ✅ POST endpoint with validation
│       └── messages/route.ts   ⚠️ GET endpoint — no auth protection
│
├── components/
│   ├── icons/              ✅ 7 SVG icon components
│   ├── providers/          ✅ ThemeProvider (next-themes wrapper)
│   ├── sections/           ✅ 6 sections, each with barrel export
│   │   ├── Navbar/         ✅ Server + Client split (Navbar → NavbarClient)
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
│   ├── api/                ✅ Response helpers
│   ├── db/                 ✅ Client, schema, queries
│   └── validations/        ✅ Env + contact schema (Zod)
│
├── types/                  ✅ 7 type files with barrel export
└── public/                 ✅ Images organized in subfolders
```

---

## 3. Module Audit

### 3.1 Presentation Layer (components/)

| Component | Type | Client? | Notes |
|---|---|---|---|
| Navbar → NavbarClient | Section | Yes | Scroll detection, mobile menu toggle |
| MobileMenu | Section | No (props-driven) | Rendered by NavbarClient |
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

**Assessment**: Clean component architecture. Proper server/client split. Barrel exports throughout.

### 3.2 Data Layer

| Module | Location | Responsibility |
|---|---|---|
| Site config | `config/site.ts` | Site name, description, OG/Twitter metadata |
| Navigation config | `config/navigation.ts` | Nav links, logo text, phone number |
| Personal config | `config/personal.ts` | Name, birthday, phone, email, bio |
| Projects data | `data/projects.ts` | Project list (2 projects) |
| Skills data | `data/skills.ts` | Skill categories (4 categories) |
| Social links data | `data/social-links.ts` | Social media links (4 links) |

**Assessment**: Clean separation of configuration vs content data. All typed. No CMS — all hardcoded constants.

### 3.3 Database Layer

| Component | File | Responsibility |
|---|---|---|
| Client | `lib/db/client.ts` | Lazy singleton Neon client |
| Schema | `lib/db/schema.ts` | Auto-create `messages` table |
| Queries | `lib/db/queries.ts` | `insertMessage()`, `getMessages()` |

**Schema**:
```sql
messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
)
```

**Assessment**: Minimal but functional. Auto-migration pattern (ensureSchema) is fine for a single table but won't scale — should migrate to proper migration tool before adding more tables.

### 3.4 API Layer

| Route | Method | Auth | Validation | Notes |
|---|---|---|---|---|
| `/api/contact` | POST | None | Zod | Inserts contact message to DB |
| `/api/messages` | GET | **None** | None | Returns ALL messages — security concern |

**Assessment**: `/api/messages` exposes all contact submissions to anyone. This is either a dev-only endpoint or needs auth before production.

### 3.5 Validation Layer

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

| # | Issue | Severity | Category |
|---|---|---|---|
| 1 | `/api/messages` has no auth — exposes all contact data publicly | **High** | Security |
| 2 | No tests of any kind | **Medium** | Quality |
| 3 | `ensureSchema()` auto-migration won't scale beyond 1 table | **Medium** | Database |
| 4 | `images.unoptimized: true` in next.config — all images unoptimized | **Low** | Performance |
| 5 | No rate limiting on `/api/contact` — could be abused | **Medium** | Security |
| 6 | No CSRF protection on contact form | **Low** | Security |
| 7 | No deploy configuration exists | **Medium** | DevOps |
| 8 | No CI/CD pipeline | **Medium** | DevOps |
| 9 | No error monitoring / logging infrastructure | **Low** | Observability |
| 10 | `.gitignore` has Prisma entry but Prisma not used — dead artifact | **Trivial** | Cleanup |
| 11 | `PHONE_NUMBER` in navigation.ts and `PHONE` in personal.ts — duplicated | **Trivial** | Consistency |
| 12 | `LOGO_TEXT` exported from navigation.ts but not used in NavbarClient (uses Image) | **Trivial** | Cleanup |

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
| Presentation ↔ Data access | `ContactForm.tsx` calls `fetch("/api/contact")` directly — acceptable for now but would benefit from an API client layer if more endpoints are added |
| Config vs Data | `personal.ts` exports `EMAIL` and `PHONE` separately AND also inside `PERSONAL_INFO_ITEMS` — minor duplication |
| Navigation config | `PHONE_NUMBER` exists in both `navigation.ts` and `personal.ts` (`PHONE`) — same data, two locations |

---

## 7. Potential Technical Debt

| # | Item | When it becomes debt | Recommended action |
|---|---|---|---|
| 1 | Auto-migration via `ensureSchema()` | When adding users, game_scores, leaderboard tables | Migrate to proper migration tool (in platform-infra) |
| 2 | No API client abstraction | When game frontend needs multiple API calls to watermelon-game-api | Create API client layer |
| 3 | Unprotected `/api/messages` | Before production deploy | Add auth or remove endpoint |
| 4 | No rate limiting | Before production deploy | Add rate limiting to contact endpoint |
| 5 | No error boundaries | When users encounter runtime errors | Add React error boundaries |
| 6 | Image optimization disabled | When page performance matters | Enable Vercel image optimization or use proper config |
