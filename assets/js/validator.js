/* ==========================================================================
   validator.js — pure-JS JSON-LD validation engine.
   Shares its rule set with the generators via schema-rules.js.
   ========================================================================== */

import { getRule, generatorFor, schemaRules } from './schema-rules.js';

/* A finding: { level: 'error'|'warn'|'ok'|'info', message, generator? } */

function typeOf(node) {
  const t = node && node['@type'];
  if (Array.isArray(t)) return t;
  return t ? [t] : [];
}

function has(node, prop) {
  const v = node[prop];
  if (v === undefined || v === null) return false;
  if (typeof v === 'string') return v.trim() !== '';
  if (Array.isArray(v)) return v.length > 0;
  return true;
}

/* Validate a single node against its rule(s). Pushes findings; recurses. */
function validateNode(node, findings, path) {
  if (!node || typeof node !== 'object') return;

  // Arrays of nodes
  if (Array.isArray(node)) {
    node.forEach((n, i) => validateNode(n, findings, `${path}[${i}]`));
    return;
  }

  const types = typeOf(node);
  const label = path || (types[0] || 'item');

  if (types.length === 0) {
    findings.push({ level: 'warn', message: `${label}: no @type found — Google can't classify this object.` });
  }

  let matchedRule = false;
  const handledKeys = new Set(); // collection keys already deep-validated below
  for (const type of types) {
    const rule = getRule(type);
    if (!rule) continue;
    matchedRule = true;

    // Required
    for (const r of rule.required) {
      if (r.oneOf) {
        const ok = r.oneOf.some((p) => has(node, p));
        if (!ok) {
          findings.push({ level: 'error', message: `${type}: missing required property — one of "${r.oneOf.join('" or "')}". ${r.note}`, generator: generatorFor(type) });
        }
        continue;
      }
      if (!has(node, r.prop)) {
        findings.push({ level: 'error', message: `${type}: missing required property "${r.prop}". ${r.note}`, generator: generatorFor(type) });
      }
    }
    // Recommended
    for (const r of rule.recommended) {
      if (!has(node, r.prop)) {
        findings.push({ level: 'warn', message: `${type}: missing recommended property "${r.prop}". ${r.note}` });
      }
    }

    // Collection children (FAQ questions, breadcrumb items…)
    if (rule.collection && rule.childType) {
      handledKeys.add(rule.collection);
      const items = node[rule.collection];
      if (Array.isArray(items)) {
        items.forEach((child, i) => {
          if (child && typeof child === 'object' && typeOf(child).length === 0) {
            // assume the documented child type if missing
            child = Object.assign({ '@type': rule.childType }, child);
          }
          validateNode(child, findings, `${type}.${rule.collection}[${i}]`);
        });
      }
    }
  }

  // Recurse into nested typed objects (Offer, address, author, reviewRating, etc.)
  for (const [key, value] of Object.entries(node)) {
    if (key === '@context' || key === '@type' || handledKeys.has(key)) continue;
    if (Array.isArray(value)) {
      value.forEach((v, i) => { if (v && typeof v === 'object') validateNode(v, findings, `${label}.${key}[${i}]`); });
    } else if (value && typeof value === 'object') {
      validateNode(value, findings, `${label}.${key}`);
    }
  }

  if (!matchedRule && types.length > 0) {
    findings.push({ level: 'info', message: `${label}: type "${types.join(', ')}" isn't in our rule set, so it was parsed but not deeply checked. It may still be valid schema.org.` });
  }
}

/* Validate one already-parsed JSON-LD object/array. Returns findings. */
export function validateObject(obj) {
  const findings = [];
  // Unwrap @graph
  let nodes;
  if (Array.isArray(obj)) nodes = obj;
  else if (obj && Array.isArray(obj['@graph'])) {
    if (!obj['@context']) findings.push({ level: 'warn', message: 'Top level: missing "@context". Add "@context": "https://schema.org".' });
    nodes = obj['@graph'];
  } else nodes = [obj];

  nodes.forEach((node, i) => {
    if (!node || typeof node !== 'object') {
      findings.push({ level: 'error', message: `Item ${i}: not a JSON object.` });
      return;
    }
    // @context check (skip if we already flagged it on a @graph wrapper)
    if (!Array.isArray(obj) || true) {
      if (node['@context'] === undefined && !(obj && obj['@context'])) {
        findings.push({ level: 'warn', message: `${node['@type'] || 'Item ' + i}: missing "@context". Add "@context": "https://schema.org".` });
      } else if (node['@context'] && !/schema\.org/.test(JSON.stringify(node['@context']))) {
        findings.push({ level: 'warn', message: `@context is "${node['@context']}" — expected it to reference schema.org.` });
      }
    }
    validateNode(node, findings, '');
  });

  return findings;
}

/* Parse + validate raw JSON-LD text. */
export function validateJsonText(text) {
  const trimmed = (text || '').trim();
  if (!trimmed) return { ok: false, parseError: 'Nothing to validate — paste some JSON-LD first.', findings: [] };
  let obj;
  try {
    obj = JSON.parse(trimmed);
  } catch (e) {
    return { ok: false, parseError: 'Invalid JSON: ' + e.message, findings: [] };
  }
  const findings = validateObject(obj);
  return { ok: !findings.some((f) => f.level === 'error'), parseError: null, findings };
}

/* Extract every <script type="application/ld+json"> block from raw HTML and validate each. */
export function validateHtml(html) {
  const results = [];
  if (!html || !html.trim()) return { blocks: 0, results: [{ ok: false, parseError: 'Paste some HTML that contains JSON-LD.', findings: [] }] };

  // Use the DOM parser — safe, no script execution.
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const scripts = doc.querySelectorAll('script[type="application/ld+json"]');

  if (scripts.length === 0) {
    return { blocks: 0, results: [{ ok: false, parseError: 'No <script type="application/ld+json"> blocks found in that HTML.', findings: [] }] };
  }

  scripts.forEach((s) => {
    results.push(validateJsonText(s.textContent || ''));
  });

  return { blocks: scripts.length, results };
}

/* Summarize findings into counts. */
export function summarize(findings) {
  return {
    errors: findings.filter((f) => f.level === 'error').length,
    warnings: findings.filter((f) => f.level === 'warn').length,
  };
}

export { schemaRules };
