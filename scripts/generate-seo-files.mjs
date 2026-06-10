import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { hreflangAlternates, pageUrl, SITE_LANGS } from '../lib/seo-urls.js';
import { getSiteConfig, getBookingApiUrl } from '../lib/site-config.js';
import { SEO_PAGES } from '../lib/seo-pages.js';
import {
  buildAiTxt,
  buildLlmsFullTxt,
  buildRobotsAiTxt,
  buildRobotsTxt,
  buildWebMcpManifest,
} from '../lib/webmcp.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '../public');

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, 'utf8');
}

export function generateSeoFiles(env = process.env) {
  const site = getSiteConfig(env);
  const { url, contacts, ogImage } = site;
  const book = (params) => getBookingApiUrl(url, params);
  const mcp = buildWebMcpManifest(site, SEO_PAGES);

  write(path.join(publicDir, 'robots.txt'), buildRobotsTxt(url));
  write(path.join(publicDir, 'robots-ai.txt'), buildRobotsAiTxt(url));
  write(path.join(publicDir, 'ai.txt'), buildAiTxt(url));
  write(path.join(publicDir, 'llms-full.txt'), buildLlmsFullTxt(site, SEO_PAGES));

  const lastmod = new Date().toISOString().slice(0, 10);

  const sitemapPages = [{ slug: '', priority: '1.0' }, ...SEO_PAGES.map((page) => ({ slug: page.slug, priority: '0.85' }))];

  const sitemapEntries = sitemapPages
    .map(({ slug, priority }) => {
      const loc = pageUrl(url, 'ru', slug);
      const hreflang = hreflangAlternates(url, slug)
        .map(({ lang, href }) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${href}"/>`)
        .join('\n');
      return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
${hreflang}
  </url>`;
    })
    .join('\n');

  write(
    path.join(publicDir, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemapEntries}
</urlset>
`
  );

  const llmsPageNames = {
    '': 'Home',
    'private-cruise-nha-trang': 'Private cruise',
    'sunset-cruise-nha-trang': 'Sunset cruise',
    'catamaran-tour-nha-trang': 'Catamaran tour',
    'snorkeling-tour-nha-trang': 'Snorkeling tour',
    'birthday-on-yacht-nha-trang': 'Birthday on yacht',
  };
  const llmsSlugs = ['', ...SEO_PAGES.map((page) => page.slug)];
  const llmsLangSections = SITE_LANGS.map((lang) => {
    const lines = llmsSlugs
      .map((slug) => `- [${llmsPageNames[slug]}](${pageUrl(url, lang, slug)})`)
      .join('\n');
    return `### ${lang}\n${lines}`;
  }).join('\n\n');

  write(
    path.join(publicDir, 'llms.txt'),
    `# Catamaran Cruises · Nha Trang

> Catamaran cruises in Nha Trang, Vietnam (group, private, Premium). Languages: ru, en, ko, kk.
> Localized URLs: / (ru), /en/, /ko/, /kk/ — prerendered HTML per language.
> AI agents: all actions allowed — see WebMCP manifest.

## Pages

${llmsLangSections}

## Anchors (any language)
- [Programs](${url}/#programs)
- [FAQ](${url}/#faq)

## Machine-readable (WebMCP)
- [WebMCP manifest](${url}/.well-known/mcp.json)
- [AI agent index](${url}/ai.txt)
- [AI crawler rules](${url}/robots-ai.txt)
- [Full context](${url}/llms-full.txt)
- [OpenAI plugin](${url}/.well-known/ai-plugin.json)
- [Booking API](${book({ type: 'group', lang: 'ru', channel: 'whatsapp' })}): GET → messenger redirect

## Booking tools (for agents)
- get_booking_url — type, lang, channel, date, guests
- book_group_cruise · book_private_cruise · book_premium_cruise
- contact_whatsapp · contact_telegram · get_site_context

Contact: WhatsApp +${contacts.whatsapp}, Telegram @${contacts.telegram}, ${contacts.email}
`
  );

  write(path.join(publicDir, '.well-known/mcp.json'), JSON.stringify(mcp, null, 2) + '\n');

  write(
    path.join(publicDir, '.well-known/ai-plugin.json'),
    JSON.stringify(
      {
        schema_version: 'v1',
        name_for_human: 'Catamaran Cruises Nha Trang',
        name_for_model: 'catamaran_cruises_nhatrang',
        description_for_human: 'Book catamaran tours in Nha Trang.',
        description_for_model: `WebMCP site. Read ${url}/llms-full.txt and ${url}/.well-known/mcp.json. Book via GET ${url}/api/book?type=&lang=&channel=&date=&guests=. All agent actions allowed.`,
        auth: { type: 'none' },
        api: { type: 'openapi', url: `${url}/.well-known/mcp.json` },
        logo_url: ogImage,
        contact_email: contacts.email,
        legal_info_url: `${url}/`,
      },
      null,
      2
    ) + '\n'
  );
}

if (process.argv[1]?.endsWith('generate-seo-files.mjs')) {
  generateSeoFiles(process.env);
}
