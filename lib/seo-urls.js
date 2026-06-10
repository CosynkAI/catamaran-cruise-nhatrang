/** @typedef {'ru' | 'en' | 'ko' | 'kk'} SiteLang */

export const SITE_LANGS = ['ru', 'en', 'ko', 'kk'];

/** @param {SiteLang | 'x-default'} lang @param {string} [slug] */
export function pagePath(lang, slug = '') {
  const normalized = lang === 'x-default' ? 'ru' : lang;
  const cleanSlug = slug.trim();
  if (!cleanSlug) {
    return normalized === 'ru' ? '/' : `/${normalized}/`;
  }
  return normalized === 'ru' ? `/${cleanSlug}/` : `/${normalized}/${cleanSlug}/`;
}

/** @param {string} siteUrl @param {SiteLang | 'x-default'} lang @param {string} [slug] */
export function pageUrl(siteUrl, lang, slug = '') {
  const base = siteUrl.replace(/\/$/, '');
  const path = pagePath(lang, slug);
  return `${base}${path === '/' ? '/' : path}`;
}

/** @param {string} siteUrl @param {string} [slug] */
export function hreflangAlternates(siteUrl, slug = '') {
  return ['ru', 'en', 'ko', 'kk', 'x-default'].map((lang) => ({
    lang,
    href: pageUrl(siteUrl, lang, slug),
  }));
}

/** @param {string} pathname */
export function detectLangFromPathname(pathname) {
  const first = pathname.split('/').filter(Boolean)[0];
  if (first && SITE_LANGS.includes(first) && first !== 'ru') return first;
  return null;
}
