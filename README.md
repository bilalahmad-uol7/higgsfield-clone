# Higgsfield — Noir Redesign

An educational, unaffiliated redesign concept for [higgsfield.ai](https://higgsfield.ai), built to demonstrate an AI-agent-driven development workflow. **This is not Higgsfield.** It has real accounts (Supabase Auth, email + Google), a Postgres database, Stripe billing in test mode and an admin panel — but no real AI inference: every "generation" is a scripted client-side simulation that charges real (database) credits. See [PROCESS.md](./PROCESS.md) for how it was built.

## What this is

- **v2 (current): an original "cinema noir" redesign.** Black & paper-white with one REC-red accent, editorial serif + mono type, and film motifs (grain, viewfinders, slates, timecodes). Footage stays grayscale until it's in focus, then blooms into color. The landing page has three Apple-style scroll set pieces: the hero pulls back into a framed monitor, a pinned film strip scrolls sideways, and a "how it works" demo types the prompt, lights camera moves and renders the shot as you scroll. Design spec: [docs/superpowers/specs/2026-09-25-noir-redesign-design.md](./docs/superpowers/specs/2026-09-25-noir-redesign-design.md).
- **v1: the original high-fidelity clone** is preserved at git tag `v1-clone`.
- **v2 backend:** Supabase auth (email/password + Google SSO) and Postgres with row-level security; Stripe Checkout for plan subscriptions (monthly/annual) and one-time credit packs, the Customer Portal for plan changes, and a signed webhook that records every successful payment and grants credits; an `/account` page; and an `/admin` panel with users (search, credit adjustments, roles) and all recorded Stripe transactions.
- A `/create` studio page that mimics a real async generation pipeline — queued → preparing → generating → upscaling → complete, with credits, cancellation, and batch results — that resolves to real (but pre-selected) Higgsfield demo media instead of calling any model.
- Studio names in the landing marquee are fictional on purpose, so the page implies no real endorsements.

## Stack

Next.js 16 (App Router, Turbopack) · TypeScript · Tailwind v4 · Supabase (Auth + Postgres) · Stripe · zustand · framer-motion · Lenis · Vitest.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Without a `.env.local` the marketing site runs as-is; accounts, credits, billing and admin need the backend setup below.

## Backend setup (one time)

```
Browser ──► Next.js (proxy.ts, server actions, route handlers) ──► Supabase Auth + Postgres (RLS)
                     │  /api/checkout, /api/billing/portal              ▲
                     ▼                                                  │ service role
                  Stripe Checkout / Portal ── webhook ──► /api/stripe/webhook
```

1. `cp .env.example .env.local`.
2. **Supabase** — create a project at supabase.com, then from *Project Settings*:
   - *API*: copy the Project URL, publishable key and secret key into `.env.local`.
   - *Database → Connection string*: copy the session-pooler URI (with your DB password) into `SUPABASE_DB_URL`.
   - *Authentication → URL Configuration*: Site URL `http://localhost:3000`, redirect URL `http://localhost:3000/**`.
   - *Authentication → Sign In / Providers → Email*: turn **off** "Confirm email" for instant demo signups (the app also handles confirmation links if you leave it on).
3. **Database** — `npm run db:push` applies `supabase/migrations` (tables, RLS policies, credit functions, signup trigger).
4. **Google SSO** — in Google Cloud Console create an OAuth client (*Web application*) with the authorized redirect URI `https://<project-ref>.supabase.co/auth/v1/callback`, then paste its client ID/secret into Supabase *Authentication → Providers → Google* and enable it.
5. **Stripe (test mode)** — copy the test secret key into `STRIPE_SECRET_KEY`, then:
   ```bash
   npm run stripe:seed        # products, monthly/annual prices, credit packs, portal config
   stripe login               # once
   npm run stripe:listen      # prints whsec_… → STRIPE_WEBHOOK_SECRET; keep it running
   ```
6. `npm run dev`, sign up, then make yourself an admin: `npm run make-admin -- you@example.com`.

Pay with Stripe's test card `4242 4242 4242 4242`, any future expiry, any CVC.

### How money and credits flow

- **Credits** live in `profiles.credits` (120 on signup). `/create` charges through `POST /api/generations`, which re-validates the params and prices them **server-side**; cancelling refunds exactly once. All balance changes go through `security definer` Postgres functions that only the server's service role can execute, and every change is written to `credit_ledger`.
- **Plans** are Stripe subscriptions (monthly, or annual at the discounted rate). Each paid invoice — first payment or renewal — is written to `transactions` and grants that period's credits (×12 for annual, ×seats for Team). Subscribers change plans or cancel in the Stripe Customer Portal; the webhook keeps the profile in sync.
- **Credit packs** are one-time Checkout payments that grant their credits on `checkout.session.completed`.
- The webhook is signature-verified and idempotent: `transactions.stripe_object_id` and `credit_ledger (reason, ref)` are unique, so Stripe retries never double-record or double-credit.

### Scripts

| Script | What it does |
| --- | --- |
| `npm test` | Vitest unit tests (catalog, webhook mapping, param validation, redirects) |
| `npm run db:push` / `db:types` | Apply migrations / regenerate `database.types.ts` |
| `npm run stripe:seed` | Create or update the Stripe test catalog and portal config (idempotent) |
| `npm run stripe:listen` | Forward Stripe webhooks to your local server |
| `npm run make-admin -- <email>` | Grant the admin role to an existing account |

### Media source switch

Media is hotlinked from higgsfield.ai's public CDN by default (verified hotlinkable, no auth/referer restriction). Set `NEXT_PUBLIC_MEDIA_SOURCE=local` to serve from a vendored `/public/demo` set instead — useful if you need the app to work with zero external network calls (e.g. a live demo on bad wifi). See `src/lib/media.ts`.

```bash
NEXT_PUBLIC_MEDIA_SOURCE=local npm run dev
```

## Structure

```
src/
  app/            routes: /, /explore, /create, /pricing, /login, /signup, /account, /admin/*
    api/          generations (credit charge/refund), checkout, billing portal, stripe webhook
    auth/         server actions + OAuth callback / email-confirm routes
  components/     home/, explore/, create/, pricing/, auth/, admin/, layout/, motion/, ui/
  data/           typed content modules (nav, copy, tools, pricing, demo media)
  lib/
    supabase/     browser / server / service-role clients, session proxy, DB types
    stripe/       catalog (lookup keys, credits), webhook → action mapping, fulfilment
    auth/         session helpers (requireUser / requireAdmin), safe redirects
    generation/   the simulated pipeline + server-side param validation
  proxy.ts        refreshes the Supabase session; gates /create, /account, /admin
supabase/migrations/   schema, RLS, credit functions
scripts/               stripe-seed.ts, make-admin.ts
```

## Process logs

`.agent-logs/` contains an automatic, hook-captured transcript of every prompt/response pair from the Claude Code sessions that built this project (see [PROCESS.md](./PROCESS.md) for what that infrastructure is and why it exists).

## Deploying

Standard Next.js app — deploy with `vercel deploy` or any Next.js-compatible host. Set the variables from `.env.example` in the host (with `NEXT_PUBLIC_SITE_URL` set to the deployed URL), add that URL to Supabase's redirect URLs, and create a Stripe webhook endpoint for `https://<your-domain>/api/stripe/webhook` listening to `checkout.session.completed`, `invoice.paid`, `customer.subscription.updated` and `customer.subscription.deleted`.
