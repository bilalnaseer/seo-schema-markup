#!/usr/bin/env node
/* ==========================================================================
   tools/build-pages.js — OPTIONAL dev scaffolding.
   Generates the static HTML for generator, guide and lead-gen pages from
   shared templates so nav/footer/head stay consistent. The committed output
   is plain static HTML; the site runs with NO build step. Re-run only when
   you change the shared chrome:  node tools/build-pages.js
   ========================================================================== */

const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const SITE = 'https://seoschemamarkup.com';
const OG = SITE + '/assets/img/og-default.png';

/* ---------------- shared chrome ---------------- */
const LOGO = '<svg class="logo" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8" fill="#5b6cff"/><path d="M9 11h14M9 16h14M9 21h9" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></svg>';

function nav() {
  return `<header class="site-header">
  <nav class="nav wrap" aria-label="Primary">
    <a class="brand" href="/">${LOGO} SEO Schema Markup</a>
    <div class="nav-spacer"></div>
    <div class="nav-links" id="navLinks">
      <a href="/schema-markup-validator/">Validator</a>
      <div class="dropdown">
        <button aria-haspopup="true" aria-expanded="false">Generators ▾</button>
        <div class="dropdown-menu">
          <a href="/faq-schema-generator/">FAQ Schema</a>
          <a href="/product-schema-generator/">Product Schema</a>
          <a href="/article-schema-generator/">Article Schema</a>
          <a href="/local-business-schema-generator/">Local Business Schema</a>
          <a href="/organization-schema-generator/">Organization Schema</a>
          <a href="/breadcrumb-schema-generator/">Breadcrumb Schema</a>
          <a href="/event-schema-generator/">Event Schema</a>
          <a href="/review-schema-generator/">Review Schema</a>
        </div>
      </div>
      <div class="dropdown">
        <button aria-haspopup="true" aria-expanded="false">Guides ▾</button>
        <div class="dropdown-menu">
          <a href="/what-is-schema-markup/">What is Schema Markup</a>
          <a href="/types-of-schema-markup/">Types of Schema Markup</a>
          <a href="/how-to-add-schema-markup/">How to Add Schema Markup</a>
          <a href="/json-ld/">What is JSON-LD</a>
          <a href="/shopify-schema-markup/">Shopify Schema Markup</a>
          <a href="/wordpress-schema-markup/">WordPress Schema Markup</a>
        </div>
      </div>
    </div>
    <button class="theme-toggle" aria-label="Toggle dark mode" title="Toggle theme">
      <svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19"/></svg>
      <svg class="moon" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>
    </button>
    <button class="nav-toggle" aria-label="Open menu" aria-controls="navLinks">☰</button>
  </nav>
</header>`;
}

function footer() {
  return `<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div>
        <a class="brand" href="/" style="margin-bottom:12px">${LOGO} SEO Schema Markup</a>
        <p class="footer-about">Free, open-source JSON-LD schema generators and a validator. Built by <a href="https://websensepro.com">Bilal Naseer</a>, Shopify Partner &amp; official n8n Creator at <a href="https://websensepro.com">WebSensePro</a>.</p>
      </div>
      <div>
        <h4>Generators</h4>
        <ul>
          <li><a href="/faq-schema-generator/">FAQ Schema</a></li>
          <li><a href="/product-schema-generator/">Product Schema</a></li>
          <li><a href="/article-schema-generator/">Article Schema</a></li>
          <li><a href="/local-business-schema-generator/">Local Business Schema</a></li>
          <li><a href="/organization-schema-generator/">Organization Schema</a></li>
          <li><a href="/breadcrumb-schema-generator/">Breadcrumb Schema</a></li>
          <li><a href="/event-schema-generator/">Event Schema</a></li>
          <li><a href="/review-schema-generator/">Review Schema</a></li>
        </ul>
      </div>
      <div>
        <h4>Guides</h4>
        <ul>
          <li><a href="/what-is-schema-markup/">What is Schema Markup</a></li>
          <li><a href="/types-of-schema-markup/">Types of Schema Markup</a></li>
          <li><a href="/how-to-add-schema-markup/">How to Add Schema Markup</a></li>
          <li><a href="/json-ld/">What is JSON-LD</a></li>
          <li><a href="/shopify-schema-markup/">Shopify Schema Markup</a></li>
          <li><a href="/wordpress-schema-markup/">WordPress Schema Markup</a></li>
        </ul>
      </div>
      <div>
        <h4>Resources</h4>
        <ul>
          <li><a href="/schema-markup-validator/">Schema Validator</a></li>
          <li><a href="https://websensepro.com">WebSensePro Agency</a></li>
          <li><a href="https://m.youtube.com/websensepro">YouTube Channel</a></li>
          <li><a href="https://github.com/bilalnaseer/seo-schema-markup">GitHub Repo</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 SEO Schema Markup · MIT License</span>
      <span>Made with care by <a href="https://websensepro.com">WebSensePro</a></span>
    </div>
  </div>
</footer>`;
}

