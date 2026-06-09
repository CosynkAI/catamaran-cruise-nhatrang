import { buildMessengerUrl } from '../lib/booking-url.js';
import { getSiteConfig } from '../lib/site-config.js';

const ALLOWED_TYPES = new Set(['group', 'individual', 'vip']);
const ALLOWED_CHANNELS = new Set(['whatsapp', 'telegram', 'zalo']);
const ALLOWED_LANGS = new Set(['ru', 'en', 'ko', 'kk']);

export default function handler(req, res) {
  const q = req.query ?? {};
  const type = ALLOWED_TYPES.has(q.type) ? q.type : 'group';
  const lang = ALLOWED_LANGS.has(q.lang) ? q.lang : 'ru';
  const channel = ALLOWED_CHANNELS.has(q.channel) ? q.channel : 'whatsapp';
  const site = getSiteConfig(process.env);

  const url = buildMessengerUrl(site, {
    type,
    lang,
    channel,
    date: typeof q.date === 'string' ? q.date.slice(0, 32) : undefined,
    guests: q.guests != null ? String(q.guests).slice(0, 8) : undefined,
  });

  res.setHeader('Cache-Control', 'no-store');
  res.redirect(302, url);
}
