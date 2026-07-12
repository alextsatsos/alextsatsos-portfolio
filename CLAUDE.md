@AGENTS.md

# Alex Tsatsos Portfolio — Context Pack

Paste this at the start of any new claude.ai chat to get fully up to speed.

## Recent Changes (Session 6 in progress — July 12, 2026)

- **Session 6 (Install Mods: UX Research) started.** Info-bar skills locked (see Six Case Studies). Its research artifact is a **Google Slides** embed, not Figma — first case study needing this; confirm embed + accessible-title handling before assuming the Figma iframe component can be reused as-is.
- **Session 5 (Enterprise Delivery Tracker) shipped.** New cream tape-strip pull quote (replaces the inline navy treatment; navy now structural-only — hero/reflection/footer), stepper GIF framed in browser chrome, annotated three-panel image, interactive Figma prototype. The callout heading silently broke during a stacked-layout change and was fixed — re-verify callouts after any layout change touching them (see Design System).
- **Carryover (Sessions 3–4.5), still current:** sidebar/TOC removed, all sections full-width with no max-width cap (1016px at 1280 viewport); Skills in the hero info bar via `SkillCheck`; whiteboard photo keeps its 620px cap; image card frame removed (images float on the dot-grid bg); footer WCAG fixed (cyan `#00FBEA` handNote → off-white on the navy footer, copy unchanged); axe-core clean across all 5 groups.

## Who I Am

Alex Tsatsos — Senior UX & Product Designer, 8+ years in fintech and enterprise retail. Building a portfolio at alextsatsos.com targeting enterprise/fintech hiring managers. Currently job hunting for full-time in-house roles.

Core positioning: "I design the software nobody brags about — but everybody depends on."

## Tech Stack

- Next.js 16, Notion CMS, Cloudinary, Vercel
- GitHub repo: `alextsatsos/alextsatsos-portfolio`
- Build tool: Claude Code desktop app
- Fonts: Bricolage Grotesque (headings 800), Hanken Grotesk (body/UI), Architects Daughter (handwritten accents)

## Design System — LOCKED

Active palette (navy + pink + lime only):

- **Navy `#133464`** — dominant everywhere
- **Pink `#FF2687`** — large text/fills/lines only. WCAG rule enforced in code: only used at 18px+ regular or 14px+ bold, or as fills/lines — never small body text or subheads under that size. If a design calls for pink at a smaller size, swap to navy instead.
- **Lime `#D8FF76`** — key-phrase accent. Angled SVG underline on navy/dark backgrounds; solid highlight fill behind the text on light/cream backgrounds (the underline reads too faint on light, per the light-background rule)
- Cyan, groove (gold), lullaby (lavender) — REMOVED from all pages

Lime SVG underline device:
```html
<path d="M0 7 L[width] 4" stroke="#D8FF76" stroke-width="2.5" stroke-linecap="round"/>
```
Used on key phrases only, never whole sentences.

### WCAG rules

- Pink fails AA at small text — only use at 18px+ regular or 14px+ bold, or as fills/lines. This rule was violated in four places during initial build (nav tabs, card titles, skill subheads, hero eyebrow) and has since been fixed — either sized up or swapped to navy.
- Architects Daughter must be full navy only — no opacity tricks (also fails WCAG)
- White text on navy passes AAA at 12.33:1
- Secondary/label grays must hit 4.5:1 at their rendered size — don't reuse a light gray from one context (e.g. muted UI chrome) in a smaller text context without rechecking contrast
- Every homepage/case study page needs unbroken heading hierarchy — no skipping levels (h1 → h2 → h3, no h1 → h3 jumps)
- All `<nav>` landmarks need distinct `aria-label`s so assistive tech can tell them apart
- Form inputs (e.g. password gate) need a real `<label>` (visually hidden is fine) — placeholder text alone is not a substitute
- Embedded iframes (e.g. Figma prototypes) need a descriptive `title` attribute
- Decorative icon elements (e.g. SkillCheck's check box) should be `aria-hidden="true"`
- Password gate's "View Case Study" submit button (white text on pink `#FF2687` fill) is sized at 1.2rem (19.2px) bold specifically to clear the WCAG large-bold text threshold (18.66px, where the required ratio drops from 4.5:1 to 3:1) — don't shrink this button below that size without also darkening the fill
- Password gate's heading renders as `<h1>` while locked (not `<h2>`) — this is intentional and safe, since `PasswordGate` fully replaces its children (including the real page's `<h1>`) while locked, so the two never coexist on screen at once

