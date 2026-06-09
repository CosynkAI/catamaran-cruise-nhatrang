import { getBookingMessage } from '@lib/booking-messages.js';
import { getCurrentPageSlug, getPageSeo } from '@lib/seo-pages.js';
import { SITE } from './site.js';

const STORAGE_KEY = 'site-lang';

export let currentLang = 'ru';

export const LANG_FLAGS = { ru: '🇷🇺', en: '🇬🇧', ko: '🇰🇷', kk: '🇰🇿' };

const SUPPORTED_LANGS = new Set(['ru', 'en', 'ko', 'kk']);

const localeLoaders = {
  ru: () => import('./locales/ru.js'),
  en: () => import('./locales/en.js'),
  ko: () => import('./locales/ko.js'),
  kk: () => import('./locales/kk.js'),
};

const loadedLocales = {};

export async function ensureLocale(lang) {
  if (!SUPPORTED_LANGS.has(lang)) return loadedLocales.ru ?? {};
  if (!loadedLocales[lang]) {
    const mod = await localeLoaders[lang]();
    loadedLocales[lang] = mod.default;
  }
  return loadedLocales[lang];
}

const MAP_LANG = { ru: 'ru', en: 'en', ko: 'ko', kk: 'ru' };

function getMapEmbed(lang) {
  const hl = MAP_LANG[lang] ?? 'ru';
  return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d778.77!2d109.1043328!3d12.2620948!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31706128699425c7%3A0xe6e90d3f6adbeb06!2zQsOqbiBUw6AuIER1IExp4bujaCBOaGEgVHJhbmc!5e0!3m2!1s${hl}!2svn!4v1749480000000`;
}

export function t(key) {
  const dict = loadedLocales[currentLang] ?? loadedLocales.ru;
  if (!dict) return key;
  return dict[key] ?? loadedLocales.ru?.[key] ?? key;
}

export function getMessage(type) {
  return getBookingMessage(currentLang, type);
}

function getPageUrl() {
  const slug = getCurrentPageSlug();
  return slug ? `${SITE.url}/${slug}/` : `${SITE.url}/`;
}

function updateSeoUrls() {
  const pageUrl = getPageUrl();
  document.querySelector('link[rel="canonical"]')?.setAttribute('href', pageUrl);
  document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => {
    el.setAttribute('href', pageUrl);
  });
  document.querySelector('meta[property="og:url"]')?.setAttribute('content', pageUrl);
  const ogImage = document.querySelector('meta[property="og:image"]');
  if (ogImage) ogImage.content = SITE.ogImage;
  const twImage = document.querySelector('meta[name="twitter:image"]');
  if (twImage) twImage.content = SITE.ogImage;
}

function getActiveMeta() {
  const pageSeo = getPageSeo(getCurrentPageSlug(), currentLang);
  if (!pageSeo) {
    return {
      title: t('meta.title'),
      description: t('meta.description'),
      ogTitle: t('meta.ogTitle'),
      ogDescription: t('meta.ogDescription'),
      schemaName: t('meta.schemaName'),
      schemaDescription: t('meta.schemaDescription'),
    };
  }
  return {
    title: pageSeo.title,
    description: pageSeo.description,
    ogTitle: pageSeo.ogTitle,
    ogDescription: pageSeo.ogDescription,
    schemaName: pageSeo.schemaName,
    schemaDescription: pageSeo.schemaDescription,
  };
}

function applyPageHero() {
  const pageSeo = getPageSeo(getCurrentPageSlug(), currentLang);
  if (!pageSeo) return;
  const title = document.getElementById('hero-title');
  const lead = document.querySelector('.hero-lead');
  if (title) title.innerHTML = pageSeo.heroTitle;
  if (lead) lead.textContent = pageSeo.heroLead;
}

function updateMeta() {
  const meta = getActiveMeta();
  document.title = meta.title;
  document.documentElement.lang = currentLang;

  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.content = meta.description;

  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.content = meta.ogTitle;

  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.content = meta.ogDescription;

  const ogLocale = document.querySelector('meta[property="og:locale"]');
  if (ogLocale) ogLocale.content = t('meta.ogLocale');

  const twTitle = document.querySelector('meta[name="twitter:title"]');
  if (twTitle) twTitle.content = meta.ogTitle;

  const twDesc = document.querySelector('meta[name="twitter:description"]');
  if (twDesc) twDesc.content = meta.ogDescription;

  updateSeoUrls();
}

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function updateFaqSchema() {
  const script = document.getElementById('faq-schema-json');
  if (!script) return;
  script.textContent = JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        { q: 'faq.q1', a: 'faq.a1' },
        { q: 'faq.q2', a: 'faq.a2' },
        { q: 'faq.q3', a: 'faq.a3' },
        { q: 'faq.q4', a: 'faq.a4' },
      ].map(({ q, a }) => ({
        '@type': 'Question',
        name: t(q),
        acceptedAnswer: { '@type': 'Answer', text: stripHtml(t(a)) },
      })),
    },
    null,
    2
  );
}

function updateJsonLd() {
  const script = document.getElementById('schema-json');
  if (!script) return;
  const { contacts } = SITE;
  const meta = getActiveMeta();
  script.textContent = JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'TouristTrip',
      name: meta.schemaName,
      description: meta.schemaDescription,
      url: getPageUrl(),
      image: SITE.ogImage,
      inLanguage: ['ru', 'en', 'ko', 'kk'],
      touristType: ['Tourists', 'Families', 'Expats', 'Couples'],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.96',
        reviewCount: '127',
        bestRating: '5',
        worstRating: '1',
      },
      provider: {
        '@type': 'TravelAgency',
        name: 'Catamaran Cruises · Nha Trang',
        url: SITE.url,
        telephone: `+${contacts.whatsapp}`,
        email: contacts.email,
        image: SITE.ogImage,
        sameAs: [`https://t.me/${contacts.telegram}`, contacts.instagram],
      },
      itinerary: {
        '@type': 'ItemList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Group cruise' },
          { '@type': 'ListItem', position: 2, name: 'Private cruise' },
          { '@type': 'ListItem', position: 3, name: 'VIP Premium' },
        ],
      },
      areaServed: { '@type': 'AdministrativeArea', name: 'Nha Trang, Khanh Hoa, Vietnam' },
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'USD',
        lowPrice: '80',
        highPrice: '1500',
        offerCount: '3',
      },
      paymentAccepted: 'Cash, Credit Card, Rubles, Vietnamese Dong',
    },
    null,
    2
  );
  updateFaqSchema();
}

