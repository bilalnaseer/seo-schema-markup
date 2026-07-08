# Changelog

All notable changes to this project. Newest first. Agents: **append an entry here for every meaningful change** so others don't have to re-read the codebase. Format loosely follows [Keep a Changelog](https://keepachangelog.com/); dates are YYYY-MM-DD.

---

## [Unreleased]

### Added
- Wired the rating widget (`assets/js/rating.js`) into all **guide/lead-gen pages** (previously only on the 8 generators + validator). Added to the `guidePage()` template in `tools/build-pages.js`: a `.rating-widget` div at the bottom (after the sibling band) plus the `rating.js` module script. Guides have no `SoftwareApplication` block, so the widget uses `data-schema-type="CreativeWorkSeries"` with `data-schema-name="${p.crumbName}"` (the existing custom-injection mechanism) — a real `aggregateRating` is injected only when genuine votes exist (count > 0), per the no-fabricated-ratings constraint. Covers all 7 pages: what-is / types-of / how-to-add / json-ld / aggregaterating-schema / shopify / wordpress. Home (`index.html`, the hub) and `404.html` (noindex) intentionally excluded.
- New guide page `/aggregaterating-schema/` (in the **Guides** menu, positioned after JSON-LD). Educational guide on AggregateRating schema — what it is, required/recommended properties, a nested-Product JSON-LD example, Google's genuine-ratings rules (no fabricated ratings, per constraint §5), and links to the Review/Product generators + validator. Embeds `/assets/img/aggregaterating-schema.png` in a `<figure>` so readers see the star-rating rich result they can earn (first guide to use an inline image; relies on the global responsive `img` rule). Added as a new entry in the `guides` array in `tools/pages-data.js`; nav dropdown + footer links added in `tools/build-pages.js` and the 2 hand-written pages with the Guides menu (`index.html`, `schema-markup-validator/index.html`). Sitemap regenerated (16 → 17 URLs).
- Deprecation notice on `/faq-schema-generator/` (top of page, above H1) explaining Google deprecated FAQ rich results — no longer shown in Search as of May 7, 2026 (announced May 8, 2026; docs removed June 15, 2026), per https://developers.google.com/search/updates#faq-deprecation; `FAQPage` markup stays valid, tool stays fully functional. Implemented as a new optional `notice` field on the FAQ config in `tools/pages-data.js`, rendered by the generator template in `tools/build-pages.js`, styled with a new `.notice` callout (warn tokens, dark-mode aware) in `main.css`. Static/non-dismissible to respect the no-browser-storage constraint.
- Protected admin endpoint (`functions/api/admin/rating.js`) for manual rating adjustments via KV config.
- Support for `config:<page>` in `functions/api/rating.js` and frontend widget `assets/js/rating.js` to override or disable ratings.
- Wired the rating widget (`assets/js/rating.js`) into all generator tool pages via `tools/build-pages.js`.
- Added support for custom schema injection (e.g. `CreativeWorkSeries`) to `rating.js` via `data-schema-type` and `data-schema-name` attributes.

### Changed
- Changed the required environment variable for the admin endpoint from `ADMIN_TOKEN` to `ADMIN_SECRET_KEY`.
- Updated code to explicitly use the `ratings-variable` KV namespace binding if needed.

### Fixed
- Fixed a mobile responsiveness issue where the `.tool` grid would stretch horizontally off-screen due to CSS Grid blowout from the `<pre>` code block. Added `min-width: 0;` to `.panel`.
- Fixed an issue where the rating stars would not visually color yellow to reflect the current average rating.

### Added
- Wired the rating widget (`assets/js/rating.js`) into the `schema-markup-validator/index.html` hand-written page.
- `AGENTS.md` — source-of-truth onboarding doc for AI agents (constraints, architecture, workflows).
- `CHANGELOG.md` — this file.

---

## [0.1.0] — 2026-06-21 — Initial v1 build

First working version. Vanilla static site, no build step, no runtime dependencies. Builds + verifies clean (all JS parses, all 26 embedded JSON-LD blocks valid, all internal links resolve, validator engine unit-tested).

