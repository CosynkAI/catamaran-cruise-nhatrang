import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { generateSeoFiles } from './scripts/generate-seo-files.mjs';
import { optimizeHeroMedia } from './scripts/optimize-media.mjs';
import { syncGalleryMedia } from './scripts/sync-gallery-media.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(async ({ mode, command }) => {
  const env = loadEnv(mode, __dirname, '');
  generateSeoFiles(env);
  const isCi = process.env.CF_PAGES === '1' || process.env.CI === 'true';
  if (command === 'build' && !isCi) {
    await optimizeHeroMedia();
    await syncGalleryMedia();
  }

  return {
    root: 'src',
    publicDir: '../public',
    envDir: __dirname,
    plugins: [
      tailwindcss(),
      {
        name: 'inject-google-site-verification',
        transformIndexHtml(html) {
          const token = env.VITE_GOOGLE_SITE_VERIFICATION?.trim();
          if (!token) return html;
          return html.replace(
            '<!-- google-site-verification -->',
            `<meta name="google-site-verification" content="${token}" />`
          );
        },
      },
    ],
    resolve: {
      alias: {
        '@lib': path.resolve(__dirname, 'lib'),
      },
    },
    build: {
      outDir: '../dist',
      emptyOutDir: true,
      target: 'es2020',
      cssMinify: true,
      modulePreload: { polyfill: false },
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('/locales/')) {
              const lang = id.match(/locales\/([\w-]+)\.js/)?.[1];
              return lang ? `locale-${lang}` : undefined;
            }
          },
        },
      },
    },
  };
});
