/* ==========================================================================
   generators/core.js — generic form → JSON-LD generator framework.
   A generator page provides a config; this renders the form, live output,
   copy/download buttons and inline validation (shared with the validator).
   ========================================================================== */

import { boot, debounce, el, prune, renderJsonInto, copyText, downloadFile, asScriptTag } from '../shared.js';
import { validateObject, summarize } from '../validator.js';

/*
  Field definition:
  { name, label, type, required, recommended, hint, placeholder, advanced, options, value,
    rows }                                  // type: text|url|number|date|datetime-local|textarea|select
  List field:
  { name, type:'list', label, addLabel, advanced, min, item: [ ...subfields ] }
*/

function inputFor(field, value, onInput) {
  let node;
  const common = { id: field._id, name: field.name, placeholder: field.placeholder || '' };
  if (field.type === 'textarea') {
    node = el('textarea', Object.assign({ rows: field.rows || 3 }, common));
    node.value = value || '';
  } else if (field.type === 'select') {
    node = el('select', common, (field.options || []).map((o) =>
      el('option', { value: o.value, ...(o.value === value ? { selected: 'selected' } : {}) }, [o.label])));
  } else {
    node = el('input', Object.assign({ type: field.type || 'text' }, common));
    node.value = value || '';
  }
  node.addEventListener('input', onInput);
  node.addEventListener('change', onInput);
  return node;
}

function labelFor(field) {
  const kids = [field.label];
  if (field.required) kids.push(el('span', { class: 'req', title: 'Required' }, [' *']));
  else if (field.recommended) kids.push(el('span', { class: 'rec', title: 'Recommended' }, [' (recommended)']));
  return el('label', { for: field._id }, kids);
}

function fieldRow(field, value, onInput) {
  const row = el('div', { class: 'field' }, [labelFor(field), inputFor(field, value, onInput)]);
  if (field.hint) row.appendChild(el('p', { class: 'hint' }, [field.hint]));
  return row;
}

export function mountGenerator(config) {
  boot();

  const form = document.getElementById('genForm');
  const advancedWrap = document.getElementById('genAdvanced');
  const codeEl = document.getElementById('genCode');
  const resultsEl = document.getElementById('genResults');
  let idc = 0;
  config.fields.forEach((f) => { f._id = 'f' + (idc++); if (f.item) f.item.forEach((s) => s._id = 'f' + (idc++)); });

  // ---- value store ----
  const values = JSON.parse(JSON.stringify(config.sample || {}));

  const update = debounce(render, 180);

  function listContainerId(name) { return 'list_' + name; }

  function renderListField(field) {
    const container = el('div', {});
    const items = el('div', { id: listContainerId(field.name) });
    if (!Array.isArray(values[field.name])) values[field.name] = [];

    function drawItems() {
      items.innerHTML = '';
      values[field.name].forEach((itemVal, idx) => {
        const card = el('div', { class: 'repeat-item' });
        const remove = el('button', { class: 'remove', type: 'button', 'aria-label': 'Remove', title: 'Remove' }, ['×']);
        remove.addEventListener('click', () => {
          values[field.name].splice(idx, 1);
          if (values[field.name].length < (field.min || 0)) values[field.name].push({});
          drawItems(); render();
        });
        card.appendChild(remove);
        field.item.forEach((sub) => {
          const sid = field.name + '_' + idx + '_' + sub.name;
          const subField = Object.assign({}, sub, { _id: sid });
          card.appendChild(fieldRow(subField, itemVal[sub.name], (e) => {
            itemVal[sub.name] = e.target.value;
            update();
          }));
        });
        items.appendChild(card);
      });
    }
    drawItems();

    const addBtn = el('button', { class: 'btn btn-ghost btn-sm', type: 'button' }, ['+ ' + (field.addLabel || 'Add item')]);
    addBtn.addEventListener('click', () => { values[field.name].push({}); drawItems(); render(); });

    container.appendChild(items);
    container.appendChild(addBtn);
    return el('div', { class: 'field' }, [el('label', {}, [field.label]), field.hint ? el('p', { class: 'hint' }, [field.hint]) : null, container]);
  }

  function renderField(field, target) {
    if (field.type === 'list') { target.appendChild(renderListField(field)); return; }
    target.appendChild(fieldRow(field, values[field.name], (e) => { values[field.name] = e.target.value; update(); }));
  }

  // Build form: basic fields in form, advanced in <details>
  const advancedFields = config.fields.filter((f) => f.advanced);
  config.fields.filter((f) => !f.advanced).forEach((f) => renderField(f, form));
  if (advancedFields.length) {
    advancedFields.forEach((f) => renderField(f, advancedWrap));
  } else {
    document.querySelector('.advanced')?.remove();
  }

  // ---- render output + validation ----
  function render() {
    const obj = prune(config.build(values)) || {};
    const json = renderJsonInto(codeEl, obj);
    codeEl._json = json;

    // Validate the generated object using the shared engine.
    const findings = validateObject(obj);
    const { errors, warnings } = summarize(findings);
    resultsEl.innerHTML = '';
    const pill = el('div', { class: 'summary-pill ' + (errors ? 'fail' : 'pass') }, [
      errors ? `${errors} required field${errors > 1 ? 's' : ''} missing`
             : warnings ? `Valid · ${warnings} recommended field${warnings > 1 ? 's' : ''} to add`
             : '✓ Valid — ready to use'
    ]);
    resultsEl.appendChild(pill);
    findings.filter((f) => f.level === 'error' || f.level === 'warn').forEach((f) => {
      const cls = f.level === 'error' ? 'err' : 'warn';
      const dot = f.level === 'error' ? '✕' : '!';
      resultsEl.appendChild(el('div', { class: 'msg ' + cls }, [el('span', { class: 'dot', text: dot }), el('span', {}, [f.message])]));
    });
  }

  // ---- buttons ----
  document.getElementById('copyJson').addEventListener('click', () => copyText(codeEl._json, 'JSON copied'));
  document.getElementById('copyScript').addEventListener('click', () => copyText(asScriptTag(codeEl._json), 'Script snippet copied'));
  document.getElementById('downloadJson').addEventListener('click', () => downloadFile(codeEl._json, config.fileName || 'schema.json'));

  render();
}
