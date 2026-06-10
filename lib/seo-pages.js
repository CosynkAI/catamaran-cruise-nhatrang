/** @typedef {{ title: string, description: string, ogTitle: string, ogDescription: string, schemaName: string, schemaDescription: string, heroTitle: string, heroLead: string }} PageLocaleSeo */

/** @type {{ slug: string, defaultTab: 'group' | 'individual' | 'vip', locales: Record<string, PageLocaleSeo> }[]} */
export const SEO_PAGES = [
  {
    slug: 'private-cruise-nha-trang',
    defaultTab: 'individual',
    locales: {
      ru: {
        title: 'Частный круиз в Нячанге | Private boat tour от $1000',
        description:
          'Private boat tour Nha Trang: индивидуальный катамаран-круиз для вашей компании. Снорклинг, еда, бар и маршрут без толп. От $1000.',
        ogTitle: 'Частный катамаран-круиз в Нячанге',
        ogDescription: 'Индивидуальный морской тур: только ваша компания, трансфер, бар и морепродукты.',
        schemaName: 'Private catamaran cruise in Nha Trang',
        schemaDescription: 'Private boat tour on a catamaran in Nha Trang with snorkeling, meals and open bar.',
        heroTitle: 'Частный катамаран-круиз в&nbsp;Нячанге',
        heroLead:
          'Private boat tour для пар, семей и компаний — свой маршрут, бар, морепродукты и команда только для вас. От $1000.',
      },
      en: {
        title: 'Private Cruise Nha Trang | Private Boat Tour from $1000',
        description:
          'Private boat tour Nha Trang: charter a catamaran for your group only. Snorkeling, meals, open bar. From $1000.',
        ogTitle: 'Private catamaran cruise in Nha Trang',
        ogDescription: 'Your group, your route — transfer, premium menu and crew dedicated to you.',
        schemaName: 'Private catamaran cruise in Nha Trang',
        schemaDescription: 'Private boat tour on a catamaran in Nha Trang with snorkeling, meals and open bar.',
        heroTitle: 'Private catamaran cruise in&nbsp;Nha&nbsp;Trang',
        heroLead:
          'Private boat tour for couples, families and groups — custom route, open bar and crew just for you. From $1000.',
      },
      ko: {
        title: '냐짱 프라이빗 크루즈 | Private boat tour $1000부터',
        description: 'Nha Trang private boat tour: 단독 캐터마란, 스노클링, 식사, 바 포함. $1000부터.',
        ogTitle: '냐짱 프라이빗 캐터마란 크루즈',
        ogDescription: '일행만을 위한 프라이빗 보트 투어 — 맞춤 루트와 프리미엄 서비스.',
        schemaName: 'Nha Trang private catamaran cruise',
        schemaDescription: 'Private boat tour with snorkeling and meals on a catamaran in Nha Trang.',
        heroTitle: '냐짱 프라이빗 캐터마란&nbsp;크루즈',
        heroLead: '커플·가족·단체를 위한 private boat tour — $1000부터, 맞춤 루트와 오픈 바.',
      },
      kk: {
        title: 'Нячангта жеке круиз | Private boat tour $1000 бастап',
        description:
          'Private boat tour Nha Trang: жеке катамаран, снорклинг, тамақ, бар. Тек сіздің компанияңыз. $1000 бастап.',
        ogTitle: 'Нячангта жеке катамаран круизі',
        ogDescription: 'Жеке теңіз туры — трансфер, кең меню және команда тек сізге.',
        schemaName: 'Nha Trang private catamaran cruise',
        schemaDescription: 'Private boat tour on a catamaran in Nha Trang.',
        heroTitle: 'Нячангта жеке катамаран&nbsp;круизі',
        heroLead: 'Жұптар, отбасылар және компанияларға private boat tour — $1000 бастап.',
      },
    },
  },
  {
    slug: 'sunset-cruise-nha-trang',
    defaultTab: 'group',
    locales: {
      ru: {
        title: 'Sunset cruise Нячанг | Закатный круиз на катамаране от $80',
        description:
          'Sunset cruise Nha Trang: закатный catamaran tour, музыка, еда и снорклинг. Групповой от $80, частный от $1000.',
        ogTitle: 'Sunset cruise на катамаране в Нячанге',
        ogDescription: 'Закат в море, острова и ужин — один из лучших sunset cruise в Нячанге.',
        schemaName: 'Sunset catamaran cruise in Nha Trang',
        schemaDescription: 'Sunset cruise on a catamaran with islands, snorkeling and dinner in Nha Trang.',
        heroTitle: 'Sunset cruise на&nbsp;катамаране в&nbsp;Нячанге',
        heroLead:
          'Закатный catamaran tour: золотой час над морем, острова, снорклинг и ужин. Групповой от $80.',
      },
      en: {
        title: 'Sunset Cruise Nha Trang | Catamaran Sunset Tour from $80',
        description:
          'Sunset cruise Nha Trang: golden hour catamaran tour with islands, snorkeling and dinner. Group from $80.',
        ogTitle: 'Sunset cruise on a catamaran in Nha Trang',
        ogDescription: 'One of the best sunset cruises in Nha Trang — music, food and open sea.',
        schemaName: 'Sunset catamaran cruise in Nha Trang',
        schemaDescription: 'Sunset cruise on a catamaran with islands, snorkeling and dinner.',
        heroTitle: 'Sunset cruise in&nbsp;Nha&nbsp;Trang',
        heroLead: 'Golden-hour catamaran tour with islands, snorkeling and dinner. Group tours from $80.',
      },
      ko: {
        title: '냐짱 선셋 크루즈 | Sunset cruise $80부터',
        description: 'Sunset cruise Nha Trang: 캐터마란 선셋 투어, 스노클링, 식사. 단체 $80부터.',
        ogTitle: '냐짱 캐터마란 선셋 크루즈',
        ogDescription: '바다 위 선셋, 섬 투어와 저녁 식사.',
        schemaName: 'Nha Trang sunset catamaran cruise',
        schemaDescription: 'Sunset cruise with snorkeling and dinner on a catamaran.',
        heroTitle: '냐짱 선셋&nbsp;크루즈',
        heroLead: 'Sunset cruise: 황금빛 바다, 섬과 스노클링. 단체 $80부터.',
      },
      kk: {
        title: 'Нячанг Sunset cruise | Закат круизі $80 бастап',
        description: 'Sunset cruise Nha Trang: закатты catamaran tour, снорклинг, кешкі ас. Топтық $80 бастап.',
        ogTitle: 'Нячангта sunset cruise',
        ogDescription: 'Теңіздегі күн бату, аралдар және кешкі ас.',
        schemaName: 'Nha Trang sunset catamaran cruise',
        schemaDescription: 'Sunset cruise on a catamaran in Nha Trang.',
        heroTitle: 'Нячангта sunset&nbsp;cruise',
        heroLead: 'Закатты catamaran tour — аралдар, снорклинг. Топтық $80 бастап.',
      },
    },
  },
  {
    slug: 'catamaran-tour-nha-trang',
    defaultTab: 'group',
    locales: {
      ru: {
        title: 'Catamaran tour Нячанг | Морской тур на катамаране от $80',
        description:
          'Catamaran tour Nha Trang: групповые и частные морские туры, снорклинг, SUP, рыбалка. Yacht tour без толп. От $80.',
        ogTitle: 'Catamaran tour в Нячанге',
        ogDescription: 'Полный день на катамаране: острова, активности, еда и русскоязычная команда.',
        schemaName: 'Catamaran tour in Nha Trang',
        schemaDescription: 'Catamaran tour with snorkeling, SUP, fishing and meals in Nha Trang.',
        heroTitle: 'Catamaran tour в&nbsp;Нячанге',
        heroLead:
          'Групповой и частный catamaran cruise: острова, снорклинг, SUP и обед в рыбацкой деревне. От $80.',
      },
      en: {
        title: 'Catamaran Tour Nha Trang | Boat Tour from $80',
        description:
          'Catamaran tour Nha Trang: group and private boat tours, snorkeling, SUP, fishing. From $80 per guest.',
        ogTitle: 'Catamaran tour in Nha Trang',
        ogDescription: 'Full day on the water — islands, activities, food and an experienced crew.',
        schemaName: 'Catamaran tour in Nha Trang',
        schemaDescription: 'Catamaran tour with snorkeling, SUP, fishing and meals.',
        heroTitle: 'Catamaran tour in&nbsp;Nha&nbsp;Trang',
        heroLead: 'Group and private catamaran cruise — islands, snorkeling, SUP and village lunch. From $80.',
      },
      ko: {
        title: '냐짱 캐터마란 투어 | Catamaran tour $80부터',
        description: 'Catamaran tour Nha Trang: 단체·프라이빗 보트 투어, 스노클링, SUP. $80부터.',
        ogTitle: '냐짱 캐터마란 투어',
        ogDescription: '섬, 액티비티, 식사가 포함된 하루 크루즈.',
        schemaName: 'Nha Trang catamaran tour',
        schemaDescription: 'Catamaran tour with snorkeling and meals.',
        heroTitle: '냐짱 캐터마란&nbsp;투어',
        heroLead: 'Catamaran tour — 스노클링, SUP, 섬 투어. 단체 $80부터.',
      },
      kk: {
        title: 'Нячанг catamaran tour | Катамаран туры $80 бастап',
        description: 'Catamaran tour Nha Trang: топтық және жеке теңіз турлары, снорклинг, SUP. $80 бастап.',
        ogTitle: 'Нячангта catamaran tour',
        ogDescription: 'Аралдар, белсенділік, тамақ — толық күн теңізде.',
        schemaName: 'Nha Trang catamaran tour',
        schemaDescription: 'Catamaran tour with snorkeling and meals in Nha Trang.',
        heroTitle: 'Нячангта catamaran&nbsp;tour',
        heroLead: 'Catamaran cruise — аралдар, снорклинг, SUP. Топтық $80 бастап.',
      },
    },
  },
  {
    slug: 'snorkeling-tour-nha-trang',
    defaultTab: 'group',
    locales: {
      ru: {
        title: 'Snorkeling tour Нячанг | Снорклинг на катамаране от $80',
        description:
          'Snorkeling tour Nha Trang: прозрачная вода Южных островов, catamaran cruise, обед и команда. От $80.',
        ogTitle: 'Snorkeling tour на катамаране в Нячанге',
        ogDescription: 'Снорклинг, SUP и рыбалка в одном catamaran tour — без массового туризма.',
        schemaName: 'Snorkeling catamaran tour in Nha Trang',
        schemaDescription: 'Snorkeling tour by catamaran to the Southern Islands of Nha Trang.',
        heroTitle: 'Snorkeling tour в&nbsp;Нячанге',
        heroLead:
          'Snorkeling tour на катамаране: Южные острова, прозрачная вода, SUP и обед. Групповой от $80.',
      },
      en: {
        title: 'Snorkeling Tour Nha Trang | Catamaran Snorkel Trip from $80',
        description:
          'Snorkeling tour Nha Trang: Southern Islands, clear water, catamaran cruise and lunch. From $80.',
        ogTitle: 'Snorkeling tour by catamaran in Nha Trang',
        ogDescription: 'Snorkeling, SUP and fishing in one catamaran tour — away from crowds.',
        schemaName: 'Snorkeling catamaran tour in Nha Trang',
        schemaDescription: 'Snorkeling tour by catamaran to the Southern Islands.',
        heroTitle: 'Snorkeling tour in&nbsp;Nha&nbsp;Trang',
        heroLead: 'Catamaran snorkeling tour to the Southern Islands with lunch. Group tours from $80.',
      },
      ko: {
        title: '냐짱 스노클링 투어 | Snorkeling tour $80부터',
        description: 'Snorkeling tour Nha Trang: 남부 섬, 맑은 바다, 캐터마란 크루즈. $80부터.',
        ogTitle: '냐짱 캐터마란 스노클링 투어',
        ogDescription: '스노클링, SUP, 낚시가 포함된 보트 투어.',
        schemaName: 'Nha Trang snorkeling catamaran tour',
        schemaDescription: 'Snorkeling tour by catamaran in Nha Trang.',
        heroTitle: '냐짱 스노클링&nbsp;투어',
        heroLead: 'Snorkeling tour — 남부 섬, 맑은 물, 식사 포함. $80부터.',
      },
      kk: {
        title: 'Нячанг snorkeling tour | Снорклинг туры $80 бастап',
        description: 'Snorkeling tour Nha Trang: Оңтүстік аралдар, мөлдір су, катамаран. $80 бастап.',
        ogTitle: 'Нячангта snorkeling tour',
        ogDescription: 'Снорклинг, SUP және балық аулау бір catamaran tour-да.',
        schemaName: 'Nha Trang snorkeling tour',
        schemaDescription: 'Snorkeling tour by catamaran in Nha Trang.',
        heroTitle: 'Нячангта snorkeling&nbsp;tour',
        heroLead: 'Snorkeling tour — Оңтүстік аралдар, мөлдір су. Топтық $80 бастап.',
      },
    },
  },
  {
    slug: 'birthday-on-yacht-nha-trang',
    defaultTab: 'vip',
    locales: {
      ru: {
        title: 'День рождения на яхте Нячанг | Birthday on yacht от $1500',
        description:
          'Birthday on yacht Nha Trang: VIP catamaran cruise с едой, баром, дрон-съёмкой и персональным маршрутом. От $1500.',
        ogTitle: 'День рождения на катамаране в Нячанге',
        ogDescription: 'Праздник в море: премиальный сервис, музыка, еда и закат для вашей компании.',
        schemaName: 'Birthday catamaran cruise in Nha Trang',
        schemaDescription: 'VIP birthday on yacht — private catamaran with premium menu and drone video.',
        heroTitle: 'День рождения на&nbsp;катамаране',
        heroLead:
          'Birthday on yacht в Нячанге: VIP-круиз, премиальное меню, бар, дрон и маршрут под ваш праздник. От $1500.',
      },
      en: {
        title: 'Birthday on Yacht Nha Trang | VIP Catamaran from $1500',
        description:
          'Birthday on yacht Nha Trang: VIP catamaran cruise with premium food, open bar, drone video. From $1500.',
        ogTitle: 'Birthday party on a catamaran in Nha Trang',
        ogDescription: 'Celebrate at sea — premium service, music, food and sunset for your group.',
        schemaName: 'Birthday catamaran cruise in Nha Trang',
        schemaDescription: 'VIP birthday on yacht with premium menu and drone filming.',
        heroTitle: 'Birthday on&nbsp;yacht in Nha Trang',
        heroLead: 'VIP catamaran birthday — premium menu, open bar, drone video and custom route. From $1500.',
      },
      ko: {
        title: '냐짱 요트 생일 파티 | Birthday on yacht $1500부터',
        description: 'Birthday on yacht Nha Trang: VIP 캐터마란, 프리미엄 식사, 드론 촬영. $1500부터.',
        ogTitle: '냐짱 캐터마란 생일 파티',
        ogDescription: '바다 위 프라이빗 생일 파티 — 프리미엄 서비스와 선셋.',
        schemaName: 'Nha Trang birthday catamaran cruise',
        schemaDescription: 'VIP birthday on yacht in Nha Trang.',
        heroTitle: '요트&nbsp;생일 파티',
        heroLead: 'Birthday on yacht — VIP 크루즈, 프리미엄 메뉴, 드론. $1500부터.',
      },
      kk: {
        title: 'Нячангта яхтада туған күн | Birthday on yacht $1500 бастап',
        description: 'Birthday on yacht Nha Trang: VIP катамаран, премиум тамақ, дрон түсірілімі. $1500 бастап.',
        ogTitle: 'Нячангта катамаранда туған күн',
        ogDescription: 'Теңіздегі мереке — премиум сервис және закат.',
        schemaName: 'Nha Trang birthday catamaran cruise',
        schemaDescription: 'VIP birthday on yacht in Nha Trang.',
        heroTitle: 'Яхтада туған&nbsp;күн',
        heroLead: 'Birthday on yacht — VIP круиз, премиум меню, дрон. $1500 бастап.',
      },
    },
  },
];

/** @param {string} slug @param {string} [lang] */
export function getPageSeo(slug, lang = 'ru') {
  const page = SEO_PAGES.find((p) => p.slug === slug);
  if (!page) return null;
  return page.locales[lang] ?? page.locales.ru;
}

/** @param {string} slug */
export function getPageConfig(slug) {
  return SEO_PAGES.find((p) => p.slug === slug) ?? null;
}

export function getPageSlugs() {
  return SEO_PAGES.map((p) => p.slug);
}

/** @returns {string} */
export function getCurrentPageSlug() {
  if (typeof document === 'undefined') return '';
  return document.body?.dataset?.page?.trim() || '';
}
