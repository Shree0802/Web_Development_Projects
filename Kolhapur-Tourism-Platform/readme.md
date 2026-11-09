# 🏰 Kolhapur Travel & Tourism Platform
### Complete TRIVVIU-Inspired Travel Website Redesign & Modern Full-Stack Web Platform

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-blue.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-0878D1.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-Bundler-orange.svg)](https://vitejs.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248.svg)](https://www.mongodb.com/)
[![AI-Powered](https://img.shields.io/badge/AI-Google%20Gemini%20%7C%20OpenAI-FF7900.svg)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v3.4-0878D1.svg)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-OpenStreetMap-FF7900.svg)](https://leafletjs.com/)
[![Tests](https://img.shields.io/badge/QA%20Tests-87%20Passed%20(100%25)-brightgreen.svg)](#-automated-testing--qa-verification)

---

## 🌍 Executive Overview

Welcome to the **Kolhapur Tourism Discovery & Travel Planning Platform** — an end-to-end, commercial-grade travel discovery, interactive planning, AI-assisted guidance, and tour booking portal dedicated to **Kolhapur, Maharashtra, India** (reverently celebrated as *Dakshin Kashi*).

The entire user interface and architecture has been transformed following the visual direction, layout philosophy, and interface style of modern travel reference designs (**TRIVVIU**):
- **Clean White Navigation Bar**: Sticky, horizontal alignment, active underline in bright blue (`#0878D1`), dropdown menus, and orange CTA (`#FF7900`).
- **Dynamic 4-Slide Scenic Hero Section**: Full-width high-resolution destination photography (New Palace, Panhala Fort, Kopeshwar Temple, Rankala Lake) with auto-crossfade, location badges, slider controls, and left-aligned bold white typography.
- **Floating 4-Field Search Panel**: Positioned overlapping the bottom of the hero with Location, Trip Type, Duration, Price filters, and an orange Search button.
- **Verified Cultural Heritage Photography**: Authentic, high-resolution imagery for Kolhapuri Misal, GI-Tagged Kolhapuri Chappals, historic Maratha fortresses, and red-mud Kushti wrestling.
- **Top Destinations (4:5 Aspect Ratio)**: Visual destination cards with text overlays on the photographs, category pills, review ratings, and favorite heart buttons.
- **Real AI Tourism Assistant ('Shahu Margdarshak')**: Grounded in verified Kolhapur knowledge, answers visitor questions in real time with quick-prompt chips.
- **AI-Powered Travel Route Builder**: Day-by-day customized travel itinerary generation with time slots, driving distances, budget breakdown, and PDF export.
- **Dual-Layer Database Architecture**: Real MongoDB via Mongoose with dual-persistence fallback to JSON persistence.

---

## 🎨 Color System & Design Tokens

| Token Name | Hex Code | Usage |
| :--- | :--- | :--- |
| **Primary Blue** | `#0878D1` | Brand identity, primary links, icons, active tab underlines, badges |
| **Secondary Blue** | `#1267B0` | Hover states, interactive highlights |
| **Primary Orange** | `#FF7900` | Primary action buttons, CTA triggers, search button, hero accents |
| **Dark Text** | `#17243A` | Primary typography, footers, dark hero backdrops |
| **Secondary Text** | `#6B7280` | Supporting text, captions, metadata |
| **Background** | `#FFFFFF` | Main page backgrounds, cards |
| **Light Background**| `#F5F8FC` | Alternate sections, input backgrounds, filter bars |
| **Border** | `#E5E7EB` | Subtle structural borders and dividers |

---

## 🧠 Real AI Integration

The platform features a multi-tiered AI architecture in `server/src/services/aiService.js`:
- **Supported Providers**: Google Gemini API (`GEMINI_API_KEY`) and OpenAI API (`OPENAI_API_KEY`).
- **Ground-Truth Knowledge Base**: System prompts inject verified Kolhapur facts (temple darshan hours, Kiranotsav solar phenomenon, ticket prices, Panhala fort granaries, authentic Phadtare/Bawada Misal spots, vegetable-tanned leather sandals on Mahadwar Road, red-soil wrestling talims).
- **Graceful Deterministic Fallback**: In the absence of an API key or during network latency, an expert local rule engine generates identical structured responses with 0 failure rate.
- **Interactive UI**: Floating chat widget accessible on every page with quick-prompt suggestions.

---

## 🍃 MongoDB Schemas & Database Layer

The database layer (`server/src/models/` and `server/src/config/db.js`) connects to MongoDB with automatic reconnection and graceful fallback:
1. **User**: Name, email, hashed password, role (`user`/`admin`), phone, city, avatar.
2. **Destination**: Slug ID, Marathi/English names, category, description, history, coordinates, gallery, timings, entry fee, rating.
3. **Hotel**: Slug ID, property type, tariff, address, coordinates, amenities, room types, verified badge.
4. **Tour**: Package title, duration, days count, inclusions/exclusions, day-by-day itinerary, price.
5. **Booking**: Unique reference code (`KOL-2026-XXXX`), travel dates, guest count, contact details, payment mode, status.
6. **Review**: Target destination/hotel ID, reviewer name, rating (1-5), comments, verified visit badge.
7. **Wishlist**: User ID, target ID, target type, synchronized with local storage.
8. **Itinerary**: User ID, days count, pace, budget, activities, AI-generated flag.
9. **ContactMessage**: Customer inquiries, subject, resolution status.
10. **FoodItem & CultureItem**: Authentic culinary recipes, famous eateries, and GI-tagged crafts.

---

## 🚀 Running the Project Locally

### Prerequisites
- Node.js (v18.0 or higher)
- npm (v9.0 or higher)
- MongoDB (Optional: Local service on port 27017 or MongoDB Atlas URI)

### Quickstart

```bash
# 1. Install root, server, and client dependencies
npm run install:all

# 2. Seed MongoDB with authentic Kolhapur records
npm run seed:mongo

# 3. Build the frontend client
cd client && npm run build && cd ..

# 4. Start the production server (serves frontend SPA & API on port 5000)
npm run start
```
Open your browser to: **`http://localhost:5000`**

### Development Mode (Concurrent Live Reload)

```bash
# Terminal 1: Backend API (port 5000)
cd server
npm run dev

# Terminal 2: Vite Dev Server (port 5173)
cd client
npm run dev
```
Open your browser to: **`http://localhost:5173`**

---

## 🧪 Automated Testing & QA Verification

The codebase includes two automated end-to-end test suites:

### 1. Backend API & Database Test Suite (`tests/api-test.cjs`)
Runs 46 comprehensive tests covering Authentication, Authorization, Destinations, Hotels, Tours, Bookings, Reviews, Inquiries, Weather, AI Itinerary, and AI Chat:
```bash
node tests/api-test.cjs
```
> **Result**: `46/46 Passed (100.0%)`

### 2. Browser End-to-End Test Suite (`tests/e2e-browser-test.cjs`)
Runs 41 browser tests via Playwright covering all 21 routes, interactive user flows, cultural photography integrity, AI chat assistant, and 8 responsive viewports (320px to 1920px):
```bash
node tests/e2e-browser-test.cjs
```
> **Result**: `41/41 Passed (100.0%)`, 35 visual screenshots saved in `tests/screenshots/`.

---

## 🔑 Demo Login Credentials

For testing user and admin workflows, convenient 1-click buttons are embedded directly in the Sign In modal:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Administrator** | `admin@kolhapurtourism.com` | `Admin@123` |
| **Traveler (Demo)** | `traveler@kolhapur.com` | `Traveler@123` |

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
