# Bag Co. — Find My Bag Service Desk

A demo "Find My Bag" servicing flow for a bag manufacturer: customers drop
a bag in for repair and track it, staff run the back office. Built with
Next.js (App Router) + TypeScript + Tailwind.

This milestone runs on **mock data only** — tickets are stored in the
browser's `localStorage`, seeded with sample tickets on first load. No
backend or database yet; that's the next milestone (FastAPI + Postgres).

## Routes

- `/` — landing page, links to both panels
- `/customer` — drop off a bag for service (generates a ticket ID) and
  track an existing ticket by ID or phone number
- `/admin` — passcode-gated staff panel: dashboard of all tickets with
  status filters and search, and a ticket detail page to assign a
  technician, set an ETA, change status, and leave notes the customer
  sees when they track their bag

  Demo passcode: `bagco123` (hardcoded for this milestone, see
  `src/components/AdminGate.tsx`)

## Data model

See `src/lib/types.ts`. A `ServiceTicket` moves through:
`Received → In Service → Ready for Pickup → Returned` (or `Cancelled`),
with a running list of timestamped notes both roles can read.

`src/lib/store.ts` is the only place that reads/writes `localStorage` —
swapping in a real API later means replacing this file without touching
the pages.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (Next.js picks the
next free port if 3000 is taken).

## Deploying to Vercel

This is a stock Next.js app — Vercel detects it automatically.

1. Push this repo to GitHub.
2. In Vercel, "Add New Project" → import the repo → deploy (no
   environment variables needed yet).
3. Or, from the CLI: `npx vercel` (first run links/creates the project
   and deploys a preview), then `npx vercel --prod` for production.
