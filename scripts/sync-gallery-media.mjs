import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SRC = path.resolve(ROOT, '..', 'images and videos');
const OUT = path.join(ROOT, 'public', 'images', 'media');
const MANIFEST = path.join(ROOT, 'public', 'gallery-manifest.json');

const SKIP = new Set(['фоновое видео.mp4', 'фоновое видео.MP4']);
const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const WIDTHS = [480, 960, 1400];
const WEBP_QUALITY = 82;

export async function syncGalleryMedia() {
  if (!fs.existsSync(SRC)) {
    console.warn('[gallery] source folder not found:', SRC);
    return;
  }

  fs.mkdirSync(OUT, { recursive: true });

  for (const name of fs.readdirSync(OUT)) {
    if (/^photo-/i.test(name)) fs.unlinkSync(path.join(OUT, name));
  }

  const seenSizes = new Set();
  const files = fs
    .readdirSync(SRC)
    .filter((name) => IMAGE_EXT.has(path.extname(name).toLowerCase()))
    .filter((name) => !SKIP.has(name))
    .sort((a, b) => a.localeCompare(b, 'ru'));

  const items = [];
  let imageIndex = 0;
  let totalBefore = 0;
  let totalAfter = 0;

  for (const name of files) {
    const srcPath = path.join(SRC, name);
    const stat = fs.statSync(srcPath);
    if (seenSizes.has(stat.size)) continue;
    seenSizes.add(stat.size);

    imageIndex += 1;
    const base = `photo-${String(imageIndex).padStart(3, '0')}`;
    const srcsetParts = [];
    let width = 0;
    let height = 0;

    for (const w of WIDTHS) {
      const outName = w === 1400 ? `${base}.webp` : `${base}-${w}.webp`;
      const outPath = path.join(OUT, outName);
      const out = await sharp(srcPath)
        .rotate()
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY })
        .toFile(outPath);

      if (w === 1400) {
        width = out.width;
        height = out.height;
      }
      srcsetParts.push(`/images/media/${outName} ${out.width}w`);
      totalAfter += fs.statSync(outPath).size;
    }

    totalBefore += stat.size;

    items.push({
      type: 'image',
      src: `/images/media/${base}.webp`,
      srcset: srcsetParts.join(', '),
      width,
      height,
      alt: `photo-${imageIndex}`,
    });
  }

  fs.writeFileSync(MANIFEST, `${JSON.stringify({ items }, null, 2)}\n`);
  const saved = totalBefore > 0 ? Math.round((1 - totalAfter / totalBefore) * 100) : 0;
  console.log(
    `[gallery] synced ${items.length} responsive webp sets → ${OUT} (${Math.round(totalBefore / 1024)} KB source → ${Math.round(totalAfter / 1024)} KB output, −${saved}% vs originals)`
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  syncGalleryMedia().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
