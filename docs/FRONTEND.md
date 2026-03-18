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
| clsx + tailwind-merge | - | Conditional class utilities |

## Project Structure

```
portfolio_nextjs/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (font, metadata, ThemeProvider)
│   ├── page.tsx                  # Home page - composes all sections
│   ├── globals.css               # Theme tokens & CSS variables
│   └── api/
│       ├── contact/route.ts      # POST /api/contact
│       └── messages/route.ts     # GET /api/messages
│
├── components/
│   ├── icons/                    # SVG icon components
│   ├── providers/
│   │   └── ThemeProvider.tsx      # next-themes wrapper (dark default)
│   ├── sections/                 # Page sections
│   │   ├── Navbar/               # Navigation bar + mobile menu
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
│   ├── navigation.ts             # Nav links & logo text
│   └── personal.ts              # Personal info (name, email, phone, bio)
│
├── data/                         # Content data
│   ├── projects.ts               # Project list (title, tag, image, link)
│   ├── skills.ts                 # Skill categories
│   └── social-links.ts           # Social media links
│
├── lib/                          # Shared utilities
│   ├── utils.ts                  # cn() helper (clsx + tailwind-merge)
│   ├── api/
│   │   └── response.ts           # successResponse / errorResponse helpers
│   ├── db/
│   │   ├── client.ts             # Neon DB client (lazy singleton)
│   │   ├── schema.ts             # Auto-create messages table
│   │   └── queries.ts            # insertMessage / getMessages
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
│   └── personal.ts               # PersonalInfoItem
│
└── public/
    └── images/                   # Static images (avatar, projects, logo)
```

## Architecture

### Page Composition

The app is a **single-page portfolio** built with Next.js App Router. The home page (`app/page.tsx`) composes sections in order:

```
Navbar → Hero → About → Projects → Contact → Footer
```

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

### GET `/api/messages`

Returns all stored contact messages from the database.

**Response:** `200` — Array of message objects.

## Database

- **Provider**: [Neon Serverless Postgres](https://neon.tech)
- **Connection**: Via `@neondatabase/serverless` using `DATABASE_URL` env var
- **Schema**: Auto-created on first query (`ensureSchema()`)

```sql
CREATE TABLE IF NOT EXISTS messages (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(120) NOT NULL,
  message    TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | Neon Postgres connection string |

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
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
