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
- `VITE_WHATSAPP_NUMBER`, `VITE_TELEGRAM_USERNAME`, `VITE_ZALO_PHONE`, `VITE_INSTAGRAM_URL`, `VITE_CONTACT_EMAIL`, `VITE_OG_IMAGE_URL`

**Runtime** (для `/api/book`):
- `SITE_URL`, `WHATSAPP_NUMBER`, `TELEGRAM_USERNAME`, `ZALO_PHONE`, `INSTAGRAM_URL`, `CONTACT_EMAIL`

5. **Save and Deploy**

## 2. Домен (уже на Cloudflare)

**Workers & Pages** → проект → **Custom domains** → **Set up a custom domain**:
- `seatrips-nhatrang.com`
- `www.seatrips-nhatrang.com`

DNS создастся автоматически (CNAME на `*.pages.dev`). Прокси (оранжевое облако) — можно оставить включённым.

Редирект `www` → apex: `public/_redirects`.

## 3. Проверка

- https://seatrips-nhatrang.com/
- https://seatrips-nhatrang.com/sitemap.xml
- https://seatrips-nhatrang.com/api/book?type=group&lang=ru&channel=whatsapp
- https://www.seatrips-nhatrang.com/ → редирект на apex

## 4. Локальный preview (опционально)

```bash
npm run build
npx wrangler pages dev dist
```

## 5. Почта (опционально)

`info@seatrips-nhatrang.com` — **Email Routing** в Cloudflare.
