import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildTravelAgencyProvider } from '../lib/business-schema.js';
import { getSeoBody } from '../lib/seo-body.js';
import { getSiteConfig } from '../lib/site-config.js';
import { hreflangAlternates, pagePath, pageUrl } from '../lib/seo-urls.js';
import { SEO_PAGES } from '../lib/seo-pages.js';
import { REVIEWS_I18N } from '../lib/reviews-i18n.js';
import ru from '../src/locales/ru.js';
import en from '../src/locales/en.js';
import ko from '../src/locales/ko.js';
import kk from '../src/locales/kk.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');
const indexPath = path.join(distDir, 'index.html');
const LANGS = ['ru', 'en', 'ko', 'kk'];
const HOME_LOCALES = { ru, en, ko, kk };

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
}

function escapeText(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;');
}

function setMeta(html, selector, content) {
  const re = new RegExp(`(${selector} content=")[^"]*(")`, 'i');
  return html.replace(re, (_, open, close) => `${open}${escapeAttr(content)}${close}`);
}

function setTagText(html, pattern, value) {
  return html.replace(pattern, value);
}

function buildLocaleDict(lang) {
  const base = HOME_LOCALES[lang];
  const reviews = REVIEWS_I18N[lang] ?? REVIEWS_I18N.ru;
  return { ...base, ...reviews };
}

function applyDataI18n(html, dict) {
  let next = html.replace(
    /(<([a-z][a-z0-9]*)[^>]*\sdata-i18n="([^"]+)"[^>]*>)([^<]*)(<\/\2>)/gi,
    (match, open, _tag, key, _content, close) => {
      const val = dict[key];
      if (val === undefined) return match;
      return `${open}${escapeText(val)}${close}`;
    }
  );

  next = next.replace(
    /(<([a-z][a-z0-9]*)[^>]*\sdata-i18n-html="([^"]+)"[^>]*>)([\s\S]*?)(<\/\2>)/gi,
    (match, open, _tag, key, _content, close) => {
      const val = dict[key];
      if (val === undefined) return match;
      return `${open}${val}${close}`;
    }
  );

  next = next.replace(
    /(<[^>]*\sdata-i18n-aria="([^"]+)"[^>]*)(>)/gi,
    (match, open, key, close) => {
      const val = dict[key];
      if (val === undefined) return match;
      const cleaned = open.replace(/\saria-label="[^"]*"/gi, '');
      return `${cleaned} aria-label="${escapeAttr(val)}"${close}`;
    }
  );

  next = next.replace(
    /(<[^>]*\sdata-i18n-title="([^"]+)"[^>]*)(>)/gi,
    (match, open, key, close) => {
      const val = dict[key];
      if (val === undefined) return match;
      const cleaned = open.replace(/\stitle="[^"]*"/gi, '');
      return `${cleaned} title="${escapeAttr(val)}"${close}`;
    }
  );

  return next;
}

