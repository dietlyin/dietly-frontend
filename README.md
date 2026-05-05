# Dietly — Premium Fitness Meal Subscription

A full-stack fitness meal subscription platform built with **React + Vite** (frontend) and **Express + MongoDB** (backend). Dark-themed, mobile-responsive, and production-ready.

---

## Tech Stack

| Layer    | Technology                                          |
| -------- | --------------------------------------------------- |
| Frontend | React 18, Vite 6, Tailwind CSS 3, Framer Motion 11 |
| Backend  | Express 5, MongoDB (Mongoose 9), JWT Auth           |
| Deploy   | Vercel (backend `vercel.json` included)             |

---

## Project Structure

```
Dietly/
├── frontend/                   React SPA
│   ├── index.html              Entry HTML
│   ├── vite.config.js          Vite config (dev port 3000)
│   ├── tailwind.config.js      Tailwind theme (brand-green, fonts)
│   └── src/
│       ├── main.jsx            React root mount
│       ├── App.jsx             App shell + AuthProvider
│       ├── index.css           Global styles + utility classes
│       ├── assets/
│       │   ├── dietly-logo.png Logo
│       │   └── dietly/         Food images (17 photos)
│       ├── components/
│       │   ├── Navbar.jsx      Fixed nav + mobile fullscreen menu
│       │   ├── Hero.jsx        Hero section (text + image layout)
│       │   ├── HeroImage.jsx   Reusable hero image with glow effect
│       │   ├── Features.jsx    4-card feature grid with food images
│       │   ├── Gallery.jsx     9-image responsive grid (Our Menu)
│       │   ├── ImageCard.jsx   Reusable image card with hover zoom
│       │   ├── PlansSlider.jsx Animated plan carousel with images
│       │   ├── HowItWorks.jsx  4-step process cards
│       │   ├── Testimonials.jsx Rotating testimonial carousel
│       │   ├── CTA.jsx         Call-to-action banner
│       │   ├── Footer.jsx      Footer with links + contact
│       │   └── AuthModal.jsx   Login/Register modal
│       ├── context/
│       │   └── AuthContext.jsx  JWT auth state management
│       ├── hooks/
│       │   └── useAPI.js       Generic data-fetching hook
│       ├── pages/
│       │   └── Home.jsx        Main page composing all sections
│       └── services/
│           └── api.js          Axios client + API endpoints
│
├── backend/                    REST API
│   ├── api/index.js            Vercel serverless entry
│   ├── vercel.json             Vercel deployment config
│   └── src/
│       ├── server.js           Express server + middleware
│       ├── config/db.js        MongoDB connection
│       ├── controllers/        Route handlers
│       ├── middleware/          Auth + validation middleware
│       ├── models/             Mongoose schemas
│       ├── routes/             Express routers
│       └── seeders/seed.js     Database seeder
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas connection string)

### 1. Clone & Install

```bash
git clone <repo-url> Dietly
cd Dietly

# Install frontend
cd frontend
npm install

# Install backend
cd ../backend
npm install
```

### 2. Environment Variables

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/dietly
JWT_SECRET=your_jwt_secret_here
```

Optionally create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Seed Database (Optional)

```bash
cd backend
npm run seed
```

### 4. Run Development Servers

**Backend:**
```bash
cd backend
npm run dev          # Runs on http://localhost:5000
```

**Frontend:**
```bash
cd frontend
npm run dev          # Runs on http://localhost:3000
```

Open **http://localhost:3000** in your browser.

### 5. Production Build

```bash
cd frontend
npm run build        # Output in frontend/dist/
```

---

## Sections & Features

| Section       | Description                                      |
| ------------- | ------------------------------------------------ |
| **Navbar**    | Fixed, transparent → blur on scroll, mobile menu |
| **Hero**      | Two-column layout: text + food image             |
| **Features**  | 4 cards with food photos, icons, descriptions    |
| **Gallery**   | 9-image responsive grid (1/2/3 columns)          |
| **Plans**     | Animated carousel with plan images & pricing     |
| **How It Works** | 4-step process with connector lines           |
| **Testimonials** | Auto-rotating review carousel                 |
| **CTA**       | Full-width call-to-action banner                 |
| **Footer**    | Links, contact info, social icons                |
| **Auth**      | Login/Register modal with JWT                    |

---

## Responsive Breakpoints

| Breakpoint | Width   | Layout Behavior                             |
| ---------- | ------- | ------------------------------------------- |
| Mobile     | < 640px | Single column, stacked sections, touch-friendly |
| Tablet     | 640–1024px | 2-column grids, side-by-side buttons      |
| Desktop    | > 1024px | Full layout, 3–4 column grids, side hero image |

---

## API Endpoints

| Method | Endpoint              | Description              |
| ------ | --------------------- | ------------------------ |
| POST   | `/api/auth/register`  | Register new user        |
| POST   | `/api/auth/login`     | Login                    |
| GET    | `/api/auth/me`        | Get current user         |
| GET    | `/api/plans`          | List all plans           |
| GET    | `/api/meals`          | List meals               |
| GET    | `/api/testimonials`   | List testimonials        |
| GET    | `/api/faqs`           | List FAQs                |
| GET    | `/api/stats`          | Site statistics          |
| POST   | `/api/orders`         | Create order             |
| POST   | `/api/contact`        | Submit contact form      |
| POST   | `/api/gym-partnership/apply` | Gym partnership app |

---

## Food Images

All meal photos are in `frontend/src/assets/dietly/`:

- Paneer Bhurji, Paneer Paratha
- Masala Chana/Matki/Moong Sprouts, Boiled variants
- Banana Shake, Chocolate Banana Shake
- Malai Dahi, Kaccha Chivda, Masala Mashed Potato

Images use `object-cover`, fixed aspect ratios, `rounded-xl`, and lazy loading throughout.

---

## Design System

- **Colors:** `brand-green` (#22c55e), neutral-950 dark background
- **Fonts:** Inter (body), Space Grotesk (headings)
- **Cards:** `#141414` bg, 1px white/6% border, 1rem radius
- **Animations:** Framer Motion scroll-triggered + hover effects
- **Accessibility:** `prefers-reduced-motion` support, ARIA labels

---

## License

ISC
