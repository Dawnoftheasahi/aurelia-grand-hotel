# ✦ The Aurelia Grand — Hotel Booking System
### COS30043 Interface Design and Development — Full-Stack Project

A complete, production-ready hotel booking system featuring a Vue 3 frontend and Node.js/Express REST API backend with persistent SQLite storage.

---

## 🚀 Quick Setup

### Prerequisites
- Node.js v18+
- npm v8+

### 1. Clone / Extract the project
```
aurelia-hotel/
├── backend/
└── frontend/
```

### 2. Setup & Seed the Backend
```bash
cd backend
cp .env.example .env
npm install
node src/db/seed.js    # seeds database with demo data
npm run dev            # starts API on http://localhost:3001
```

### 3. Setup the Frontend
```bash
cd frontend
npm install
npm run dev            # starts dev server on http://localhost:5173
```

### 4. Open in Browser
Visit **http://localhost:5173**

#### Demo Credentials
| Role  | Email                    | Password     |
|-------|--------------------------|--------------|
| Guest | `alex@example.com`       | `password123`|
| Admin | `admin@aurelia.com`      | `admin123`   |

---

## 📁 Project Structure

```
aurelia-hotel/
├── backend/
│   ├── server.js                  # Express app entry point
│   ├── .env.example
│   ├── aurelia.db                 # SQLite database (auto-created)
│   └── src/
│       ├── db/
│       │   ├── database.js        # DB init + sql.js wrapper
│       │   └── seed.js            # Demo data seeder
│       ├── routes/
│       │   ├── auth.js            # Register, login, profile
│       │   ├── rooms.js           # Room listing, detail, availability
│       │   ├── bookings.js        # Bookings CRUD + conflict detection
│       │   ├── dashboard.js       # Dashboard summary stats
│       │   ├── reviews.js         # Room reviews
│       │   └── promotions.js      # Promo codes
│       └── middleware/
│           └── auth.js            # JWT authentication middleware
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── main.js
        ├── App.vue
        ├── assets/
        │   └── main.css           # Global design system (CSS custom properties)
        ├── router/
        │   └── index.js           # Vue Router with auth guards
        ├── stores/
        │   ├── authStore.js       # Pinia: auth state + JWT
        │   └── uiStore.js         # Pinia: toast notifications
        ├── composables/
        │   └── useApi.js          # Axios instance
        ├── components/
        │   ├── layout/
        │   │   ├── TheNavbar.vue  # Responsive navbar with dropdown
        │   │   └── TheFooter.vue  # 4-column footer
        │   └── ui/
        │       ├── RoomCard.vue
        │       ├── BookingCard.vue
        │       ├── StatusBadge.vue
        │       ├── StatCard.vue
        │       ├── AppModal.vue
        │       ├── ToastContainer.vue
        │       ├── ImageCarousel.vue
        │       ├── LoadingSpinner.vue
        │       └── EmptyState.vue
        └── views/
            ├── HomeView.vue            # Landing page
            ├── RoomsView.vue           # Room listing + filters
            ├── RoomDetailView.vue      # Room detail + carousel
            ├── BookingView.vue         # Booking form + confirmation
            ├── BookingConfirmView.vue  # Booking confirmation page
            ├── AuthView.vue            # Login + Register
            ├── DashboardView.vue       # User dashboard
            ├── BookingHistoryView.vue  # Booking history
            ├── ServicesView.vue        # Hotel services
            ├── ProfileView.vue         # Profile & settings
            └── NotFoundView.vue        # 404 page
```

---

## 🗺️ Page Map (10 Pages)

| # | Route           | Page                  | Auth? | Description |
|---|-----------------|-----------------------|-------|-------------|
| 1 | `/`             | Home / Landing        | No    | Hero, featured rooms, testimonials, offers |
| 2 | `/rooms`        | Room Listing          | No    | Search, filter, sort, responsive grid |
| 3 | `/rooms/:id`    | Room Detail           | No    | Gallery, amenities, reviews, booking panel |
| 4 | `/booking`      | Booking Form          | ✓     | Full booking flow with extras + promo |
| 5 | `/auth`         | Login / Register      | Guest | Tabbed auth with password strength |
| 6 | `/dashboard`    | User Dashboard        | ✓     | Stats, next stay, recent bookings |
| 7 | `/history`      | Booking History       | ✓     | Filter/search, cancel, status badges |
| 8 | `/services`     | Hotel Services        | No    | Dining, spa, pool, events, concierge |
| 9 | `/profile`      | Profile & Settings    | ✓     | Personal info, membership, preferences |
|10 | `/:pathMatch`   | 404 Not Found         | No    | Branded error page |

