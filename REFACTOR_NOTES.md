# Frontend refactor

## Structure

- `src/main.js` — bootstrap only
- `src/ui/*` — carousel, gallery, reviews, booking, video, navigation, FAQ
- `src/css/design-tokens.css` — design tokens (replaces `more.css` / `more2.css`)
- `functions/api/availability.js` — `GET /api/availability?date=YYYY-MM-DD`

## Smoke checklist (manual)

1. **Меню** — открыть/закрыть на мобилке, Tab не уходит за пределы меню
2. **Язык** — RU/EN/KO/KK: отзывы, контакты, FAQ `aria-expanded`
3. **Бронь** — выбор даты → превью; без даты → ошибка; sticky CTA / floating WA
4. **Карусели** — галерея и отзывы: стрелки, точки, resize
5. **Видео** — hero на десктопе; на мобилке — tap to play
6. **Availability** — заблокированная дата показывает `form.dateUnavailable` на текущем языке

## Build

```bash
npm run build
```

Runs: Vite → prerender → `verify-dist` → `verify-refactor`

## Availability API (production)

- Cloudflare Pages Function: `/api/availability`
- Optional KV `AVAILABILITY` key `blocked-dates` → `["2026-07-01"]`
- Or env `BLOCKED_DATES` JSON array
- Client fails open if API unavailable