**SkillCheck component**: 18px navy-outlined box (1.5px solid, 4px radius), inline SVG pink check path `d="M5 12l4 4 10-11"`, navy Hanken Grotesk 500 label, 9px gap. Box is `aria-hidden`. NOT a checkbox input. Used in the case study hero info bar's "Skills applied" row (wraps horizontally) — no longer lives in a sidebar card.

**Tape-strip card style** (still used by `AboutSection` and `WhiteboardPhoto`, no longer by case study sidebars since those are gone): white bg, NO border, `box-shadow: 0 4px 16px rgba(19,52,100,0.08), 0 1px 4px rgba(19,52,100,0.05)`. Tape strip: `#E8DFC8`, position absolute, top -9px, centered, 44px x 16px.

**Pull quote card (in-body, case studies)** — LOCKED, replaces the old inline navy treatment: cream/paper bg `#FAFAF7`, slight rotation (tape-strip card look), `#E8DFC8` tape strip anchored on top. Quote text in navy with both `"` marks pink and inline; lime **highlight fill** (not underline) behind the key phrase, since the card sits on a light background. Attribution is a witty one-line credit in Architects Daughter (full navy per WCAG), not a flat "Users said." Navy is reserved for structural elements only (hero, reflection, footer) — do not use a navy pull-quote block.

**Callout component** — bold navy heading inside a tinted/bordered box, matching Split Tender's "the core problem" reference. Re-verify it renders correctly (heading position intact) after ANY layout change that touches it — a prior stacking change silently broke the heading positioning.

**Case study cards (homepage)**: Option B style — pink left border (4px), white bg, shadow, border-radius 20px. Three columns: number+client left / quote center / tags+arrow right. Password protected tag: background `rgba(255,38,135,0.08)`, color `var(--pink)`

**Case study images (photos, annotated screenshots, GIFs)**: No card wrapper — image renders directly on the dot-grid page background, no box-shadow/padding container. Tape strip (`#E8DFC8`) stays as a decorative element anchored to the image itself. Caption sits below with no extra card padding to account for. Exception: the whiteboard sketch photo keeps an intentional 620px width cap since it's a discrete image, not full-width running content.

## Layout Rules — LOCKED

### Case study pages

- **No sidebar, no two-column zone.** Every section — Overview/Background included — renders full-width, same treatment as the rest of the page. The old `1fr 240px` grid, its sticky sidebar, and its mobile reorder logic are gone (removed Session 4.5).
- Full-width zone has no max-width cap — matches the hero's left/right edges exactly (spans full container width, 1016px at 1280 viewport).
- No partial overlaps, no dead space
- TOC ("On this page") no longer exists anywhere in the template.

### Hero card

- Full width — NO image slot (text only, Option A decision)
- Navy gradient (135deg, `#133464` → `#1a4280`), dot-grid overlay
- `border-radius: 20px 20px 0 0` (rounded top, square bottom)
- 3px pink seam between hero and info bar
- Info bar: white bg, `border-radius: 0 0 20px 20px`. Two rows: Role/Timeline (or Company)/Platform/Outcome, then a hairline-divided "Skills applied" row with wrapping `SkillCheck` items (added Session 4.5, replaces the old sidebar Skills card)

## Notion CMS

- Case Studies DB ID: `c8e6b0f6-7cb0-48d5-883c-a3cb2c14dad9`
- Home Page ID: `37759b481e4381d38a88e60e3b11148c`

