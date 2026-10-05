@AGENTS.md

# Alex Tsatsos Portfolio — Context Pack

Paste this at the start of any new claude.ai chat to get fully up to speed.

## Recent Changes (Session 10 — July 13, 2026)

- **Session 10 (Launch readiness: favicon, OG image, SEO meta) shipped.** Three additions, all via Next 16's metadata file conventions + Metadata API. **Favicon:** custom geometric bold-pink "A" on navy (a stroked letterform with rounded joins, tuned for 16px legibility rather than Bricolage's fine terminals which vanish that small) — `app/icon.svg` (rel=icon SVG), `app/favicon.ico` (real multi-res 16/32/48 PNG-encoded ICO, replaces the Next default), `app/apple-icon.png` (180×180, full-bleed navy square with extra padding so iOS's rounded mask doesn't clip the A). Generated with `sharp` (a transitive dep) + a tiny hand-rolled ICO packer (sharp can't write .ico). **OG image:** `app/opengraph-image.tsx` via `next/og` `ImageResponse` (1200×630, static-prerendered), re-exported by `app/twitter-image.tsx`. Matches the hero: navy dot-grid, Architects Daughter eyebrow, Bricolage 800 "Hi! I'm Alex." (pink period), tagline with the lime angled-SVG underline under "everybody" only, muted `alextsatsos.com`, circular Cloudinary headshot with white ring (`c_thumb,g_face,z_0.7` for a centered face). **Big gotcha:** the OG font parser (`@vercel/og`) crashes on the project's variable-font `fvar` tables (`parseFvarAxis` → `Cannot read properties of undefined`), so pinned static weight slices were fetched from Google Fonts into `public/og-fonts/` (Bricolage 800/600, Architects 400, Hanken 500) and `readFile`'d at build — these MUST be committed (not gitignored). Also: every `<div>` with >1 child needs explicit `display:flex` or satori throws (bit the headline div); the tagline is rendered word-by-word with `flexWrap` so it breaks naturally, and the underline is `position:absolute` so its gap doesn't disturb line spacing. **SEO meta (layout.tsx):** `metadataBase` = `https://alextsatsos.com` (canonical pinned to the real domain, never `.vercel.app`), title default + `%s — Alex Tsatsos` template, description, full `openGraph` (type website) + `twitter` (summary_large_image). Case study `generateMetadata` adds per-slug canonical + `og:type=article` — **and must re-declare the OG image explicitly**, because once a page defines its own `openGraph` object Next drops the root `opengraph-image` convention's inherited image. **Verification gotcha:** the running dev server (another chat's) throws `failed to pipe response` on the `next/og` route in Turbopack dev, masking the real error — verify OG routes via a production `next build` (prerenders them to `.next/server/app/opengraph-image.body`), building into a throwaway `distDir` so it doesn't clobber the shared `.next`; `next build` also rewrites/reformats `tsconfig.json`, so `git checkout tsconfig.json` after.
- **Session 9 (Homepage case study grid) shipped.** Wired the `// case studies` placeholder to render the six studies from Notion via `getCaseStudies` (Published, Order asc). New `CaseStudyCards` component (Option B: 4px pink left border, white bg, shadow, 20px radius, three-column number+Title+client / quote / tags+arrow). **Watch-out (1) from Session 8 resolved:** the 7th study, `payments-dashboard`, was **unpublished in Notion** (Alex's call) so the "all published, Order asc" query cleanly returns exactly the six — the locked six verified as Order 1-6 directly against Notion first. **Card data is Notion-sourced except the quote** (the six locked quotes live in a `CARD_QUOTES` map keyed by slug, since exact wording matters most). **Fixes applied after first build:** (A) added the case study **Title** to each card (was number+client only); (B) **removed the lime highlight from all cards** — card 03's "essentially disappeared" now renders plain (scoped to `CaseStudyCards` only; the Delivery Tracker *page's* `CaseStudyPullQuote`/`LimeMark` is untouched); (C) **replaced the Category pill with a new `CardTag` pill** — added a `CardTag` text property in Notion (populated for all six: Point-of-Sale UX, Visual Logic, Systems Resilience, Research Synthesis, Admin Console Design, Dashboard Design), added `cardTag` to the `CaseStudy` type + `pageToCase` mapping; (D) the left-column label swaps **"nCino" → "Fintech"** as a **card-only display transform** (`clientLabel()`), NOT a Notion edit, because `Company` also feeds the case study page hero (which must still read "nCino"). Also populated the previously-empty `Company` field on the 5 retail/fintech studies ("Enterprise Retail" ×3, "nCino" ×2, from the locked Client column) so the card client label has a source. **Links always go to `/case-studies/[slug]`, never the Notion `ExternalLink`** — Split Tender and Logic Builder have `ExternalLink` set to raw Figma prototypes, and honoring it would bypass Split Tender's password gate. **`unstable_cache` gotcha (worse than the Session 6 note):** adding the new `cardTag` field required a full `rm -rf .next` — clearing `.next/cache` **and** restarting the dev server was NOT enough; the pre-`cardTag` `getCaseStudies` result kept being served. **Footer axe false-positive fixed (folded in):** the footer's off-white text was flagged as a hard color-contrast violation (axe read the bg as the page's near-white `#fafaf7`, 1.03:1) because the dot-grid was a `background-image` on the text's ancestor, which defeats axe's effective-background resolution (it was flaky — showed as "incomplete" earlier the same session). Fix: `.footer` keeps a solid navy `background-color` with the dot overlay moved to `.footer::before`, **and the content column `.inner` gets its own solid navy `background-color` + a `.inner::before` dot overlay** (axe reads `.inner`'s navy directly — putting navy only on `.footer` did NOT work, axe still fell through to the body). Now full-page axe = **0 violations / 22 passes** (footer text now sits in the same benign "incomplete" bucket as all other text over the site-wide dot-grid). No footer copy/visual change. **Compositor still blanks on scroll** (Session 8 note) — screenshot the whole page via a viewport tall enough to avoid scrolling (e.g. 1280×3200) rather than scroll-then-shoot.
- **Session 8 (QA Test Dashboard) shipped.** No password, nCino, KeyPhrase "browsable test results", Platform "Desktop + Mobile", Outcome "Internal Tooling". **The Notion body was completely blank** when the session started (contradicting the "all 6 bodies populated" claim) — Alex filled the copy, then the usual heading-1 → heading-2 promotion was needed, and the two ✦ blocks (`## ✦ the 50/50 toggle solution`, `## ✦ rethinking color`) were authored as H2 headings and converted to callouts (bold label + plain body). **Skills (4):** A/B Testing, Dashboard Design, **Mobile UX** (Notion field said "Mobile UX", not the "Mobile Design" in the old decisions list — kept Mobile UX per Alex), Data Table Design. **Two new components:** `DeviceScreens` (caption prefixes `desktop:` and `mobile:` group consecutive images into a natural-aspect device grid — desktop = wide 2-up, mobile = phone-width 2-up — so tall full-page captures aren't distorted by the 16/10 mockup box) and `PrototypePair` (two consecutive `<embed>` blocks render side by side, each labelled/titled from its caption or by position: mobile first, desktop second). Also added a `shot:` prefix (single natural-aspect image, centered, 620px cap) for the portrait `mobile-ab` comparison graphic. **Template bug fixed:** `CaseStudyBody` used to split sections into a narrative zone + a feature zone and render all narrative first, which *reordered* sections whenever a feature section (Background, once it gained an image) preceded a narrative one (Interviews). Since Session 4.5 made both zones visually identical (full-width), they were merged into **one document-order zone** (removed `isFeatureSection`/`VISUAL_BLOCK_TYPES`/`FORCED_FEATURE_KEYS`/`hasCalloutPair`) — non-regressive, re-verified Admin Area + Logic Builder order and axe. **6 images** (CMS-driven, inline in Notion, not in git): `original`→`chrome:` browser frame (the red/green "before"), `mobile-ab`→`shot:` (Card vs Table comparison), and the **4-card grid** = `desktop-main`+`desktop-slideout` (`desktop:`) over `mobile-card`+`mobile-detail` (`mobile:`). Note the final mobile asset is named `mobile-card`, not the `mobile-table` in the old asset list. **2 Figma prototypes** side by side (`<embed>` ×2). axe 0 violations, `image-alt` on all 6. **Watch-outs:** (1) a **7th case study appeared in the DB** — "Payments Dashboard Redesign" (`payments-dashboard`, Order 1, Published) — not in the locked six; will affect homepage grid ordering (Session 9). (2) A stray **unredacted** `admin_area_before` (showing the name blurred for Session 7) is sitting in the shared Cloudinary collection link Alex sent. (3) The in-app browser preview can't screenshot this iframe-heavy page reliably (compositor blanks on scroll); worked around with a tall viewport + sequential `img.decode()` + a `marginTop` shift instead of scrolling.
- **Session 7 (Admin Area Update) shipped.** No password, nCino, KeyPhrase "built for growth". Notion body needed the usual heading-1 → heading-2 promotion; the ✦ "neither group was wrong" finding became a callout (last sentence intentionally regular-weight, not bold — only the label is bold). **Reflection now renders a trailing bulleted list as lime `→` arrows** (design-system: lime on navy): `ReflectionBlock` gained a `bullets` prop + `.arrowList` CSS (`content:"\2192"`, `var(--lime)`), and `renderReflection` extracts the section's `bulleted_list_item`s — reflections with no trailing list are unaffected. No headline (first paragraph isn't bold), Hurricane Florence context kept. **Skills:** "Admin Console Design" wasn't a shared-schema option, so it was added via `ALTER COLUMN "Skills" SET MULTI_SELECT(...)` — pass the FULL existing option list by name (Notion matches by name, preserves option IDs, so other studies' skills stay intact); the 4 locked skills were then set on the page. **Images (8):** four concept screens as two `mockup` pairs, plus a redacted `before` product screenshot, the `card-sort` photo, and two IA maps. The `before` shot had a "Last updated … by [name]" line redacted **via a Cloudinary `e_blur_region:2000,x_,y_,w_,h_` transform baked into the URL** (no re-upload); card-sort (a 4032×3024 / 3MB phone photo) uses `sketch:`→`WhiteboardPhoto` (tape strip, 620px cap) and `f_auto,q_auto` to drop it to ~700KB WebP; the two wide IA maps use `frame:`→`FramedImage` (full-width, natural aspect, individual captions) since they'd be tiny/letterboxed in the 16/10 mockup box. Note: adding images to Context and Research turned them into feature sections, so **all four sections now render in the single full-width zone** (narrativeZone empty) — fine, spacing held. axe 0 violations, `image-alt` passes on all 8.
- **Session 6 (Install Mods: UX Research) shipped.** First case study with a **Google Slides** research embed (not Figma). `PrototypeEmbed` was generalized with an optional `aspectRatio` prop: Slides are auto-detected by URL (`docs.google.com/presentation`) and render at native ~16:9 (`960 / 569`) inside the same browser-chrome frame, with a "Research readout" label and a data-driven iframe `title` — instead of the Figma-tuned fixed height. The page's Notion headings had to be promoted heading-1 → heading-2 to match the section parser; the ✦ "finding that surprised me most" became a callout; Notion forbids commas in multi-select options, so the skill reads `Quantitative Usability Metrics (UMUX & SEQ)`. No pull quote (none in Notion). Note: `unstable_cache` persists in `.next` in dev — clear `.next` (not just restart) to see fresh Notion edits locally.
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

~~Card 03 only: lime highlight on "essentially disappeared"~~ — REMOVED in Session 9: homepage cards render quotes as plain text with no lime highlight (all six consistent). The lime highlight remains on the Delivery Tracker case study *page's* pull quote, which is a separate component.

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

## Build Status (as of July 13, 2026)

- ✅ Session 0 — Homepage hero + about (pushed)
- ✅ Session 1 — PasswordGate component (pushed, merged feat/password-gate → main)
- ✅ Session 2 — Case study page template (pushed, commit a6f5d2b)
- ✅ Session 3 — Split Tender Refunds (layout width fix, image frame removal, WCAG fixes)
- ✅ Session 4 — Logic Builder
- ✅ Session 4.5 — Removed sidebar/TOC, moved Skills into hero info bar
- ✅ Session 5 — Enterprise Delivery Tracker (shipped; cream pull quote, stepper GIF, annotated three-panel)
- ✅ Session 6 — Install Mods: UX Research (shipped; Google Slides research embed via generalized `PrototypeEmbed`, ✦ callout, heading-level fix; axe 0 violations, merged to main)
- ✅ Session 7 — Admin Area Update (shipped; lime-arrow reflection bullets, ✦ callout, "Admin Console Design" added to shared Skills schema, 8 images incl. Cloudinary `e_blur_region` PII redaction on the `before` screenshot; all four sections now full-width feature zone; axe 0 violations)
- ✅ Session 8 — QA Test Dashboard (shipped; `DeviceScreens` + `PrototypePair` components, `desktop:`/`mobile:`/`shot:` caption prefixes, 4-card grid, two side-by-side Figma prototypes; two-zone→single document-order zone fix in `CaseStudyBody`; blank Notion body populated + heading/callout fixes; axe 0 violations)
- ✅ Session 10 — Launch readiness (shipped; favicon SVG/ICO/apple-icon via app-icon conventions, `next/og` OG + twitter image with static `public/og-fonts/` slices, SEO metadata with `metadataBase` canonical + per-case-study OG/canonical overrides; verified via isolated production build)
- ✅ Session 9 — Homepage case study grid (shipped, commit `da332a5`; `CaseStudyCards` Option B grid from Notion, `CardTag` pill + property, card Title, no card lime highlight, nCino→Fintech display swap, footer axe false-positive fixed; `payments-dashboard` unpublished; axe 0 violations, verified live on Vercel)

## Key Decisions Log (per-case-study, beyond the locked specs above)

- Admin Area reflection: NO headline, Hurricane Florence context included, lime → arrows (not standard list bullets)
- QA Dashboard: mobile screens prioritized; 4-card grid = desktop main+slideout over mobile card+detail (via `desktop:`/`mobile:` prefixes → `DeviceScreens`); two Figma prototype embeds side by side (`PrototypePair`); `mobile-ab` comparison via `shot:`; Skills use "Mobile UX" (not "Mobile Design")
- Delivery Tracker: stepper GIF (browser-chrome framed) before "design and engineering aligned" callout; annotated three-panel image in hi-fi section
- Homepage grid (Session 9): cards show number + Title + client label + quote + `CardTag` pill (+ Password pill); quotes hardcoded in `CARD_QUOTES` (slug-keyed), everything else from Notion; NO lime highlight on any card (removed from card 03); client label is `Company` with a card-only `nCino`→`Fintech` swap; links always internal (`/case-studies/[slug]`), never `ExternalLink`

## Voice Rules

Direct, specific, lightly wry, grounded. No em dashes, no AI buzzwords, no parallel-list constructions. Alex's voice is high-fidelity — clean spelling/grammar only, never rewrite the voice.
