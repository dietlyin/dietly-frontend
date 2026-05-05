# Dietly — Fitness Meal Subscription Website

> Always read this README before making any changes.

## Overview

Dietly is a clean, professional fitness meal subscription landing page built with React + Vite + Tailwind CSS. It connects to a Node.js/Express backend API for plans, testimonials, and authentication.

**Live URL:** https://frontend-eight-peach-93.vercel.app  
**Backend API:** https://backend-gules-zeta-65.vercel.app/api

---

## Folder Structure

```
src/
├── components/
│   ├── Navbar.jsx         # Fixed top nav, mobile menu, auth CTA
│   ├── Hero.jsx           # Main hero section with headline + stats
│   ├── Features.jsx       # 4-card feature grid
│   ├── PlansSlider.jsx    # Auto-rotating plan card carousel
│   ├── HowItWorks.jsx     # 4-step process section
│   ├── Testimonials.jsx   # Customer testimonial carousel
│   ├── CTA.jsx            # Final call-to-action banner
│   ├── Footer.jsx         # Footer with links, contact, socials
│   └── AuthModal.jsx      # Login/Register modal
│
├── pages/
│   └── Home.jsx           # Assembles all sections in order
│
├── context/
│   └── AuthContext.jsx     # Auth state (login, register, logout)
│
├── hooks/
│   └── useAPI.js           # Generic data-fetching hook with fallbacks
│
├── services/
│   └── api.js              # Axios instance + API endpoint functions
│
├── assets/
│   └── dietly-logo.png     # Brand logo
│
├── App.jsx                 # Root component (AuthProvider + Home)
├── main.jsx                # React DOM entry point
└── index.css               # Global styles (Tailwind + utilities)
```

---

## Design Principles

1. **Clean UI only** — No glassmorphism, no aurora backgrounds, no grain overlays
2. **No blur misuse** — Only use backdrop-blur on the navbar when scrolled (subtle)
3. **No glitch effects** — No particles, neon borders, shimmer animations, or grain noise
4. **Solid backgrounds** — Cards use solid `#141414` bg with subtle borders
5. **Readable text** — High contrast white on dark, with neutral-400/500 for secondary
6. **Minimal animations** — Simple fade-in and slide-up via Framer Motion. No 3D transforms
7. **Consistent spacing** — `section-spacing` utility for all sections (py-20 to py-28)
8. **Proper typography** — Inter for body, Space Grotesk for headings. Nothing else

---

## Colors

| Token          | Value     | Usage                    |
|---------------|-----------|--------------------------|
| neutral-950    | `#0a0a0a` | Page background          |
| `#141414`      | —         | Card backgrounds         |
| white          | `#ffffff` | Primary text             |
| neutral-400    | —         | Secondary text           |
| neutral-500    | —         | Muted text               |
| brand-green    | `#22c55e` | Primary accent (CTA, highlights) |
| brand-green-light | `#4ade80` | Hover state for green  |

---

## Component Breakdown

### Navbar
Fixed position. Transparent → solid bg on scroll. Desktop links + mobile fullscreen menu. Auth button opens AuthModal.

### Hero
Left-aligned headline "Fuel Your Fitness Journey" with subtext, 2 CTA buttons (primary + secondary), trust stats row at bottom.

### Features
4-column grid with icon + title + description cards. Solid card backgrounds with green icon accents.

### PlansSlider
Single card auto-rotating every 4 seconds through Basic → Standard → Premium. Dot indicators. Arrow navigation. Smooth fade transition.

### HowItWorks
4-step numbered grid with icons. Clean cards. Desktop connector lines between steps.

### Testimonials
Auto-rotating testimonial carousel. Star ratings, quote text, author info. Simple dot + arrow navigation.

### CTA
Full-width card with centered headline, subtext, and primary CTA button. Subtle green accent glow.

### Footer
5-column grid: brand info + 3 link columns. Contact details. Social icons. Copyright bar.

---

## How to Run

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Environment variable for API:
```
VITE_API_URL=https://backend-gules-zeta-65.vercel.app/api
```

---

## Rules for Future AI Edits

1. **Always read this README first** before making any changes
2. **Never add** glassmorphism, grain overlays, aurora backgrounds, particles, or neon borders
3. **Never add** heavy blur effects on sections or cards
4. **Keep animations minimal** — fade-in and slide-up only. No 3D transforms, no parallax
5. **Use solid backgrounds** for cards (#141414) — no gradient backgrounds or backdrop-filter
6. **Maintain the color palette** — neutral-950 bg, brand-green accent, white text
7. **Test mobile** — every change must look good on 375px width
8. **Keep the component structure** — one component per section, assembled in Home.jsx
9. **Don't add new fonts** — Inter + Space Grotesk only
10. **Don't over-engineer** — simple, clean, readable code

---

## Tech Stack

- **React 18** + **Vite 6**
- **Tailwind CSS 3**
- **Framer Motion** (minimal usage)
- **Lucide React** (icons)
- **Axios** (API calls)
- **Vercel** (deployment)
