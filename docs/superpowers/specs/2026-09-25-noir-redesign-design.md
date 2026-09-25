# Higgsfield Redesign — "Noir" (full-site, original design)

Branch: `feat/v2-redesign` (user-created).

## Context
The 8x team changed the brief. They no longer want a pixel clone of higgsfield.ai; they want an **original redesign** that shows creativity. The redesign must still be loud, animated and cinematic, but with a completely new layout.

Decisions locked with the user:
- **Motion:** hybrid. Normal section flow, plus **3 Apple-style pinned/scrubbed set pieces**.
- **Aesthetic:** **Cinema noir**. Black and paper-white with one warm accent (REC red), an editorial serif with mono, and film motifs.
- **Scope:** **full site** (landing, `/create`, `/pricing`, `/explore`, auth, placeholder pages). It is built in 3 phases, each verified and committed on its own.
- **Partners marquee:** **fictional studio wordmarks**, to avoid implying real endorsements.
- **Stack:** **framer-motion (already installed) + Lenis**. No GSAP.

**Creative through-line:** *"The world is black & white until you direct it."* Every video renders grayscale by default and blooms to full color when it is in focus: hovered, centered in the reel, or finished rendering. One idea ties the whole site together and demos the product.

Current state (from exploration):
- Next 16.3.5, React 19.2, Tailwind v4 with tokens in the `@theme` block of `src/app/globals.css`, framer-motion ^13.
- All media is remote from the Higgsfield CDN via `src/lib/media.ts`.
- Components already use semantic tokens (no raw hex), so a token swap restyles most of the site automatically.
- The generation logic is isolated in `src/lib/generation/*`. Only `ParamsSidebar`, `JobFeed` and `JobCard` touch the store, so `/create` can be fully restyled without touching logic.

Before starting:
- `git tag v1-clone` on `main` preserves the original clone for comparison.
- Save this plan as the spec at `docs/superpowers/specs/2026-09-25-noir-redesign-design.md`.
- Per AGENTS.md, check `node_modules/next/dist/docs/` before using any Next API (fonts, metadata, Image).

---

## Design system (Phase 1a)
**File: `src/app/globals.css`**, with new `@theme` tokens:
- `--color-ink #0a0a0a` (bg), `--color-ink-raised #121212`, `--color-paper #efebe4` (primary text, warm off-white), `--color-rec #ff3b2f` (single accent: CTAs, REC dot, focus, selection).
- Keep the white-alpha ladder and gray ramp. Remap `surface-*` to neutral noir grays.
- **Codemod `lime` → `rec`** across about 22 files (40 occurrences), and the `Button` `lime` variant → `primary`. Remove `magenta`.
- Radii go sharp: `--radius-*` become 2–6px. Buttons are square with mono uppercase labels.
- Utilities:
  - `.noir-media` (grayscale(1) contrast(1.1), with a transition to `grayscale(0)` on `.is-live` / hover)
  - `.display` (serif)
  - `.slate` (mono uppercase label with tracking)
  - `.sprockets` (film-strip holes via repeating gradient)
- Fix: the undefined `text-white-70` class in SiteHeader.

**Fonts** (`src/app/layout.tsx`, via `next/font/google`): **Instrument Serif** (display, with italic for emphasis), **Inter Tight** (body/UI) and **JetBrains Mono** (timecodes, slates, labels). These replace Space Grotesk and Space Mono, and `.hf-heading` → serif display.

**Motion primitives** (new, `src/components/motion/`):
- `SmoothScroll.tsx`: `ReactLenis` root provider in layout, disabled under `prefers-reduced-motion`.
- `Reveal.tsx`: `whileInView` fade/rise/clip wrapper with stagger.
- `Marquee.tsx`: infinite CSS-transform marquee with direction/speed and edge mask; pauses on hover.
- `FilmGrain.tsx`: fixed full-screen SVG `feTurbulence` noise at about 6% opacity with stepped jitter; pointer-events none.
- `Viewfinder.tsx`: 4 corner brackets plus an optional REC dot and a live `Timecode`.
- `Timecode.tsx`: mono `00:00:12:04` counter (rAF), used in the hero, jobs and footer.
- `usePinProgress.ts`: small hook wrapping `useScroll({target, offset})` for sticky set pieces, returning a 0→1 MotionValue.

