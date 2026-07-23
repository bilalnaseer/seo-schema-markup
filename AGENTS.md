# AGENTS.md — Source of Truth for AI Agents

> Read this file **and** `CHANGELOG.md` before doing anything. Together they let you work on this repo without reading the whole codebase. Keep both updated as you make changes.

---

## 1. What this project is

A **free, open-source schema markup generator + validator** hub. 

- **Live site:** https://seoschemamarkup.com
- **Agency / author:** WebSensePro — https://websensepro.com · Bilal Naseer (Shopify Partner, official n8n Creator) · YouTube https://youtube.com/websensepro
- **Host:** Cloudflare Pages · **License:** MIT · **Repo:** public

---

## 2. Hard constraints (DO NOT violate)

These are non-negotiable. Breaking one is a regression, not a refactor.

1. **Vanilla JS + multi-page static HTML.** No framework (React/Vue/Next/Svelte), no SPA, no client-side routing. Each schema type is its own real `.html` file at its own crawlable URL.
2. **No build step required to run the site.** Every page is plain HTML/CSS/JS that runs as-is. The scripts in `tools/` are *optional dev conveniences*; the committed output is static.
3. **Zero external runtime dependencies / no CDN frameworks.** All JS is hand-written vanilla ES modules. Tiny self-contained helpers only.
4. **No API keys / secrets in the repo.** AdSense IDs and any keys are added on the deployed site / via environment. Ad slots in markup are empty styled placeholders.
5. **No fake or hardcoded `aggregateRating` / reviews.** Ratings come only from genuine votes (see §7). If count is 0, omit `aggregateRating` entirely.
   - **Owner-approved exception (blog posts):** blog posts MAY carry a manually-entered `aggregateRating` via the CMS (`rating_value`/`rating_count`/`best_rating` front-matter → `BlogPosting.aggregateRating` in `build-blog.js`). The site owner accepted the Google manual-action risk. Guardrails that MUST stay: it emits only when a value + a positive count are supplied (blank ⇒ omitted), and the rating is **rendered visibly** on the post. This exception is scoped to blog posts only — do NOT hardcode ratings anywhere else; generators/guides still use genuine votes (§7).
6. **Speed is sacred.** Target Lighthouse 100 / green CWV. No render-blocking resources, no layout shift, defer non-critical JS.
7. **No browser storage for tool state.** `localStorage` is used for the **theme toggle only**.
8. **No thin/duplicate pages.** Every page has unique, useful, original copy.

If a task seems to require breaking one of these, **stop and ask the user** before proceeding.

---

## 3. Architecture & file map

