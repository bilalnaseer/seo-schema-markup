#!/usr/bin/env node
/* ==========================================================================
   tools/build-blog.js — builds the /blog/ section from Markdown.

   Source of truth: content/blog/*.md  (written by the team via Sveltia CMS,
   /admin). This script turns each post into a static, crawlable HTML page and
   builds the blog index. It shares nav/footer/head with build-pages.js via
   tools/chrome.js, so the blog matches the rest of the site exactly.

   Run:  node tools/build-blog.js
   On deploy, Cloudflare Pages runs this automatically (see build command).
   Zero runtime/browser dependencies; a tiny built-in Markdown parser only.
   ========================================================================== */

const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const { SITE, head, footer, breadcrumbJsonLd, siblingCards } = require('./chrome.js');

const CONTENT_DIR = path.join(ROOT, 'content', 'blog');
const OUT_DIR = path.join(ROOT, 'blog');
const DEFAULT_AUTHOR = { name: 'Bilal Naseer', url: 'https://websensepro.com' };
const PUBLISHER = { name: 'WebSensePro', url: 'https://websensepro.com', logo: SITE + '/assets/img/logo-512.png' };

/* Cards shown under every post / on the index, linking back into the tools. */
const TOOL_CARDS = [
  { href: '/schema-markup-validator/', title: 'Schema Validator', desc: 'Test any JSON-LD.' },
  { href: '/faq-schema-generator/', title: 'FAQ Schema', desc: 'FAQ rich results.' },
  { href: '/product-schema-generator/', title: 'Product Schema', desc: 'Price &amp; ratings.' },
  { href: '/article-schema-generator/', title: 'Article Schema', desc: 'Author &amp; dates.' },
];

