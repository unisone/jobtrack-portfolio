<div align="center">

# JobTrack

### Modern Job Application Tracker

[![Next.js](https://img.shields.io/badge/Next.js-15.4-black?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)

<br />

A full-stack job application tracking platform with premium glassmorphic UI,<br />
real-time sync, and comprehensive job search management.

<br />

![JobTrack Preview](https://via.placeholder.com/900x500/0a0a0a/ffffff?text=JobTrack+Dashboard)

</div>

---

## Table of Contents

<details>
<summary>Click to expand</summary>

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Security](#security)
- [Testing](#testing)
- [Deployment](#deployment)
- [License](#license)
- [Acknowledgments](#acknowledgments)

</details>

---

## Features

<table>
<tr>
<td width="50%">

### Core Functionality

- **Application Tracking** — Log and manage jobs with detailed status
- **Pipeline Management** — Visual kanban from Applied → Offer
- **Interview Scheduling** — Track rounds, dates, and follow-ups
- **Analytics Dashboard** — Response rates and success metrics
- **Resume Gallery** — Store multiple resume versions

</td>
<td width="50%">

### Technical Highlights

- **Real-time Sync** — Supabase-powered live data sync
- **Offline-First** — Zustand persistence for offline use
- **OAuth Authentication** — Google & GitHub sign-in
- **Responsive Design** — Mobile-first with desktop optimization
- **Accessibility** — WCAG 2.1 compliant, reduced motion support

</td>
</tr>
</table>

### Premium UI/UX

| Feature | Description |
|---------|-------------|
| **Glassmorphism** | Modern dark theme with sophisticated blur effects |
| **Micro-interactions** | Framer Motion-powered smooth animations |
| **Magnetic Effects** | Cursor-following hover interactions |
| **Parallax Scrolling** | Cinematic scroll-driven animations |

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

---

## Tech Stack

<table>
<tr>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=nextjs" width="48" height="48" alt="Next.js" />
<br>Next.js 15
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=react" width="48" height="48" alt="React" />
<br>React 19
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=ts" width="48" height="48" alt="TypeScript" />
<br>TypeScript
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=tailwind" width="48" height="48" alt="Tailwind" />
<br>Tailwind v4
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=supabase" width="48" height="48" alt="Supabase" />
<br>Supabase
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=vercel" width="48" height="48" alt="Vercel" />
<br>Vercel
</td>
</tr>
</table>

<details>
<summary><strong>Full Stack Details</strong></summary>

| Category | Technology |
|----------|------------|
| **Framework** | [Next.js 15](https://nextjs.org/) — App Router with React Server Components |
| **Language** | [TypeScript 5.x](https://www.typescriptlang.org/) — Strict mode enabled |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) — Utility-first CSS |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com/) — New York theme variant |
| **Animation** | [Framer Motion](https://www.framer.com/motion/) — Production-ready motion library |
| **Database** | [Supabase](https://supabase.com/) — PostgreSQL with real-time subscriptions |
| **State** | [Zustand](https://zustand-demo.pmnd.rs/) — Lightweight state with persistence |
| **Forms** | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) — Type-safe validation |
| **Testing** | [Playwright](https://playwright.dev/) — E2E testing |

</details>

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

---

## Getting Started

### Prerequisites

- **Node.js** 18+
- **npm**, yarn, or pnpm
- **Supabase** account ([free tier available](https://supabase.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd jobtrack-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env.local
   ```

   Add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open** [http://localhost:3000](http://localhost:3000)

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Playwright E2E tests |

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

---

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (dashboard)/        # Protected dashboard routes
│   ├── auth/               # Authentication pages
│   └── resumes/            # Resume management
├── components/
│   ├── landing/            # Landing page components
│   ├── jobs/               # Job management components
│   ├── ui/                 # shadcn/ui components
│   └── providers/          # Context providers
├── hooks/                  # Custom React hooks
├── lib/
│   ├── supabase/           # Database services
│   ├── auth/               # Authentication utilities
│   └── store.ts            # Zustand state management
└── types/                  # TypeScript definitions
```

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

---

## Architecture

<details>
<summary><strong>Why Zustand over Redux?</strong></summary>

- Simpler API with less boilerplate
- Built-in persistence middleware for offline support
- Better TypeScript inference out of the box
- Smaller bundle size (~1KB vs ~10KB)

</details>

<details>
<summary><strong>Why Supabase?</strong></summary>

- PostgreSQL reliability with real-time subscriptions
- Built-in authentication with OAuth providers
- Row-level security for data protection
- Generous free tier for personal projects

</details>

<details>
<summary><strong>Why App Router?</strong></summary>

- Server Components for better initial load performance
- Streaming and Suspense support
- Improved data fetching patterns
- Built-in layouts and loading states

</details>

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

---

## Security

| Measure | Implementation |
|---------|----------------|
| **Input Validation** | Zod schemas at all system boundaries |
| **XSS Prevention** | Sanitized outputs and CSP headers |
| **Open Redirect Protection** | Validated redirect URLs |
| **Authentication** | httpOnly cookies, CSRF protection |
| **Database Security** | Row-Level Security (RLS) policies |

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

---

## Testing

Comprehensive E2E test coverage:

- ✅ Authentication flows (login, signup, OAuth)
- ✅ Protected route redirects
- ✅ Landing page interactions
- ✅ Security header validation

```bash
# Run all tests
npm run test

# Run tests in UI mode
npx playwright test --ui
```

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

---

## Deployment

Deploy on **Vercel** with automatic deployments from the main branch.

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

---

## License

Distributed under the **MIT License**. See `LICENSE` for more information.

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

---

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) — Beautiful component library
- [Vercel](https://vercel.com) — Hosting and deployment
- [Supabase](https://supabase.com) — Backend infrastructure
- [Skill Icons](https://skillicons.dev) — Tech stack icons

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>
