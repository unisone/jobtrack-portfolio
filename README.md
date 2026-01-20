# JobTrack - Modern Job Application Tracker

[![Next.js](https://img.shields.io/badge/Next.js-15.4-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)

A modern, full-stack job application tracking platform built with Next.js 15, React 19, and Supabase. Features a premium glassmorphic UI, real-time sync, and comprehensive job search management.

---

## Features

### Core Functionality
- **Application Tracking** - Log and manage job applications with detailed status tracking
- **Pipeline Management** - Visual kanban-style pipeline from Applied to Offer
- **Interview Scheduling** - Track interview rounds, dates, and follow-ups
- **Analytics Dashboard** - Response rates, application trends, and success metrics
- **Resume Gallery** - Store and manage multiple resume versions

### Technical Highlights
- **Real-time Sync** - Supabase-powered live data synchronization
- **Offline-First** - Zustand persistence for seamless offline experience
- **OAuth Authentication** - Google and GitHub sign-in with secure session management
- **Responsive Design** - Mobile-first approach with desktop optimization
- **Accessibility** - WCAG 2.1 compliant with reduced motion support

### Premium UI/UX
- **Glassmorphism Design** - Modern dark theme with sophisticated blur effects
- **Smooth Animations** - Framer Motion-powered micro-interactions
- **Magnetic Interactions** - Cursor-following hover effects
- **Parallax Scrolling** - Cinematic scroll-driven animations

---

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router) |
| **Language** | [TypeScript 5.x](https://www.typescriptlang.org/) (strict mode) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com/) (New York theme) |
| **Animation** | [Framer Motion](https://www.framer.com/motion/) |
| **Database** | [Supabase](https://supabase.com/) (PostgreSQL) |
| **State Management** | [Zustand](https://zustand-demo.pmnd.rs/) with persistence |
| **Forms** | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| **Testing** | [Playwright](https://playwright.dev/) (E2E) + [Jest](https://jestjs.io/) |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- Supabase account (for database)

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

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Fill in your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Create production build
npm run lint     # Run ESLint
npm run test     # Run Playwright E2E tests
```

---

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (dashboard)/       # Protected dashboard routes
│   ├── auth/              # Authentication pages
│   └── resumes/           # Resume management
├── components/
│   ├── landing/           # Landing page components
│   ├── jobs/              # Job management components
│   ├── ui/                # shadcn/ui components
│   └── providers/         # Context providers
├── hooks/                 # Custom React hooks
├── lib/
│   ├── supabase/         # Database services
│   ├── auth/             # Authentication utilities
│   └── store.ts          # Zustand state management
└── types/                # TypeScript definitions
```

---

## Architecture Decisions

### Why Zustand over Redux?
- Simpler API with less boilerplate
- Built-in persistence middleware for offline support
- Better TypeScript inference out of the box
- Smaller bundle size (~1KB vs ~10KB)

### Why Supabase?
- PostgreSQL reliability with real-time subscriptions
- Built-in authentication with OAuth providers
- Row-level security for data protection
- Generous free tier for personal projects

### Why App Router?
- Server Components for better initial load performance
- Streaming and Suspense support
- Improved data fetching patterns
- Built-in layouts and loading states

---

## Security

- **Input Validation** - Zod schemas at all system boundaries
- **XSS Prevention** - Sanitized outputs and CSP headers
- **Open Redirect Protection** - Validated redirect URLs
- **Secure Authentication** - httpOnly cookies, CSRF protection
- **Row-Level Security** - Database-enforced access control

---

## Testing

The project includes comprehensive E2E tests covering:

- Authentication flows (login, signup, OAuth)
- Protected route redirects
- Landing page interactions
- Security header validation

```bash
# Run all tests
npm run test

# Run tests in UI mode
npx playwright test --ui
```

---

## Deployment

The app can be deployed on [Vercel](https://vercel.com) with automatic deployments from the main branch.

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Vercel](https://vercel.com) for hosting and deployment
- [Supabase](https://supabase.com) for the backend infrastructure
