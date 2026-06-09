# Catamaran Cruise Landing — Нячанг

Лендинг морских круизов в Нячанге. Токены дизайна: `more.css`, `more2.css` (в корне репозитория).

## Запуск

```bash
cd catamaran-cruise-landing
npm install
npm run dev
```

Откройте адрес из терминала (обычно http://localhost:5173).

**Сборка:** `npm run build` → `dist/` (+ prerender SEO-страниц).

**Preview:** `npm run preview`

## Переменные окружения

Скопируйте `.env.example` → `.env` и задайте продакшен-значения.

При `npm run dev` / `npm run build` из `.env` пересобираются `public/robots.txt`, `sitemap.xml`, `llms.txt`, `.well-known/mcp.json`.

| Переменная | Назначение |
|------------|------------|
| `VITE_SITE_URL` | Canonical, sitemap, Open Graph |
| `VITE_WHATSAPP_NUMBER` | WhatsApp (только цифры) |
| `VITE_TELEGRAM_USERNAME` | Telegram без @ |
| `VITE_INSTAGRAM_URL` | Instagram |
| `VITE_CONTACT_EMAIL` | Email в Schema.org / MCP |

**API для AI:** `GET /api/book?type=group|individual|vip&lang=ru|en|ko|kk&channel=whatsapp|telegram` → редирект в мессенджер с готовым текстом (Cloudflare: `functions/api/book.js`).

## Контакты

В блоке `#contacts` — Анастасия и Полина с прямыми WhatsApp/Telegram.

`src/site.js` + `lib/site-config.js` — единый источник URL и контактов для Schema/MCP; `src/main.js` экспортирует `CONTACTS`.

---

## Журнал изменений (по ТЗ маркетолога)

Доработки по анализу SEO/конверсии заказчика (июнь 2026).

### P1 — конверсия и доверие (сделано)

#### Оффер и позиционирование

| Было | Стало |
|------|-------|
| «Покажем Нячанг, который не видят 90% туристов» | **H1:** «Частные и групповые круизы на катамаране в Нячанге» |
| Абстрактный оффер | **Lead:** закаты, острова, снорклинг, премиум без толп — для пар, семей и компаний |
| Маркетинговый title | **SEO title (ru):** «Катамаран-круизы в Нячанге \| Частные и групповые морские туры» |

Ключи `i18n`: `hero.title`, `hero.lead`, `meta.title`, `meta.ogTitle`.

#### Цены (главная проблема конверсии)

Цены видны везде — снимает тревогу «50$ или 500$?»:

| Формат | Цена |
|--------|------|
| Групповой | от **$69** |
| Индивидуальный | от **$390** |
| VIP | от **$900** |

Где отображаются:
- Hero — полоска `.hero-prices` (3 бейджа)
- Табы конфигуратора — `.tab-price`
- Панели конфигуратора — `.config-panel__price`
- Карточки программ — `.card-price`
- Примечание под программами — `price.note` («Финальная стоимость зависит от даты и состава группы»)

Ключи `i18n`: `hero.priceGroup`, `hero.pricePrivate`, `hero.priceVip`, `group.price`, `private.price`, `vip.price`, `price.note`.

#### Social proof и отзывы

- Блок **«Гостям у нас нравится»** — статистика (1000+, 4.9★, безопасность)
- Отзывы вынесены в отдельную секцию `#reviews` после галереи (3 карточки, ru/en/ko)

#### Trust-блок

Секция `#trust` — «Почему нам доверяют» (6 пунктов):
- лицензия / регистрация
- опытная команда
- 1000+ гостей, рейтинг 4.9
- страховка и снаряжение
- сотни выходов в море
- прозрачные условия (депозит 50%, перенос при погоде)

Ключи: `trust.title`, `trust.1` … `trust.6`.

#### Блок «Что происходит после брони»

Секция `#booking-steps` — 5 шагов вместо старого блока steps:
1. Написали в WhatsApp
2. Подтвердили дату
3. Внесли депозит 50%
4. Получили инструкцию
5. Вышли в море

Ключи: `booking.title`, `booking.1.title` … `booking.5.text`.

#### Структура страницы (новый порядок)

```
Hero
  ↓
Social proof (статистика)
  ↓
Программы (карточки + цены)
  ↓
Trust (почему нам доверяют)
  ↓
Booking steps (что после брони)
  ↓
Конфигуратор (форма + табы)
  ↓
Галерея
  ↓
Отзывы
  ↓
FAQ
  ↓
Контакты
```

#### Прочие UX/дизайн

- Badge hero: `Sunset vibes · sea · music · food`
- Sunset-чипы времени — `.time-chip--sunset` (читаемость)
- Карточки `.content-card` — полоска `::before` не вылезает за скругления
- FAQ/карточки — тёмный текст на светлых панелях (`body.theme-sea .content-card`)
- Галерея — только фото, карусель 2×3, свайп, `scripts/sync-gallery-media.mjs`
- Фон — `public/videos/hero.mp4`

---

### SEO — все языки (сделано)

#### Meta и коммерческие ключи

| Язык | `meta.title` |
|------|----------------|
| ru | Катамаран-круизы в Нячанге \| Частные и групповые морские туры |
| en | Catamaran Cruise Nha Trang \| Private & Group Boat Tours |
| ko | 냐짱 캐터마란 크루즈 \| 프라이빗·단체 보트 투어 |
| kk | Нячангта катамаран круиздері \| Жеке және топтық теңіз турлары |

В `meta.description` и `programs.subtitle` (все 4 языка) добавлены ключи:
- `catamaran cruise nha trang`
- `private boat tour`
- `sunset cruise`
- `snorkeling tour`
- `catamaran tour` / `yacht tour`

Статический `<head>` в `src/index.html` синхронизирован с ru-версией (title, description, og, twitter, schema).

#### Schema.org

- `@type`: `TouristTrip`
- `offers`: `AggregateOffer` с `lowPrice: 69`, `highPrice: 900`, `offerCount: 3`
- `aggregateRating`: 4.9 / 127 отзывов
- FAQ schema генерируется из `i18n` при смене языка

#### Техническое SEO (было + актуально)

- canonical, hreflang (ru/en/ko/kk)
- sitemap.xml, robots.txt
- llms.txt, llms-full.txt
- WebMCP / ai-plugin.json
- Мультиязычность: ru, en, ko, kk

---

### P2 — отдельные посадочные + prerender (сделано)

#### 5 SEO-страниц

Контент в `lib/seo-pages.js`, при сборке генерируются в `dist/{slug}/index.html` скриптом `scripts/prerender-seo-pages.mjs`.

| URL | Фокус | Таб по умолчанию |
|-----|-------|------------------|
| `/private-cruise-nha-trang/` | private boat tour | individual ($390) |
| `/sunset-cruise-nha-trang/` | sunset cruise | group ($69) |
| `/catamaran-tour-nha-trang/` | catamaran tour | group ($69) |
| `/snorkeling-tour-nha-trang/` | snorkeling tour | group ($69) |
| `/birthday-on-yacht-nha-trang/` | birthday on yacht | vip ($900) |

На каждой странице в **статическом HTML** (без JS):
- уникальные `<title>`, description, og/twitter
- canonical и og:url на свой URL
- уникальные H1 и lead в hero
- schema с page-specific name/description/url
- `data-page="{slug}"` и `data-default-tab` на `<body>`

При смене языка в браузере `i18n.js` подставляет переводы страницы из `seo-pages.js` (title, meta, hero).

#### Sitemap и индексация

`sitemap.xml` — 6 URL (главная + 5 посадочных), hreflang на каждый.

`llms.txt` — ссылки на все посадочные.

Vercel: статика `/slug/index.html` отдаётся раньше SPA-rewrite из `vercel.json`.

#### Сборка

```bash
npm run build
# = vite build && node scripts/prerender-seo-pages.mjs
```

---

### P3 — не сделано (бэклог)

- A/B тесты (цена, видео выше fold, scarcity «4–8 мест»)
- Дополнительные языки
- Оптимизация скорости (Lighthouse)
- Реальные фото клиентов, видео-отзывы, скрины WhatsApp, TripAdvisor/Google Reviews (нужен контент от заказчика)

---

## Структура проекта

```
catamaran-cruise-landing/
├── src/
│   ├── index.html          # разметка, секции, статический SEO (ru)
│   ├── main.js             # конфигуратор, галерея, бронирование, page defaults
│   ├── i18n.js             # переводы ru/en/ko/kk, meta, page-aware SEO
│   ├── site.js             # конфиг из env
│   └── css/input.css       # стили (hero-prices, trust, booking-steps, …)
├── lib/
│   ├── site-config.js      # URL, контакты, og
│   ├── booking-messages.js # шаблоны WhatsApp/Telegram
│   ├── booking-url.js
│   └── seo-pages.js        # контент 5 посадочных × 4 языка
├── scripts/
│   ├── generate-seo-files.mjs    # robots, sitemap, llms, mcp
│   ├── prerender-seo-pages.mjs   # dist/{slug}/index.html
│   ├── sync-gallery-media.mjs    # фото → public/images/media
│   └── build-single-page.mjs     # один HTML для пересылки
├── public/
│   ├── videos/hero.mp4
│   ├── gallery-manifest.json
│   ├── sitemap.xml
│   └── robots.txt
├── api/book.js             # Vercel redirect в мессенджер
└── vercel.json
```

## Реализовано (полный список)

- Hero: видео-фон, badge, H1/lead по новому офферу, цены, 2 CTA
- Мобильное меню + липкая кнопка «Забронировать»
- Social proof (статистика)
- Программы: групповой / индивидуальный / VIP с ценами и мессенджерами
- Trust-блок и booking steps
- Конфигуратор: табы с ценами, форма даты/гостей/времени, готовые сообщения
- Галерея: карусель фото (синк из `../images and videos/`)
- Отзывы (отдельная секция)
- FAQ с Schema.org
- Контакты: Анастасия, Полина
- i18n: ru, en, ko, kk
- SEO: meta, hreflang, sitemap, 5 prerender-страниц
- API `/api/book` для AI-агентов

## Оценка маркетолога (до доработок → потенциал)

| Критерий | Было | Потенциал после P1+P2 |
|----------|------|-------------------------|
| Маркетинг | 8/10 | 9+ |
| SEO | 6.5/10 | 8+ |
| Конверсия | 6/10 | 8+ |
| Дизайн | 8.5/10 | 8.5+ |
