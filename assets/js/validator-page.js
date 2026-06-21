/* Wiring for the /schema-markup-validator/ page. */
import { boot, debounce, el } from './shared.js';
import { validateJsonText, validateHtml, summarize } from './validator.js';

boot();

const input = document.getElementById('vInput');
const modeJson = document.getElementById('modeJson');
const modeHtml = document.getElementById('modeHtml');
const results = document.getElementById('vResults');

const SAMPLE = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Wireless Headphones',
  image: 'https://example.com/headphones.jpg',
  offers: { '@type': 'Offer', price: '79.99', priceCurrency: 'USD', availability: 'https://schema.org/InStock' }
}, null, 2);

function findingRow(f) {
  const cls = f.level === 'error' ? 'err' : f.level === 'warn' ? 'warn' : f.level === 'ok' ? 'ok' : 'warn';
  const dot = f.level === 'error' ? '✕' : f.level === 'warn' ? '!' : f.level === 'info' ? 'i' : '✓';
  const children = [el('span', { class: 'dot', text: dot }), el('span', {}, [f.message])];
  if (f.generator) {
    children[1].appendChild(document.createTextNode(' '));
    children[1].appendChild(el('a', { href: f.generator }, ['Fix it with the generator →']));
  }
  return el('div', { class: 'msg ' + cls }, children);
}

function renderSingle(res, label) {
  const frag = document.createDocumentFragment();
  if (label) frag.appendChild(el('h3', { class: 'mt0' }, [label]));

  if (res.parseError) {
    frag.appendChild(el('div', { class: 'msg err' }, [el('span', { class: 'dot', text: '✕' }), el('span', {}, [res.parseError])]));
    return frag;
  }

  const { errors, warnings } = summarize(res.findings);
  const pill = el('div', { class: 'summary-pill ' + (errors ? 'fail' : 'pass') }, [
    errors ? `${errors} error${errors > 1 ? 's' : ''}` + (warnings ? `, ${warnings} warning${warnings > 1 ? 's' : ''}` : '')
           : warnings ? `Valid · ${warnings} recommendation${warnings > 1 ? 's' : ''}` : '✓ Valid — all checks passed'
  ]);
  frag.appendChild(el('div', { style: 'margin-bottom:12px' }, [pill]));

  if (res.findings.length === 0) {
    frag.appendChild(el('div', { class: 'msg ok' }, [el('span', { class: 'dot', text: '✓' }), el('span', {}, ['No issues found. This markup includes all required and recommended properties we check for.'])]));
  } else {
    res.findings.forEach((f) => frag.appendChild(findingRow(f)));
  }
  return frag;
}

function run() {
  results.innerHTML = '';
  const text = input.value;
  if (modeHtml.checked) {
    const out = validateHtml(text);
    if (out.blocks > 1) {
      results.appendChild(el('p', { class: 'muted' }, [`Found ${out.blocks} JSON-LD blocks in the HTML.`]));
    }
    out.results.forEach((res, i) => {
      results.appendChild(renderSingle(res, out.blocks > 1 ? `Block ${i + 1}` : null));
    });
  } else {
    results.appendChild(renderSingle(validateJsonText(text), null));
  }
}

const debouncedRun = debounce(run, 250);
input.addEventListener('input', debouncedRun);
modeJson.addEventListener('change', run);
modeHtml.addEventListener('change', run);

document.getElementById('vSample').addEventListener('click', () => {
  modeJson.checked = true;
  input.value = SAMPLE;
  run();
});
document.getElementById('vClear').addEventListener('click', () => {
  input.value = '';
  results.innerHTML = '';
  input.focus();
});

// Prefill so the page is never empty.
input.value = SAMPLE;
run();