```
/index.html                       Home/hub (HAND-WRITTEN)
/schema-markup-validator/         Validator (HAND-WRITTEN)
/404.html                         Custom 404 (HAND-WRITTEN)

/<type>-schema-generator/         8 generator pages (GENERATED — see §4)
/what-is-schema-markup/           Guide (GENERATED)
/types-of-schema-markup/          Guide (GENERATED)
/how-to-add-schema-markup/        Guide (GENERATED)
/json-ld/                         Guide (GENERATED)
/shopify-schema-markup/           Lead-gen page (GENERATED)
/wordpress-schema-markup/         Lead-gen page (GENERATED)

assets/css/main.css               Hand-written design system. Light + dark
                                  (prefers-color-scheme + [data-theme] toggle).
assets/js/shared.js               UI: theme, nav, toast, copy/download,
                                  asScriptTag, debounce, JSON highlighter,
                                  el() DOM helper, prune(). boot() runs per page.
assets/js/schema-rules.js         ⭐ SINGLE SOURCE OF TRUTH: required/recommended
                                  props per schema.org type. Used by BOTH
                                  generators and the validator.
assets/js/validator.js            Validation engine (parses JSON-LD, extracts
                                  from HTML, walks nodes against schema-rules).
assets/js/validator-page.js       Wiring for the validator page only.
assets/js/generators/core.js      Generic form→JSON-LD framework
                                  (mountGenerator(config)).
assets/js/generators/<type>.js    Per-type config (fields + build()). Thin.
assets/js/rating.js               Async ratings widget (OPT-IN, v1.1, see §7).

functions/api/rating.js           Cloudflare Pages Function for genuine ratings
                                  (KV namespace binding "RATINGS"). OPT-IN.

tools/chrome.js                   ⭐ SINGLE SOURCE for GENERATED-page chrome
                                  (head/nav/footer/breadcrumb). Used by BOTH
                                  build-pages.js and build-blog.js.
tools/build-pages.js              OPTIONAL dev script: generates the GENERATED
                                  generator/guide/lead-gen pages.
tools/pages-data.js               Content/SEO copy for generated pages.
tools/build-blog.js               Builds /blog/ (index + posts) from Markdown.
tools/build-sitemap.js            OPTIONAL: regenerates sitemap.xml (tools +
                                  guides + blog posts).

/blog/                            Blog index + posts (GENERATED from Markdown).
content/blog/*.md                 Blog post SOURCE (front-matter + Markdown),
                                  written by the team via Sveltia CMS.
/admin/                           Sveltia CMS (index.html + config.yml +
                                  vendored sveltia-cms.js). noindex. See
                                  BLOG-SETUP.md for OAuth/Worker/Cloudflare.

robots.txt · sitemap.xml · site.webmanifest · favicon.svg/.ico
assets/img/og-default.(svg|png) · logo-512.png · apple-touch-icon.png
```

### Shared chrome (nav/footer/head)
Nav and footer are **static HTML duplicated in every page** on purpose — crawlable internal links + zero JS dependency + no layout shift. For generated pages (generators, guides AND blog) the chrome lives in **`tools/chrome.js`**; for hand-written pages it's inline. **If you change the nav or footer, update it in `tools/chrome.js` AND in the 3 hand-written pages (`index.html`, `schema-markup-validator/index.html`, `404.html`), then re-run `build-pages.js` AND `build-blog.js`.**

---

## 4. ⚠️ How pages are produced (most important workflow)

Generator, guide, and lead-gen pages are **NOT hand-edited**. They are generated:

```bash
node tools/build-pages.js     # regenerates generator/guide/lead-gen pages
node tools/build-blog.js      # regenerates /blog/ (index + posts) from content/blog/*.md
node tools/build-sitemap.js   # regenerates sitemap.xml (tools + guides + blog)
```

On Cloudflare Pages these run as the deploy **build command** (see BLOG-SETUP.md), so team posts published via the CMS become static HTML automatically. The committed public site is still pure static HTML with zero runtime deps.

- **To change page copy / titles / meta / explainers / guide bodies:** edit `tools/pages-data.js`, then re-run `build-pages.js`.
- **To change shared templates (head/nav/footer/page layout):** edit `tools/chrome.js` (shared) or `tools/build-pages.js` (page bodies), then re-run the builds.
- **Blog posts are NOT hand-edited HTML** — edit `content/blog/*.md` (or use the CMS), then re-run `build-blog.js`. Editing `/blog/**/index.html` directly is lost on the next build.
- **Editing a generated `index.html` directly will be lost** the next time the script runs.
- **Hand-written pages** (`index.html`, `schema-markup-validator/`, `404.html`) are edited directly — they are NOT produced by the script.

