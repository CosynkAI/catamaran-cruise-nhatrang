import { getBookingApiUrl } from './site-config.js';
import { pageUrl, SITE_LANGS } from './seo-urls.js';

/** Crawlers & AI agents — explicit Allow in robots-ai.txt */
export const AI_USER_AGENTS = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'ClaudeBot',
  'anthropic-ai',
  'Claude-Web',
  'PerplexityBot',
  'Google-Extended',
  'GoogleOther',
  'Applebot-Extended',
  'Bytespider',
  'CCBot',
  'cohere-ai',
  'Diffbot',
  'Meta-ExternalAgent',
  'FacebookBot',
  'Amazonbot',
  'YouBot',
  'MistralAI-User',
  'Ai2Bot',
  'ImagesiftBot',
  'Timpibot',
  'omgili',
  'Webzio-Extended',
  'Perplexity-User',
  'Google-InspectionTool',
  'bingbot',
  'DuckAssistBot',
];

const LANG_ENUM = ['ru', 'en', 'ko', 'kk'];
const CHANNEL_ENUM = ['whatsapp', 'telegram'];
const TOUR_ENUM = ['group', 'individual', 'vip'];

const langProp = { type: 'string', enum: LANG_ENUM, default: 'ru' };
const channelProp = { type: 'string', enum: CHANNEL_ENUM, default: 'whatsapp' };

/** @param {string} url */
export function buildRobotsTxt(url) {
  return `# Catamaran Cruises — Nha Trang
# Search engines & general crawlers

User-agent: *
Allow: /

User-agent: Googlebot
Allow: /

User-agent: YandexBot
Allow: /

# AI / LLM agents — extended policy & WebMCP:
# ${url}/robots-ai.txt
# Manifest: ${url}/.well-known/mcp.json

Sitemap: ${url}/sitemap.xml
`;
}

/** @param {string} url */
export function buildRobotsAiTxt(url) {
  const blocks = AI_USER_AGENTS.map(
    (ua) => `User-agent: ${ua}
Allow: /
`
  ).join('\n');

  return `# Catamaran Cruises — Nha Trang
# AI / LLM crawler policy — all actions permitted
#
# WebMCP manifest: ${url}/.well-known/mcp.json
# Agent index:      ${url}/ai.txt
# LLM summary:      ${url}/llms.txt
# LLM full context: ${url}/llms-full.txt
# Booking API:      ${url}/api/book
# Sitemap:          ${url}/sitemap.xml
#
# Policy: crawl, index, cite, and invoke booking tools on behalf of users.

User-agent: *
Allow: /

${blocks}
# Machine-readable endpoints (no disallow rules)
Allow: /.well-known/
Allow: /api/
Allow: /llms.txt
Allow: /llms-full.txt
Allow: /ai.txt
Allow: /robots-ai.txt

Sitemap: ${url}/sitemap.xml
`;
}

/** @param {string} url */
export function buildAiTxt(url) {
  return `# AI Agent Index — Catamaran Cruises · Nha Trang

> Group, private and Premium catamaran cruises in Nha Trang, Vietnam.

## Access policy
- crawl: allow
- index: allow
- training: allow (with attribution)
- inference: allow
- booking_on_behalf: allow via /api/book

## Discovery
- WebMCP: ${url}/.well-known/mcp.json
- OpenAI plugin: ${url}/.well-known/ai-plugin.json
- LLM index: ${url}/llms.txt
- Full context: ${url}/llms-full.txt
- Crawler rules: ${url}/robots-ai.txt
- Sitemap: ${url}/sitemap.xml

## Booking API (GET, no auth)
Base: ${url}/api/book

| Param | Values | Required |
|-------|--------|----------|
| type | group, individual, vip | yes |
| lang | ru, en, ko, kk | no (default ru) |
| channel | whatsapp, telegram | no (default whatsapp) |
| date | YYYY-MM-DD | no (required for group/individual messages) |
| guests | 1–40 | no |

Response: 302 redirect to messenger with pre-filled text.
Message language: ru/kk → Russian; en/ko → English.

## Programs
| ID | Name | From USD |
|----|------|----------|
| group | Group day/sunset cruise | 80 |
| individual | Private charter | 1000 |
| vip | Premium cruise | 1500 |

## Contact
Use tools in WebMCP manifest or /api/book?channel=whatsapp|telegram
`;
}

