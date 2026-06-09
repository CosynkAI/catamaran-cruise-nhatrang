import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getSiteConfig, getBookingApiUrl } from '../lib/site-config.js';
import { SEO_PAGES } from '../lib/seo-pages.js';

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

  write(
    path.join(publicDir, 'robots.txt'),
    `# Catamaran Cruises — Nha Trang
User-agent: *
Allow: /

User-agent: Googlebot
Allow: /

User-agent: YandexBot
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: ${url}/sitemap.xml
`
  );

  const hreflangLinks = ['ru', 'en', 'ko', 'kk', 'x-default']
    .map((lang) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="{loc}"/>`)
    .join('\n');

  const sitemapEntries = [
    { loc: `${url}/`, priority: '1.0' },
    ...SEO_PAGES.map((page) => ({
      loc: `${url}/${page.slug}/`,
      priority: '0.85',
    })),
  ]
    .map(
      ({ loc, priority }) => `  <url>
    <loc>${loc}</loc>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
${hreflangLinks.replace(/\{loc\}/g, loc)}
  </url>`
    )
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

  write(
    path.join(publicDir, 'llms.txt'),
    `# Catamaran Cruises · Nha Trang

> Catamaran cruises in Nha Trang, Vietnam (group, private, Premium). Languages: ru, en, ko, kk.

- [Home](${url}/)
- [Private cruise](${url}/private-cruise-nha-trang/)
- [Sunset cruise](${url}/sunset-cruise-nha-trang/)
- [Catamaran tour](${url}/catamaran-tour-nha-trang/)
- [Snorkeling tour](${url}/snorkeling-tour-nha-trang/)
- [Birthday on yacht](${url}/birthday-on-yacht-nha-trang/)
- [Programs](${url}/#programs)
- [FAQ](${url}/#faq)
- [Full context](${url}/llms-full.txt)
- [WebMCP](${url}/.well-known/mcp.json)
- [Booking API](${book({ type: 'group', lang: 'ru', channel: 'whatsapp' })}): redirects to WhatsApp with pre-filled message

Contact: WhatsApp +${contacts.whatsapp}, Telegram @${contacts.telegram}, ${contacts.email}
`
  );

  const mcp = {
    $schema: 'https://modelcontextprotocol.io/schemas/2025-03/website-manifest.json',
    name: 'Catamaran Cruises · Nha Trang',
    description:
      'Group, private and Premium catamaran cruises in Nha Trang — snorkelling, SUP, fishing, meals and sunset tours.',
    homepage: url,
    version: '1.1.0',
    publisher: { name: 'Catamaran Cruises Nha Trang', url, country: 'VN' },
    language: 'ru',
    languages: ['ru', 'en', 'ko', 'kk'],
    context: {
      summary: `${url}/llms.txt`,
      full: `${url}/llms-full.txt`,
      sitemap: `${url}/sitemap.xml`,
    },
    resources: [
      { name: 'homepage', uri: `${url}/`, mimeType: 'text/html' },
      { name: 'programs', uri: `${url}/#programs`, mimeType: 'text/html' },
      { name: 'faq', uri: `${url}/#faq`, mimeType: 'text/html' },
    ],
    tools: [
      {
        name: 'book_group_cruise',
        description:
          'Redirect to WhatsApp/Telegram/Zalo with a pre-filled group-tour booking message. Query: type, lang, channel, date, guests.',
        endpoint: book({ type: 'group', lang: 'ru', channel: 'whatsapp' }),
        method: 'GET',
        inputSchema: {
          type: 'object',
          properties: {
            lang: { type: 'string', enum: ['ru', 'en', 'ko', 'kk'], default: 'ru' },
            channel: { type: 'string', enum: ['whatsapp', 'telegram', 'zalo'], default: 'whatsapp' },
            date: { type: 'string' },
            guests: { type: 'integer', minimum: 1 },
          },
        },
      },
      {
        name: 'book_private_cruise',
        description: 'Redirect with pre-filled private charter message.',
        endpoint: book({ type: 'individual', lang: 'ru', channel: 'whatsapp' }),
        method: 'GET',
        inputSchema: {
          type: 'object',
          properties: {
            lang: { type: 'string', enum: ['ru', 'en', 'ko', 'kk'] },
            channel: { type: 'string', enum: ['whatsapp', 'telegram', 'zalo'] },
            date: { type: 'string' },
            guests: { type: 'integer', minimum: 1 },
          },
        },
      },
      {
        name: 'book_vip_cruise',
        description: 'Redirect with pre-filled Premium cruise message.',
        endpoint: book({ type: 'vip', lang: 'ru', channel: 'whatsapp' }),
        method: 'GET',
        inputSchema: {
          type: 'object',
          properties: {
            lang: { type: 'string', enum: ['ru', 'en', 'ko', 'kk'] },
            channel: { type: 'string', enum: ['whatsapp', 'telegram', 'zalo'] },
          },
        },
      },
      {
        name: 'contact_telegram',
        description: 'Open Telegram chat.',
        endpoint: book({ type: 'group', lang: 'ru', channel: 'telegram' }),
        method: 'GET',
      },
    ],
    contact: {
      email: contacts.email,
      phone: `+${contacts.whatsapp}`,
      whatsapp: `https://wa.me/${contacts.whatsapp}`,
      telegram: `https://t.me/${contacts.telegram}`,
      zalo: contacts.zaloUrl || `https://zalo.me/${contacts.zaloPhone}`,
      instagram: contacts.instagram,
    },
    license: {
      ai_training_allowed: true,
      ai_citation_required: true,
      attribution: `Catamaran Cruises · Nha Trang (${url})`,
    },
  };

  write(path.join(publicDir, '.well-known/mcp.json'), JSON.stringify(mcp, null, 2) + '\n');

  write(
    path.join(publicDir, '.well-known/ai-plugin.json'),
    JSON.stringify(
      {
        schema_version: 'v1',
        name_for_human: 'Catamaran Cruises Nha Trang',
        name_for_model: 'catamaran_cruises_nhatrang',
        description_for_human: 'Book catamaran tours in Nha Trang.',
        description_for_model: `Use ${url}/llms-full.txt and booking API ${url}/api/book?type=&lang=&channel= for pre-filled messenger links.`,
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
