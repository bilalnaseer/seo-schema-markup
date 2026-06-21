#!/usr/bin/env node
/* Optional: regenerate sitemap.xml. Run:  node tools/build-sitemap.js */
const fs = require('fs');
const path = require('path');
const SITE = 'https://seoschemamarkup.com';
const today = new Date().toISOString().slice(0, 10);

const { generators, guides } = require('./pages-data.js');
const urls = [
  { loc: '/', priority: '1.0' },
  { loc: '/schema-markup-validator/', priority: '0.9' },
  ...generators.map((g) => ({ loc: g.slug, priority: '0.8' })),
  ...guides.map((g) => ({ loc: g.slug, priority: '0.7' })),
];

const body = urls.map((u) =>
  `  <url>\n    <loc>${SITE}${u.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`
).join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
fs.writeFileSync(path.resolve(__dirname, '..', 'sitemap.xml'), xml);
console.log('wrote sitemap.xml with', urls.length, 'urls');
