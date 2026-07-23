/* ==========================================================================
   tools/chrome.js — shared chrome (head/nav/footer) for GENERATED pages.
   Single source of truth used by BOTH build-pages.js (generators/guides) and
   build-blog.js (blog index + posts). If you change the nav or footer here,
   also update the 3 HAND-WRITTEN pages per AGENTS.md §3:
   index.html, schema-markup-validator/index.html, 404.html.
   ========================================================================== */

const SITE = 'https://seoschemamarkup.com';
const OG = SITE + '/assets/img/og-default.png';

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
          <a href="/shopify-product-schema-generator/">Shopify Product Schema</a>
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
          <a href="/aggregaterating-schema/">AggregateRating Schema</a>
          <a href="/shopify-schema-markup/">Shopify Schema Markup</a>
          <a href="/wordpress-schema-markup/">WordPress Schema Markup</a>
        </div>
      </div>
      <a href="/blog/">Blog</a>
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
          <li><a href="/shopify-product-schema-generator/">Shopify Product Schema</a></li>
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
          <li><a href="/aggregaterating-schema/">AggregateRating Schema</a></li>
          <li><a href="/shopify-schema-markup/">Shopify Schema Markup</a></li>
          <li><a href="/wordpress-schema-markup/">WordPress Schema Markup</a></li>
        </ul>
      </div>
      <div>
        <h4>Resources</h4>
        <ul>
          <li><a href="/blog/">Blog</a></li>
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
<meta property="og:image" content="${p.ogImage || OG}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${p.title}">
<meta name="twitter:description" content="${p.desc}">
<meta name="twitter:image" content="${p.ogImage || OG}">

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

function breadcrumbJsonLd(crumbs) {
  const items = crumbs.map((c, i) =>
    `    { "@type": "ListItem", "position": ${i + 1}, "name": ${JSON.stringify(c.name)}, "item": "${SITE}${c.slug}" }`
  ).join(',\n');
  return `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
${items}
  ]
}
</script>`;
}

function siblingCards(siblings) {
  return siblings.map((s) => `<a class="card" href="${s.href}"><h3>${s.title}</h3><p>${s.desc}</p></a>`).join('\n        ');
}

module.exports = { SITE, OG, LOGO, nav, footer, head, breadcrumbJsonLd, siblingCards };
