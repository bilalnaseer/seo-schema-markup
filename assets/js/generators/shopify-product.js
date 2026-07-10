/* ==========================================================================
   generators/shopify-product.js — Shopify Product schema builder.

   Unlike the other generators, this tool does NOT emit static JSON-LD. It
   emits a ready-to-paste **Liquid** snippet whose values are resolved live on
   the merchant's storefront ({{ product.title }}, {{ product.price }}, …).
   Because Liquid `{{ }}` placeholders aren't valid JSON, it can't reuse the
   JSON-validation framework in core.js — it renders Liquid text and wires up
   its own copy/download. Toggles decide which properties are included; Liquid
   `{% if %}` guards decide, per storefront, whether each value is present.

   No fabricated ratings (constraint §5/§7): the aggregateRating block is
   always wrapped in an `{% if <review count> > 0 %}` guard, so it only ever
   renders when the store has genuine reviews. And because there's no native
   Shopify review system, the merchant supplies the rating/count as Liquid
   expressions (typically their reviews-app metafields) in three inputs.

   The whole snippet is wrapped in `{% if template.name == 'product' %}` so it
   only emits on product pages.
   ========================================================================== */

import { boot, el, debounce, copyText, downloadFile } from '../shared.js';

const fields = [
  { name: 'offerMode', label: 'Pricing (offers)', type: 'select', options: [
    { value: 'variant', label: 'One Offer per variant (recommended)' },
    { value: 'single', label: 'Single Offer — selected/first variant' },
    { value: 'aggregate', label: 'Price range (AggregateOffer)' },
  ], hint: 'Per-variant is richest for products with several variants; use a single Offer for simple products.' },
  { name: 'ratingValue', label: 'Average rating metafield', type: 'text',
    placeholder: 'REPLACE_WITH_YOUR_METAFIELD',
    hint: 'We prepend <code>product.metafields.</code> automatically — enter only your metafield path (e.g. <code>reviews.rating.value.rating</code>). Leave blank to omit ratings.' },
  { name: 'reviewCount', label: 'Review count metafield', type: 'text',
    placeholder: 'REPLACE_WITH_YOUR_METAFIELD',
    hint: 'Enter only the metafield path after <code>product.metafields.</code> Required for ratings; also guards the block so it only renders when the count is &gt; 0.' },
  { name: 'bestRating', label: 'Best rating metafield', type: 'text',
    placeholder: 'REPLACE_WITH_YOUR_METAFIELD',
    hint: 'Optional. Enter only the metafield path after <code>product.metafields.</code> Omitted if left blank (schema.org treats bestRating as 5 by default).' },
  { name: 'includeBrand', label: 'Brand (from product vendor)', type: 'checkbox', value: true },
  { name: 'includeDescription', label: 'Description', type: 'checkbox', value: true },
  { name: 'includeSku', label: 'SKU', type: 'checkbox', value: true, advanced: true },
  { name: 'includeCategory', label: 'Category (from product type)', type: 'checkbox', value: false, advanced: true },
  { name: 'includeGtin', label: 'GTIN (from variant barcode)', type: 'checkbox', value: false, advanced: true },
  { name: 'multipleImages', label: 'Include all product images', type: 'checkbox', value: false, advanced: true,
    hint: 'Off = featured image only.' },
];

/* Rating inputs start blank — the merchant fills in only the metafield path
   after `product.metafields.` (the prefix is hardcoded in the Liquid). */
const DEFAULTS = {};

/* ---------------- Liquid assembly ---------------- */
function buildLiquid(v) {
  let s = `{% if template.name == 'product' %}
<script type="application/ld+json">
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": {{ product.title | json }},
  "url": {{ shop.url | append: product.url | json }}`;

  if (v.multipleImages) {
    s += `
  {% if product.images.size > 0 %},
  "image": [
    {%- for image in product.images -%}
    {{ image | image_url: width: 1200 | prepend: 'https:' | json }}{%- unless forloop.last -%},{%- endunless -%}
    {%- endfor -%}
  ]{% endif %}`;
  } else {
    s += `
  {% if product.featured_image %},
  "image": {{ product.featured_image | image_url: width: 1200 | prepend: 'https:' | json }}{% endif %}`;
  }

  if (v.includeDescription) {
    s += `
  {% if product.description != blank %},
  "description": {{ product.description | strip_html | truncatewords: 60 | json }}{% endif %}`;
  }
  if (v.includeSku) {
    s += `
  {% if product.selected_or_first_available_variant.sku != blank %},
  "sku": {{ product.selected_or_first_available_variant.sku | json }}{% endif %}`;
  }
  if (v.includeGtin) {
    s += `
  {% if product.selected_or_first_available_variant.barcode != blank %},
  "gtin": {{ product.selected_or_first_available_variant.barcode | json }}{% endif %}`;
  }
  if (v.includeBrand) {
    s += `
  {% if product.vendor != blank %},
  "brand": { "@type": "Brand", "name": {{ product.vendor | json }} }{% endif %}`;
  }
  if (v.includeCategory) {
    s += `
  {% if product.type != blank %},
  "category": {{ product.type | json }}{% endif %}`;
  }

  if (v.offerMode === 'single') {
    s += `,
  "offers": {
    "@type": "Offer",
    "price": {{ product.selected_or_first_available_variant.price | divided_by: 100.0 | json }},
    "priceCurrency": {{ shop.currency | json }},
    "availability": {% if product.selected_or_first_available_variant.available %}"https://schema.org/InStock"{% else %}"https://schema.org/OutOfStock"{% endif %},
    "url": {{ shop.url | append: product.url | json }}
  }`;
  } else if (v.offerMode === 'aggregate') {
    s += `,
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": {{ shop.currency | json }},
    "lowPrice": {{ product.price_min | divided_by: 100.0 | json }},
    "highPrice": {{ product.price_max | divided_by: 100.0 | json }},
    "offerCount": {{ product.variants.size | json }},
    "availability": {% if product.available %}"https://schema.org/InStock"{% else %}"https://schema.org/OutOfStock"{% endif %}
  }`;
  } else {
    s += `,
  "offers": [
    {%- for variant in product.variants -%}
    {
      "@type": "Offer",
      "price": {{ variant.price | divided_by: 100.0 | json }},
      "priceCurrency": {{ shop.currency | json }},
      "availability": {% if variant.available %}"https://schema.org/InStock"{% else %}"https://schema.org/OutOfStock"{% endif %},
      "url": {{ shop.url | append: product.url | append: '?variant=' | append: variant.id | json }}{% if variant.sku != blank %},
      "sku": {{ variant.sku | json }}{% endif %}
    }{%- unless forloop.last -%},{%- endunless -%}
    {%- endfor -%}
  ]`;
  }

  const rv = (v.ratingValue || '').trim();
  const rc = (v.reviewCount || '').trim();
  const br = (v.bestRating || '').trim();
  if (rv && rc) {
    // The `product.metafields.` prefix is fixed — inputs supply only the path.
    const rvExpr = 'product.metafields.' + rv;
    const rcExpr = 'product.metafields.' + rc;
    const best = br ? `,
    "bestRating": {{ product.metafields.${br} | json }}` : '';
    s += `
  {% comment %} aggregateRating renders ONLY when the review count is > 0 — never fabricate ratings. Confirm these metafield expressions resolve in your store. {% endcomment %}
  {% if ${rcExpr} > 0 %},
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": {{ ${rvExpr} | json }},
    "reviewCount": {{ ${rcExpr} | json }}${best}
  }{% endif %}`;
  }

  s += `
}
<\/script>
{% endif %}`;
  return s;
}

