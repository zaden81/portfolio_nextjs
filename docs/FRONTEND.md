# Frontend Documentation

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 16.1.6 | React framework (App Router) |
| React | 19.2.3 | UI library |
| TypeScript | ^5 | Type safety |
| Tailwind CSS | v4 | Utility-first styling |
| next-themes | ^0.4.6 | Dark/Light mode |
| Zod | ^4.3.6 | Schema validation |
| Neon Serverless Postgres | ^1.0.2 | Database |
| matter-js | ^0.20.0 | Physics engine for game |
| clsx + tailwind-merge | - | Conditional class utilities |

## Project Structure

```
portfolio_nextjs/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (font, metadata, ThemeProvider, AuthProvider)
│   ├── page.tsx                  # Home page - composes all sections
│   ├── globals.css               # Theme tokens & CSS variables
│   ├── login/page.tsx            # Login page (Suspense-wrapped for searchParams)
│   ├── register/page.tsx         # Register page (name + email + password)
│   ├── auth/callback/page.tsx    # OAuth callback handler (Suspense-wrapped)
│   ├── game/
│   │   ├── page.tsx              # Game page (server component, metadata)
│   │   ├── GameClient.tsx        # Game UI: canvas, overlays, auth integration
│   │   └── error.tsx             # Game-specific error boundary
│   ├── error.tsx                  # Global error boundary
│   └── api/
│       └── contact/route.ts      # POST /api/contact
│
├── components/
│   ├── icons/                    # SVG icon components
│   ├── providers/
│   │   └── ThemeProvider.tsx      # next-themes wrapper (dark default)
│   ├── sections/                 # Page sections
│   │   ├── Auth/                 # LoginForm, RegisterForm
│   │   ├── Navbar/               # NavbarClient (auth + page-link aware), MobileMenu
│   │   ├── Hero/                 # Hero banner + scroll button + wave divider
│   │   ├── About/                # Bio, personal info, skills grid
│   │   ├── Projects/             # Project showcase cards
│   │   ├── Contact/              # Contact form + info + social links
│   │   └── Footer/               # Footer
│   └── ui/                       # Reusable UI primitives
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       ├── Textarea.tsx
│       ├── Container.tsx
│       ├── SectionHeader.tsx
│       ├── SocialLinkButton.tsx
│       ├── StatusAlert.tsx
│       ├── ThemeToggle.tsx
│       └── LoadingScreen.tsx
│
├── config/                       # Static configuration
│   ├── site.ts                   # Site metadata (title, description, OG/Twitter)
│   ├── navigation.ts             # Nav links (Home, About, Projects, Game) & phone
│   └── personal.ts              # Personal info (name, birthday, phone, email, bio)
│
├── data/                         # Content data
│   ├── projects.ts               # Project list (title, tag, image, link)
│   ├── skills.ts                 # Skill categories
│   └── social-links.ts           # Social media links
│
├── lib/                          # Shared utilities
│   ├── utils.ts                  # cn() helper (clsx + tailwind-merge)
│   ├── api/
│   │   ├── response.ts           # successResponse / errorResponse helpers
│   │   └── game.ts               # Game API client (authFetch-based)
│   ├── auth/
│   │   ├── provider.tsx          # AuthProvider (React Context)
│   │   ├── api.ts                # authFetch + authApi client
│   │   └── index.ts              # useAuth hook export
│   ├── game/
│   │   ├── engine.ts             # Game engine (Matter.js physics, canvas rendering)
│   │   ├── physics.ts            # Physics body creation (ground, walls, blocks, etc.)
│   │   ├── levels.ts             # 3 levels (Simple Tower, Double Stack, Pyramid)
│   │   ├── scoring.ts            # Score calculation + bonuses
│   │   └── types.ts              # Block, Level, GamePhase, GameState
│   ├── db/
│   │   ├── client.ts             # Neon DB client (lazy singleton)
│   │   └── queries.ts            # insertMessage
│   └── validations/
│       ├── env.ts                # DATABASE_URL validation
│       └── contact.ts            # Contact form schema (Zod)
│
├── types/                        # TypeScript type definitions
│   ├── navigation.ts             # NavLink
│   ├── project.ts                # Project
│   ├── skill.ts                  # SkillCategory
│   ├── social-link.ts            # SocialLink
│   ├── contact.ts                # ContactFormData
│   ├── personal.ts               # PersonalInfoItem
│   ├── auth.ts                   # AuthUser, AuthState, LoginFormData, etc.
│   ├── game.ts                   # Block, Level, GamePhase, GameState (re-exports)
│   └── index.ts                  # Barrel export
│
└── public/
    └── images/                   # Static images (avatar, projects, logo)
```

## Architecture

### Page Composition

The app is a **portfolio platform** built with Next.js App Router. The home page (`app/page.tsx`) composes sections in order:

