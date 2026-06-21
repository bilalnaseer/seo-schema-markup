/* ==========================================================================
   rating.js — async, on-interaction ratings widget (OPT-IN, v1.1).
   Loads current genuine rating, lets a visitor vote once/day, and injects a
   REAL aggregateRating into the page's SoftwareApplication JSON-LD.
   If count is 0, no aggregateRating is injected. Never fabricates ratings.

   Enable by adding to a tool page:
     <div class="rating-widget" data-page="/faq-schema-generator/" id="rate"></div>
     <script type="module" src="/assets/js/rating.js"></script>
   ========================================================================== */

const root = document.getElementById('rate');
if (root) {
  const page = root.getAttribute('data-page') || location.pathname;
  const customSchemaType = root.getAttribute('data-schema-type');
  const customSchemaName = root.getAttribute('data-schema-name') || document.title.split(' —')[0];
  const meta = document.createElement('span');
  meta.className = 'rating-meta';

  const stars = document.createElement('div');
  stars.className = 'stars';
  // RTL trick in CSS means we render 5..1 for hover fill.
  for (let v = 5; v >= 1; v--) {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = '★';
    b.setAttribute('aria-label', v + ' star' + (v > 1 ? 's' : ''));
    b.addEventListener('click', () => vote(v));
    stars.appendChild(b);
  }
  root.appendChild(stars);
  root.appendChild(meta);

  function injectAggregate(count, average) {
    if (!count) return;

    if (customSchemaType) {
      const newScript = document.createElement('script');
      newScript.type = 'application/ld+json';
      newScript.textContent = JSON.stringify({
        "@context": "https://schema.org/",
        "@type": customSchemaType,
        "name": customSchemaName,
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": String(average),
          "bestRating": "5",
          "ratingCount": String(count)
        }
      }, null, 2);
      document.head.appendChild(newScript);
      return;
    }

    const appScript = [...document.querySelectorAll('script[type="application/ld+json"]')]
      .find((s) => /"SoftwareApplication"/.test(s.textContent));
    if (!appScript) return;
    try {
      const data = JSON.parse(appScript.textContent);
      data.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: String(average),
        ratingCount: String(count),
      };
      appScript.textContent = JSON.stringify(data, null, 2);
    } catch (e) {}
  }

  function show(count, average) {
    meta.textContent = count
      ? `${average} / 5 from ${count} vote${count > 1 ? 's' : ''}`
      : 'Be the first to rate this tool';
      
    const roundAvg = Math.round(average);
    const btns = stars.querySelectorAll('button');
    btns.forEach((b, i) => {
      const v = 5 - i;
      if (v <= roundAvg && count > 0) {
        b.classList.add('on');
      } else {
        b.classList.remove('on');
      }
    });

    injectAggregate(count, average);
  }

  async function load() {
    try {
      const r = await fetch('/api/rating?page=' + encodeURIComponent(page));
      const d = await r.json();
      if (d.enabled === false) {
        root.remove();
        return;
      }
      show(d.count || 0, d.average || 0);
    } catch (e) { meta.textContent = 'Rate this tool'; }
  }

  async function vote(value) {
    try {
      const r = await fetch('/api/rating', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ page, value }),
      });
      const d = await r.json();
      if (d.enabled === false || r.status === 403) {
        root.remove();
        return;
      }
      if (d.count) show(d.count, d.average);
      if (r.status === 429) meta.textContent += ' · you already voted today';
    } catch (e) {}
  }

  // Defer the network call so it never blocks initial render / CWV.
  if ('requestIdleCallback' in window) requestIdleCallback(load);
  else setTimeout(load, 1200);
}
