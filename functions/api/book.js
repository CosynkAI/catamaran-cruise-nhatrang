import { buildMessengerUrl } from '../../lib/booking-url.js';
import { getSiteConfig } from '../../lib/site-config.js';

const ALLOWED_TYPES = new Set(['group', 'individual', 'vip']);
const ALLOWED_CHANNELS = new Set(['whatsapp', 'telegram']);
const ALLOWED_LANGS = new Set(['ru', 'en', 'ko', 'kk']);

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const q = url.searchParams;
  const type = ALLOWED_TYPES.has(q.get('type')) ? q.get('type') : 'group';
  const lang = ALLOWED_LANGS.has(q.get('lang')) ? q.get('lang') : 'ru';
  const channel = ALLOWED_CHANNELS.has(q.get('channel')) ? q.get('channel') : 'whatsapp';
  const site = getSiteConfig(context.env);

  const target = buildMessengerUrl(site, {
    type,
    lang,
    channel,
    date: q.get('date') ? q.get('date').slice(0, 32) : undefined,
    guests: q.get('guests') != null ? String(q.get('guests')).slice(0, 8) : undefined,
  });

  return new Response(null, {
    status: 302,
    headers: {
      Location: target,
      'Cache-Control': 'no-store',
    },
  });
}
