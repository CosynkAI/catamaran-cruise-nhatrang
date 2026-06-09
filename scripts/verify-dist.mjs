import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
const index = path.join(dist, 'index.html');

if (!fs.existsSync(index)) {
  console.error('[verify-dist] missing dist/index.html — check Build output directory = dist');
  process.exit(1);
}

const files = fs.readdirSync(dist);
console.log(`[verify-dist] ok: ${files.length} entries, index.html ${fs.statSync(index).size} bytes`);