function updateLangButtons() {
  document.querySelectorAll('[data-lang]').forEach((btn) => {
    const active = btn.dataset.lang === currentLang;
    btn.classList.toggle('is-active', active);
    const isOption = btn.classList.contains('lang-dropdown__option');
    if (isOption) {
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    } else {
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    }
  });
  const flag = document.getElementById('lang-current-flag');
  if (flag) flag.textContent = LANG_FLAGS[currentLang] ?? LANG_FLAGS.ru;
}

export function applyTranslations({ animate = false } = {}) {
  if (animate) document.body.classList.add('is-lang-switching');

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });

  document.querySelectorAll('[data-i18n-html]').forEach((el) => {
    el.innerHTML = t(el.dataset.i18nHtml);
  });

  document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    el.setAttribute('aria-label', t(el.dataset.i18nAria));
  });

  document.querySelectorAll('[data-i18n-alt]').forEach((el) => {
    el.alt = t(el.dataset.i18nAlt);
  });

  document.querySelectorAll('[data-i18n-title]').forEach((el) => {
    el.title = t(el.dataset.i18nTitle);
  });

  const map = document.getElementById('map-frame');
  if (map) {
    const url = getMapEmbed(currentLang);
    map.dataset.src = url;
    if (map.dataset.loaded === 'true') map.src = url;
  }

  applyPageHero();
  updateMeta();
  updateJsonLd();
  updateLangButtons();

  if (animate) {
    requestAnimationFrame(() => {
      document.body.classList.remove('is-lang-switching');
    });
  }
}

export async function setLang(lang) {
  if (!SUPPORTED_LANGS.has(lang)) return;
  await ensureLocale(lang);
  if (!loadedLocales.ru) await ensureLocale('ru');
  currentLang = lang;
  localStorage.setItem(STORAGE_KEY, lang);
  applyTranslations({ animate: true });
}

export async function initI18n(onLangChange) {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && SUPPORTED_LANGS.has(saved)) currentLang = saved;

  await ensureLocale('ru');
  if (currentLang !== 'ru') await ensureLocale(currentLang);

  applyTranslations();

  document.querySelectorAll('[data-lang]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      await setLang(btn.dataset.lang);
      onLangChange?.();
    });
  });
}