Key fields:

- `KeyPhrase` (text) — exact words for lime SVG underline. Empty = no underline.
- `ImageType` (select) — `annotated`, `mockup`, `screenshot`, `gif`
- `PasswordProtected` (checkbox)
- `Slug` (text)

## Six Case Studies — LOCKED

| # | Title | Slug | Password | Client | KeyPhrase |
|---|---|---|---|---|---|
| 01 | Split Tender Refunds | `split-tender-refunds` | YES | Enterprise Retail | one guided flow |
| 02 | Logic Builder | `logic-builder` | NO | nCino | non-coders |
| 03 | Enterprise Delivery Tracker | `enterprise-delivery-tracker` | YES | Enterprise Retail | end-to-end delivery visibility |
| 04 | Install Mods: UX Research | `install-mods-ux-research` | YES | Enterprise Retail | high-stakes installation flow |
| 05 | Admin Area Update | `admin-area-update` | NO | nCino | built for growth |
| 06 | QA Test Dashboard | `qa-test-dashboard` | NO | nCino | browsable test results |

All 6 Notion page bodies are populated with full copy.

**Info-bar "Skills applied" — LOCKED where Notion's Skills field was empty** (decided fresh, grounded in real work; if a future study's field is empty, confirm before assuming a sync bug):

- 03 Delivery Tracker (5): Information Architecture, Stakeholder Facilitation, Design Systems, Flow Design, Systems Resilience
- 04 Install Mods (4): User Interviews, Usability Testing, Research Synthesis, Quantitative Usability Metrics (UMUX, SEQ)

## Case Study Card Quotes — LOCKED

01: Three transactions consolidated into one guided flow — with a reusable stepper that other teams adopted.
02: Turned a code-only configuration tool into a point-and-click experience for non-technical users.
03: Users said "Once an order was on the truck, it essentially disappeared." Now they can track every step.
04: Solo end-to-end research that changed the design — from script to synthesis.
05: A neglected admin area, two user groups, two mental models — and two concepts to match.
06: Internal tools deserve good design too.

Card 03 only: lime highlight on "essentially disappeared"

## Image Assets — Naming Convention

`[case-study-slug]--[what-it-is].[ext]` — all lowercase, double hyphen between slug and descriptor. Cloudinary folders: `portfolio/case-studies/` and `portfolio/headshots/`

Key assets:

- `alex-tsatsos--headshot-hero.jpg` — homepage hero (already uploaded ✅)
- `split-tender--annotated-screens.png` — cream bg `#FAFAF7`, three-panel
- `delivery-tracker--stepper-gif.gif` — side panel only, under 3MB, use `<img>` not Next Image
- `delivery-tracker--annotated-screens.png` — cream bg, three-panel
- Admin area: 4 concept screens (concept1-default, concept1-hover, concept2-collapsed, concept2-expanded)
- QA dashboard: original screenshot, mobile-ab comparison, desktop-main, desktop-slideout, mobile-table, mobile-detail

Note: with the image card frame gone, any image with a baked-in cream `#FAFAF7` background must still read intentionally against the dot-grid page bg, not like a stray rectangle — re-export transparent if it looks off.

**Cloudinary before committing (Session 5):** always confirm a new image/GIF is uploaded to Cloudinary and referenced by its Cloudinary URL before committing — a local filesystem path reference passes locally but 404s once deployed to Vercel. For assets near or over the 3MB guideline, use the `f_auto,q_auto` transform in the URL (`/upload/f_auto,q_auto/...`) so supporting browsers get an optimized format (e.g. animated WebP) and others fall back to the original.

## Password Gate — LOCKED

- Env var: `NEXT_PUBLIC_PORTFOLIO_PASSWORD`
- SessionStorage key: `portfolio_unlocked`
- Style: dot-grid bg, navy input border, pink submit button
- Error: pink border + pink message below input, don't clear input
- Contact email: alex@alextsatsos.com
- Input has a real `<label>` (visually hidden, sr-only styling) in addition to the placeholder — placeholder alone isn't a valid accessible name per WCAG 3.3.2

