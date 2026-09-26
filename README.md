# Higgsfield — Noir Redesign

An educational redesign concept for [higgsfield.ai](https://higgsfield.ai). It is not affiliated with Higgsfield, and it was built to show an AI-agent-driven development workflow. **This is not Higgsfield.**

The backend is real:
- Accounts through Supabase Auth, with email or Google sign-in.
- A Postgres database protected by row-level security.
- Stripe billing in test mode.
- A credit ledger that charges for every generation.
- An admin panel.

**Image generation is real.** It runs on the free [Pollinations.ai](https://pollinations.ai) API.

**Video generation is a mock.** It is charged like a real job but returns sample clips. The [feature matrix](#feature-matrix) below lists exactly what is real, what is mocked and what is static. See [PROCESS.md](./PROCESS.md) for how the project was built.

## What this is

- **v2 (current): an original "cinema noir" redesign.**
  - Black and paper-white with one REC-red accent, editorial serif and mono type, and film motifs (grain, viewfinders, slates, timecodes).
  - Footage stays grayscale until it is in focus, then fades into color.
  - The landing page has three Apple-style scroll set pieces:
    - the hero pulls back into a framed monitor;
    - a pinned film strip scrolls sideways;
    - a "how it works" demo types the prompt, lights up camera moves and renders the shot as you scroll.
  - Design spec: [docs/superpowers/specs/2026-09-25-noir-redesign-design.md](./docs/superpowers/specs/2026-09-25-noir-redesign-design.md).
- **v1: the original high-fidelity clone** is preserved at git tag `v1-clone`.
- The studio names in the landing marquee are made up on purpose, so the page doesn't imply real endorsements.

## Feature matrix

**Real** means it works end to end against live services. **Mock** means the flow is real (auth, charging, persistence) but the output is sample media. **Static** means content only, with no backend.

| Area | Feature | Status | Notes |
| --- | --- | --- | --- |
| Accounts | Email + password sign-up / login | **Real** | Supabase Auth, via server actions. Handles email-confirmation links if confirmation is on. |
| Accounts | Google SSO | **Real** | Supabase OAuth. Needs the Google provider enabled in Supabase (see setup). |
| Accounts | Route protection | **Real** | `src/proxy.ts` gates `/create`, `/account` and `/admin`. Pages re-check with `requireUser` / `requireAdmin`, and every API route checks the session itself. |
| Credits | Balance and ledger | **Real** | `profiles.credits` (120 on signup). Every change is a row in `credit_ledger`, written only by `security definer` functions that only the server's service role can run. |
| Credits | Per-request charging | **Real** | `POST /api/generations` re-validates the params, prices them **on the server**, and charges and records the job in one transaction (`start_generation`). |
| Credits | Refunds | **Real** | Automatic when a job fails. On cancel, a refund is given **only while the job is still running**. A finished job returns `409 not_cancellable`, so output can't be kept for free. |
| Credits | Concurrency cap | **Real** | At most 3 running jobs per user (`429 too_many_jobs`). |
| Studio | Image generation | **Real** | Pollinations.ai, keyless by default. Images are fetched on the server and stored in the Supabase Storage bucket `generations`. |
| Studio | Image failsafe | **Mock (fallback)** | If Pollinations times out, errors or is rate-limited (after one retry), that slot gets a demo sample marked "Sample", and the job still completes. `POLLINATIONS_DISABLED=1` forces this. |
| Studio | Video generation | **Mock** | Same server pipeline: real auth, a real charge and a DB record. It "renders" for 12–20s, then returns demo clips. The UI labels it as a simulation. |
| Studio | Take history | **Real** | Stored server-side, per user. The last **5** takes are shown on `/create` and `/account`. Nothing is kept in localStorage, so accounts that share a browser never see each other's takes. |
| Studio | Reference image upload | **Static** | The picker shows the file name only. Nothing is uploaded or used. |
| Billing | Plan subscriptions (monthly / annual) | **Real** | Stripe Checkout, test mode. Each paid invoice grants that period's credits (×12 for annual, ×seats for Team). |
| Billing | Credit packs | **Real** | One-time Stripe Checkout payments. |
| Billing | Plan changes / cancellation | **Real** | Stripe Customer Portal. |
| Billing | Webhook | **Real** | Signature-verified and idempotent (unique `stripe_object_id` and `(reason, ref)`). |
| Account | `/account` | **Real** | Credits, plan, recent takes, purchases and credit activity. |
| Admin | `/admin` | **Real** | KPIs (users, subscribers, revenue, payments, generations in the last 24h). Users page: search, credit adjustments, roles. Transactions page. Generations page: every job with output, source, status and cost. |
| Marketing | Landing, explore, community feed, effects, tools, FAQ | **Static** | Typed content modules in `src/data/`. Community likes and comments are not interactive. |
| Marketing | `/api`, `/mcp`, `/supercomputer`, `/plugins/after-effects` | **Static** | "Coming soon" placeholder pages. |
| Studio | Audio / upscale / inpaint tool modes | **Static** | Tool links open the studio. Only the image and video types exist. |

## How a generation works

```
POST /api/generations ──► start_generation (tx): cap check → charge credits → insert row 'running'
        │
        ├─ image ─► after(): Pollinations per slot ─► upload to Storage ─► finish_generation
        │             (a slot that fails → demo sample; a Storage/DB error → fail_generation = refund)
        └─ video ─► nothing runs; the job is due in 12–20s

GET /api/generations/:id  (client polls every 2s)
        └─ settles on read: a due mock video → finish_generation (demo clips)
                            an image job > due + 60s → fail_generation (worker died → refund)

POST /api/generations/:id/cancel ──► cancel_generation: running → cancelled + refund, else 409
```

- Every state change in the database is `where status = 'running'`, so a cancel racing a finish (or a failure) can only have one winner. A worker that loses deletes the files it uploaded.
- Code:
  - `supabase/migrations/20260927000000_generations.sql` (schema, transitions, bucket)
  - `src/lib/generation/lifecycle.ts` (pure rules)
  - `src/lib/generation/server/` (Pollinations client, image worker, settle-on-read)
  - `src/lib/generation/track.ts` (client polling plus the staged progress animation)

### Pollinations.ai

- **Keyless (default).** `image.pollinations.ai` is free and needs no signup. It is rate-limited per IP, and the service chooses the model (currently `sana`). The app asks for the aspect ratio and quality tier (long edge 1024 / 1280 / 1536 px), sends `safe=true` (content filter) and `nofeed=true` (keeps takes out of the public feed), and uses a seed derived from the job id.
- **Keyed (optional).** Set `POLLINATIONS_API_KEY` to an `sk_` key from [enter.pollinations.ai](https://enter.pollinations.ai/keys) to use `gen.pollinations.ai` with `POLLINATIONS_MODEL` (default `flux`). The key is only ever sent as a server-side header. It never appears in a URL or reaches the browser.
- Video stays mocked because Pollinations' video models are paid.

## Stack

Next.js 16 (App Router, Turbopack) · TypeScript · Tailwind v4 · Supabase (Auth, Postgres, Storage) · Stripe · Pollinations.ai · zustand · framer-motion · Lenis · Vitest.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Without a `.env.local`, the marketing site runs as-is. Accounts, the studio, billing and admin need the backend setup below.

## Backend setup (one time)

```
Browser ──► Next.js (proxy.ts, server actions, route handlers) ──► Supabase Auth + Postgres (RLS) + Storage
                     │  /api/checkout, /api/billing/portal              ▲
                     │  /api/generations ──► Pollinations.ai             │ service role
                     ▼                                                  │
                  Stripe Checkout / Portal ── webhook ──► /api/stripe/webhook
```

1. Run `cp .env.example .env.local`.
2. **Supabase:** create a project at supabase.com. Then, from *Project Settings*:
   - *API*: copy the Project URL, the publishable key and the secret key into `.env.local`.
   - *Database → Connection string*: copy the session-pooler URI (with your DB password) into `SUPABASE_DB_URL`.
   - *Authentication → URL Configuration*: set the Site URL to `http://localhost:3000` and add the redirect URL `http://localhost:3000/**`.
   - *Authentication → Sign In / Providers → Email*: turn **off** "Confirm email" for instant demo signups. The app also handles confirmation links if you leave it on.
3. **Database:** run `npm run db:push`. It applies `supabase/migrations`: tables, RLS policies, credit and generation functions, the signup trigger, and the `generations` Storage bucket.
4. **Google SSO:** in Google Cloud Console, create an OAuth client (*Web application*) with the authorized redirect URI `https://<project-ref>.supabase.co/auth/v1/callback`. Paste its client ID and secret into Supabase *Authentication → Providers → Google* and enable it.
5. **Stripe (test mode):** copy the test secret key into `STRIPE_SECRET_KEY`, then run:
   ```bash
   npm run stripe:seed        # products, monthly/annual prices, credit packs, portal config
   stripe login               # once
   npm run stripe:listen      # prints whsec_… → STRIPE_WEBHOOK_SECRET; keep it running
   ```
6. **Pollinations:** nothing to do. It works keyless. Optionally set `POLLINATIONS_API_KEY` / `POLLINATIONS_MODEL`.
7. Run `npm run dev` and sign up. Then make yourself an admin with `npm run make-admin -- you@example.com`.

Pay with Stripe's test card `4242 4242 4242 4242`, any future expiry date and any CVC.

### How money and credits flow

- **Credits** live in `profiles.credits` (120 on signup).
  - Studio jobs are priced on the server: video 8, image 3, × quality (1.5k ×1, 2k ×1.4, 4K ×2) × batch size.
  - They are charged when the job starts and refunded automatically if it fails, or if it is cancelled while still running.
  - Every balance change goes through `security definer` Postgres functions that only the server's service role can execute, and every change is written to `credit_ledger`.
- **Plans** are Stripe subscriptions, monthly or annual at the discounted rate.
  - Each paid invoice (first payment or renewal) is written to `transactions` and grants that period's credits.
  - Subscribers change or cancel plans in the Stripe Customer Portal, and the webhook keeps the profile in sync.
- **Credit packs** are one-time Checkout payments. They grant their credits on `checkout.session.completed`.
- **The webhook** is signature-verified and idempotent: `transactions.stripe_object_id` and `credit_ledger (reason, ref)` are unique, so Stripe retries never double-record or double-credit.

### Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | yes | Base URL for OAuth and Stripe redirects |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | yes | Supabase client |
| `SUPABASE_SECRET_KEY` | yes | Service role (server only). Runs the credit and job functions and writes to Storage. |
| `SUPABASE_DB_URL` | for scripts | `db:push` / `db:types` |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | for billing | Stripe test mode |
| `POLLINATIONS_API_KEY`, `POLLINATIONS_MODEL` | no | Keyed Pollinations with a chosen model |
| `POLLINATIONS_DISABLED` | no | `1` forces the image failsafe (demo samples) |
| `NEXT_PUBLIC_MEDIA_SOURCE` | no | `local` serves demo media from `/public/demo` |

### Scripts

| Script | What it does |
| --- | --- |
| `npm test` | Vitest unit tests: catalog, webhook mapping, param validation, redirects, Pollinations requests, the image-job failsafe and refund paths, and lifecycle rules |
| `npm run db:push` / `db:types` | Apply migrations / regenerate `database.types.ts` |
| `npm run stripe:seed` | Create or update the Stripe test catalog and portal config (idempotent) |
| `npm run stripe:listen` | Forward Stripe webhooks to your local server |
| `npm run make-admin -- <email>` | Grant the admin role to an existing account |

### Media source switch

Marketing media and the demo samples used by mock video (and by the image failsafe) are hotlinked from higgsfield.ai's public CDN by default. They were verified to be hotlinkable, with no auth or referer restriction.

Set `NEXT_PUBLIC_MEDIA_SOURCE=local` to serve them from a vendored `/public/demo` set instead. See `src/lib/media.ts`. Generated images always come from Supabase Storage.

```bash
NEXT_PUBLIC_MEDIA_SOURCE=local npm run dev
```

## Structure

```
src/
  app/            routes: /, /explore, /create, /pricing, /login, /signup, /account, /admin/*
    api/          generations (start / status / cancel), checkout, billing portal, stripe webhook
    auth/         server actions + OAuth callback / email-confirm routes
  components/     home/, explore/, create/, pricing/, auth/, admin/, layout/, motion/, ui/
  data/           typed content modules (nav, copy, tools, pricing, demo media)
  lib/
    supabase/     browser / server / service-role clients, session proxy, DB types
    stripe/       catalog (lookup keys, credits), webhook → action mapping, fulfilment
    auth/         session helpers (requireUser / requireAdmin), safe redirects
    generation/   params + validation, lifecycle rules, client store + tracker
      server/     Pollinations client, image worker (with failsafe), settle-on-read
  proxy.ts        refreshes the Supabase session; gates /create, /account, /admin
supabase/migrations/   schema, RLS, credit + generation functions, storage bucket
scripts/               stripe-seed.mts, make-admin.mts
```

## Process logs

`.agent-logs/` holds an automatic, hook-captured transcript of every prompt/response pair from the Claude Code sessions that built this project. [PROCESS.md](./PROCESS.md) explains what that setup is and why it exists.

## Deploying

This is a standard Next.js app. Deploy it with `vercel deploy` or any Next.js-compatible host.

1. Set the variables from `.env.example` on the host, with `NEXT_PUBLIC_SITE_URL` set to the deployed URL.
2. Add that URL to Supabase's redirect URLs.
3. Create a Stripe webhook endpoint for `https://<your-domain>/api/stripe/webhook` that listens to `checkout.session.completed`, `invoice.paid`, `customer.subscription.updated` and `customer.subscription.deleted`.

Image jobs keep running after the API responds (via `after()`, with `maxDuration = 300`). A host that cuts off post-response work early is covered by the stale-job watchdog, which refunds the job.
