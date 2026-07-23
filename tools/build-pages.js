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
const { SITE, OG, LOGO, nav, footer, head, breadcrumbJsonLd, siblingCards } = require('./chrome.js');

/* Two-crumb (Home › page) breadcrumb, as used by generator & guide pages. */
function crumbJsonLd(crumbName, slug) {
  return breadcrumbJsonLd([{ name: 'Home', slug: '/' }, { name: crumbName, slug }]);
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

/* ---------------- generator page template ---------------- */
function generatorPage(p) {
  const jsonld = crumbJsonLd(p.crumbName, p.slug) + '\n' + softwareAppJsonLd(p.appName, p.slug) + (p.extraJsonLd || '');
  return `${head(p, jsonld)}

<main id="main">
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> › ${p.crumbName}</nav>
    ${p.notice ? `<div class="notice" role="note"><span class="notice-icon" aria-hidden="true">⚠️</span><div>${p.notice}</div></div>` : ''}
    <h1>${p.h1}</h1>
    <p class="lead muted" style="max-width:760px">${p.lead}</p>

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
          <h2>${p.liquid ? 'Liquid code for your theme' : 'JSON-LD output'}</h2>
          <button class="btn btn-ghost btn-sm" id="copyJson">${p.liquid ? 'Copy Liquid' : 'Copy JSON'}</button>
          ${p.liquid ? '' : '<button class="btn btn-ghost btn-sm" id="copyScript">Copy &lt;script&gt;</button>'}
          <button class="btn btn-primary btn-sm" id="downloadJson">${p.liquid ? 'Download .liquid' : 'Download'}</button>
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

    <div class="rating-widget" style="justify-content: center; margin: 40px 0 20px;" data-page="${p.slug}" id="rate"></div>
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
  const jsonld = crumbJsonLd(p.crumbName, p.slug) + (p.extraJsonLd || '');
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

    <div class="rating-widget" style="justify-content: center; margin: 40px 0 20px;" data-page="${p.slug}" data-schema-type="CreativeWorkSeries" data-schema-name="${p.crumbName}" id="rate"></div>
  </div>
</main>

${footer()}

<script type="module">import { boot } from '/assets/js/shared.js'; boot();</script>
<script type="module" src="/assets/js/rating.js"></script>
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
