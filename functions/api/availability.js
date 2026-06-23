/**
 * GET /api/availability?date=YYYY-MM-DD
 *
 * Returns { available: true/false, message: string }
 *
 * Blocked dates are stored in KV (AVAILABILITY KV namespace) as JSON array,
 * or fall back to a static list configured via environment variable.
 * Example KV key: "blocked-dates" → ["2026-07-01", "2026-07-02"]
 */

/** Fallback blocked dates when KV is not configured */
const FALLBACK_BLOCKED = [];

function parseBlockedDates(env) {
  try {
    const envDates = env.BLOCKED_DATES;
    if (envDates) return JSON.parse(envDates);
  } catch { /* ignore */ }
  return FALLBACK_BLOCKED;
}

async function loadBlockedDates(env) {
  try {
    if (env.AVAILABILITY && typeof env.AVAILABILITY.get === 'function') {
      const raw = await env.AVAILABILITY.get('blocked-dates');
      if (raw) return JSON.parse(raw);
    }
  } catch { /* ignore */ }
  return parseBlockedDates(env);
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=60',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const date = url.searchParams.get('date');

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return json({ available: false, message: 'Invalid date format. Use YYYY-MM-DD.' }, 400);
  }

  const blocked = await loadBlockedDates(context.env);
  const available = !blocked.includes(date);

  return json({
    available,
    date,
    message: available ? 'Date is available.' : 'This date is fully booked.',
  });
}