function applyMapEmbed(html, lang) {
  const hl = lang === 'kk' ? 'ru' : lang;
  const embed = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.387!2d109.196731!3d12.238795!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31706128699425c7%3A0xe6e90d3f6adbeb06!2zQsOqbiBUw6AuIER1IExp4bujaCBOaGEgVHJhbmc!5e0!3m2!1s${hl}!2svn!4v1749480000000`;
  return html.replace(/data-src="https:\/\/www\.google\.com\/maps\/embed[^"]*"/, `data-src="${embed}"`);
}

function homeSeo(lang) {
  const dict = HOME_LOCALES[lang];
  return {
    title: dict['meta.title'],
    description: dict['meta.description'],
    ogTitle: dict['meta.ogTitle'],
    ogDescription: dict['meta.ogDescription'],
    ogLocale: dict['meta.ogLocale'],
    schemaName: dict['meta.schemaName'],
    schemaDescription: dict['meta.schemaDescription'],
    heroTitle: dict['hero.title'],
    heroLead: dict['hero.lead'],
  };
}

function getSeo(lang, page) {
  if (!page) return homeSeo(lang);
  return page.locales[lang] ?? page.locales.ru;
}

function patchSchemaJson(html, seo, canonicalUrl, site) {
  const provider = buildTravelAgencyProvider(site.contacts, site);
  return html.replace(
    /(<script type="application\/ld\+json" id="schema-json">\s*)([\s\S]*?)(\s*<\/script>)/,
    (_, open, json, close) => {
      try {
        const data = JSON.parse(json);
        data.name = seo.schemaName;
        data.description = seo.schemaDescription;
        data.url = canonicalUrl;
        data.image = site.ogImage;
        data.provider = provider;
        return `${open}${JSON.stringify(data, null, 2)}${close}`;
      } catch {
        return `${open}${json}${close}`;
      }
    }
  );
}

function applyHreflang(html, siteUrl, slug) {
  const without = html.replace(/\n?\s*<link rel="alternate" hreflang="[^"]*" href="[^"]*"\s*\/?>/g, '');
  const links = hreflangAlternates(siteUrl, slug)
    .map(({ lang, href }) => `    <link rel="alternate" hreflang="${lang}" href="${href}" />`)
    .join('\n');
  return without.replace(/(<link rel="canonical" href="[^"]*"\s*\/?>)/, `$1\n${links}`);
}

function applyBodyAttrs(html, { lang, slug, defaultTab }) {
  let next = html.replace(/<html lang="[^"]*"/, `<html lang="${lang}"`);
  const attrs = [
    `data-page="${slug ?? ''}"`,
    `data-default-tab="${defaultTab ?? ''}"`,
    `data-default-lang="${lang}"`,
  ].join(' ');
  return next.replace(/<body([^>]*)>/, (match, rest) => {
    const body = rest
      .replace(/\s*data-page="[^"]*"/g, '')
      .replace(/\s*data-default-tab="[^"]*"/g, '')
      .replace(/\s*data-default-lang="[^"]*"/g, '');
    return `<body${body} ${attrs}>`;
  });
}

function applySeoBody(html, slug, lang) {
  const body = getSeoBody(slug, lang);
  if (!body) return html;
  let next = html.replace(
    /(<h2 id="seo-content-title"[^>]*>)([\s\S]*?)(<\/h2>)/,
    (_, open, _inner, close) => `${open}${escapeText(body.title)}${close}`
  );
  return next.replace(
    /(<div id="seo-content-text"[^>]*>)([\s\S]*?)(<\/div>)/,
    (_, open, _inner, close) => `${open}${body.html}${close}`
  );
}

function prerenderVariant(baseHtml, { lang, slug, page, site }) {
  const seo = getSeo(lang, page);
  const canonicalUrl = pageUrl(site.url, lang, slug);
  let html = baseHtml;

  html = setTagText(html, /<title>[^<]*<\/title>/, `<title>${escapeAttr(seo.title)}</title>`);
  html = setMeta(html, 'meta name="description"', seo.description);
  html = setMeta(html, 'meta property="og:title"', seo.ogTitle);
  html = setMeta(html, 'meta property="og:description"', seo.ogDescription);
  html = setMeta(html, 'meta property="og:url"', canonicalUrl);
  html = setMeta(html, 'meta property="og:locale"', seo.ogLocale ?? 'ru_RU');
  html = setMeta(html, 'meta name="twitter:title"', seo.ogTitle);
  html = setMeta(html, 'meta name="twitter:description"', seo.ogDescription);
  html = html.replace(
    /<link rel="canonical" href="[^"]*"/,
    `<link rel="canonical" href="${canonicalUrl}"`
  );
  html = applyHreflang(html, site.url, slug);
  html = applyBodyAttrs(html, {
    lang,
    slug,
    defaultTab: page?.defaultTab,
  });
  html = setTagText(
    html,
    /(<h1 id="hero-title"[^>]*>)([\s\S]*?)(<\/h1>)/,
    `$1${seo.heroTitle}$3`
  );
  html = setTagText(
    html,
    /(<p class="hero-lead"[^>]*>)([\s\S]*?)(<\/p>)/,
    `$1${escapeText(seo.heroLead)}$3`
  );
  html = patchSchemaJson(html, seo, canonicalUrl, site);
  html = applySeoBody(html, slug, lang);
  html = applyDataI18n(html, buildLocaleDict(lang));
  html = applyMapEmbed(html, lang);
  return html;
}

function getOutDir(lang, slug) {
  const relative = pagePath(lang, slug).replace(/^\//, '').replace(/\/$/, '');
  return relative ? path.join(distDir, relative) : distDir;
}

function prerenderSeoPages(env = process.env) {
  if (!fs.existsSync(indexPath)) {
    console.warn('prerender-seo-pages: dist/index.html not found, skipping');
    return;
  }

  const site = getSiteConfig(env);
  const baseHtml = fs.readFileSync(indexPath, 'utf8');
  let count = 0;

  for (const lang of LANGS) {
    const homeHtml = prerenderVariant(baseHtml, { lang, slug: '', page: null, site });
    const homeDir = getOutDir(lang, '');
    fs.mkdirSync(homeDir, { recursive: true });
    fs.writeFileSync(path.join(homeDir, 'index.html'), homeHtml, 'utf8');
    console.log(`prerender: ${pagePath(lang)}`);
    count += 1;

    for (const page of SEO_PAGES) {
      const html = prerenderVariant(baseHtml, { lang, slug: page.slug, page, site });
      const outDir = getOutDir(lang, page.slug);
      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');
      console.log(`prerender: ${pagePath(lang, page.slug)}`);
      count += 1;
    }
  }

  console.log(`prerender: ${count} HTML variants`);
}

if (process.argv[1]?.endsWith('prerender-seo-pages.mjs')) {
  prerenderSeoPages(process.env);
}

export { prerenderSeoPages };
