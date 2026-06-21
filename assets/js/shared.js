/* ==========================================================================
   shared.js — UI behavior + reusable helpers (vanilla ES module)
   No dependencies. Imported by every interactive page.
   ========================================================================== */

/* ---------- Theme toggle (preference is the ONLY thing stored) ---------- */
export function initTheme() {
  const btn = document.querySelector('.theme-toggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const root = document.documentElement;
    const current = root.getAttribute('data-theme')
      || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });
}

/* ---------- Mobile nav + dropdowns ---------- */
export function initNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
  }
  document.querySelectorAll('.dropdown > button').forEach((b) => {
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      const dd = b.parentElement;
      const wasOpen = dd.classList.contains('open');
      document.querySelectorAll('.dropdown.open').forEach((d) => d.classList.remove('open'));
      if (!wasOpen) dd.classList.add('open');
    });
  });
  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown.open').forEach((d) => d.classList.remove('open'));
  });
}

/* ---------- Toast ---------- */
let toastEl;
export function toast(message) {
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.className = 'toast';
    document.body.appendChild(toastEl);
  }
  toastEl.textContent = message;
  toastEl.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toastEl.classList.remove('show'), 1800);
}

/* ---------- Clipboard + download ---------- */
export async function copyText(text, label = 'Copied to clipboard') {
  try {
    await navigator.clipboard.writeText(text);
  } catch (e) {
    // Fallback for older browsers / non-secure contexts
    const ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (e2) {}
    document.body.removeChild(ta);
  }
  toast(label);
}

export function downloadFile(text, filename, type = 'application/json') {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}

/* Wrap a JSON-LD string in a ready-to-paste <script> tag. */
export function asScriptTag(jsonString) {
  return '<script type="application/ld+json">\n' + jsonString + '\n<\/script>';
}

/* ---------- Debounce ---------- */
export function debounce(fn, ms = 200) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

/* ---------- Hand-rolled JSON syntax highlighter (no library) ---------- */
function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function highlightJson(jsonString) {
  const esc = escapeHtml(jsonString);
  // Tokenize strings (and detect keys by trailing colon), numbers, booleans, null.
  return esc.replace(
    /("(?:\\.|[^"\\])*")(\s*:)?|\b(true|false)\b|\b(null)\b|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g,
    (m, str, colon, bool, nul, num) => {
      if (str !== undefined) {
        if (colon !== undefined) return '<span class="tok-key">' + str + '</span><span class="tok-punc">' + colon + '</span>';
        return '<span class="tok-str">' + str + '</span>';
      }
      if (bool !== undefined) return '<span class="tok-bool">' + bool + '</span>';
      if (nul !== undefined) return '<span class="tok-null">' + nul + '</span>';
      if (num !== undefined) return '<span class="tok-num">' + num + '</span>';
      return m;
    }
  );
}

/* Render a JSON-LD object into a <pre><code> element with highlighting. */
export function renderJsonInto(preCodeEl, obj) {
  const json = JSON.stringify(obj, null, 2);
  preCodeEl.innerHTML = highlightJson(json);
  return json;
}

/* ---------- Small DOM helpers ---------- */
export function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') node.className = v;
    else if (k === 'html') node.innerHTML = v;
    else if (k === 'text') node.textContent = v;
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
    else if (v !== null && v !== undefined) node.setAttribute(k, v);
  }
  (Array.isArray(children) ? children : [children]).forEach((c) => {
    if (c == null) return;
    node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  });
  return node;
}

/* Drop empty strings / empty arrays / empty objects so output stays clean. */
export function prune(obj) {
  if (Array.isArray(obj)) {
    const arr = obj.map(prune).filter((v) => v !== undefined);
    return arr.length ? arr : undefined;
  }
  if (obj && typeof obj === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      const pv = prune(v);
      if (pv !== undefined) out[k] = pv;
    }
    return Object.keys(out).length ? out : undefined;
  }
  if (typeof obj === 'string') { const t = obj.trim(); return t === '' ? undefined : t; }
  return obj;
}

/* ---------- Boot common UI on every page ---------- */
export function boot() {
  initTheme();
  initNav();
}
