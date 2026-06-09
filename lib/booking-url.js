import { getBookingMessage } from './booking-messages.js';

/**
 * @param {import('./site-config.js').getSiteConfig extends (...args: any) => infer R ? R : never} site
 * @param {{ type?: string; lang?: string; channel?: string; date?: string; guests?: string | number }} opts
 */
export function buildMessengerUrl(site, opts = {}) {
  const { contacts } = site;
  const type = opts.type || 'group';
  const lang = opts.lang || 'ru';
  const channel = opts.channel || 'whatsapp';
  const text = getBookingMessage(lang, type, {
    date: opts.date,
    guests: opts.guests != null && opts.guests !== '' ? String(opts.guests) : undefined,
    time: opts.time,
  });

  if (channel === 'telegram') {
    return `https://t.me/${contacts.telegram}?text=${encodeURIComponent(text)}`;
  }

  if (channel === 'zalo') {
    if (contacts.zaloUrl) {
      const sep = contacts.zaloUrl.includes('?') ? '&' : '?';
      return `${contacts.zaloUrl}${sep}msg=${encodeURIComponent(text)}`;
    }
    return `https://zalo.me/${contacts.zaloPhone}?msg=${encodeURIComponent(text)}`;
  }

  return `https://wa.me/${contacts.whatsapp}?text=${encodeURIComponent(text)}`;
}
