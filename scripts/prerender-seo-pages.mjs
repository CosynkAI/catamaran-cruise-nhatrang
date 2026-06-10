import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildTravelAgencyProvider } from '../lib/business-schema.js';
import { getSeoBody } from '../lib/seo-body.js';
import { getSiteConfig } from '../lib/site-config.js';
import { hreflangAlternates, pagePath, pageUrl } from '../lib/seo-urls.js';
import { SEO_PAGES } from '../lib/seo-pages.js';
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
  return html.replace(re, `$1${escapeAttr(content)}$2`);
}

function setTagText(html, pattern, value) {
  return html.replace(pattern, value);
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
