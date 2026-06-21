/* ==========================================================================
   Cloudflare Pages Function — Admin Ratings Endpoint.
   POST /api/admin/rating

   Requires a KV namespace binding named RATINGS and an env var ADMIN_SECRET_KEY.
   Body: { page: "/faq-schema-generator/", enabled: true|false, count: 150, average: 4.8, clear: true|false }
   ========================================================================== */

function cors(extra = {}) {
  return {
    'content-type': 'application/json',
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'POST,OPTIONS',
    'access-control-allow-headers': 'content-type, authorization',
    ...extra,
  };
}

function safeKey(page) {
  return String(page || '').replace(/[^a-z0-9/_-]/gi, '').slice(0, 120);
}

export async function onRequestOptions() {
  return new Response(null, { headers: cors() });
}

export async function onRequestPost({ request, env }) {
  // 1. Auth
  const authHeader = request.headers.get('Authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  
  if (!env.ADMIN_SECRET_KEY || token !== env.ADMIN_SECRET_KEY) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: cors() });
  }

  // 2. Parse Body
  let body;
  try { body = await request.json(); } catch (e) {
    return new Response(JSON.stringify({ error: 'bad json' }), { status: 400, headers: cors() });
  }

  const page = safeKey(body.page);
  if (!page) {
    return new Response(JSON.stringify({ error: 'missing page' }), { status: 400, headers: cors() });
  }

  // 3. Clear Override
  if (body.clear) {
    await env['ratings-variable'].delete('config:' + page);
    return new Response(JSON.stringify({ success: true, cleared: true }), { headers: cors() });
  }

  // 4. Set Override
  const config = {};
  if (typeof body.enabled === 'boolean') config.enabled = body.enabled;
  if (typeof body.count === 'number') config.count = body.count;
  if (typeof body.average === 'number') config.average = body.average;

  if (Object.keys(config).length === 0) {
    return new Response(JSON.stringify({ error: 'no config fields provided' }), { status: 400, headers: cors() });
  }

  await env['ratings-variable'].put('config:' + page, JSON.stringify(config));

  return new Response(JSON.stringify({ success: true, config }), { headers: cors() });
}
