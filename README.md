# SEO Schema Markup — Free Generator &amp; Validator

> **Live tool:** [seoschemamarkup.com](https://seoschemamarkup.com) · Built by [Bilal Naseer](https://websensepro.com) / [WebSensePro](https://websensepro.com) · [YouTube](https://m.youtube.com/websensepro)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
![No build step](https://img.shields.io/badge/build-none-success)
![Vanilla JS](https://img.shields.io/badge/stack-vanilla%20JS-yellow)

A free, open-source hub of **schema markup generators** and a **JSON-LD validator**. Create valid [schema.org](https://schema.org) structured data for FAQ, Product, Article, Local Business, Organization, Breadcrumb, Event and Review — then test any markup against Google's required and recommended properties. Everything runs in the browser; no signup, no data leaves your machine.

## ✨ Features

- **9 tools** — a schema validator/checker plus generators for the highest-impact schema types.
- **Live JSON-LD output** with hand-rolled syntax highlighting, copy, copy-as-`<script>`, and download.
- **Inline validation** — required fields flagged red, recommended fields amber, in plain English.
- **One shared rule set** (`assets/js/schema-rules.js`) powers both the generators and the validator.
- **Self-referencing schema** — `BreadcrumbList` + `SoftwareApplication` on every tool page.
- **Fast & accessible** — light/dark mode, semantic HTML, no layout shift, Lighthouse-focused.

## 🧱 Stack & constraints

- **Vanilla JS, multi-page static HTML.** No framework, no SPA, no client-side routing.
- **No build step required.** Every page is a real `.html` file that runs as-is.
- **Zero external runtime dependencies / no CDN frameworks.**
- Hosted on **Cloudflare Pages**. MIT licensed.

The only optional server code is a Cloudflare Pages Function for **genuine** ratings (see below).

## 🚀 Run locally

No build needed — it's static. Use any static server so module imports resolve:

```bash
npx serve .
# or
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## 🛠 Project structure

```
/                         index.html (home)
/schema-markup-validator/ validator (paste JSON-LD or HTML)
/<type>-schema-generator/ one folder per generator
/<guide>/                 cornerstone guides + Shopify/WordPress lead-gen pages
assets/css/main.css       hand-written design system (light + dark)
assets/js/shared.js       theme, nav, copy/download, JSON highlighter
assets/js/schema-rules.js single source of truth for required/recommended props
assets/js/validator.js    validation engine (shared)
assets/js/generators/     core framework + per-type config modules
functions/api/rating.js   optional Cloudflare Pages Function (KV)
tools/                     OPTIONAL dev scripts (page + sitemap generation)
```

### Optional dev scripts

These are developer conveniences only — the committed output is plain static HTML and the site works without them:

```bash
node tools/build-pages.js     # regenerate generator/guide pages from shared templates
node tools/build-sitemap.js   # regenerate sitemap.xml
```

Edit shared chrome (nav/footer/head) or page copy in `tools/` then re-run, or edit the generated `.html` directly.

## ⭐ Ratings (opt-in, v1.1)

To keep ratings honest, `aggregateRating` is **never hardcoded**. The included Cloudflare Pages Function (`functions/api/rating.js`) records real votes in Cloudflare **KV** (one vote per IP per page per day) and `assets/js/rating.js` injects a real `aggregateRating` only when `count > 0`. To enable:

1. Create a KV namespace and bind it as `RATINGS` in your Cloudflare Pages project.
2. Add to a tool page: `<div class="rating-widget" data-page="/faq-schema-generator/" id="rate"></div>` and `<script type="module" src="/assets/js/rating.js"></script>`.

Until enabled, pages ship valid `SoftwareApplication` markup **without** `aggregateRating` — fully compliant, just no stars until genuine reviews exist.

## 🔒 Notes

- **No secrets in the repo.** AdSense IDs and any keys are added on the deployed site / via environment — ad slots in the markup are empty styled placeholders.
- Always confirm final eligibility with Google's [Rich Results Test](https://search.google.com/test/rich-results).

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Keep it vanilla, no build, no fake ratings.

## 📄 License

[MIT](LICENSE) © Bilal Naseer / WebSensePro

---

Need schema &amp; SEO done for you? **[WebSensePro](https://websensepro.com)** builds Shopify &amp; WordPress SEO + structured data that earns rich results.