/* ---------------- Form rendering (checkboxes + selects) ---------------- */
function mount() {
  boot();
  const form = document.getElementById('genForm');
  const advancedWrap = document.getElementById('genAdvanced');
  const codeEl = document.getElementById('genCode');
  const resultsEl = document.getElementById('genResults');

  const values = {};
  fields.forEach((f) => {
    if (f.type === 'select') values[f.name] = f.options[0].value;
    else if (f.type === 'text') values[f.name] = DEFAULTS[f.name] || '';
    else values[f.name] = f.value;
  });

  let idc = 0;
  const update = debounce(render, 140);

  function rowFor(field) {
    const id = 'sf' + (idc++);
    let control, wrap;
    if (field.type === 'select') {
      control = el('select', { id, name: field.name },
        field.options.map((o) => el('option', { value: o.value }, [o.label])));
      control.value = values[field.name];
      control.addEventListener('change', (e) => { values[field.name] = e.target.value; update(); });
      wrap = el('div', { class: 'field' }, [el('label', { for: id }, [field.label]), control]);
    } else if (field.type === 'text') {
      control = el('input', { type: 'text', id, name: field.name, placeholder: field.placeholder || '' });
      control.value = values[field.name];
      control.addEventListener('input', (e) => { values[field.name] = e.target.value; update(); });
      wrap = el('div', { class: 'field' }, [el('label', { for: id }, [field.label]), control]);
    } else {
      control = el('input', { type: 'checkbox', id, name: field.name });
      control.checked = !!values[field.name];
      control.addEventListener('change', (e) => { values[field.name] = e.target.checked; update(); });
      wrap = el('div', { class: 'field field-check' }, [el('label', { for: id }, [control, ' ' + field.label])]);
    }
    if (field.hint) wrap.appendChild(el('p', { class: 'hint', html: field.hint }));
    return wrap;
  }

  fields.filter((f) => !f.advanced).forEach((f) => form.appendChild(rowFor(f)));
  fields.filter((f) => f.advanced).forEach((f) => advancedWrap.appendChild(rowFor(f)));

  function render() {
    const liquid = buildLiquid(values);
    codeEl.textContent = liquid;
    codeEl._liquid = liquid;

    resultsEl.innerHTML = '';
    resultsEl.appendChild(el('div', { class: 'msg ok' }, [
      el('span', { class: 'dot', text: '📋' }),
      el('span', { html: 'Paste into <code>layout/theme.liquid</code> just before <code>&lt;/head&gt;</code> (Online Store &rarr; Themes &rarr; Edit code). Works on every theme — incl. Horizon  . The <code>{% if template.name == \'product\' %}</code> wrapper keeps it on product pages only.' }),
    ]));
    const rv = (values.ratingValue || '').trim();
    const rc = (values.reviewCount || '').trim();
    if (rv && rc) {
      resultsEl.appendChild(el('div', { class: 'msg warn' }, [
        el('span', { class: 'dot', text: '!' }),
        el('span', { html: 'Ratings only render when your review count is &gt; 0 — confirm those metafield expressions resolve in your store before publishing.' }),
      ]));
    } else if (rv || rc) {
      resultsEl.appendChild(el('div', { class: 'msg warn' }, [
        el('span', { class: 'dot', text: '!' }),
        el('span', { html: 'Add <strong>both</strong> average rating and review count to output an <code>aggregateRating</code>.' }),
      ]));
    }
  }

  document.getElementById('copyJson').addEventListener('click', () => copyText(codeEl._liquid, 'Liquid copied'));
  document.getElementById('downloadJson').addEventListener('click',
    () => downloadFile(codeEl._liquid, 'product-schema.liquid', 'text/plain'));

  render();
}

mount();
