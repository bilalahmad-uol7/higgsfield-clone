# Process

This document narrates how this project was built with Claude Code, for an assignment whose subject is the *process* of working with AI agents as much as the resulting app. It's written after the fact from the actual session — nothing here is a plan that was never executed.

## 0. Capture infrastructure (prior session)

Before any product work started, a separate setup pass wired Claude Code's `UserPromptSubmit` and `Stop` hooks (`.claude/hooks/capture.py`, `.claude/settings.json`) to log every prompt/response pair to `.agent-logs/<timestamp>_<session-id>.md`, verified to fire independently across multiple sessions. That infrastructure is what produced the raw transcripts backing this writeup — it's what makes "the process" inspectable rather than just asserted.

## 1. Requirements, in plan mode

The task: clone higgsfield.ai's frontend as closely as possible using only public resources, then simulate a generation backend rather than build one, given the assignment's resource constraints. Before writing any code, four scoping questions were put to the user directly (`AskUserQuestion`) rather than assumed:

- Which surfaces to build (landing + explore + create, plus pricing and auth)
- How to source media (hotlink the real CDN, with a local-fallback escape hatch)
- How elaborate the fake generation flow should be (a scripted job with realistic timing, not an instant fake)
- Whether the agent-workflow itself should be a visible deliverable (yes — this document)

## 2. Research, delegated to parallel subagents

Two `Explore` subagents ran concurrently against the live higgsfield.ai site (it turned out to be server-rendered and fully fetchable, not JS-gated) while the plan was being scaffolded:

- **Agent 1** mapped the landing page: section order, verbatim copy, nav structure, visual system.
- **Agent 2** mapped the product surface: named models (Soul, Cinema Studio, Genjutsu, Effects, Lipsync Studio...), the Create page's params-sidebar layout, the Explore page's Creation Hub concept, and pricing tiers.

Their findings were then **verified directly**, not taken on faith — a real risk with delegated research is a subagent confidently reporting something stale or slightly wrong:

- Fetched `higgsfield.ai` and their published `llms.txt`/`llms-full.txt` directly to cross-check routes and copy.
- Extracted the actual CSS bundle and pulled real `--color-*` custom properties out of it — the design tokens in `globals.css` (`#d1fe17` lime, `#0b0b0b` background, the white-alpha border ladder) are copied values, not eyeballed from screenshots.
- Tested hotlinking directly with `curl` using a foreign `Referer` header before committing to the CDN-first media strategy — confirmed `cdn.higgsfield.ai` and `assets.higgsfield.ai` serve cross-origin with no restriction, which is why the app can reference their media at all.

This mix — parallel delegation for breadth, direct verification for anything load-bearing — is the main methodological point of this build.

## 3. Plan review and approval

A single markdown plan (`Context` → research findings → architecture → phased build list → verification checklist) was written and handed back via `ExitPlanMode` for explicit approval before any code was touched. Model was switched (Opus → Sonnet) between planning and execution at the user's request; the plan carried over unchanged.

## 4. Phased execution, one commit per phase

Each phase below was implemented, then verified live in a real browser (Chrome via the `claude-in-chrome` tools) before moving on and committing — not just type-checked.

1. **Scaffold + design system** — Next.js 16 App Router, Tailwind v4, the real color/type tokens, a grouped mega-menu header (the real nav has ~22 links; a flat bar doesn't work at that density).
2. **Landing page** — all 10 sections from the live site, real hotlinked CDN media, verbatim copy.
3. **Explore page** — a tool directory with category tabs plus a community gallery, URL-synced tab state (`?tab=`), `Recreate` deep-links into `/create`.
4. **Create page + generation engine** — the centerpiece; see below.
5. **Pricing + Auth** — static, no real payment or auth backend.
6. **Polish** — favicon, OG metadata, custom 404.

## 5. The generation engine, and two real bugs it surfaced

The hardest and most interesting part: `/create` needed to *feel* like a real async backend without one existing. `src/lib/generation/` is a small state machine (`queued → preparing → generating → upscaling → complete`) driven by `setTimeout` chains, with uneven progress (fast/slow/fast), a decrementing queue position, credits that deduct on submit and refund on cancel, and batched results that reveal on a stagger — all persisted to `localStorage` via `zustand` so a refresh mid-demo doesn't lose history.

Live browser verification (not just "it type-checks") caught two real bugs that would not have been visible from code review alone:

- **Selected preset had no visible highlight.** A global `* { border-color: var(--color-white-8) }` rule in `globals.css` was written outside any Tailwind `@layer`, which in Tailwind v4 gives it *higher* cascade priority than the `utilities` layer — so it silently overrode every `border-lime` utility in the app. Fix: wrap the base reset in `@layer base { ... }`.
- **Every generated video rendered as a black frame, with zero network requests for it.** `<video muted>` as a JSX boolean prop doesn't reliably sync to the DOM `.muted` property once `src` is set after mount (a known React/video quirk) — so the browser's autoplay policy was silently rejecting the programmatic `play()` call as an unmuted autoplay attempt. Confirmed via direct DOM inspection (`readyState: 0`, no network request had ever fired) rather than guessing. Fix: set `el.muted = true` imperatively right before calling `.play()`.

Both were found by actually clicking through the running app in a browser and looking closely at what didn't match expectations, then root-caused with direct tool inspection (network requests, console, live DOM/localStorage reads) rather than pattern-matching to a plausible-sounding explanation.

## 6. What's real vs. simulated

| Real | Simulated |
|---|---|
| Design tokens, copy, layout, routes | Every "generation" — no model is ever called |
| Hotlinked Higgsfield CDN media (verified public, no restriction) | Which specific clip a prompt "returns" (deterministic hash, not content-aware) |
| Client-side state (credits, job history, tab state) | Auth (`/login`, `/signup` are static forms, no backend) |

## 7. Raw transcripts

`.agent-logs/*.md` contains the complete, hook-captured prompt/response history for the sessions that built this, for anyone who wants to check this document against what actually happened rather than what it claims happened.
