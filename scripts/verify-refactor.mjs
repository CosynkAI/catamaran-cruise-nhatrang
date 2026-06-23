import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];

function check(condition, message) {
  if (!condition) errors.push(message);
}

const uiModules = [
  'carousel.js',
  'gallery-carousel.js',
  'reviews-carousel.js',
  'booking.js',
  'video.js',
  'navigation.js',
  'faq.js',
];

for (const file of uiModules) {
  check(fs.existsSync(path.join(root, 'src/ui', file)), `missing src/ui/${file}`);
}

check(fs.existsSync(path.join(root, 'src/css/design-tokens.css')), 'missing src/css/design-tokens.css');
check(!fs.existsSync(path.join(root, 'more.css')), 'remove obsolete more.css');
check(!fs.existsSync(path.join(root, 'more2.css')), 'remove obsolete more2.css');
check(
  fs.readFileSync(path.join(root, 'src/css/input.css'), 'utf8').includes('@import "./design-tokens.css"'),
  'input.css must import design-tokens.css'
);
check(fs.existsSync(path.join(root, 'functions/api/availability.js')), 'missing functions/api/availability.js');

const localeKeys = ['form.dateUnavailable'];
for (const lang of ['ru', 'en', 'ko', 'kk']) {
  const file = path.join(root, `src/locales/${lang}.js`);
  const src = fs.readFileSync(file, 'utf8');
  for (const key of localeKeys) {
    check(src.includes(`"${key}"`), `${lang}.js missing "${key}"`);
  }
}

if (errors.length) {
  console.error('[verify-refactor] failed:');
  errors.forEach((msg) => console.error(`  - ${msg}`));
  process.exit(1);
}

console.log('[verify-refactor] ok: modules, tokens, locales, availability API');
