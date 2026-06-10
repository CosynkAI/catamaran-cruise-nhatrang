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

const missing = expected.filter((file) => !fs.existsSync(file));

if (missing.length) {
  console.error('[verify-dist] missing prerendered HTML:');
  missing.forEach((file) => console.error(`  - ${path.relative(dist, file)}`));
  process.exit(1);
}

console.log(`[verify-dist] ok: ${expected.length} prerendered pages`);