### Added — Foundation
- `assets/css/main.css` — hand-written design system. Light + dark mode via `prefers-color-scheme` and a `[data-theme]` toggle (theme is the only thing in `localStorage`). Includes nav/footer/tool/validation styles, reserved no-layout-shift ad slots, and JSON syntax-highlight tokens.
- `assets/js/shared.js` — `boot()` (theme + nav init), `toast`, `copyText`, `downloadFile`, `asScriptTag`, `debounce`, hand-rolled `highlightJson`/`renderJsonInto`, `el()` DOM helper, `prune()` (drops empty/undefined fields).
- `assets/js/schema-rules.js` — single source of truth: required/recommended properties per schema.org type (FAQPage, Product/Offer/AggregateRating/Review/Rating, Article+aliases, Person, Organization, LocalBusiness+aliases, PostalAddress, BreadcrumbList/ListItem, Event, VideoObject, SoftwareApplication). `getRule()` resolves aliases.
- `assets/js/validator.js` — validation engine. Parses JSON-LD text, extracts JSON-LD from raw HTML (via `DOMParser`), unwraps `@graph`, walks nodes against `schema-rules.js`, supports `oneOf` requirements and collection child checks. Returns levelled findings + `summarize()`.
- `LICENSE` (MIT), `.gitignore`, `CONTRIBUTING.md`, `README.md` (marketing + WebSensePro/YouTube backlinks, MIT badge).

### Added — Pages (hand-written)
- `index.html` — home/hub. WebSite + Organization JSON-LD, tool cards, guide cards, explainer copy.
- `schema-markup-validator/index.html` + `assets/js/validator-page.js` — two modes (paste JSON-LD / paste HTML), live results with red errors / amber warnings, "fix it in the generator" links, sample loader.
- `404.html` — custom, noindex, links back into the hub.

### Added — Generators (framework + 8 tools)
- `assets/js/generators/core.js` — `mountGenerator(config)`: renders form (incl. repeatable `list` fields + Advanced `<details>`), live debounced JSON-LD output with highlighting, Copy JSON / Copy `<script>` / Download buttons, inline validation via the shared engine.
- Per-type configs: `faq.js`, `product.js`, `article.js`, `local-business.js`, `organization.js`, `breadcrumb.js`, `event.js`, `review.js`. Each ships a prefilled sample. Review/Product never emit fake ratings (only when user provides real values).
- Generated pages for all 8 at their slugs, each with `BreadcrumbList` + `SoftwareApplication` JSON-LD and a 300–500-word explainer; FAQ page dogfoods a real `FAQPage`.

### Added — Guides & lead-gen (generated)
- `/what-is-schema-markup/`, `/types-of-schema-markup/`, `/how-to-add-schema-markup/`, `/json-ld/`.
- `/shopify-schema-markup/`, `/wordpress-schema-markup/` — lead-gen pages with a tasteful WebSensePro CTA.

### Added — Dev tooling (optional, not required to run site)
- `tools/build-pages.js` + `tools/pages-data.js` — generate generator/guide/lead-gen pages from shared templates (keeps nav/footer/head consistent). Committed output is plain static HTML.
- `tools/build-sitemap.js` — regenerates `sitemap.xml` (16 URLs).

### Added — Global SEO / assets
- `robots.txt`, `sitemap.xml`, `site.webmanifest`.
- `favicon.svg`, `favicon.ico`, `assets/img/og-default.svg` + generated 1200×630 `og-default.png`, `logo-512.png`, `apple-touch-icon.png`.

### Added — Ratings (opt-in, not wired in v1)
- `functions/api/rating.js` — Cloudflare Pages Function backed by KV (`RATINGS` binding), one vote per IP per page per day, never fabricates ratings.
- `assets/js/rating.js` — async, on-idle widget that injects a real `aggregateRating` only when count > 0.

### Notes / deferred
- Ratings widget deferred to v1.1 per spec — pages ship valid `SoftwareApplication` **without** `aggregateRating`.
- Video schema generator (`/video-schema-generator/`) deferred (was optional v1.5).
- Not yet done: git commit/push, GitHub repo settings, Cloudflare Pages connection, AdSense (post-approval).
- `favicon.ico` is a PNG payload (SVG favicon is primary).