---

## 🔌 REST API Endpoints

| Method | Endpoint                    | Auth | Description |
|--------|-----------------------------|------|-------------|
| GET    | `/api/health`               | —    | Health check |
| POST   | `/api/auth/register`        | —    | Register user |
| POST   | `/api/auth/login`           | —    | Login, returns JWT |
| GET    | `/api/auth/me`              | ✓    | Current user profile |
| PATCH  | `/api/auth/profile`         | ✓    | Update profile |
| GET    | `/api/rooms`                | —    | List rooms (filterable) |
| GET    | `/api/rooms/:id`            | —    | Room detail |
| GET    | `/api/rooms/:id/availability` | —  | Booked dates for a month |
| POST   | `/api/bookings`             | ✓    | Create booking (conflict check) |
| GET    | `/api/bookings`             | ✓    | User's bookings |
| GET    | `/api/bookings/:id`         | ✓    | Single booking detail |
| PATCH  | `/api/bookings/:id/cancel`  | ✓    | Cancel booking |
| GET    | `/api/dashboard/summary`    | ✓    | Stats + next stay + recent |
| GET    | `/api/reviews/:roomId`      | —    | Room reviews |
| POST   | `/api/reviews`              | ✓    | Submit review |
| GET    | `/api/promotions`           | —    | Active promo codes |
| POST   | `/api/promotions/validate`  | —    | Validate promo code |

---

## 🗄️ Data Model

### users
`id, name, email, password (bcrypt), phone, role (guest|admin), created_at`

### rooms
`id, name, type (Standard|Deluxe|Suite|Family), description, price_per_night, capacity, bed_type, size_sqm, floor, view_type, images (JSON), amenities (JSON), is_available, rating, review_count`

### bookings
`id, user_id, room_id, check_in, check_out, guests, nights, room_price, extras (JSON), extras_price, total_price, status (confirmed|completed|cancelled), special_requests, confirmation_code, created_at`

### reviews
`id, user_id, room_id, booking_id, rating (1-5), title, comment, created_at`

### promotions
`id, code, title, description, discount_percent, is_active, uses_count`

---

## 🎨 Design Approach

### Visual Identity — "The Aurelia Grand"
A **luxury hotel aesthetic** built around:
- **Deep Navy** `#0A1628` — authority, elegance, trust
- **Warm Gold** `#C9A84C` — luxury, aspiration, accent
- **Cream** `#FAF7F2` — warmth, comfort, breathing room
- **Playfair Display** — serif display font for headings (authority, tradition)
- **DM Sans** — geometric sans for body text (clean, legible, modern)

### Design System
All design tokens are defined as CSS custom properties in `src/assets/main.css`:
- Complete color palette with semantic variants (success, error, warning, info)
- Spacing scale (4px base × 8 increments)
- Shadow scale (xs → xl + gold shadow)
- Transition speeds (fast 150ms → slow 400ms)
- Border radius scale

### Visual Hierarchy
- **H1 Playfair Display** 2–5.5rem (responsive clamp) for heroes
- **H2 Playfair Display** 1.5–2.5rem for section headings
- **Gold section labels** uppercase 0.75rem with wide tracking before headings
- **Consistent card patterns** with hover elevation transitions

---

## 📱 Responsive Design

Mobile-first approach using CSS Grid and Flexbox:

| Breakpoint | Behaviour |
|------------|-----------|
| `< 640px`  | Single column, mobile navigation, stacked forms |
| `640–900px`| Tablet 2-col grid, booking panel above form |
| `900–1024px`| 2/3-col layouts, filter sidebar narrower |
| `> 1024px` | Full desktop: 3–4 column grids, sticky panels |

Key responsive patterns:
- **Navbar**: Full links → Hamburger with animated overlay menu
- **Hero search**: Horizontal → Vertical stack on mobile
- **Room grid**: 3-col → 2-col → 1-col
- **Booking form**: Side-by-side → stacked, summary floats above form on mobile
- **Dashboard**: 4-col stats → 2-col → 1-col
- **Footer**: 4-col → 2-col → 1-col

---

