import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');
const outputFilePath = path.resolve(__dirname, '../../cruise.html');
const SITE_URL = 'https://cruisenhatrang.com';

function buildSinglePage() {
  console.log('Building single HTML page...');
  let html = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');

  // 1. Find and inline stylesheets
  const linkRegex = /<link[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/g;
  html = html.replace(linkRegex, (match, href) => {
    // strip out leading slash or dot
    const cleanHref = href.replace(/^\.?\//, '');
    const cssPath = path.join(distDir, cleanHref);
    if (fs.existsSync(cssPath)) {
      let css = fs.readFileSync(cssPath, 'utf-8');
      // Convert relative urls in CSS to absolute urls
      css = css.replace(/url\(['"]?([^'")]+)['"]?\)/g, (m, urlPath) => {
        if (urlPath.startsWith('http://') || urlPath.startsWith('https://') || urlPath.startsWith('data:')) {
          return m;
        }
        // Normalize url
        const cleanUrl = urlPath.replace(/^\.?\//, '');
        if (cleanUrl.startsWith('assets/')) {
          return `url(${SITE_URL}/${cleanUrl})`;
        } else {
          return `url(${SITE_URL}/assets/${cleanUrl})`;
        }
      });
      return `<style>${css}</style>`;
    }
    return match;
  });

  // 2. Find and inline scripts
  const scriptRegex = /<script[^>]*src=["']([^"']+)["'][^>]*><\/script>/g;
  html = html.replace(scriptRegex, (match, src) => {
    const cleanSrc = src.replace(/^\.?\//, '');
    const jsPath = path.join(distDir, cleanSrc);
    if (fs.existsSync(jsPath)) {
      const js = fs.readFileSync(jsPath, 'utf-8');
      return `<script type="module">${js}</script>`;
    }
    return match;
  });

  // 3. Convert all other relative URLs in the HTML to absolute URLs
  // Replace attributes: src, poster, href (excluding anchors like #), data-src starting with / or relative
  html = html.replace(/(src|poster|href|data-src)=["']\/([^"']+)["']/g, (match, attr, val) => {
    if (val.startsWith('http') || val.startsWith('mailto') || val.startsWith('tel') || val.startsWith('#')) {
      return match;
    }
    return `${attr}="${SITE_URL}/${val}"`;
  });

  // 4. Save output
  fs.writeFileSync(outputFilePath, html, 'utf-8');
  console.log(`Successfully generated single HTML page: ${outputFilePath}`);
}

buildSinglePage();
