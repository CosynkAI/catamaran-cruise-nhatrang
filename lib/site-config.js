const DEFAULTS = {
  url: 'https://seatrips-nhatrang.com',
  whatsapp: '84364389764',
  telegram: 'Nastasia8963',
  instagram: 'https://www.instagram.com/redfoxproduction89?igsh=MzU5NHIwa3EzbWtq&utm_source=q',
  tiktok: 'https://www.tiktok.com/@seatrips.nhatrang?_r=1&_t=ZS-96w4vWILHT6',
  email: 'info@seatrips-nhatrang.com',
  mapsUrl: 'https://maps.app.goo.gl/i6bR4GQdWunXpdtT6',
  ogImagePath: '/images/og-image.jpg',
  heroPosterPath: '/images/hero-poster.jpg',
};

function read(env, viteKey, fallback) {
  const plain = viteKey.replace(/^VITE_/, '');
  const value = env[viteKey] ?? env[plain];
  if (value === undefined || value === null || String(value).trim() === '') {
    return fallback;
  }
  return String(value).trim();
}

/** @param {Record<string, string | undefined>} env */
export function getSiteConfig(env = {}) {
  const url = read(env, 'VITE_SITE_URL', DEFAULTS.url).replace(/\/$/, '');
  const ogOverride = read(env, 'VITE_OG_IMAGE_URL', '');
  return {
    url,
    ogImage: ogOverride || `${url}${DEFAULTS.ogImagePath}`,
    heroPoster: `${url}${DEFAULTS.heroPosterPath}`,
    mapsUrl: read(env, 'VITE_MAPS_URL', DEFAULTS.mapsUrl),
    contacts: {
      whatsapp: read(env, 'VITE_WHATSAPP_NUMBER', DEFAULTS.whatsapp).replace(/\D/g, ''),
      telegram: read(env, 'VITE_TELEGRAM_USERNAME', DEFAULTS.telegram).replace(/^@/, ''),
      instagram: read(env, 'VITE_INSTAGRAM_URL', DEFAULTS.instagram),
      tiktok: read(env, 'VITE_TIKTOK_URL', DEFAULTS.tiktok),
      email: read(env, 'VITE_CONTACT_EMAIL', DEFAULTS.email),
    },
  };
}

export function getBookingApiUrl(siteUrl, params) {
  const base = `${siteUrl.replace(/\/$/, '')}/api/book`;
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value != null && value !== '') qs.set(key, String(value));
  }
  const query = qs.toString();
  return query ? `${base}?${query}` : base;
}
