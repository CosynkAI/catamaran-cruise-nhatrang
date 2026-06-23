# Catamaran Cruise Landing — Нячанг

Лендинг морских круизов в Нячанге. Токены дизайна: `src/css/design-tokens.css`.

## Запуск

```bash
cd catamaran-cruise-landing
npm install
npm run dev
```

Откройте адрес из терминала (обычно http://localhost:5173).

**Сборка:** `npm run build` → `dist/` (24 prerender HTML: 6 страниц × 4 языка).

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
| Групповой | от **$80** |
| Индивидуальный | от **$1000** |
| Premium | от **$1500** |

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

- canonical, hreflang (ru/en/ko/kk) — path-based: `/`, `/en/`, `/ko/`, `/kk/`
- sitemap.xml, robots.txt
- llms.txt, llms-full.txt
- WebMCP / ai-plugin.json
- Мультиязычность: ru, en, ko, kk

---

### P2 — отдельные посадочные + prerender (сделано)

#### 6 страниц × 4 языка = 24 HTML

Контент в `lib/seo-pages.js` (посадочные) и `src/locales/*.js` (главная). При сборке `scripts/prerender-seo-pages.mjs` генерирует статический HTML для каждой локали.

| URL (ru) | en | Фокус | Таб |
|----------|-----|-------|-----|
| `/` | `/en/` | главная | — |
| `/private-cruise-nha-trang/` | `/en/private-cruise-nha-trang/` | private boat tour | individual |
| `/sunset-cruise-nha-trang/` | `/en/sunset-cruise-nha-trang/` | sunset cruise | group |
| `/catamaran-tour-nha-trang/` | `/en/catamaran-tour-nha-trang/` | catamaran tour | group |
| `/snorkeling-tour-nha-trang/` | `/en/snorkeling-tour-nha-trang/` | snorkeling tour | group |
| `/birthday-on-yacht-nha-trang/` | `/en/birthday-on-yacht-nha-trang/` | birthday on yacht | vip |

Аналогично `/ko/…` и `/kk/…`.

В **статическом HTML** каждой версии:
- уникальные `<title>`, description, og/twitter, `lang`
- canonical и hreflang (path-based)
- H1 и lead в hero на языке страницы
- schema с адресом (`lib/business-schema.js`)
- `data-page`, `data-default-tab`, `data-default-lang` на `<body>`

`i18n.js` читает язык из URL (`/en/…`) и `data-default-lang`; смена языка в UI ведёт на `/en/…`, `/ko/…`.

#### Sitemap и индексация

`sitemap.xml` — **24 URL** (6 страниц × 4 языка), на каждый — hreflang-альтернативы.

`llms.txt` / `llms-full.txt` — все локализованные URL.

Cloudflare Pages: статика `dist/{lang}/{slug}/index.html` отдаётся до SPA fallback (`public/_redirects`).

#### Сборка

```bash
npm run build
# vite build && prerender (24 HTML) && verify-dist
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
│   ├── index.html          # разметка, секции, SEO-блок #seo-content
│   ├── main.js             # конфигуратор, галерея, бронирование
│   ├── i18n.js             # ru/en/ko/kk, path-based URL, meta, schema
│   ├── site.js             # конфиг из env
│   ├── locales/            # переводы UI
│   └── css/input.css
├── lib/
│   ├── site-config.js      # URL, контакты, og
│   ├── seo-pages.js        # 5 посадочных × 4 языка
│   ├── seo-urls.js         # pagePath, hreflang, detectLang
│   ├── seo-body.js         # SEO-тексты (главная + посадочные)
│   ├── business-schema.js  # NAP + TravelAgency schema
│   ├── booking-messages.js
│   └── webmcp.js
├── scripts/
│   ├── generate-seo-files.mjs    # robots, sitemap (24 URL), llms, mcp
│   ├── prerender-seo-pages.mjs   # 24 HTML
│   └── verify-dist.mjs
├── functions/api/book.js   # Cloudflare Pages — редирект в мессенджер
├── public/                 # статика, sitemap, robots, _redirects
└── wrangler.toml           # pages_build_output_dir = dist
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
- SEO: meta, hreflang (path-based), sitemap, 24 prerender-страницы, schema + адрес
- API `/api/book` для AI-агентов

## Оценка маркетолога (до доработок → потенциал)

| Критерий | Было | Потенциал после P1+P2 |
|----------|------|-------------------------|
| Маркетинг | 8/10 | 9+ |
| SEO | 6.5/10 | 8+ |
| Конверсия | 6/10 | 8+ |
| Дизайн | 8.5/10 | 8.5+ |