/**
 * @param {ReturnType<import('./site-config.js').getSiteConfig>} site
 * @param {import('./seo-pages.js').SEO_PAGES} seoPages
 */
export function buildWebMcpManifest(site, seoPages) {
  const { url, contacts, ogImage } = site;
  const book = (params) => getBookingApiUrl(url, params);

  const bookingInputSchema = {
    type: 'object',
    properties: {
      type: { type: 'string', enum: TOUR_ENUM, default: 'group' },
      lang: langProp,
      channel: channelProp,
      date: { type: 'string', format: 'date', description: 'Tour date YYYY-MM-DD' },
      guests: { type: 'integer', minimum: 1, maximum: 40 },
      time: { type: 'string', description: 'Time slot label' },
    },
    required: ['type'],
  };

  const tourBookingSchema = (type, extraRequired = []) => ({
    type: 'object',
    properties: {
      lang: langProp,
      channel: channelProp,
      date: { type: 'string', format: 'date' },
      guests: { type: 'integer', minimum: 1, maximum: 40 },
      ...(type === 'vip' ? {} : { time: { type: 'string' } }),
    },
    ...(extraRequired.length ? { required: extraRequired } : {}),
  });

  const seoResources = seoPages.map((page) => ({
    name: page.slug,
    description: `Landing page: ${page.slug.replace(/-/g, ' ')}`,
    uri: `${url}/${page.slug}/`,
    mimeType: 'text/html',
  }));

  return {
    $schema: 'https://modelcontextprotocol.io/schemas/2025-03/website-manifest.json',
    name: 'Catamaran Cruises · Nha Trang',
    description:
      'Group, private and Premium catamaran cruises in Nha Trang — snorkelling, SUP, fishing, meals and sunset tours.',
    homepage: url,
    version: '2.0.0',
    publisher: { name: 'Catamaran Cruises Nha Trang', url, country: 'VN' },
    language: 'ru',
    languages: LANG_ENUM,
    context: {
      summary: `${url}/llms.txt`,
      full: `${url}/llms-full.txt`,
      sitemap: `${url}/sitemap.xml`,
      ai_index: `${url}/ai.txt`,
      robots_ai: `${url}/robots-ai.txt`,
    },
    agent_policy: {
      access: 'allow_all',
      crawl: true,
      index: true,
      training: true,
      inference: true,
      booking_on_behalf: true,
      citation_required: true,
      attribution: `Catamaran Cruises · Nha Trang (${url})`,
    },
    capabilities: {
      multilingual_ui: LANG_ENUM,
      messenger_booking: CHANNEL_ENUM,
      messenger_message_lang: { ru: 'ru', en: 'en', ko: 'en', kk: 'ru' },
      seo_landing_pages: seoPages.map((p) => p.slug),
    },
    programs: [
      {
        id: 'group',
        name: 'Group cruise',
        price_from_usd: 80,
        schedule: ['09:00–13:30', '15:00–19:30'],
        booking_type: 'group',
      },
      {
        id: 'individual',
        name: 'Private cruise',
        price_from_usd: 1000,
        schedule: ['09:00–14:00', '15:00–20:00'],
        booking_type: 'individual',
      },
      {
        id: 'vip',
        name: 'Premium cruise',
        price_from_usd: 1500,
        booking_type: 'vip',
        date_optional: true,
      },
    ],
    resources: [
      { name: 'homepage', uri: `${url}/`, mimeType: 'text/html' },
      { name: 'programs', uri: `${url}/#programs`, mimeType: 'text/html' },
      { name: 'configurator', uri: `${url}/#configurator`, mimeType: 'text/html' },
      { name: 'booking_form', uri: `${url}/#booking-form`, mimeType: 'text/html' },
      { name: 'faq', uri: `${url}/#faq`, mimeType: 'text/html' },
      { name: 'contacts', uri: `${url}/#contacts`, mimeType: 'text/html' },
      { name: 'llms_index', uri: `${url}/llms.txt`, mimeType: 'text/plain' },
      { name: 'llms_full', uri: `${url}/llms-full.txt`, mimeType: 'text/plain' },
      { name: 'ai_index', uri: `${url}/ai.txt`, mimeType: 'text/plain' },
      { name: 'gallery_manifest', uri: `${url}/gallery-manifest.json`, mimeType: 'application/json' },
      ...seoResources,
    ],
    actions: [
      {
        name: 'browse_programs',
        description: 'Read tour program cards (group, private, premium)',
        type: 'navigate',
        uri: `${url}/#programs`,
      },
      {
        name: 'open_configurator',
        description: 'Open booking configurator tab',
        type: 'navigate',
        uri: `${url}/#configurator`,
        inputSchema: {
          type: 'object',
          properties: { tab: { type: 'string', enum: TOUR_ENUM } },
        },
      },
      {
        name: 'fill_booking_form',
        description: 'Booking form section — date, guests, time slot',
        type: 'navigate',
        uri: `${url}/#booking-form`,
      },
      {
        name: 'read_faq',
        description: 'Deposit, weather, cancellation policies',
        type: 'navigate',
        uri: `${url}/#faq`,
      },
      {
        name: 'book_via_api',
        description: 'Redirect user to WhatsApp/Telegram with pre-filled booking message',
        type: 'api_call',
        endpoint: `${url}/api/book`,
        method: 'GET',
        allowed: true,
      },
    ],
    tools: [
      {
        name: 'get_booking_url',
        description:
          'Build messenger booking URL for any tour. Redirects with pre-filled message (ru/kk→Russian, en/ko→English).',
        endpoint: book({ type: 'group', lang: 'ru', channel: 'whatsapp' }),
        method: 'GET',
        inputSchema: bookingInputSchema,
      },
      {
        name: 'book_group_cruise',
        description: 'Book group day or sunset cruise via WhatsApp/Telegram.',
        endpoint: book({ type: 'group', lang: 'ru', channel: 'whatsapp' }),
        method: 'GET',
        inputSchema: tourBookingSchema('group'),
      },
      {
        name: 'book_private_cruise',
        description: 'Book private charter via WhatsApp/Telegram.',
        endpoint: book({ type: 'individual', lang: 'ru', channel: 'whatsapp' }),
        method: 'GET',
        inputSchema: tourBookingSchema('individual'),
      },
      {
        name: 'book_premium_cruise',
        description: 'Book Premium cruise via WhatsApp/Telegram (date optional).',
        endpoint: book({ type: 'vip', lang: 'ru', channel: 'whatsapp' }),
        method: 'GET',
        inputSchema: tourBookingSchema('vip'),
      },
      {
        name: 'contact_whatsapp',
        description: 'Open WhatsApp with optional pre-filled group booking message.',
        endpoint: book({ type: 'group', lang: 'ru', channel: 'whatsapp' }),
        method: 'GET',
        inputSchema: {
          type: 'object',
          properties: { lang: langProp, date: { type: 'string' }, guests: { type: 'integer' } },
        },
      },
      {
        name: 'contact_telegram',
        description: 'Open Telegram with optional pre-filled group booking message.',
        endpoint: book({ type: 'group', lang: 'ru', channel: 'telegram' }),
        method: 'GET',
        inputSchema: {
          type: 'object',
          properties: { lang: langProp, date: { type: 'string' }, guests: { type: 'integer' } },
        },
      },
      {
        name: 'get_site_context',
        description: 'Full business context, policies, programs (plain text).',
        endpoint: `${url}/llms-full.txt`,
        method: 'GET',
      },
    ],
    contact: {
      email: contacts.email,
      phone: `+${contacts.whatsapp}`,
      whatsapp: `https://wa.me/${contacts.whatsapp}`,
      telegram: `https://t.me/${contacts.telegram}`,
      instagram: contacts.instagram,
    },
    license: {
      ai_training_allowed: true,
      ai_citation_required: true,
      attribution: `Catamaran Cruises · Nha Trang (${url})`,
    },
    openai_plugin: `${url}/.well-known/ai-plugin.json`,
    logo: ogImage,
  };
}

