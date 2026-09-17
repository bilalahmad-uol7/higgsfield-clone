# Higgsfield Clone

An educational, unaffiliated visual clone of [higgsfield.ai](https://higgsfield.ai), built to demonstrate an AI-agent-driven development workflow. **This is not Higgsfield.** It has no backend, no real AI inference, and no account — every "generation" is a scripted client-side simulation. See [PROCESS.md](./PROCESS.md) for how it was built.

## What this is

- A high-fidelity static/interactive clone of the marketing site (landing, explore, pricing, auth) built in Next.js 16.
- A `/create` studio page that mimics a real async generation pipeline — queued → preparing → generating → upscaling → complete, with credits, cancellation, and batch results — that resolves to real (but pre-selected) Higgsfield demo media instead of calling any model.
- Design tokens (colors, type, radii) and marketing copy taken directly from the live site; see [PROCESS.md](./PROCESS.md) for how they were sourced.

## Stack

Next.js 16 (App Router, Turbopack) · TypeScript · Tailwind v4 · zustand · framer-motion · lucide-react.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Media source switch

Media is hotlinked from higgsfield.ai's public CDN by default (verified hotlinkable, no auth/referer restriction). Set `NEXT_PUBLIC_MEDIA_SOURCE=local` to serve from a vendored `/public/demo` set instead — useful if you need the app to work with zero external network calls (e.g. a live demo on bad wifi). See `src/lib/media.ts`.

```bash
NEXT_PUBLIC_MEDIA_SOURCE=local npm run dev
```

## Structure

```
src/
  app/            routes: /, /explore, /create, /pricing, /login, /signup
  components/     landing/, explore/, create/, pricing/, auth/, layout/, ui/
  data/           typed content modules (nav, landing copy, tools, pricing, demo media)
  lib/
    media.ts              CDN <-> local media resolution
    generation/            the simulated generation pipeline (types, store, simulate, resolve)
```

## Process logs

`.agent-logs/` contains an automatic, hook-captured transcript of every prompt/response pair from the Claude Code sessions that built this project (see [PROCESS.md](./PROCESS.md) for what that infrastructure is and why it exists).

## Deploying

Standard Next.js app — deploy with `vercel deploy` or any Next.js-compatible host. No environment variables are required; `NEXT_PUBLIC_MEDIA_SOURCE` is optional.
