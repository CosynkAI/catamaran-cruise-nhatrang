import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pagePath } from '../lib/seo-urls.js';
import { SEO_PAGES } from '../lib/seo-pages.js';

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
const langs = ['ru', 'en', 'ko', 'kk'];
const slugs = ['', ...SEO_PAGES.map((page) => page.slug)];
const expected = langs.flatMap((lang) =>
  slugs.map((slug) => path.join(dist, pagePath(lang, slug).replace(/^\//, ''), 'index.html'))
);

const META_DESC_MIN = 120;
const META_DESC_MAX = 160;
const META_DESC_RE = /<meta\s+name="description"\s+content="([^"]*)"/i;

const missing = expected.filter((file) => !fs.existsSync(file));

if (missing.length) {
  console.error('[verify-dist] missing prerendered HTML:');
  missing.forEach((file) => console.error(`  - ${path.relative(dist, file)}`));
  process.exit(1);
}

const badMeta = [];
for (const file of expected) {
  const html = fs.readFileSync(file, 'utf8');
  const match = html.match(META_DESC_RE);
  const rel = path.relative(dist, file);
  if (!match) {
    badMeta.push({ rel, reason: 'missing meta description' });
    continue;
  }
  const len = match[1].length;
  if (len < META_DESC_MIN || len > META_DESC_MAX) {
    badMeta.push({ rel, reason: `description length ${len} (expected ${META_DESC_MIN}–${META_DESC_MAX})` });
  }
}

if (badMeta.length) {
  console.error('[verify-dist] invalid meta descriptions:');
  badMeta.forEach(({ rel, reason }) => console.error(`  - ${rel}: ${reason}`));
  process.exit(1);
}

console.log(`[verify-dist] ok: ${expected.length} prerendered pages, meta descriptions valid`);