**Gotcha:** strings in `tools/pages-data.js` use single quotes. Any apostrophe inside them must be written as `&rsquo;` (or the file won't parse). Page `body` fields are template literals (backticks) so apostrophes are fine there.

---

## 5. How to add a new schema generator

1. Add the type's required/recommended props to `assets/js/schema-rules.js` (this powers validation everywhere).
2. Create `assets/js/generators/<type>.js` calling `mountGenerator({ fileName, sample, fields, build })`. Look at an existing one (e.g. `faq.js`, `product.js`) — keep it thin.
   - `fields`: array of `{ name, label, type, required, recommended, hint, advanced, options }`; use `{ type:'list', item:[...] }` for repeatable groups.
   - `build(values)`: returns the JSON-LD object. Output is auto-`prune()`d (empties dropped) and auto-validated against `schema-rules.js`.
3. Add a page config to the `generators` array in `tools/pages-data.js` (slug, title, desc, h1, lead, module path, explainer HTML 300–500 words with secondary keywords, sibling cards).
4. Add the new link to the **nav dropdown + footer** in `tools/build-pages.js` and the 3 hand-written pages.
5. Run `node tools/build-pages.js && node tools/build-sitemap.js`.

---

## 6. Per-page SEO requirements (apply to every page)

- Unique `<title>` (~55–60 chars, primary keyword front-loaded) + meta description (~150 chars, primary + a secondary keyword + "free").
- One `<h1>` with the primary keyword; logical H2/H3 with secondary keywords.
- Self-referencing `<link rel="canonical">`. Clean trailing-slash URLs.
- Open Graph + Twitter Card tags (title, description, og:image = `/assets/img/og-default.png`).
- Semantic HTML5, descriptive alt text, ARIA where needed.
- Every tool page injects `BreadcrumbList` + `SoftwareApplication` JSON-LD. Generators may also dogfood their own type where genuine (e.g. FAQ page has a real `FAQPage`).
- **Extra JSON-LD per page:** both generator and guide configs support an optional `extraJsonLd` string (raw `<script type="application/ld+json">…</script>`) that is appended into `<head>`. Use it to add genuine page-specific structured data — e.g. `/how-to-add-schema-markup/` carries a real `VideoObject` for its embedded YouTube walkthrough. Never fabricate values (dates, durations, thumbnails must be real).
- **Embedding video:** wrap a YouTube iframe in `<figure class="video-embed"><div class="video-frame"><iframe … loading="lazy"></iframe></div><figcaption>…</figcaption></figure>` (responsive 16:9 `.video-embed` component in `main.css`, no layout shift). Pair it with a `VideoObject` via `extraJsonLd`.
- Internal linking: home → all tools; each tool → validator + 2–3 siblings + relevant guide; guides → tools.

---

## 7. Ratings (genuine only) — current status: OPT-IN / deferred to v1.1

- `aggregateRating` must **never** be fabricated. `functions/api/rating.js` stores real votes in Cloudflare **KV** (binding name `RATINGS`), one vote per IP per page per day. `assets/js/rating.js` injects a real `aggregateRating` into the page's `SoftwareApplication` block **only when count > 0**.
- As of v1 the widget is **not wired into pages**. To enable: bind a KV namespace as `RATINGS` in Cloudflare Pages, then add to a tool page:
  `<div class="rating-widget" data-page="/faq-schema-generator/" id="rate"></div>` + `<script type="module" src="/assets/js/rating.js"></script>`.

---

## 8. Testing (no build; site is static)

ES modules require a real server (won't work over `file://`):

```bash
cd /Users/bilalnaseer/Desktop/seo-schema-markup
python3 -m http.server 8000      # then open http://localhost:8000
# or: npx serve .
```

Checks before considering a change done:
- `for f in $(find assets/js functions tools -name "*.js"); do node --check "$f"; done` — all parse.
- Click the affected page; DevTools console shows **no errors**.
- Paste generator output into Google Rich Results Test (https://search.google.com/test/rich-results) and validator.schema.org — no errors.
- Lighthouse (Mobile) on the served URL stays 100 / green.
- After editing `tools/`, re-run `node tools/build-pages.js && node tools/build-sitemap.js`.

---

## 9. Working agreements for agents

- **Update `CHANGELOG.md`** with every meaningful change (newest first). That's how the next agent avoids re-reading everything.
- **Update this file** if you change architecture, workflow, or a constraint.
- Match existing code style (vanilla, no deps, hand-written CSS). No new dependencies without explicit user approval.
- Do not commit/push unless the user asks. Do not add secrets.
- Keep schema output valid and SEO copy original. Don't create thin pages.
- Prefer editing `tools/pages-data.js` over hand-editing generated HTML.