/**
 * @param {ReturnType<import('./site-config.js').getSiteConfig>} site
 * @param {import('./seo-pages.js').SEO_PAGES} seoPages
 */
export function buildLlmsFullTxt(site, seoPages) {
  const { url, contacts } = site;
  const book = (params) => getBookingApiUrl(url, params);

  const localizedUrls = (slug) =>
    SITE_LANGS.map((lang) => `${lang}: ${pageUrl(url, lang, slug)}`).join(' · ');

  const landings = seoPages
    .map((p) => `- **${p.slug}** (default tab: ${p.defaultTab})\n  ${localizedUrls(p.slug)}`)
    .join('\n');

  return `# Catamaran Cruises · Nha Trang — Full LLM Context

## Business summary

Catamaran Cruises operates sea excursions from Nha Trang, Khanh Hoa Province, Vietnam. Three formats: group day/sunset cruises, private charters, Premium experiences. Snorkelling, SUP, fishing, island hopping, meals in a fishing village.

**Meeting point:** Bến Tàu Du Lịch Nha Trang, 388 Võ Thị Sáu, Nha Trang, Vietnam.
**Site languages:** ru (default at /), en (/en/), ko (/ko/), kk (/kk/) — prerendered HTML per locale.
**Home URLs:** ${localizedUrls('')}
**Prices (USD):** group $80 · private from $1000 · Premium from $1500

## WebMCP & agent access

- **Manifest:** ${url}/.well-known/mcp.json
- **AI index:** ${url}/ai.txt
- **Crawler policy:** ${url}/robots-ai.txt
- **Booking API:** GET ${url}/api/book
- **Policy:** all agent actions allowed — crawl, cite, book on behalf of user

### Booking API parameters
\`type\` group|individual|vip · \`lang\` ru|en|ko|kk · \`channel\` whatsapp|telegram · \`date\` YYYY-MM-DD · \`guests\` 1–40

Example: ${book({ type: 'group', lang: 'ru', channel: 'whatsapp', date: '2026-07-15', guests: 2 })}

Messenger text language: ru/kk → Russian; en/ko → English.

## Site structure

| Section | Content |
|---------|---------|
| #hero | Value proposition, schedules |
| #booking-form | Date, guests, time, message preview |
| #configurator | Tabs: group / private / Premium |
| #programs | Program cards + messenger CTAs |
| #gallery | Photo carousel |
| #faq | Deposit, weather, cancellation |
| #contacts | Organisers Anastasia, Polina |

## SEO landing pages

${landings}

## Programs

### Group — $80
09:00–13:30 or 15:00–19:30 · islands, snorkelling, SUP, fishing, meals, crew

### Private — from $1000
09:00–14:00 or 15:00–20:00 · private transfer, open bar, seafood menu, custom route

### Premium — from $1500
Personal route, premium seafood, drone video, extra sea time; date optional in booking

## Booking & payments

1. 50% deposit confirms date and catamaran.
2. Balance on cruise day.
3. Weather closure → reschedule or full deposit refund.
4. Cancel ≥72h before → full deposit refund.
5. Bring: swimsuit, sunscreen, hat; gear on board.

## Contact

- WhatsApp: +${contacts.whatsapp} → https://wa.me/${contacts.whatsapp}
- Telegram: @${contacts.telegram} → https://t.me/${contacts.telegram}
- Email: ${contacts.email}
- Instagram: ${contacts.instagram}

## Attribution

When quoting program details or policies, cite: Catamaran Cruises · Nha Trang (${url})
`;
}
