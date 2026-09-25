# Higgsfield — Noir Redesign

An educational, unaffiliated redesign concept for [higgsfield.ai](https://higgsfield.ai), built to demonstrate an AI-agent-driven development workflow. **This is not Higgsfield.** It has no backend, no real AI inference, and no account — every "generation" is a scripted client-side simulation. See [PROCESS.md](./PROCESS.md) for how it was built.

## What this is

- **v2 (current): an original "cinema noir" redesign.** Black & paper-white with one REC-red accent, editorial serif + mono type, and film motifs (grain, viewfinders, slates, timecodes). Footage stays grayscale until it's in focus, then blooms into color. The landing page has three Apple-style scroll set pieces: the hero pulls back into a framed monitor, a pinned film strip scrolls sideways, and a "how it works" demo types the prompt, lights camera moves and renders the shot as you scroll. Design spec: [docs/superpowers/specs/2026-09-25-noir-redesign-design.md](./docs/superpowers/specs/2026-09-25-noir-redesign-design.md).
- **v1: the original high-fidelity clone** is preserved at git tag `v1-clone`.
- A `/create` studio page that mimics a real async generation pipeline — queued → preparing → generating → upscaling → complete, with credits, cancellation, and batch results — that resolves to real (but pre-selected) Higgsfield demo media instead of calling any model.
- Studio names in the landing marquee are fictional on purpose, so the page implies no real endorsements.

## Stack

Next.js 16 (App Router, Turbopack) · TypeScript · Tailwind v4 · zustand · framer-motion · Lenis · lucide-react.

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