## Homepage Hero Copy — LOCKED

- Eyebrow: "→ Senior UX & Product Designer" (Architects Daughter, pink — confirmed at a size that clears the 18px-regular pink WCAG threshold)
- Title: "Hi! I'm Alex." (period in pink)
- Tagline: "I design the software nobody brags about — but everybody depends on." (lime highlight on "everybody" ONLY)
- Subtitle: "8+ years in fintech and retail ops designing enterprise tools for the workflows, edge cases, and high-stakes flows that run the business. Open to full-time roles."
- CTAs: "See My Work" (navy fill) + "About Me" (navy outline)
- Skills: Product Strategy, Design Systems, Accessibility (WCAG), Fintech

## About Section Copy — LOCKED (verbatim)

P1: "Most UX designers design the screens everyone sees. I design the stuff that barely anyone notices but keeps the whole system running. Whether that's a warehouse associate managing return logistics or a loan officer closing a multi-million dollar deal, I make sure their workflows are intuitive, informative, and error-free. That's the work I love, and that's how I've spent the last 8 years."

P2: "I've worked in fintech and enterprise retail, where a small misclick can cost millions of dollars and a regulatory headache. The people I design for aren't browsing or exploring, they're trying to solve real, messy problems with software. Edge cases aren't edge cases to them, they're the use cases."

P3: "I'm just as comfortable getting into the weeds of a design system as I am in a room full of stakeholders who can't agree on what they need. If you need software that's robust, flexible, and built for the hard stuff, let's talk."

Pull quote: "Good design doesn't stop at the screen, and it doesn't assume it knows everything. It leaves room for the person using it."

Skill groups:

- **understanding people**: UX Research, Usability Testing, Journey Mapping
- **the nuts & bolts**: Design Systems, Prototyping, Figma, Accessibility (WCAG), Data Visualization
- **what runs the business**: Product Strategy, Stakeholder Facilitation, Information Architecture, Design Ops
- **the future-thinking stuff**: Vibe Coding, Claude Code, AI-Assisted Prototyping, Prompt Design

Note: homepage heading hierarchy fixed to include `<h2>` for major section headings — previously jumped from the single `<h1>` straight to `<h3>` for card titles and skill subheads.

## Build Status (as of July 12, 2026)

- ✅ Session 0 — Homepage hero + about (pushed)
- ✅ Session 1 — PasswordGate component (pushed, merged feat/password-gate → main)
- ✅ Session 2 — Case study page template (pushed, commit a6f5d2b)
- ✅ Session 3 — Split Tender Refunds (layout width fix, image frame removal, WCAG fixes)
- ✅ Session 4 — Logic Builder
- ✅ Session 4.5 — Removed sidebar/TOC, moved Skills into hero info bar
- ✅ Session 5 — Enterprise Delivery Tracker (shipped; cream pull quote, stepper GIF, annotated three-panel)
- 🔄 Session 6 — Install Mods: UX Research (in progress). Skills locked. Embeds a **Google Slides** deck (not Figma) for its research artifact — first case study needing this; likely new template handling vs. the Figma iframe pattern (different embed URL, aspect ratio, `title`).
- ⬜ Sessions 7–9 — Not started

## Key Decisions Log (per-case-study, beyond the locked specs above)

- Admin Area reflection: NO headline, Hurricane Florence context included, lime → arrows (not standard list bullets)
- QA Dashboard: mobile screens prioritized, 4-card A/B grid, two prototype embeds side by side
- Delivery Tracker: stepper GIF (browser-chrome framed) before "design and engineering aligned" callout; annotated three-panel image in hi-fi section

## Voice Rules

Direct, specific, lightly wry, grounded. No em dashes, no AI buzzwords, no parallel-list constructions. Alex's voice is high-fidelity — clean spelling/grammar only, never rewrite the voice.