function head(p, extraJsonLd) {
  const url = SITE + p.slug;
  return `<!DOCTYPE html>
<html lang="en" prefix="og: https://ogp.me/ns#">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${p.title}</title>
<meta name="description" content="${p.desc}">
<link rel="canonical" href="${url}">
<meta name="theme-color" content="#5b6cff">

<meta property="og:type" content="${p.ogType || 'website'}">
<meta property="og:site_name" content="SEO Schema Markup">
<meta property="og:title" content="${p.title}">
<meta property="og:description" content="${p.desc}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${OG}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${p.title}">
<meta name="twitter:description" content="${p.desc}">
<meta name="twitter:image" content="${OG}">

<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">

<script>(function(){try{var t=localStorage.getItem('theme');if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}})();</script>
<link rel="preload" href="/assets/css/main.css" as="style">
<link rel="stylesheet" href="/assets/css/main.css">
${extraJsonLd || ''}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
${nav()}`;
}

function breadcrumbJsonLd(crumbName, slug) {
  return `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "${SITE}/" },
    { "@type": "ListItem", "position": 2, "name": "${crumbName}", "item": "${SITE}${slug}" }
  ]
}
</script>`;
}

function softwareAppJsonLd(name, slug) {
  return `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "${name}",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Web",
  "url": "${SITE}${slug}",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
}
</script>`;
}

function siblingCards(siblings) {
  return siblings.map((s) => `<a class="card" href="${s.href}"><h3>${s.title}</h3><p>${s.desc}</p></a>`).join('\n        ');
}

/* ---------------- generator page template ---------------- */
function generatorPage(p) {
  const jsonld = breadcrumbJsonLd(p.crumbName, p.slug) + '\n' + softwareAppJsonLd(p.appName, p.slug) + (p.extraJsonLd || '');
  return `${head(p, jsonld)}

<main id="main">
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> › ${p.crumbName}</nav>
    <h1>${p.h1}</h1>
    <p class="lead muted" style="max-width:760px">${p.lead}</p>
    <div class="rating-widget" data-page="${p.slug}" id="rate"></div>

    <div class="tool">
      <div class="panel">
        <div class="output-head"><h2>Details</h2></div>
        <form id="genForm" autocomplete="off"></form>
        <details class="advanced">
          <summary>Advanced &amp; recommended fields</summary>
          <div id="genAdvanced"></div>
        </details>
      </div>

      <div class="panel">
        <div class="output-head">
          <h2>JSON-LD output</h2>
          <button class="btn btn-ghost btn-sm" id="copyJson">Copy JSON</button>
          <button class="btn btn-ghost btn-sm" id="copyScript">Copy &lt;script&gt;</button>
          <button class="btn btn-primary btn-sm" id="downloadJson">Download</button>
        </div>
        <div class="codewrap"><pre class="code"><code id="genCode"></code></pre></div>
        <div class="results" id="genResults"></div>
      </div>
    </div>

    <div class="ad-slot" data-format="leaderboard" aria-hidden="true"><!-- Reserved ad slot -->Ad space</div>

    <section class="explainer">
      ${p.explainer}
    </section>

    <section class="band">
      <h2 class="center">More schema tools</h2>
      <div class="grid">
        ${siblingCards(p.siblings)}
      </div>
    </section>
  </div>
</main>

${footer()}

<script type="module" src="${p.module}"></script>
<script type="module" src="/assets/js/rating.js"></script>
</body>
</html>
`;
}

/* ---------------- guide / lead-gen page template ---------------- */
function guidePage(p) {
  const jsonld = breadcrumbJsonLd(p.crumbName, p.slug) + (p.extraJsonLd || '');
  return `${head(Object.assign({ ogType: 'article' }, p), jsonld)}

<main id="main">
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> › ${p.crumbName}</nav>
    <article class="prose">
      <h1>${p.h1}</h1>
      ${p.body}
      ${p.cta || ''}
    </article>
    <div class="ad-slot" data-format="inline" aria-hidden="true"><!-- Reserved ad slot -->Ad space</div>
    <section class="band">
      <h2 class="center">Generate your schema markup</h2>
      <div class="grid">
        ${siblingCards(p.siblings)}
      </div>
    </section>
  </div>
</main>

${footer()}

<script type="module">import { boot } from '/assets/js/shared.js'; boot();</script>
</body>
</html>
`;
}

/* ---------------- write helper ---------------- */
function write(slug, html) {
  const dir = path.join(ROOT, slug.replace(/^\/|\/$/g, ''));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  console.log('wrote', slug);
}

const { generators, guides } = require('./pages-data.js');
generators.forEach((p) => write(p.slug, generatorPage(p)));
guides.forEach((p) => write(p.slug, guidePage(p)));
console.log('done.');
