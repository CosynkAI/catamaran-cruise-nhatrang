/** @typedef {{ title: string, html: string }} SeoBody */

/** @type {Record<string, Record<string, SeoBody>>} */
const SEO_BODIES = {
  __home__: {
    ru: {
      title: 'Катамаран-круизы и морские туры в Нячанге',
      html: `<p>Catamaran cruise Nha Trang — это групповые и частные морские туры с причала Bến Tàu Du Lịch Nha Trang. Мы проводим <strong>sunset cruise</strong> на закате, дневной <strong>catamaran tour</strong> с островами и <strong>snorkeling tour</strong> в прозрачной воде залива. Групповой формат от $80 — идеален для пар и небольших компаний; <strong>private boat tour</strong> от $1000 — только ваша команда, бар, морепродукты и маршрут под вас.</p>
<p>На борту: снорклинг, SUP, рыбалка, обед в рыбацкой деревне, музыка и команда с опытом более 1000 гостей за сезон. Бронирование через WhatsApp или Telegram — укажите дату, число гостей и формат (группа, индивидуальный или Premium от $1500). Круизы на русском, английском, корейском и казахском.</p>`,
    },
    en: {
      title: 'Catamaran cruises & boat tours in Nha Trang',
      html: `<p><strong>Catamaran cruise Nha Trang</strong> — group and private sea tours from Bến Tàu Du Lịch Nha Trang pier. We run <strong>sunset cruise</strong> trips, daytime <strong>catamaran tour</strong> routes with islands, and <strong>snorkeling tour</strong> sessions in clear bay water. Group tours from $80 suit couples and friends; <strong>private boat tour</strong> from $1000 is your catamaran only — open bar, seafood menu, custom route.</p>
<p>On board: snorkelling, SUP, fishing, lunch in a fishing village, music and an experienced crew. Book via WhatsApp or Telegram with your date, guest count and format (group, private or Premium from $1500). Tours in Russian, English, Korean and Kazakh.</p>`,
    },
    ko: {
      title: '냐짱 캐터마란 크루즈 & 보트 투어',
      html: `<p><strong>Catamaran cruise Nha Trang</strong> — Bến Tàu Du Lịch Nha Trang 부두에서 출발하는 단체·프라이빗 바다 투어입니다. <strong>Sunset cruise</strong>, 섬을 도는 <strong>catamaran tour</strong>, <strong>snorkeling tour</strong>을 운영합니다. 단체 $80부터, <strong>private boat tour</strong> $1000부터 — 일행만을 위한 맞춤 루트와 오픈 바.</p>
<p>스노클링, SUP, 낚시, 어촌 식사, 음악이 포함됩니다. WhatsApp·Telegram으로 날짜와 인원을 보내 예약하세요. Premium $1500부터. 러시아어·영어·한국어·카자흐어 안내.</p>`,
    },
    kk: {
      title: 'Нячангта катамаран круиздері мен теңіз турлары',
      html: `<p><strong>Catamaran cruise Nha Trang</strong> — Bến Tàu Du Lịch Nha Trang айлағынан топтық және жеке теңіз турлары. <strong>Sunset cruise</strong>, аралдарға <strong>catamaran tour</strong>, таза суда <strong>snorkeling tour</strong>. Топтық $80 бастап, <strong>private boat tour</strong> $1000 бастап — тек сіздің компанияңыз, бар және жеке маршрут.</p>
<p>Снорклинг, SUP, балық аулау, балықшылар ауылында түскі ас. WhatsApp немесе Telegram арқылы броньдаңыз. Premium $1500 бастап.</p>`,
    },
  },
  'private-cruise-nha-trang': {
    ru: {
      title: 'Private boat tour и частный катамаран в Нячанге',
      html: `<p><strong>Private boat tour Nha Trang</strong> — аренда катамарана только для вашей компании: пары, семьи или друзей. Индивидуальный маршрут, снорклинг, бар и морепродукты, трансфер к причалу. Частный catamaran cruise от $1000 — без толп туристов, с гибким временем выхода 09:00–14:00 или sunset 15:00–20:00.</p>`,
    },
    en: {
      title: 'Private boat tour & charter catamaran in Nha Trang',
      html: `<p><strong>Private boat tour Nha Trang</strong> charters the catamaran for your group only — couples, families or friends. Custom route, snorkelling, open bar and seafood, pier transfer. Private catamaran cruise from $1000, flexible 09:00–14:00 or sunset 15:00–20:00 departures.</p>`,
    },
    ko: {
      title: '냐짱 프라이빗 보트 투어',
      html: `<p><strong>Private boat tour Nha Trang</strong> — 일행만을 위한 캐터마란 전세. 맞춤 루트, 스노클링, 오픈 바, 해산물, 선착장 픽업. $1000부터, 주간·선셋 출발 선택.</p>`,
    },
    kk: {
      title: 'Нячангта private boat tour',
      html: `<p><strong>Private boat tour Nha Trang</strong> — жеке катамаран тек сіздің тобыңызға. Жеке маршрут, снорклинг, бар, теңіз өнімдері. $1000 бастап.</p>`,
    },
  },
  'sunset-cruise-nha-trang': {
    ru: {
      title: 'Sunset cruise — закатный круиз в Нячанге',
      html: `<p><strong>Sunset cruise Nha Trang</strong> — catamaran tour в золотой час: музыка, ужин, острова и снорклинг перед закатом. Групповой sunset cruise от $80 (15:00–19:30) или private boat tour на закате от $1000 для романтики и фото.</p>`,
    },
    en: {
      title: 'Sunset cruise Nha Trang — golden hour at sea',
      html: `<p><strong>Sunset cruise Nha Trang</strong> is a catamaran tour at golden hour — music, dinner, islands and snorkelling before dusk. Group sunset cruise from $80 (3:00–7:30 pm) or private sunset charter from $1000.</p>`,
    },
    ko: {
      title: '냐짱 선셋 크루즈',
      html: `<p><strong>Sunset cruise Nha Trang</strong> — 황금빛 바다 위 캐터마란 투어. 단체 $80부터, 프라이빗 선셋 $1000부터.</p>`,
    },
    kk: {
      title: 'Нячангта sunset cruise',
      html: `<p><strong>Sunset cruise Nha Trang</strong> — күн бату кезіндегі catamaran tour. Топтық $80, жеке закат $1000 бастап.</p>`,
    },
  },
  'catamaran-tour-nha-trang': {
    ru: {
      title: 'Catamaran tour — морской тур на катамаране',
      html: `<p><strong>Catamaran tour Nha Trang</strong> — дневной морской тур: острова Hon Mun, снорклинг, SUP, рыбалка и обед. Групповой catamaran cruise от $80; для компаний — private boat tour от $1000 с индивидуальным маршрутом.</p>`,
    },
    en: {
      title: 'Catamaran tour Nha Trang — day trip at sea',
      html: `<p><strong>Catamaran tour Nha Trang</strong> — day trip with islands, snorkelling, SUP, fishing and lunch. Group catamaran cruise from $80; private boat tour from $1000 with a custom route.</p>`,
    },
    ko: {
      title: '냐짱 캐터마란 투어',
      html: `<p><strong>Catamaran tour Nha Trang</strong> — 섬, 스노클링, SUP, 낚시, 식사 포함 데이 투어. 단체 $80, 프라이빗 $1000부터.</p>`,
    },
    kk: {
      title: 'Catamaran tour Нячанг',
      html: `<p><strong>Catamaran tour Nha Trang</strong> — аралдар, снорклинг, SUP, түскі ас. Топтық $80, жеке $1000 бастап.</p>`,
    },
  },
  'snorkeling-tour-nha-trang': {
    ru: {
      title: 'Snorkeling tour — снорклинг с катамарана',
      html: `<p><strong>Snorkeling tour Nha Trang</strong> на catamaran cruise: маски, рифы, прозрачная вода и команда рядом. Групповой тур от $80 или private boat tour от $1000 — больше времени в воде и свой маршрут к лучшим точкам снорклинга.</p>`,
    },
    en: {
      title: 'Snorkeling tour Nha Trang from a catamaran',
      html: `<p><strong>Snorkeling tour Nha Trang</strong> on a catamaran cruise — gear, reefs and clear water with crew support. Group tour from $80 or private boat tour from $1000 for longer snorkel time and custom spots.</p>`,
    },
    ko: {
      title: '냐짱 스노클링 투어',
      html: `<p><strong>Snorkeling tour Nha Trang</strong> — 캐터마란에서 스노클링, 장비 포함. 단체 $80, 프라이빗 $1000부터.</p>`,
    },
    kk: {
      title: 'Snorkeling tour Нячанг',
      html: `<p><strong>Snorkeling tour Nha Trang</strong> — катамараннан снорклинг, жабдық бортта. Топтық $80, жеке $1000 бастап.</p>`,
    },
  },
  'birthday-on-yacht-nha-trang': {
    ru: {
      title: 'Birthday on yacht — день рождения на катамаране',
      html: `<p><strong>Birthday on yacht Nha Trang</strong> — VIP catamaran cruise для праздника: премиум меню, бар, музыка, дрон-съёмка и закат в море. Private boat tour формата Premium от $1500 — идеально для дня рождения, юбилея или корпоратива в Нячанге.</p>`,
    },
    en: {
      title: 'Birthday on yacht — celebrate on a catamaran',
      html: `<p><strong>Birthday on yacht Nha Trang</strong> — VIP catamaran cruise with premium menu, open bar, music, drone video and sunset at sea. Premium private boat tour from $1500 for birthdays and celebrations.</p>`,
    },
    ko: {
      title: '요트 생일 파티 냐짱',
      html: `<p><strong>Birthday on yacht Nha Trang</strong> — VIP 캐터마란 생일 파티, 프리미엄 메뉴·드론·선셋. Premium $1500부터.</p>`,
    },
    kk: {
      title: 'Яхтада туған күн Нячанг',
      html: `<p><strong>Birthday on yacht Nha Trang</strong> — VIP катамаран, премиум меню, дрон, закат. Premium $1500 бастап.</p>`,
    },
  },
};

/** @param {string} [slug] @param {string} [lang] @returns {SeoBody | null} */
export function getSeoBody(slug = '', lang = 'ru') {
  const key = slug?.trim() || '__home__';
  const page = SEO_BODIES[key];
  if (!page) return null;
  return page[lang] ?? page.ru ?? null;
}
