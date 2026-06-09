# Деплой seatrips-nhatrang.com (Vercel + Cloudflare)

## 1. GitHub

Репозиторий: https://github.com/CosynkAI/catamaran-cruise-nhatrang

После изменений домена:

```bash
git add -A && git commit -m "chore: seatrips-nhatrang.com domain for production"
git push origin main
```

## 2. Vercel

1. [vercel.com/new](https://vercel.com/new) → Import **CosynkAI/catamaran-cruise-nhatrang**
2. Framework: **Vite** (определится автоматически)
3. Build: `npm run build`, Output: `dist` (уже в `vercel.json`)
4. **Environment Variables** (Production) — скопировать из `.env.example`:
   - `VITE_SITE_URL=https://seatrips-nhatrang.com`
   - `VITE_WHATSAPP_NUMBER`, `VITE_TELEGRAM_USERNAME`, `VITE_ZALO_PHONE`, `VITE_INSTAGRAM_URL`, `VITE_CONTACT_EMAIL`
   - Дубли без `VITE_` для `api/book` (см. `.env.example`)
5. Deploy
6. **Settings → Domains** → добавить:
   - `seatrips-nhatrang.com` (primary)
   - `www.seatrips-nhatrang.com` (редирект на apex в `vercel.json`)

## 3. Cloudflare DNS

В зоне **seatrips-nhatrang.com** → DNS:

| Тип   | Имя | Значение              | Proxy |
|-------|-----|------------------------|-------|
| CNAME | `@` | `cname.vercel-dns.com` | DNS only (серое облако) * |
| CNAME | `www` | `cname.vercel-dns.com` | DNS only |

\* Если Vercel покажет другие записи (A `76.76.21.21` для apex) — используйте их из панели Vercel → Domains.

**SSL/TLS:** Full (strict) — если включите оранжевое облако (прокси).

**Рекомендация:** для Vercel проще **DNS only** на записях домена, SSL выдаёт Vercel.

## 4. Проверка

- https://seatrips-nhatrang.com/
- https://seatrips-nhatrang.com/sitemap.xml
- https://seatrips-nhatrang.com/api/book?type=group&lang=ru&channel=whatsapp → редирект в WhatsApp
- www → редирект на apex

## 5. Почта (опционально)

`info@seatrips-nhatrang.com` — **Email Routing** в Cloudflare или переадресация на личный ящик.
