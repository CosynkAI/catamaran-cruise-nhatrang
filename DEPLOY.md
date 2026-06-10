# Деплой seatrips-nhatrang.com (Cloudflare Pages)

Репозиторий: https://github.com/CosynkAI/catamaran-cruise-nhatrang

## 1. Cloudflare Pages

1. [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. Репозиторий: **CosynkAI/catamaran-cruise-nhatrang**, ветка **main**
3. Настройки сборки:

| Поле | Значение |
|------|----------|
| Тип проекта | **Pages** (не Workers) |
| Framework preset | None |
| Build command | `npm run build` |
| Build output directory | `dist` |
| **Deploy command** | **пусто** (не `wrangler deploy`) |
| Root directory | `/` |

> Если в логе `main = "src/index.ts"` или `wrangler deploy` — в Settings → Builds очистите **Deploy command** и сохраните.

4. **Environment variables** (Production + Preview) — из `.env.example`:

**Build** (для Vite при сборке):
- `VITE_SITE_URL=https://seatrips-nhatrang.com`
- `VITE_WHATSAPP_NUMBER`, `VITE_TELEGRAM_USERNAME`, `VITE_INSTAGRAM_URL`, `VITE_CONTACT_EMAIL`, `VITE_OG_IMAGE_URL`

**Runtime** (для `/api/book`):
- `SITE_URL`, `WHATSAPP_NUMBER`, `TELEGRAM_USERNAME`, `INSTAGRAM_URL`, `CONTACT_EMAIL`

5. **Save and Deploy**

## 2. Домен (уже на Cloudflare)

**Workers & Pages** → проект → **Custom domains** → **Set up a custom domain**:
- `seatrips-nhatrang.com`
- `www.seatrips-nhatrang.com`

DNS создастся автоматически (CNAME на `*.pages.dev`). Прокси (оранжевое облако) — можно оставить включённым.

Редирект `www` → apex: `public/_redirects`.

## 3. Проверка после деплоя

**Базовые URL**
- https://seatrips-nhatrang.com/
- https://seatrips-nhatrang.com/sitemap.xml (ожидается **24** `<url>`)
- https://seatrips-nhatrang.com/api/book?type=group&lang=ru&channel=whatsapp
- https://www.seatrips-nhatrang.com/ → редирект на apex

**Локали (prerender HTML)**
- https://seatrips-nhatrang.com/en/
- https://seatrips-nhatrang.com/ko/
- https://seatrips-nhatrang.com/kk/
- https://seatrips-nhatrang.com/en/private-cruise-nha-trang/ (и остальные 4 посадочные × 3 языка)

**На каждой локали в View Source**
- `<html lang="…">` совпадает с URL
- уникальные `<title>`, H1, блок `#seo-content`
- `link rel="canonical"` на текущий path
- `link rel="preload"` для woff2 (Manrope, Cormorant)

**Производительность**
- [PageSpeed Insights](https://pagespeed.web.dev/) для `/` и `/en/`
- LCP: hero-poster; CLS: шрифты с preload

**Индексация**
- Search Console → sitemap → 24 URL
- Запросить индексацию `/`, `/en/`, топовых посадочных

## 4. Локальный preview (опционально)

```bash
npm run build
npx wrangler pages dev dist
```

## 5. Почта (опционально)

`info@seatrips-nhatrang.com` — **Email Routing** в Cloudflare.

## 6. Google Search Console (индексация)

1. Откройте [search.google.com/search-console](https://search.google.com/search-console)
2. **Добавить ресурс** → **Домен** `seatrips-nhatrang.com` (предпочтительно)  
   или **Префикс URL** `https://seatrips-nhatrang.com/`
3. **Верификация домена:** DNS TXT-запись в Cloudflare (рекомендуется — покрывает www и apex)
4. **Верификация HTML-тега** (альтернатива):
   - Search Console выдаст `content="XXXXXXXX"`
   - Cloudflare Pages → **Environment variables** → Build:
     - `VITE_GOOGLE_SITE_VERIFICATION=XXXXXXXX`
   - Redeploy (пересборка вставит meta-тег в `<head>`)
5. После верификации → **Файлы Sitemap** → добавить:
   - `https://seatrips-nhatrang.com/sitemap.xml`
6. **Проверка URL** → запросить индексацию главной `https://seatrips-nhatrang.com/`
7. `robots.txt` и `sitemap.xml` генерируются при `npm run build` из `scripts/generate-seo-files.mjs`

> Sitemap уже указан в `robots.txt`: `Sitemap: https://seatrips-nhatrang.com/sitemap.xml`