/* ---------------- helpers ---------------- */
function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
// Escape only for text nodes (keeps & entities the author may have typed rare).
function escText(s) {
  return String(s).replace(/&(?![a-zA-Z#0-9]+;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* ---------------- front-matter parser (minimal YAML subset) ----------------
   Supports:  key: value  |  key: "value"  |  key:\n  - item  (list) */
function parseFrontMatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: raw };
  const data = {};
  const lines = m[1].split(/\r?\n/);
  let key = null;
  for (const line of lines) {
    if (!line.trim()) continue;
    const listItem = line.match(/^\s*-\s+(.*)$/);
    if (listItem && key) {
      if (!Array.isArray(data[key])) data[key] = [];
      data[key].push(unquote(listItem[1].trim()));
      continue;
    }
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (kv) {
      key = kv[1];
      const val = kv[2].trim();
      data[key] = val === '' ? '' : unquote(val);
    }
  }
  return { data, body: m[2] };
}
function unquote(s) {
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    return s.slice(1, -1);
  }
  return s;
}

/* Slugify a permalink/title into a clean URL slug: lowercase, spaces & other
   non-alphanumerics collapsed to single hyphens, no leading/trailing hyphens.
   e.g. "My New Blog Post!" -> "my-new-blog-post". Used for the post URL so the
   CMS Permalink field can be pasted in as free text and still yield a clean URL. */
function slugify(s) {
  return String(s)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/* ---------------- inline Markdown ---------------- */
function inline(text) {
  let s = escText(text);
  // images  ![alt](src)
  s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g,
    (_, alt, src, title) => `<img src="${esc(src)}" alt="${esc(alt)}"${title ? ` title="${esc(title)}"` : ''} loading="lazy">`);
  // links  [text](href)
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g, (_, txt, href, title) => {
    const ext = /^https?:\/\//.test(href) && !href.includes('seoschemamarkup.com');
    const attrs = ext ? ' rel="noopener" target="_blank"' : '';
    return `<a href="${esc(href)}"${title ? ` title="${esc(title)}"` : ''}${attrs}>${txt}</a>`;
  });
  // inline code  `code`
  s = s.replace(/`([^`]+)`/g, (_, c) => `<code>${c}</code>`);
  // bold  **text**  __text__
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/__([^_]+)__/g, '<strong>$1</strong>');
  // italic  *text*  _text_
  s = s.replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>').replace(/(^|[^_\w])_([^_]+)_/g, '$1<em>$2</em>');
  return s;
}

/* ---------------- block Markdown ---------------- */
function markdown(md) {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let i = 0;
  while (i < lines.length) {
    let line = lines[i];

    // fenced code block
    const fence = line.match(/^```(\w*)\s*$/);
    if (fence) {
      const buf = [];
      i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) { buf.push(lines[i]); i++; }
      i++; // closing fence
      out.push(`<pre class="code"><code>${esc(buf.join('\n'))}</code></pre>`);
      continue;
    }

    // blank
    if (!line.trim()) { i++; continue; }

    // heading
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) { const lvl = h[1].length; out.push(`<h${lvl}>${inline(h[2].trim())}</h${lvl}>`); i++; continue; }

    // horizontal rule
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) { out.push('<hr>'); i++; continue; }

    // blockquote (consecutive > lines)
    if (/^>\s?/.test(line)) {
      const buf = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) { buf.push(lines[i].replace(/^>\s?/, '')); i++; }
      out.push(`<blockquote>${inline(buf.join(' ').trim())}</blockquote>`);
      continue;
    }

    // unordered list
    if (/^\s*[-*+]\s+/.test(line)) {
      const buf = [];
      while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) { buf.push(lines[i].replace(/^\s*[-*+]\s+/, '')); i++; }
      out.push('<ul>\n' + buf.map((it) => `  <li>${inline(it.trim())}</li>`).join('\n') + '\n</ul>');
      continue;
    }

    // ordered list
    if (/^\s*\d+\.\s+/.test(line)) {
      const buf = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) { buf.push(lines[i].replace(/^\s*\d+\.\s+/, '')); i++; }
      out.push('<ol>\n' + buf.map((it) => `  <li>${inline(it.trim())}</li>`).join('\n') + '\n</ol>');
      continue;
    }

    // paragraph (gather until blank / block start)
    const para = [];
    while (i < lines.length && lines[i].trim() &&
           !/^(#{1,6}\s|>\s?|\s*[-*+]\s+|\s*\d+\.\s+|```)/.test(lines[i]) &&
           !/^(-{3,}|\*{3,}|_{3,})\s*$/.test(lines[i])) {
      para.push(lines[i]); i++;
    }
    out.push(`<p>${inline(para.join(' ').trim())}</p>`);
  }
  return out.join('\n');
}

