# North Pole — Premium Luggage, Backpacks & Travel Gear

A demo e-commerce site for a bag manufacturer: customers browse and buy
bags, register warranty, book maintenance & service, check a bag into the
Clock Room, and find a nearby dealer; staff run products, orders, warranty,
Clock Room, and the service desk from a separate admin panel. Built with
Next.js (App Router) + TypeScript + Tailwind, styled after the North Pole
brand reference (dark hero, amber/slate palette).

This milestone runs on **mock data only** — products, orders, tickets,
warranty registrations, dealers, and Clock Room tickets are stored in the
browser's `localStorage`, seeded with sample data on first load. No backend
or database yet; that's the next milestone (FastAPI + Postgres).

## Routes

**Customer-facing**
- `/` — home page with featured products and quick links to every flow
- `/shop`, `/shop/[slug]` — product catalogue and product detail pages
- `/cart`, `/checkout` — cart and checkout (places a real mock order)
- `/orders/[id]` — order confirmation and live status tracking
- `/account` — mock sign-in (name + phone, no password) and order history
- `/warranty` — register a purchase for warranty, or look up a
  registration to file a claim
- `/service` — Maintenance & Service: drop off a bag for repair and track
  a service ticket by ID or phone number
- `/clock-room` — check a bag in for short-term storage and claim it back
  with a claim code
- `/dealers` — dealer locator, searchable by city or state

**Admin (separate login from customers)** — gated by `/admin`
- `/admin` — overview: open orders, service tickets, warranty claims,
  Clock Room occupancy, low stock
- `/admin/products` — product CRUD (add, edit, delete)
- `/admin/orders`, `/admin/orders/[id]` — order list and status updates,
  with notes the customer sees when tracking their order
- `/admin/tickets`, `/admin/tickets/[id]` — the Maintenance & Service desk
- `/admin/warranty`, `/admin/warranty/[id]` — warranty registrations and
  claim status
- `/admin/clock-room` — Clock Room tickets and status
- `/admin/dealers` — dealer directory CRUD

Demo admin login: `admin` / `bagco123` (hardcoded for this milestone, see
`src/components/AdminGate.tsx`)

## Data model

See `src/lib/types.ts` for `Product`, `Order`, `ServiceTicket`,
`WarrantyRegistration`, `Dealer`, and `StorageTicket`. Each `lib/*-store.ts`
file (`product-store`, `order-store`, `store` for service tickets,
`warranty-store`, `dealer-store`, `storage-store`, `cart-store`,
`auth-store`) is the only place that reads or writes `localStorage` for
that domain — swapping in a real API later means replacing those files
without touching the pages.

An `Order` moves through `Pending → Processing → Shipped → Delivered`
(or `Cancelled`); a `ServiceTicket` through
`Received → In Service → Ready for Pickup → Returned` (or `Cancelled`);
a `WarrantyRegistration` through
`Active → Claim Requested → Claim Approved`/`Claim Rejected` (or
`Expired`); a `StorageTicket` (Clock Room) through
`Checked In → Claimed` (or `Overdue`/`Cancelled`). All carry a running
list of timestamped notes both roles can read.

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