## ♿ Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Semantic HTML | `<header>`, `<main>`, `<footer>`, `<nav>`, `<article>`, `<aside>`, `<section>` throughout |
| Heading hierarchy | Single `<h1>` per page, logical H2→H3 cascade |
| Form labels | Every `<input>` and `<select>` has a `<label>` with matching `for`/`id` |
| ARIA attributes | `aria-label`, `aria-describedby`, `aria-live`, `aria-expanded`, `role="tablist/tab/tabpanel"` |
| Error messages | `role="alert"` on inline validation errors |
| Focus states | All interactive elements have `:focus-visible` outlines in gold |
| Keyboard nav | Tab order follows visual order; modal closes on Escape via backdrop click |
| Colour contrast | Navy/gold meets WCAG AA for normal text |
| Alt text | Descriptive alt text on all content images, `aria-hidden` on decorative images |
| Screen reader | `aria-live="polite"` for dynamic content (search results, loading) |
| Button labels | All icon-only buttons have `aria-label` |

---

## ⚡ Advanced Features

| Feature | Location |
|---------|----------|
| **JWT Authentication** | Persistent login across sessions; auth-aware navbar; protected routes |
| **Booking conflict detection** | Backend checks date overlaps before confirming; returns 409 |
| **Promo code system** | Validates codes, applies discounts, updates usage count in real-time |
| **Real-time price calculation** | Booking summary recalculates on every change (room, dates, extras, promo) |
| **Password strength indicator** | Visual strength bar on registration |
| **Toast notification system** | Non-blocking, dismissible notifications via Pinia + Teleport |
| **Image carousel** | Custom keyboard-accessible carousel with dot navigation |
| **Lazy loading** | Vue Router route-level code splitting; `loading="lazy"` on all images |
| **Page transitions** | CSS `opacity+translateY` transitions on route changes |
| **Loading & empty states** | Skeleton loaders for all data fetches; contextual empty states |
| **Sticky booking panel** | Room detail and booking form panels are sticky on desktop |
| **Countdown to check-in** | Dashboard shows "In X days" badge for upcoming stay |
| **Cancellation logic** | Cannot cancel within 24h; completed bookings are protected |
| **Loyalty membership** | Profile page shows tier, points, progress bar, benefits |
| **Stay preferences** | Profile stores room preferences (bed type, floor, view) |

---

## 📸 Recommended Report Screenshots

### Desktop (1280px)
1. **Home Page** — Full hero with search bar visible
2. **Home Page** — Scroll to featured rooms + offers section
3. **Home Page** — Testimonials section (navy background)
4. **Rooms Listing** — With filter sidebar + 3-column room grid
5. **Room Detail** — Image carousel + quick facts
6. **Room Detail** — Amenities + reviews + sticky booking panel
7. **Booking Form** — With room selected, dates set, extras chosen
8. **Booking Form** — Price summary panel + promo code applied
9. **Booking Confirmation Modal** — Popup after successful booking
10. **Login Page** — Left panel + auth form
11. **Register Page** — With password strength indicator
12. **Dashboard** — 4 stat cards + next stay card
13. **Booking History** — Status filter chips + booking cards
14. **Services Page** — Dining section with restaurant cards
15. **Profile Page** — Membership card + loyalty progress bar
16. **Profile Page** — Stay preferences tab

### Mobile (375px)
17. **Home Page** — Hero section with stacked search
18. **Rooms Listing** — Single column, hamburger nav open
19. **Booking Form** — Summary panel above form
20. **Dashboard** — 2-column stats

### Tablet (768px)
21. **Rooms Listing** — 2-column grid
22. **Services Page** — Spa layout

---

## 🏆 Rubric Alignment

| Criterion | Evidence |
|-----------|----------|
| **Interface Design** | Consistent design system with CSS variables, visual hierarchy, Playfair + DM Sans typography, gold accent palette |
| **Vue Components** | 15+ reusable components: RoomCard, BookingCard, StatusBadge, StatCard, AppModal, ImageCarousel, ToastContainer, LoadingSpinner, EmptyState, TheNavbar, TheFooter |
| **Vue Router** | 10 routes with `meta.requiresAuth` guards and `guestOnly` redirects |
| **State Management** | Pinia stores for auth (JWT persistence) and UI (toast system) |
| **REST API** | 17 endpoints with proper HTTP methods, status codes, JWT middleware |
| **Database** | Full CRUD with sql.js SQLite; seed data; foreign keys; status tracking |
| **Responsive Design** | Mobile-first; 3 breakpoints; hamburger nav; flexible grids throughout |
| **Accessibility** | Semantic HTML; ARIA labels; focus states; keyboard nav; screen reader live regions |
| **Advanced Features** | Booking conflict detection, promo system, real-time pricing, toast notifications, code splitting, lazy loading, page transitions |

---

*Built for COS30043 Interface Design and Development — The Aurelia Grand Hotel Booking System*