```
Navbar → Hero → About → Projects → Contact → Footer
```

Additional routes:
- `/login` — Email + password login form (with OAuth buttons)
- `/register` — Registration form (with OAuth buttons)
- `/auth/callback` — OAuth callback token handler
- `/game` — Angry Birds style physics game (Block Smasher)

Each section is a self-contained component under `components/sections/`, using barrel exports (`index.ts`).

### Theme System

- **Provider**: `next-themes` with `attribute="class"`, default theme is **dark**
- **CSS Variables**: Defined in `globals.css` using Tailwind v4's `@theme` directive
- **Two themes**: `:root` (dark) and `:root.light` (light)
- **Color palette**:
  - Background: dark green tones (`#1a3a0a`, `#142e06`)
  - Accent: red (`#CC2936`)
  - Text: light green/cream (`#f0f4e8`, `#C5D5A0`)
- **Toggle**: `ThemeToggle` component with Sun/Moon icons

### Component Organization

| Layer | Location | Purpose |
|---|---|---|
| **UI Primitives** | `components/ui/` | Reusable atoms (Button, Card, Input, etc.) |
| **Icons** | `components/icons/` | SVG icon components |
| **Sections** | `components/sections/` | Page-level sections (Hero, About, etc.) |
| **Providers** | `components/providers/` | Context providers (ThemeProvider) |

### Data Flow

```
config/  ──→  Static site metadata, navigation, personal info
data/    ──→  Content (projects, skills, social links)
types/   ──→  TypeScript interfaces shared across all layers
lib/     ──→  Utilities, DB access, validation
```

Content is defined as **typed constants** — no CMS or external data fetching for portfolio content.

## API Routes

### POST `/api/contact`

Receives contact form submissions. Validates with Zod, saves to Neon Postgres.

**Request body:**
```json
{
  "name": "string (1-100 chars)",
  "email": "string (valid email, max 120 chars)",
  "message": "string (1-2000 chars)"
}
```

**Responses:**
- `200` — `{ "message": "Thank you! Your message has been sent." }`
- `400` — `{ "error": "<validation error>" }`
- `500` — `{ "error": "Error saving message." }`

**Rate limited**: 5 requests/minute per IP.

## Game Engine

### Block Smasher — Angry Birds style physics game

**Tech**: HTML5 Canvas + matter-js physics engine

**Architecture** (`lib/game/`):
- `engine.ts` — Main game engine: creates Matter.js world, handles physics loop, canvas 2D rendering, mouse input (drag/release slingshot), game state management
- `physics.ts` — Body factories: ground, walls, blocks, projectile, slingshot constraint
- `levels.ts` — 3 levels with increasing difficulty (tower, double stack, pyramid)
- `scoring.ts` — Score = blocks destroyed × 100 × level multiplier + remaining projectile bonus (200 each) + level clear bonus (500)
- `types.ts` — Block, Level, GamePhase (`aiming`/`launched`/`settling`/`result`), GameState

**Game flow**:
1. Player drags slingshot ball backward
2. Release launches projectile via matter-js physics
3. Projectile hits blocks → blocks marked destroyed when off-screen or stopped
4. When settled: if all blocks gone → level complete; if projectiles remain → next shot; else → level failed
5. Between levels: score saved to backend (if authenticated)
6. Game end: session completed on server

## Database

- **Provider**: [Neon Serverless Postgres](https://neon.tech)
- **Connection**: Via `@neondatabase/serverless` using `DATABASE_URL` env var
- **Schema**: Managed by dbmate migrations in `platform-infra` repo

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | Neon Postgres connection string |
| `NEXT_PUBLIC_API_URL` | Yes | watermelon-game-api URL (for auth + game API calls) |

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Styling

- **Framework**: Tailwind CSS v4 with `@tailwindcss/postcss`
- **Font**: DM Sans (Google Fonts via `next/font`)
- **Approach**: Utility-first classes with CSS variable-based theming
- **Helpers**: `cn()` function using `clsx` + `tailwind-merge` for conditional classes
- **Transitions**: Background and text color transition on theme change (0.3s ease)

## How to Add Content

### Add a new project

Edit `data/projects.ts`:

```ts
{
  tag: "Project description",
  title: "Project Title",
  image: "/images/projects/your-image.jpg",
  href: "https://github.com/your-repo",
  // Optional: isInternal: true for internal links (uses Next.js Link)
}
```

Place the project image in `public/images/projects/`.

### Add a new skill category

Edit `data/skills.ts`:

```ts
{
  title: "Category Name",
  items: "Skill 1, Skill 2, Skill 3",
}
```

### Add a new social link

Edit `data/social-links.ts` and create a corresponding icon component in `components/icons/`.

### Update personal info

Edit `config/personal.ts` for name, birthday, phone, email, and bio text.

### Update site metadata

Edit `config/site.ts` for title, description, Open Graph, and Twitter card data.
