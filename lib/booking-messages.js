/** @type {Record<string, Record<string, string>>} */
export const BOOKING_MESSAGES = {
  ru: {
    group:
      'Здравствуйте! Хочу забронировать групповой тур на катамаране. Подскажите свободные места на ближайшие дни?',
    individual:
      'Здравствуйте! Интересует индивидуальный круиз на флагманском катамаране. Какие даты свободны?',
    vip: 'Здравствуйте! Интересует Premium-круиз на катамаране в Нячанге — хочу обсудить детали.',
  },
  en: {
    group:
      'Hello! I would like to book a group catamaran tour. Are there any spots available in the coming days?',
    individual:
      'Hello! I am interested in a private cruise on the flagship catamaran. Which dates are available?',
    vip: 'Hello! I am interested in a Premium catamaran cruise in Nha Trang and would like to discuss the details.',
  },
  ko: {
    group: '안녕하세요! 캐터마란 단체 투어 예약을 원합니다. 가까운 날짜에 자리가 있나요?',
    individual: '안녕하세요! 플래그십 캐터마란 프라이빗 크루즈에 관심이 있습니다. 가능한 날짜를 알려주세요.',
    vip: '안녕하세요! 냐짱 Premium 캐터마란 크루즈에 관심이 있습니다. 자세한 상담을 원합니다.',
  },
  kk: {
    group:
      'Сәлеметсіз бе! Катамаранда топтық тур брондағым келеді. Жақын күндерге орын бар ма?',
    individual:
      'Сәлеметсіз бе! Флагмандық катамаранда жеке круиз қызықтырады. Қай күндер бос?',
    vip: 'Сәлеметсіз бе! Нячангтағы Premium катамаран круизі қызықтырады — мәліметтерді талқылағым келеді.',
  },
};

export const TOUR_LABELS = {
  ru: { group: 'Групповой тур', individual: 'Индивидуальный круиз', vip: 'Premium' },
  en: { group: 'Group tour', individual: 'Private cruise', vip: 'Premium' },
  ko: { group: '단체 투어', individual: '프라이빗 크루즈', vip: 'Premium' },
  kk: { group: 'Топтық тур', individual: 'Жеке круиз', vip: 'Premium' },
};

const WISHES_HINT = {
  ru: 'Мои пожелания:\n(например: дата, гости, повод или особые запросы — напишите, что важно для вас)',
  en: 'My preferences:\n(e.g. date, guests, occasion or special requests — share what matters to you)',
};

const DATE_LABELS = {
  ru: 'Предпочтительная дата',
  en: 'Preferred date',
  ko: '희망 날짜',
  kk: 'Қалаған күн',
};

const GUESTS_LABELS = {
  ru: 'Гостей',
  en: 'Guests',
  ko: '인원',
  kk: 'Қонақтар',
};

const TIME_LABELS = {
  ru: 'Время',
  en: 'Time',
  ko: '시간',
  kk: 'Уақыт',
};

/** UI lang → language of the pre-filled messenger text */
const MESSAGE_LANG = {
  ru: 'ru',
  en: 'en',
  ko: 'en',
  kk: 'ru',
};

function resolveMessageLang(lang) {
  return MESSAGE_LANG[lang] ?? (BOOKING_MESSAGES[lang] ? lang : 'ru');
}

export function getBookingMessage(lang, type, extras = {}) {
  const safeLang = resolveMessageLang(lang);
  const safeType = BOOKING_MESSAGES[safeLang][type] ? type : 'group';
  let text = BOOKING_MESSAGES[safeLang][safeType];

  const tourLabel = extras.tourLabel ?? TOUR_LABELS[safeLang]?.[safeType];
  if (tourLabel) text += `\n\n${tourLabel}`;

  if (extras.date) {
    const label = DATE_LABELS[safeLang] ?? DATE_LABELS.en;
    text += `\n${label}: ${extras.date}`;
  }
  if (extras.guests) {
    const label = GUESTS_LABELS[safeLang] ?? GUESTS_LABELS.en;
    text += `\n${label}: ${extras.guests}`;
  }
  if (extras.time && safeType !== 'vip') {
    const label = TIME_LABELS[safeLang] ?? TIME_LABELS.en;
    text += `\n${label}: ${extras.time}`;
  }

  if (safeType === 'vip') {
    const hint = WISHES_HINT[safeLang] ?? WISHES_HINT.en;
    text += `\n\n${hint}`;
  }

  return text;
}
