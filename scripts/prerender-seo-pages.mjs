import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getSiteConfig } from '../lib/site-config.js';
import { SEO_PAGES } from '../lib/seo-pages.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');
const indexPath = path.join(distDir, 'index.html');

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

function patchSchemaJson(html, seo, pageUrl) {
  return html.replace(
    /(<script type="application\/ld\+json" id="schema-json">\s*)([\s\S]*?)(\s*<\/script>)/,
    (_, open, json, close) => {
      try {
        const data = JSON.parse(json);
        data.name = seo.schemaName;
        data.description = seo.schemaDescription;
        data.url = pageUrl;
        return `${open}${JSON.stringify(data, null, 2)}${close}`;
      } catch {
        return `${open}${json}${close}`;
      }
    }
  );
}

function prerenderPage(baseHtml, page, siteUrl) {
  const seo = page.locales.ru;
  const pageUrl = `${siteUrl}/${page.slug}/`;
  let html = baseHtml;

  html = setTagText(html, /<title>[^<]*<\/title>/, `<title>${escapeAttr(seo.title)}</title>`);
  html = setMeta(html, 'meta name="description"', seo.description);
  html = setMeta(html, 'meta property="og:title"', seo.ogTitle);
  html = setMeta(html, 'meta property="og:description"', seo.ogDescription);
  html = setMeta(html, 'meta property="og:url"', pageUrl);
  html = setMeta(html, 'meta name="twitter:title"', seo.ogTitle);
  html = setMeta(html, 'meta name="twitter:description"', seo.ogDescription);

  html = html.replace(/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${pageUrl}"`);
  html = html.replace(
    /<link rel="alternate" hreflang="[^"]*" href="[^"]*"/g,
    (match) => {
      const lang = match.match(/hreflang="([^"]*)"/)?.[1] ?? 'x-default';
      return `<link rel="alternate" hreflang="${lang}" href="${pageUrl}"`;
    }
  );

  html = html.replace(
    /<body class="([^"]*)"([^>]*)data-page="[^"]*"/,
    `<body class="$1"$2data-page="${page.slug}" data-default-tab="${page.defaultTab}"`
  );
  html = html.replace(
    /<body class="([^"]*)"(?![^>]*data-page)/,
    `<body class="$1" data-page="${page.slug}" data-default-tab="${page.defaultTab}"`
  );

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

  html = patchSchemaJson(html, seo, pageUrl);

  const outDir = path.join(distDir, page.slug);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');
}

function prerenderSeoPages(env = process.env) {
  if (!fs.existsSync(indexPath)) {
    console.warn('prerender-seo-pages: dist/index.html not found, skipping');
    return;
  }

  const siteUrl = getSiteConfig(env).url;
  const baseHtml = fs.readFileSync(indexPath, 'utf8');

  SEO_PAGES.forEach((page) => {
    prerenderPage(baseHtml, page, siteUrl);
    console.log(`prerender: /${page.slug}/`);
  });
}

if (process.argv[1]?.endsWith('prerender-seo-pages.mjs')) {
  prerenderSeoPages(process.env);
}

export { prerenderSeoPages };
