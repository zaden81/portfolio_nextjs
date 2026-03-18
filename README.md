# Thuong's Portfolio

Personal portfolio website for **Nguyen Hoai Thuong** — AI Engineer specializing in deep learning, NLP, and full-stack development.

Built with Next.js 16, React 19, TypeScript, and Tailwind CSS v4.

## Features

- Single-page portfolio with smooth scroll navigation
- Dark/Light theme toggle (dark by default)
- Responsive design with mobile menu
- Contact form with Zod validation, stored in Neon Serverless Postgres
- Loading screen animation
- SEO-optimized with Open Graph and Twitter card metadata

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19 + Tailwind CSS v4
- **Language**: TypeScript
- **Database**: Neon Serverless Postgres
- **Validation**: Zod
- **Theming**: next-themes

## Getting Started

### Prerequisites

- Node.js 18+
- A [Neon](https://neon.tech) database (free tier available)

### Installation

```bash
git clone https://github.com/zaden81/portfolio_nextjs.git
cd portfolio_nextjs
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
app/                → Pages & API routes (Next.js App Router)
components/
  ├── icons/        → SVG icon components
  ├── providers/    → ThemeProvider
  ├── sections/     → Navbar, Hero, About, Projects, Contact, Footer
  └── ui/           → Reusable primitives (Button, Card, Input, etc.)
config/             → Site metadata, navigation, personal info
data/               → Projects, skills, social links
lib/                → Utilities, DB client, validations
types/              → TypeScript type definitions
public/images/      → Static images
```

## API Routes

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/contact` | Submit a contact message |
| GET | `/api/messages` | Retrieve all contact messages |

## Documentation

See [`docs/FRONTEND.md`](docs/FRONTEND.md) for detailed frontend documentation including architecture, theme system, component organization, and how to add content.

## License

Private project.
