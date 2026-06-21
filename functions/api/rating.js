/* ==========================================================================
   Cloudflare Pages Function — genuine ratings only.
   GET  /api/rating?page=<key>           -> { count, average }
   POST /api/rating  { page, value }     -> records one vote (1..5)

   Requires a KV namespace binding named RATINGS (set in the Pages dashboard).
   Rate limit: one vote per IP per page per day. NEVER fabricates ratings —
   if count is 0, the client omits aggregateRating entirely.
   OPT-IN for v1.1: not wired into the pages yet. See README.
   ========================================================================== */

const DAY = 86400;

function cors(extra = {}) {
  return {
    'content-type': 'application/json',
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET,POST,OPTIONS',
    'access-control-allow-headers': 'content-type',
    ...extra,
  };
}

function safeKey(page) {
  // Only allow path-like keys to avoid abuse.
  return String(page || '').replace(/[^a-z0-9/_-]/gi, '').slice(0, 120);
}

export async function onRequestOptions() {
  return new Response(null, { headers: cors() });
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const page = safeKey(url.searchParams.get('page'));
  if (!page) return new Response(JSON.stringify({ error: 'missing page' }), { status: 400, headers: cors() });

  const configRaw = await env['ratings-variable'].get('config:' + page);
  const config = configRaw ? JSON.parse(configRaw) : {};
  if (config.enabled === false) {
    return new Response(JSON.stringify({ enabled: false }), { headers: cors() });
  }
  if (config.count !== undefined && config.average !== undefined) {
    return new Response(JSON.stringify({ count: config.count, average: config.average }), { headers: cors() });
  }

  const raw = await env['ratings-variable'].get('agg:' + page);
  const { count = 0, sum = 0 } = raw ? JSON.parse(raw) : {};
  const average = count ? Math.round((sum / count) * 10) / 10 : 0;
  return new Response(JSON.stringify({ count, average }), { headers: cors() });
}

export async function onRequestPost({ request, env }) {
  let body;
  try { body = await request.json(); } catch (e) {
    return new Response(JSON.stringify({ error: 'bad json' }), { status: 400, headers: cors() });
  }
  const page = safeKey(body.page);
  const value = Math.round(Number(body.value));
  if (!page || !(value >= 1 && value <= 5)) {
    return new Response(JSON.stringify({ error: 'invalid' }), { status: 400, headers: cors() });
  }

  // Check config
  const configRaw = await env['ratings-variable'].get('config:' + page);
  const config = configRaw ? JSON.parse(configRaw) : {};
  if (config.enabled === false) {
    return new Response(JSON.stringify({ error: 'ratings disabled' }), { status: 403, headers: cors() });
  }

  // Rate limit: one vote per IP per page per day.
  const ip = request.headers.get('cf-connecting-ip') || '0.0.0.0';
  const voteKey = `vote:${page}:${ip}`;
  if (await env['ratings-variable'].get(voteKey)) {
    return new Response(JSON.stringify({ error: 'already voted', ...(await readAgg(env, page)) }), { status: 429, headers: cors() });
  }

  const raw = await env['ratings-variable'].get('agg:' + page);
  const agg = raw ? JSON.parse(raw) : { count: 0, sum: 0 };
  agg.count += 1;
  agg.sum += value;

  await env['ratings-variable'].put('agg:' + page, JSON.stringify(agg));
  await env['ratings-variable'].put(voteKey, '1', { expirationTtl: DAY });

  const average = Math.round((agg.sum / agg.count) * 10) / 10;
  if (config.count !== undefined && config.average !== undefined) {
    return new Response(JSON.stringify({ count: config.count, average: config.average }), { headers: cors() });
  }
  return new Response(JSON.stringify({ count: agg.count, average }), { headers: cors() });
}

async function readAgg(env, page) {
  const configRaw = await env['ratings-variable'].get('config:' + page);
  const config = configRaw ? JSON.parse(configRaw) : {};
  if (config.enabled === false) return { enabled: false };
  if (config.count !== undefined && config.average !== undefined) {
    return { count: config.count, average: config.average };
  }

  const raw = await env['ratings-variable'].get('agg:' + page);
  const { count = 0, sum = 0 } = raw ? JSON.parse(raw) : {};
  return { count, average: count ? Math.round((sum / count) * 10) / 10 : 0 };
}