/* ---------------- dates ---------------- */
function isoDate(d) {
  // Accepts YYYY-MM-DD or full ISO; returns full ISO for datePublished.
  const dt = new Date(d);
  if (isNaN(dt)) return null;
  return dt.toISOString();
}
function humanDate(d) {
  const dt = new Date(d);
  if (isNaN(dt)) return '';
  return dt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

/* ---------------- load posts ---------------- */
function loadPosts() {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs.readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((file) => {
      const raw = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8');
      const { data, body } = parseFrontMatter(raw);
      const slug = slugify(data.slug || file.replace(/\.md$/, ''));
      return {
        slug,
        url: `/blog/${slug}/`,
        title: data.title || slug,
        desc: data.description || '',
        date: data.date || '',
        updated: data.updated || '',
        author: data.author || DEFAULT_AUTHOR.name,
        authorUrl: data.author_url || data.authorUrl || DEFAULT_AUTHOR.url,
        image: data.image || '',
        tags: Array.isArray(data.tags) ? data.tags : (data.tags ? [data.tags] : []),
        draft: String(data.draft) === 'true',
        rating: {
          value: data.rating_value != null ? String(data.rating_value).trim() : '',
          count: data.rating_count != null ? String(data.rating_count).trim() : '',
          best: data.best_rating != null ? String(data.best_rating).trim() : '',
        },
        bodyHtml: markdown(body),
      };
    })
    .filter((p) => !p.draft)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

/* Whether a post has a manually-entered, genuine aggregate rating to emit.
   Owner-approved exception to AGENTS.md §5 (see CHANGELOG / AGENTS §5). Only
   emits when a value AND a positive count are provided; blank => omitted. */
function hasRating(p) {
  return p.rating && p.rating.value !== '' && Number(p.rating.count) > 0 && !isNaN(Number(p.rating.value));
}
function aggregateRatingObj(p) {
  return {
    '@type': 'AggregateRating',
    ratingValue: String(p.rating.value),
    ratingCount: String(p.rating.count),
    bestRating: p.rating.best !== '' ? String(p.rating.best) : '5',
  };
}

/* ---------------- JSON-LD for a post ----------------
   Owner decision: when a post carries a genuine, manually-entered rating we emit
   the rating on a CreativeWorkSeries node (name = post title) and DROP the
   BlogPosting entirely. Google rejects aggregateRating on BlogPosting ("Invalid
   object type for field <parent_node>"), but CreativeWorkSeries IS a supported
   review-snippet type, so this is valid and eligible for star rich results. It
   matches the CreativeWorkSeries pattern rating.js already uses on guide pages.
   Posts without a rating still get the normal BlogPosting for Article SEO. */
function articleJsonLd(p) {
  if (hasRating(p)) {
    const obj = {
      '@context': 'https://schema.org',
      '@type': 'CreativeWorkSeries',
      name: p.title,
      aggregateRating: aggregateRatingObj(p),
    };
    return `<script type="application/ld+json">\n${JSON.stringify(prune(obj), null, 2)}\n</script>`;
  }
  const obj = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: p.title,
    description: p.desc || undefined,
    image: p.image ? [SITE + p.image] : undefined,
    datePublished: isoDate(p.date) || undefined,
    dateModified: isoDate(p.updated || p.date) || undefined,
    author: { '@type': 'Person', name: p.author, url: p.authorUrl || undefined },
    publisher: {
      '@type': 'Organization',
      name: PUBLISHER.name,
      url: PUBLISHER.url,
      logo: { '@type': 'ImageObject', url: PUBLISHER.logo },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': SITE + p.url },
  };
  return `<script type="application/ld+json">\n${JSON.stringify(prune(obj), null, 2)}\n</script>`;
}
function prune(o) {
  if (Array.isArray(o)) return o.map(prune);
  if (o && typeof o === 'object') {
    const r = {};
    for (const k in o) { if (o[k] !== undefined && o[k] !== '') r[k] = prune(o[k]); }
    return r;
  }
  return o;
}

/* ---------------- post page ---------------- */
function postPage(p) {
  const crumbs = breadcrumbJsonLd([
    { name: 'Home', slug: '/' },
    { name: 'Blog', slug: '/blog/' },
    { name: p.title, slug: p.url },
  ]);
  const meta = {
    slug: p.url,
    title: `${p.title} — SEO Schema Markup Blog`,
    desc: p.desc || p.title,
    ogType: 'article',
    ogImage: p.image ? SITE + p.image : undefined,
  };
  const dateLine = [
    p.date ? `<time datetime="${esc(isoDate(p.date))}">${humanDate(p.date)}</time>` : '',
    `<span>by <a href="${esc(p.authorUrl)}">${esc(p.author)}</a></span>`,
    p.updated ? `<span>Updated ${humanDate(p.updated)}</span>` : '',
  ].filter(Boolean).join(' · ');

  return `${head(meta, crumbs + '\n' + articleJsonLd(p))}

<main id="main">
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> › <a href="/blog/">Blog</a> › ${esc(p.title)}</nav>
    <article class="prose blog-post">
      <h1>${esc(p.title)}</h1>
      <p class="post-meta muted">${dateLine}</p>
      ${hasRating(p) ? `<p class="post-rating" aria-label="Rated ${esc(p.rating.value)} out of ${esc(p.rating.best !== '' ? p.rating.best : '5')}"><span class="post-rating-star" aria-hidden="true">★</span> <strong>${esc(p.rating.value)}</strong> <span class="muted">/ ${esc(p.rating.best !== '' ? p.rating.best : '5')} · ${esc(p.rating.count)} rating${Number(p.rating.count) === 1 ? '' : 's'}</span></p>` : ''}
      ${p.image ? `<img class="post-cover" src="${esc(p.image)}" alt="${esc(p.title)}" loading="eager">` : ''}
      ${p.bodyHtml}
    </article>
    <div class="ad-slot" data-format="inline" aria-hidden="true"><!-- Reserved ad slot -->Ad space</div>
    <section class="band">
      <h2 class="center">Generate your schema markup</h2>
      <div class="grid">
        ${siblingCards(TOOL_CARDS)}
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

/* ---------------- blog index ---------------- */
function postCard(p) {
  return `<a class="card blog-card" href="${p.url}">
        ${p.image ? `<img class="blog-card-cover" src="${esc(p.image)}" alt="${esc(p.title)}" loading="lazy">` : ''}
        <h3>${esc(p.title)}</h3>
        <p class="blog-card-meta">${p.date ? humanDate(p.date) : ''}${p.date ? ' · ' : ''}${esc(p.author)}</p>
        <p>${esc(p.desc)}</p>
      </a>`;
}
function indexPage(posts) {
  const crumbs = breadcrumbJsonLd([{ name: 'Home', slug: '/' }, { name: 'Blog', slug: '/blog/' }]);
  const listJsonLd = `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Blog",
  "name": "SEO Schema Markup Blog",
  "url": "${SITE}/blog/",
  "publisher": { "@type": "Organization", "name": "${PUBLISHER.name}", "url": "${PUBLISHER.url}" },
  "blogPost": [
${posts.map((p) => `    { "@type": "BlogPosting", "headline": ${JSON.stringify(p.title)}, "url": "${SITE}${p.url}"${p.date ? `, "datePublished": "${isoDate(p.date)}"` : ''} }`).join(',\n')}
  ]
}
</script>`;
  const meta = {
    slug: '/blog/',
    title: 'Blog — Schema Markup & Structured Data SEO | SEO Schema Markup',
    desc: 'Guides, tips and updates on schema markup, JSON-LD structured data and rich results — from the team behind the free SEO Schema Markup tools.',
  };
  const cards = posts.length
    ? posts.map(postCard).join('\n      ')
    : '<p class="muted">No posts yet — check back soon.</p>';

  return `${head(meta, crumbs + '\n' + listJsonLd)}

<main id="main">
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> › Blog</nav>
    <h1>Blog</h1>
    <p class="lead muted" style="max-width:760px">Guides, updates and practical tips on <strong>schema markup</strong>, JSON-LD structured data and earning rich results in Google.</p>
    <div class="grid blog-grid">
      ${cards}
    </div>
    <div class="ad-slot" data-format="leaderboard" aria-hidden="true"><!-- Reserved ad slot -->Ad space</div>
  </div>
</main>

${footer()}

<script type="module">import { boot } from '/assets/js/shared.js'; boot();</script>
</body>
</html>
`;
}

/* ---------------- write ---------------- */
function write(rel, html) {
  const dir = path.join(OUT_DIR, rel);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  console.log('wrote /blog/' + (rel ? rel + '/' : ''));
}

function build() {
  const posts = loadPosts();
  // Clear /blog/ first so posts deleted or renamed in the CMS don't leave stale
  // orphan pages behind. Everything under /blog/ is generated, so this is safe.
  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });
  write('', indexPage(posts));
  posts.forEach((p) => write(p.slug, postPage(p)));
  console.log(`done. ${posts.length} post(s).`);
}

// Only build when run directly (`node tools/build-blog.js`), not when required
// by build-sitemap.js (which just needs loadPosts()).
if (require.main === module) build();

module.exports = { loadPosts, build };
