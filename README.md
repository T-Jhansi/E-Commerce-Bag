# Bag Co. — E-commerce Demo

A demo e-commerce site for a bag manufacturer: customers browse and buy
bags, track orders, and drop a bag in for repair; staff run products,
orders, and the repair desk from a separate admin panel. Built with
Next.js (App Router) + TypeScript + Tailwind.

This milestone runs on **mock data only** — products, orders, and tickets
are stored in the browser's `localStorage`, seeded with sample data on
first load. No backend or database yet; that's the next milestone
(FastAPI + Postgres).

## Routes

**Customer-facing**
- `/` — home page with featured products
- `/shop`, `/shop/[slug]` — product catalogue and product detail pages
- `/cart`, `/checkout` — cart and checkout (places a real mock order)
- `/orders/[id]` — order confirmation and live status tracking
- `/account` — mock sign-in (name + phone, no password) and order history
- `/customer` — Find My Bag: drop off a bag for service and track a
  repair ticket by ID or phone number

**Admin (separate login from customers)** — gated by `/admin`
- `/admin` — overview: open orders, open tickets, low stock
- `/admin/products` — product CRUD (add, edit, delete)
- `/admin/orders`, `/admin/orders/[id]` — order list and status updates,
  with notes the customer sees when tracking their order
- `/admin/tickets`, `/admin/tickets/[id]` — the Find My Bag service desk

Demo admin login: `admin` / `bagco123` (hardcoded for this milestone, see
`src/components/AdminGate.tsx`)

## Data model

See `src/lib/types.ts` for `Product`, `Order`, and `ServiceTicket`.
Each `lib/*-store.ts` file (`product-store`, `order-store`, `store`
for tickets, `cart-store`, `auth-store`) is the only place that reads or
writes `localStorage` for that domain — swapping in a real API later
means replacing those files without touching the pages.

An `Order` moves through `Pending → Processing → Shipped → Delivered`
(or `Cancelled`); a `ServiceTicket` through
`Received → In Service → Ready for Pickup → Returned` (or `Cancelled`).
Both carry a running list of timestamped notes both roles can read.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (Next.js picks the
next free port if 3000 is taken).

## Deploying to Vercel

This is a stock Next.js app — Vercel detects it automatically. Once the
project is imported from GitHub, every push to `main` redeploys it.

- From the CLI instead: `npx vercel` (first run links/creates the
  project and deploys a preview), then `npx vercel --prod` for
  production.
