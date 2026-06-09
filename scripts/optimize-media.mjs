import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SRC = path.resolve(ROOT, '..', 'images and videos');
const HERO_SRC = path.join(SRC, 'фоновое видео.mp4');
const HERO_OUT = path.join(ROOT, 'public', 'videos', 'hero.mp4');
const POSTER_JPG = path.join(ROOT, 'public', 'images', 'hero-poster.jpg');
const POSTER_WEBP = path.join(ROOT, 'public', 'images', 'hero-poster.webp');

const IS_CI = process.env.CF_PAGES === '1' || process.env.CI === 'true';

function hasFfmpeg() {
  return spawnSync('ffmpeg', ['-version'], { encoding: 'utf8' }).status === 0;
}

function runFfmpeg(args) {
  if (!hasFfmpeg()) {
    console.warn('[hero] ffmpeg not available, skipping transcode');
    return false;
  }
  const result = spawnSync('ffmpeg', ['-y', ...args], { encoding: 'utf8' });
  if (result.status !== 0) {
    throw new Error(result.stderr?.trim().slice(-600) || 'ffmpeg failed');
  }
  return true;
}

function needsRebuild(output, input, maxOutputBytes = 0) {
  if (!fs.existsSync(output) || !fs.existsSync(input)) return true;
  if (maxOutputBytes > 0 && fs.statSync(output).size > maxOutputBytes) return true;
  return fs.statSync(input).mtimeMs > fs.statSync(output).mtimeMs;
}

export async function optimizeHeroMedia() {
  if (IS_CI) {
    console.log('[hero] skip optimization in CI (prebuilt assets in repo)');
    return;
  }

  const input = fs.existsSync(HERO_SRC) ? HERO_SRC : HERO_OUT;
  if (!fs.existsSync(input)) {
    console.warn('[hero] source video not found');
    return;
  }

  fs.mkdirSync(path.dirname(HERO_OUT), { recursive: true });
  fs.mkdirSync(path.dirname(POSTER_JPG), { recursive: true });

  if (needsRebuild(HERO_OUT, input, 1.2 * 1024 * 1024)) {
    const tmp = `${HERO_OUT}.tmp.mp4`;
    runFfmpeg([
      '-i',
      input,
      '-an',
      '-vf',
      'scale=1280:-2',
      '-c:v',
      'libx264',
      '-crf',
      '32',
      '-preset',
      'medium',
      '-movflags',
      '+faststart',
      '-pix_fmt',
      'yuv420p',
      tmp,
    ]);
    fs.renameSync(tmp, HERO_OUT);
    const sizeMb = (fs.statSync(HERO_OUT).size / 1024 / 1024).toFixed(2);
    console.log(`[hero] compressed video → ${HERO_OUT} (${sizeMb} MB)`);
  } else {
    console.log('[hero] video up to date');
  }

  const posterSource = fs.existsSync(HERO_OUT) ? HERO_OUT : input;
  const posterTmp = `${POSTER_JPG}.tmp.jpg`;

  if (needsRebuild(POSTER_JPG, posterSource)) {
    if (runFfmpeg(['-i', posterSource, '-frames:v', '1', '-q:v', '3', posterTmp])) {
      fs.renameSync(posterTmp, POSTER_JPG);
      console.log(`[hero] poster jpg → ${POSTER_JPG}`);
    } else if (fs.existsSync(POSTER_JPG)) {
      console.log('[hero] poster jpg up to date (ffmpeg skipped)');
    }
  }

  if (needsRebuild(POSTER_WEBP, POSTER_JPG)) {
    await sharp(POSTER_JPG)
      .resize({ width: 1920, withoutEnlargement: true })
      .webp({ quality: 84 })
      .toFile(POSTER_WEBP);
    const jpgKb = Math.round(fs.statSync(POSTER_JPG).size / 1024);
    const webpKb = Math.round(fs.statSync(POSTER_WEBP).size / 1024);
    console.log(`[hero] poster webp → ${POSTER_WEBP} (${webpKb} KB, was ${jpgKb} KB jpg)`);
  }
}

if (process.argv[1]?.endsWith('optimize-media.mjs')) {
  optimizeHeroMedia().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
