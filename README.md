# WISTORIA — Luxury Fashion Portal (Full Stack)

This project is an exact recreation of **Page 01 (Desktop & Mobile Homepage)** for the luxury fashion brand **WISTORIA**, built as a full-stack web application with React (Vite) and Node.js (Express).

---

## 🎨 Page 01 Design Specifications & Implementation

| Spec # | Feature | Details & Implementation |
|---|---|---|
| **01** | **Shipping Message** | White top announcement bar with clean centered text: `Free shipping for orders over $300`. Dynamic threshold synced with backend API. |
| **02** | **WISTORIA Logo** | Centered high-contrast luxury serif logo typography in crisp white, floating seamlessly over the dark campaign photography. |
| **03** | **Menu** | Fine 3-line hamburger icon on the top-left opening a sliding navigation drawer with runway collections, ready-to-wear categories, and atelier details. |
| **04** | **Search** | Fine minimalist magnifying glass icon opening a live search panel with search input, trending keywords, and instant product results. |
| **05** | **Shopping Bag** | Fine luxury tote bag icon on the far right with item badge count. Opens the shopping drawer with dynamic cart items, quantity stepper, free shipping progress bar, and checkout CTA. |
| **06** | **Slideshow** | Left and right minimal chevron arrows (`<` and `>`) to cycle through runway campaign looks with smooth crossfade and touch-swipe gestures on mobile. |
| **07** | **Image Fit** | Desktop composition fills the frame without stretching; Mobile fits original photo to device width with no horizontal overflow. |

---

## 🚀 Architecture

- **Frontend**: React 19 + Vite, custom Vanilla CSS design system, Bodoni Moda & Cinzel typography.
- **Backend**: Node.js + Express REST API (`server/server.js`) serving:
  - `/api/announcement` — Dynamic shipping threshold & message
  - `/api/slides` — Campaign slideshow imagery and metadata
  - `/api/navigation` — Maison categories and runway links
  - `/api/products` — Product catalog
  - `/api/search` — Instant keyword search
  - `/api/cart` — Dynamic shopping bag calculations & free shipping meter

---

## 🛠️ How to Run

### Option 1: Start both servers individually
```bash
# 1. Start the Node.js backend
cd server
npm start

# 2. In another terminal, start the React client
cd client
npm run dev
```

The client will be running at [http://localhost:3000](http://localhost:3000) and proxies API requests to the backend at [http://localhost:5000](http://localhost:5000).