Reuse existing pieces: `src/components/ui/LazyVideo.tsx` (in-view autoplay, with the muted fix already in place), `Media.tsx`, and `mediaUrl()` from `src/lib/media.ts`.

---

## Phase 1: shell + landing (`/`)
**New folder `src/components/home/`**. `src/app/page.tsx` renders these sections in order:

1. **`HeroReel`** (SET PIECE #1):
   - Layout: 100svh, a `200vh` sticky wrapper around a fullscreen bg video (first `HERO_SLIDES` media), grayscale with vignette and grain. A blurred, scaled duplicate behind it gives the backdrop glow.
   - Copy: headline in giant serif, *"Direct anything. **Camera optional.**"*, with a mono subline. CTAs: **Start directing →** `/create` and **Watch the reel**.
   - Viewfinder corners, a REC dot and a ticking timecode. Letterbox bars slide in on load.
   - Scroll: the frame shrinks from full-bleed to an inset 16:9 card (scale + clip-path inset + radius), the headline lifts and fades, and the video **blooms from grayscale to color** as it lands.
2. **`StudioMarquee`**: two rows of fictional wordmarks from new `src/data/studios.ts` (about 12, e.g. "Northlight Pictures", "KINO/LAB", "Atlas & Reed"). Each one has its own type treatment (serif italic / mono caps / condensed). The rows run in opposite directions with edge fade and a mono caption "ON SET WITH STUDIOS, AGENCIES & INDEPENDENT DIRECTORS".
3. **`ReelStrip`** (SET PIECE #2):
   - Desktop: a pinned section whose height is about frames × 50vh. Vertical scroll drives a horizontal `translateX` of a film strip with sprocket holes top and bottom. It uses about 10 frames from `EFFECTS` / `PROJECT_PREVIEW_POOL` via `LazyVideo`.
   - The centered frame scales up and goes to color; the others stay grayscale and dimmed. A mono counter reads `FRAME 03 / 10` along with the effect name, and clicking a frame deep-links to `/create?preset=…`.
   - Mobile (<768): no pin, a native horizontal scroll-snap strip.
4. **`HowItWorks`** (SET PIECE #3, the product demo):
   - A pinned section about 300vh tall. Left side: steps **01 Write → 02 Direct → 03 Render** with a progress rail. Right side: a mock "director's monitor".
   - Scroll progress types the prompt char-by-char (`useTransform` → substring length), then lights up camera-move chips (Dolly in / Crane up / Orbit).
   - Render stage: a stage label steps through the real pipeline stages (queued → preparing → generating → upscaling → complete; reuse `STAGE_LABEL` by extracting it from `JobCard` into `src/lib/generation/`). Meanwhile the video goes from blur + pixelate + grayscale to sharp color.
   - End CTA: **Try this prompt →** `/create?prompt=…` (the existing param).
5. **`FeatureBento`**: an asymmetric bento grid (Cinema Studio, Effects, Image models, Lipsync/Audio, Upscale, MCP/API) driven by `MODEL_TILES`, with hover-play and color bloom. Each card has a slate number and a staggered `Reveal`.
6. **`PricingSection`**: refactor `src/components/pricing/PricingGrid.tsx` into a shared `PricingCards` component (with the billing toggle), used here and on `/pricing`. Noir cards; the highlighted plan gets a REC-red border and a "RECOMMENDED" slate. Data comes from `src/data/pricing.ts`, unchanged.
7. **`Faq`**: new `src/data/faq.ts` with about 8 Qs (credits, commercial rights, models, cancel, team seats, API…). A sticky serif heading sits on the left and a numbered accordion on the right with motion height animation. It is built as a shared component so `/pricing` can reuse it.
8. **`FinalCta`**: a fullscreen video with a **text knockout**. A black layer with huge white "ACTION." uses `mix-blend-mode: multiply` over the video, so the footage shows only through the letters. On scroll the text scales up until the video fills the screen, then the CTA buttons reveal.

**Shell:**
- `SiteHeader.tsx` rework:
  - The header is transparent over the hero and turns solid ink with a hairline after scroll. Nav uses mono uppercase and is trimmed at top level (Explore, Create, Studios ▾, Pricing, Enterprise), keeping all existing routes from `src/data/nav.ts`.
  - Mobile menu: a fullscreen overlay with staggered serif links and body scroll lock.
- `SiteFooter.tsx` rework: "end credits". A giant serif **HIGGSFIELD** wordmark spans the full width, with credit-roll columns, "Directed by you." and a timecode.
- `FilmGrain` is mounted globally in layout.

**Cleanup:** delete the now-unused `src/components/landing/*` (HeroCarousel, PromoBar, ModelTiles, McpSection, EffectsGrid, GenjutsuSection, ProjectsShowcase, SupercomputerCta) once nothing imports them. Keep `src/data/landing.ts` (reused).

**New dep:** `lenis`.

## Phase 2: `/create` studio ("director's monitor")
The logic in `src/lib/generation/*` and the store wiring stay untouched. Restyle only:
- `src/app/create/page.tsx` layout, with the sidebar as a "camera settings" panel: mono labels and `Segmented` restyled as a square toggle bank.
- `PromptBox`, `ModelPicker`, `PresetPicker`, `BatchSizeStepper`, `GenerateButton` (REC-red "ROLL" button with a pulse while jobs run).
- `JobFeed` / `JobCard` become film frames with `Viewfinder` corners, a live `Timecode` while generating, the stage label as a slate, and a progress bar. The frame blooms grayscale → color on complete.

## Phase 3: remaining pages
- `/pricing`: a serif hero, then shared `PricingCards`, a credit packs strip, an enterprise block, and the shared `Faq`.
- `/explore`: `ExploreTabs` as mono chip tabs; `ToolCard` / `CommunityGrid` get noir cards with hover color bloom.
- Auth (`src/components/auth/AuthForm.tsx`): a split screen with a looping grayscale video and a slate on the left and a minimal form on the right.
- `ComingSoon.tsx` and `LegalPage.tsx` get noir templates, which covers `/mcp`, `/api`, `/supercomputer`, `/plugins/after-effects` and the legal/help pages automatically.
- `not-found.tsx`: "SCENE MISSING. 404" with a static-noise frame.

---

## Performance & accessibility rules (all phases)
- Only the hero video loads eagerly, with a poster. Everything else uses `LazyVideo` (in-view play/pause) with `preload="none"`.
- Animate only `transform`, `opacity`, `filter`, `clip-path`. No layout thrash.
- **`prefers-reduced-motion`:** Lenis off, the pinned set pieces render as static stacked content, the typing shows full text, and the marquee pauses.
- **Mobile:** shorter pin heights, the ReelStrip pin is replaced by snap scroll, `100svh` units, and a 16px gutter.
- Contrast: paper text on ink passes AA. REC red is used for accents and large text only, never body text.

## Verification (after each phase, before commit)
1. `npx tsc --noEmit`, `npm run lint`, `npm run build`, all clean.
2. `npm run dev`, then drive it via Chrome MCP:
   - scroll the full landing
   - record a GIF of each set piece (`hero_zoom.gif`, `reel_strip.gif`, `how_it_works.gif`)
   - check the console has no errors and the network shows only near-viewport videos loading
3. Resize to 390px width: no horizontal overflow, mobile menu works, and the reel snap-scrolls.
4. Emulate reduced motion: the page stays fully readable with no pinning.
5. Phase 2: run a generation end-to-end on `/create` (queue → complete, cancel, credits) to confirm the logic is untouched.
6. Commit per phase on `feat/v2-redesign` (Phase 1 may split into design-system and landing commits).
