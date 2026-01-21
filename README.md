<div align="center">
  <br />
  <br />
    <a href="https://github.com/unisone/jobtrack-portfolio" target="_blank">
      <img src="https://img.shields.io/badge/Job_Hunt_Tracker-2.0-blueviolet?style=for-the-badge" alt="Project Badge">
    </a>
  <br />

  <h1 align="center">JobTrack Portfolio</h1>

  <div align="center">
    <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  </div>

  <br />

  <div align="center">
    <img src="public/demo.webp" alt="High-Fidelity Cinematic Demo" width="100%" style="border-radius: 12px; border: 1px solid #333;" />
  </div>
</div>

<br />

## The Engineering Behind the UI

This project is not just a portfolio; it is an exploration of **Kinetic Architecture** and **Spatial Design**. Every interaction is engineered to feel weightless yet significant, bridging the gap between functional utility and artistic expression.

### 🍱 Bento Grid Architecture
The visual foundation is built on a strict **8pt fluid grid system**, implemented via a modular Bento Grid architecture.
- **Composition**: Deconstructed into atomic cells (`bento-grid.tsx`, `bento-card.tsx`), allowing for infinite layout permutations while maintaining visual harmony.
- **Responsiveness**: A math-based scaling logic ensures perfect alignment across all viewports, preserving the Golden Ratio constraints.

### 🎭 Motion Orchestration
We utilize **Scroll-Driven Storytelling** to guide the user's attention.
- **Timeline Synchronization**: Leveraging `Lenis` for smooth momentum scrolling, we sync animation timelines to the scroll position, creating a deterministic yet fluid experience.
- **Micro-Interactions**: Hover states are not binary; they are physics-based using `Framer Motion` springs, giving elements a tactile "magnetic" feel.

### 💎 Glassmorphism 2.0
Moving beyond basic opacity, our **Glassmorphism 2.0** engine acts as a dynamic optical layer.
- **Layered Depth**: utilizing backdrop filters, noise textures, and gradient borders to simulate light refraction (`glass-notification-stack.tsx`).
- **Performance**: Heavy composite layers are isolated to ensuring 60fps+ rendering even with complex blur calculations.

<br />

## Technologies

<div align="center">

| Core Framework | Database & Auth | Styling & Motion | UX Components |
|:---:|:---:|:---:|:---:|
| ![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white) | ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white) | ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) | ![Radix UI](https://img.shields.io/badge/Radix_UI-161618?style=for-the-badge&logo=radix-ui&logoColor=white) |
| ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white) | ![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white) | ![Lucide](https://img.shields.io/badge/Lucide-black?style=for-the-badge&logo=lucide&logoColor=white) |

</div>

### Core Pillars
*   **⚡ Performance**: 60fps+ rendering through heavy composite layer isolation and hardware-accelerated transforms.
*   **🎨 Design Systems**: A strict 8pt fluid grid system adhering to Golden Ratio constraints for visual harmony.

<br />

## 🎭 The Showcase

### 1. Magnetic Micro-Interactions
The hero section features "magnetic" input fields and buttons using custom physics-based springs, creating a tactile connection with the cursor.
<div align="center">
  <img src="public/hero-feature.webp" alt="Magnetic Interactions" width="100%" style="border-radius: 8px; border: 1px solid #333;" />
</div>

### 2. Kinetic Bento Grid
A responsive grid system where every card breathes. Features dynamic line-graph drawing and interactive ticker tapes for real-time market data visualization.
<div align="center">
  <img src="public/bento-feature.webp" alt="Bento Grid Mechanics" width="100%" style="border-radius: 8px; border: 1px solid #333;" />
</div>

### 3. Orchestrated Entrance & Scroll
Leveraging `Lenis` for smooth momentum, elements cascade into view with deterministic timing, creating a cinematic narrative flow.
<div align="center">
  <img src="public/scroll-feature.webp" alt="Scroll Dynamics" width="100%" style="border-radius: 8px; border: 1px solid #333;" />
</div>

<br />

## 🚀 Features

**Prerequisites**: Node.js 18+

```bash
# Clone the repository
git clone https://github.com/unisone/jobtrack-portfolio.git

# Navigate to project root
cd jobtrack-portfolio

# Install dependencies (pnpm recommended)
pnpm install
# or
npm install

# Start the development server
pnpm dev
```

<br />

## Let's Connect

<div align="center">
  <p>Open to opportunities in Frontend Engineering and Design Systems.</p>

  <a href="https://www.linkedin.com/in/unisone/">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />
  </a>
  <a href="https://twitter.com/unisone">
    <img src="https://img.shields.io/badge/X-000000?style=for-the-badge&logo=x&logoColor=white" alt="X/Twitter" />
  </a>
  <a href="https://jobtrack-portfolio.vercel.app/">
    <img src="https://img.shields.io/badge/Portfolio-Active-success?style=for-the-badge&logo=google-chrome&logoColor=white" alt="Portfolio" />
  </a>

  <br /> <br />
  
  <a href="mailto:contact@example.com">
    <img src="https://img.shields.io/badge/Recruiters-Get_in_Touch-important?style=for-the-badge&logo=maildotru&logoColor=white" alt="Get in Touch" />
  </a>
</div>
