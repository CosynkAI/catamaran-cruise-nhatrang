import './css/input.css';
import { buildMessengerUrl } from '@lib/booking-url.js';
import { getBookingMessage } from '@lib/booking-messages.js';
import { initI18n, currentLang, t, tMessenger } from './i18n.js';
import { SITE } from './site.js';

export const CONTACTS = SITE.contacts;

const bookingState = { date: '', guests: '2', time: '', type: 'group' };
const GALLERY_PER_PAGE = 6;
const DATE_DISPLAY_LOCALES = { ru: 'ru-RU', en: 'en-US', ko: 'ko-KR', kk: 'ru-RU' };
const SCROLL_RESTORE_KEY = 'site-scroll-restore';
let highlightMessengerTimer;

const TIME_OPTIONS = {
  group: {
    ru: [
      { value: '09:00–13:30', label: 'Дневной (09:00 – 13:30)' },
      { value: '15:00–19:30', label: 'Закатный Sunset (15:00 – 19:30)' }
    ],
    en: [
      { value: '09:00–13:30', label: 'Day Cruise (09:00 – 13:30)' },
      { value: '15:00–19:30', label: 'Sunset Cruise (15:00 – 19:30)' }
    ],
    ko: [
      { value: '09:00–13:30', label: '데이 크루즈 (09:00 – 13:30)' },
      { value: '15:00–19:30', label: '선셋 크루즈 (15:00 – 19:30)' }
    ],
    kk: [
      { value: '09:00–13:30', label: 'Күндізгі (09:00 – 13:30)' },
      { value: '15:00–19:30', label: 'Закат Sunset (15:00 – 19:30)' }
    ]
  },
  individual: {
    ru: [
      { value: '09:00–14:00', label: 'Дневной (09:00 – 14:00)' },
      { value: '15:00–20:00', label: 'Закатный Sunset (15:00 – 20:00)' }
    ],
    en: [
      { value: '09:00–14:00', label: 'Day Cruise (09:00 – 14:00)' },
      { value: '15:00–20:00', label: 'Sunset Cruise (15:00 – 20:00)' }
    ],
    ko: [
      { value: '09:00–14:00', label: '데이 크루즈 (09:00 – 14:00)' },
      { value: '15:00–20:00', label: '선셋 크루즈 (15:00 – 20:00)' }
    ],
    kk: [
      { value: '09:00–14:00', label: 'Күндізгі (09:00 – 14:00)' },
      { value: '15:00–20:00', label: 'Закат Sunset (15:00 – 20:00)' }
    ]
  }
};

export function updateBookingTimeOptions() {
  const timeEl = document.getElementById('booking-time');
  if (!timeEl) return;

  const type = bookingState.type;
  if (type === 'vip') return;

  const options = TIME_OPTIONS[type]?.[currentLang] ?? TIME_OPTIONS[type]?.ru ?? [];
  const prevVal = timeEl.value;

  timeEl.innerHTML = '';
  options.forEach((opt) => {
    const el = document.createElement('option');
    el.value = opt.value;
    el.textContent = opt.label;
    timeEl.appendChild(el);
  });

  if (options.some((o) => o.value === prevVal)) {
    timeEl.value = prevVal;
  } else if (options[0]) {
    timeEl.value = options[0].value;
  }

  bookingState.time = timeEl.value;
}

export function messengerUrl(type, channel = 'whatsapp', extras = {}) {
  return buildMessengerUrl(SITE, {
    type,
    lang: extras.lang ?? currentLang,
    channel,
    date: extras.date ?? bookingState.date,
    guests: extras.guests ?? bookingState.guests,
    time: extras.time ?? bookingState.time,
  });
}

function syncBookingStateFromForm() {
  const dateEl = document.getElementById('booking-date');
  const guestsEl = document.getElementById('booking-guests');
  const timeEl = document.getElementById('booking-time');
  if (dateEl) bookingState.date = dateEl.value;
  if (guestsEl && bookingState.type !== 'vip') bookingState.guests = guestsEl.value;
  if (timeEl && bookingState.type !== 'vip') bookingState.time = timeEl.value;
}

function formatBookingDate(isoDate) {
  if (!isoDate) return '';
  const d = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(d.getTime())) return '';
  const locale = DATE_DISPLAY_LOCALES[currentLang] ?? 'ru-RU';
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
}

function updateDateDisplay() {
  const display = document.getElementById('booking-date-display');
  if (!display) return;
  display.textContent = formatBookingDate(bookingState.date);
}

function isBookingReady() {
  return bookingState.type === 'vip' || Boolean(bookingState.date);
}

function updateBookingSteps() {
  const paramsReady = isBookingReady();
  document.querySelectorAll('.booking-steps__item').forEach((item) => {
    const step = item.dataset.step;
    item.classList.remove('is-active', 'is-done');
    if (step === 'tour') {
      item.classList.add('is-done');
    } else if (step === 'params') {
      item.classList.toggle('is-done', paramsReady);
      item.classList.toggle('is-active', !paramsReady);
    } else if (step === 'send') {
      item.classList.toggle('is-done', paramsReady);
      item.classList.toggle('is-active', paramsReady);
    }
  });
}

function highlightActiveMessenger() {
  const row = document.querySelector('.config-panel:not([hidden]) .messenger-row--config');
  if (!row) return;
  row.classList.remove('is-highlight');
  void row.offsetWidth;
  row.classList.add('is-highlight');
  clearTimeout(highlightMessengerTimer);
  highlightMessengerTimer = window.setTimeout(() => row.classList.remove('is-highlight'), 1200);
}

function scrollToActiveMessenger() {
  const row = document.querySelector('.config-panel:not([hidden]) .messenger-row--config');
  if (!row) return;
  row.scrollIntoView({ behavior: 'smooth', block: 'center' });
  highlightActiveMessenger();
}

function updateStickyCta() {
  const browse = document.getElementById('sticky-cta-browse');
  const ready = document.getElementById('sticky-cta-ready');
  const readyState = isBookingReady();
  browse?.toggleAttribute('hidden', readyState);
  ready?.toggleAttribute('hidden', !readyState);
}

function hapticTap() {
  navigator.vibrate?.(12);
}

function saveScrollForReturn() {
  try {
    sessionStorage.setItem(
      SCROLL_RESTORE_KEY,
      JSON.stringify({ y: window.scrollY, tab: bookingState.type })
    );
  } catch {
    /* ignore */
  }
}

function restoreScrollPosition() {
  try {
    const raw = sessionStorage.getItem(SCROLL_RESTORE_KEY);
    if (!raw) return;
    sessionStorage.removeItem(SCROLL_RESTORE_KEY);
    const data = JSON.parse(raw);
    if (data.tab && PANEL_IDS[data.tab]) showConfigTab(data.tab, { scrollTab: false });
    if (typeof data.y === 'number') {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.scrollTo({ top: data.y, behavior: 'auto' });
        });
      });
    }
  } catch {
    /* ignore */
  }
}

function ensureTourType(type) {
  if (type && bookingState.type !== type) showConfigTab(type);
}

function promptBookingForm(type) {
  ensureTourType(type);
  const form = document.getElementById('booking-form');
  form?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  if (type !== 'vip') {
    setBookingDateError(true);
    document.getElementById('booking-date')?.focus();
  }
}

async function copyBookingMessage() {
  syncBookingStateFromForm();
  const text = getBookingMessage(currentLang, bookingState.type, {
    date: bookingState.date || undefined,
    guests: bookingState.guests || undefined,
    time: bookingState.time || undefined,
  });
  const toast = document.getElementById('booking-copy-toast');
  try {
    await navigator.clipboard.writeText(text);
    if (toast) {
      toast.textContent = t('form.copyDone');
      toast.hidden = false;
      window.setTimeout(() => {
        toast.hidden = true;
      }, 2200);
    }
  } catch {
    if (toast) {
      toast.textContent = t('form.copyFail');
      toast.hidden = false;
    }
  }
}

function scrollActiveTabIntoView() {
  if (!isMobileViewport()) return;
  const tabs = document.querySelector('.scroll-tabs');
  const active = tabs?.querySelector('.tab-btn.is-active');
  if (!tabs || !active) return;
  const targetLeft = active.offsetLeft - (tabs.clientWidth - active.offsetWidth) / 2;
  tabs.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
}

function updateBookingPreview() {
  const preview = document.getElementById('booking-preview');
  const previewWrap = document.getElementById('booking-preview-wrap');
  if (!preview) return;
  syncBookingStateFromForm();
  updateDateDisplay();
  preview.textContent = getBookingMessage(currentLang, bookingState.type, {
    date: bookingState.date || undefined,
    guests: bookingState.guests || undefined,
    time: bookingState.time || undefined,
  });
  const ready = isBookingReady();
  previewWrap?.classList.toggle('is-ready', ready);
  updateBookingSteps();
  updateStickyCta();
}

function setBookingDateError(show) {
  const form = document.getElementById('booking-form');
  const err = document.getElementById('booking-date-error');
  form?.classList.toggle('is-invalid', show);
  if (err) err.hidden = !show;
}

function openMessengerFromEl(el) {
  syncBookingStateFromForm();
  const type = resolveTourType(el);
  const channel = el.dataset.channel || 'whatsapp';
  ensureTourType(type);
  if (type !== 'vip' && !bookingState.date) {
    promptBookingForm(type);
    return;
  }
  setBookingDateError(false);
  const url = messengerUrl(type, channel);
  saveScrollForReturn();
  if (isMobileViewport()) {
    window.location.assign(url);
    return;
  }
  window.open(url, '_blank', 'noopener,noreferrer');
}

function refreshBookingUi() {
  initMessengerLinks();
  updateBookingPreview();
}

function initBookingForm() {
  const dateEl = document.getElementById('booking-date');
  const guestsEl = document.getElementById('booking-guests');
  const timeEl = document.getElementById('booking-time');

  if (dateEl) {
    dateEl.min = new Date().toISOString().slice(0, 10);
    dateEl.required = bookingState.type !== 'vip';
    dateEl.addEventListener('change', () => {
      bookingState.date = dateEl.value;
      if (bookingState.date) {
        setBookingDateError(false);
        highlightActiveMessenger();
      }
      refreshBookingUi();
    });
  }

  const clampGuests = (value) => Math.min(40, Math.max(1, Number(value) || 1));

  const setGuests = (value) => {
    if (!guestsEl) return;
    const next = String(clampGuests(value));
    guestsEl.value = next;
    bookingState.guests = next;
    refreshBookingUi();
  };

  if (guestsEl) {
    bookingState.guests = guestsEl.value;
    guestsEl.addEventListener('input', () => setGuests(guestsEl.value));
    guestsEl.addEventListener('change', () => setGuests(guestsEl.value));
  }

  document.getElementById('guests-minus')?.addEventListener('click', () => {
    if (!guestsEl) return;
    hapticTap();
    setGuests(Number(guestsEl.value) - 1);
  });

  document.getElementById('guests-plus')?.addEventListener('click', () => {
    if (!guestsEl) return;
    hapticTap();
    setGuests(Number(guestsEl.value) + 1);
  });

  document.getElementById('booking-copy')?.addEventListener('click', copyBookingMessage);

  if (timeEl) {
    timeEl.addEventListener('change', () => {
      bookingState.time = timeEl.value;
      refreshBookingUi();
    });
  }
}

function resolveTourType(el) {
  if (el?.dataset?.messengerType) return el.dataset.messengerType;
  return document.querySelector('[data-tab].is-active')?.dataset.tab || 'group';
}

function flashCard(el) {
  if (!el) return;
  el.classList.remove('card-flash');
  el.offsetWidth;
  el.classList.add('card-flash');
}

const PANEL_IDS = {
  group: 'panel-group',
  individual: 'panel-individual',
  vip: 'panel-vip',
};

function showConfigTab(tabId, { scrollTab = true } = {}) {
  bookingState.type = tabId;

  Object.entries(PANEL_IDS).forEach(([id, panelId]) => {
    const panel = document.getElementById(panelId);
    const tab = document.querySelector(`[data-tab="${id}"]`);
    const active = id === tabId;
    panel?.toggleAttribute('hidden', !active);
    tab?.classList.toggle('is-active', active);
    tab?.setAttribute('aria-selected', active ? 'true' : 'false');
  });

  const guestsWrap = document.getElementById('field-guests-wrap');
  const timeWrap = document.getElementById('field-time-wrap');
  const dateWrap = document.getElementById('field-date-wrap');
  const vipHint = document.getElementById('booking-vip-hint');

  const dateEl = document.getElementById('booking-date');
  if (dateEl) dateEl.required = tabId !== 'vip';

  if (tabId === 'vip') {
    dateWrap?.toggleAttribute('hidden', true);
    guestsWrap?.toggleAttribute('hidden', true);
    timeWrap?.toggleAttribute('hidden', true);
    vipHint?.removeAttribute('hidden');
    bookingState.guests = '';
    bookingState.time = '';
    setBookingDateError(false);
  } else {
    dateWrap?.toggleAttribute('hidden', false);
    vipHint?.setAttribute('hidden', '');
    guestsWrap?.toggleAttribute('hidden', false);
    timeWrap?.toggleAttribute('hidden', false);
    const guestsEl = document.getElementById('booking-guests');
    if (guestsEl) bookingState.guests = guestsEl.value;
    updateBookingTimeOptions();
  }

  refreshBookingUi();
  if (scrollTab) scrollActiveTabIntoView();
}

function initConfigurator() {
  document.querySelectorAll('[data-tab]').forEach((tab) => {
    tab.addEventListener('click', () => showConfigTab(tab.dataset.tab));
  });

  document.querySelectorAll('.config-panel__actions .btn-ghost').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const href = btn.getAttribute('href');
      if (!href?.startsWith('#')) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      flashCard(target);
    });
  });
}

function initLangDropdown() {
  const dropdown = document.getElementById('lang-dropdown');
  const toggle = document.getElementById('lang-toggle');
  const menu = document.getElementById('lang-menu');
  if (!dropdown || !toggle || !menu) return;

  const close = () => {
    dropdown.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    menu.hidden = true;
  };

  const open = () => {
    dropdown.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    menu.hidden = false;
  };

  toggle.addEventListener('click', () => (menu.hidden ? open() : close()));
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
}

function initFaq() {
  const root = document.getElementById('faq');
  if (!root || root.dataset.faqReady) return;
  root.dataset.faqReady = '1';

  const items = root.querySelectorAll('details.faq-item');
  items.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      items.forEach((other) => {
        if (other !== item) other.removeAttribute('open');
      });
    });
  });
}

function bindCarouselDots(dotsEl, pageCount, getIndex, setIndex) {
  if (!dotsEl) return () => {};
  dotsEl.replaceChildren();
  for (let i = 0; i < pageCount; i += 1) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'carousel-dots__dot';
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-label', String(i + 1));
    btn.addEventListener('click', () => setIndex(i));
    dotsEl.append(btn);
  }
  return () => {
    const idx = getIndex();
    dotsEl.querySelectorAll('.carousel-dots__dot').forEach((dot, i) => {
      dot.classList.toggle('is-active', i === idx);
      dot.setAttribute('aria-selected', i === idx ? 'true' : 'false');
    });
  };
}

function chunkGalleryItems(items, size) {
  const pages = [];
  for (let i = 0; i < items.length; i += size) {
    pages.push(items.slice(i, i + size));
  }
  return pages;
}

function getReviewsPerPage() {
  if (window.innerWidth >= 1024) return 3;
  if (window.innerWidth >= 640) return 2;
  return 1;
}

function initReviewsCarousel() {
  const root = document.getElementById('reviews-carousel');
  const viewport = document.getElementById('reviews-viewport');
  const track = document.getElementById('reviews-track');
  const counter = document.getElementById('reviews-counter');
  const dotsEl = document.getElementById('reviews-dots');
  const prevBtn = document.getElementById('reviews-prev');
  const nextBtn = document.getElementById('reviews-next');
  if (!root || !viewport || !track) return;

  const sourceCards = [...track.querySelectorAll('.review-card')];
  if (!sourceCards.length) return;

  let pageIndex = 0;
  let pageCount = 1;
  let syncDots = () => {};
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const pageWidth = () => viewport.clientWidth;

  const layoutPages = () => {
    const w = pageWidth();
    if (!w) return;
    track.style.width = `${w * pageCount}px`;
    track.querySelectorAll('.reviews-carousel__page').forEach((page) => {
      page.style.flex = `0 0 ${w}px`;
      page.style.width = `${w}px`;
    });
  };

  const updateCounter = () => {
    if (!counter) return;
    counter.textContent = t('gallery.counter')
      .replace('{current}', String(pageIndex + 1))
      .replace('{total}', String(pageCount));
    syncDots();
  };

  const syncIndexFromScroll = () => {
    const w = pageWidth();
    if (!w) return;
    const next = Math.min(pageCount - 1, Math.max(0, Math.round(viewport.scrollLeft / w)));
    if (next !== pageIndex) {
      pageIndex = next;
      updateCounter();
    }
  };

  const scrollToPage = (behavior = 'auto') => {
    viewport.scrollTo({ left: pageIndex * pageWidth(), behavior });
  };

  const goToPage = (nextIndex) => {
    pageIndex = ((nextIndex % pageCount) + pageCount) % pageCount;
    scrollToPage(prefersReducedMotion ? 'auto' : 'smooth');
    updateCounter();
  };

  const rebuildPages = () => {
    const chunks = chunkGalleryItems(sourceCards, getReviewsPerPage());
    pageCount = chunks.length;
    pageIndex = Math.min(pageIndex, Math.max(0, pageCount - 1));
    track.replaceChildren();
    chunks.forEach((cards) => {
      const page = document.createElement('div');
      page.className = 'reviews-carousel__page';
      cards.forEach((card) => page.append(card));
      track.append(page);
    });
    syncDots = bindCarouselDots(dotsEl, pageCount, () => pageIndex, goToPage);
    layoutPages();
    scrollToPage('auto');
    updateCounter();
  };

  const stepPage = (delta) => goToPage(pageIndex + delta);

  prevBtn?.addEventListener('click', () => stepPage(-1));
  nextBtn?.addEventListener('click', () => stepPage(1));

  viewport.addEventListener('scroll', () => requestAnimationFrame(syncIndexFromScroll), { passive: true });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => rebuildPages(), 150);
  });

  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      stepPage(-1);
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      stepPage(1);
    }
  });

  window.refreshReviewsCarousel = () => {
    requestAnimationFrame(() => {
      layoutPages();
      scrollToPage('auto');
      updateCounter();
    });
  };

  rebuildPages();
  updateCounter();
}

async function initGalleryCarousel() {
  const root = document.getElementById('gallery-carousel');
  const viewport = document.getElementById('gallery-viewport');
  const track = document.getElementById('gallery-track');
  const counter = document.getElementById('gallery-counter');
  const dotsEl = document.getElementById('gallery-dots');
  const prevBtn = document.getElementById('gallery-prev');
  const nextBtn = document.getElementById('gallery-next');
  if (!root || !viewport || !track) return;

  let items = [];
  try {
    const res = await fetch('/gallery-manifest.json');
    if (!res.ok) return;
    const data = await res.json();
    items = (data.items ?? []).filter((item) => item.type === 'image');
  } catch {
    return;
  }
  if (!items.length) return;

  const pages = chunkGalleryItems(items, GALLERY_PER_PAGE);
  let pageIndex = 0;

  const altText = (globalIndex) => `${t('gallery.altPhoto')} ${globalIndex + 1}`;

  let syncDots = () => {};

  const updateCounter = () => {
    if (!counter) return;
    counter.textContent = t('gallery.counter')
      .replace('{current}', String(pageIndex + 1))
      .replace('{total}', String(pages.length));
    syncDots();
  };

  const buildPage = (pageItems, pageNum) => {
    const page = document.createElement('div');
    page.className = 'gallery-carousel__page';
    page.dataset.page = String(pageNum);

    pageItems.forEach((item, cellIndex) => {
      const globalIndex = pageNum * GALLERY_PER_PAGE + cellIndex;
      const cell = document.createElement('div');
      cell.className = 'gallery-carousel__cell';
      const img = document.createElement('img');
      img.className = 'gallery-carousel__img';
      img.src = item.src;
      if (item.srcset) img.srcset = item.srcset;
      img.sizes = '(max-width: 480px) 42vw, (max-width: 768px) 44vw, (max-width: 1024px) 28vw, 220px';
      if (item.width) img.width = item.width;
      if (item.height) img.height = item.height;
      img.alt = altText(globalIndex);
      img.loading = 'lazy';
      img.decoding = 'async';
      img.addEventListener('load', () => img.classList.add('is-loaded'));
      if (img.complete) img.classList.add('is-loaded');
      cell.append(img);
      page.append(cell);
    });

    return page;
  };

  track.replaceChildren();
  pages.forEach((pageItems, i) => track.append(buildPage(pageItems, i)));

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const pageWidth = () => viewport.clientWidth;

  const layoutPages = () => {
    const w = pageWidth();
    if (!w) return;
    track.style.width = `${w * pages.length}px`;
    track.querySelectorAll('.gallery-carousel__page').forEach((page) => {
      page.style.flex = `0 0 ${w}px`;
      page.style.width = `${w}px`;
    });
  };

  layoutPages();

  const syncIndexFromScroll = () => {
    const w = pageWidth();
    if (!w) return;
    const next = Math.min(pages.length - 1, Math.max(0, Math.round(viewport.scrollLeft / w)));
    if (next !== pageIndex) {
      pageIndex = next;
      updateCounter();
    }
  };

  const goToPage = (nextIndex) => {
    const w = pageWidth();
    if (!w) return;
    pageIndex = ((nextIndex % pages.length) + pages.length) % pages.length;
    viewport.scrollTo({
      left: pageIndex * w,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
    updateCounter();
  };

  const stepPage = (delta) => goToPage(pageIndex + delta);

  syncDots = bindCarouselDots(dotsEl, pages.length, () => pageIndex, goToPage);

  prevBtn?.addEventListener('click', () => stepPage(-1));
  nextBtn?.addEventListener('click', () => stepPage(1));

  viewport.addEventListener('scroll', () => requestAnimationFrame(syncIndexFromScroll), { passive: true });

  window.addEventListener('resize', () => {
    layoutPages();
    viewport.scrollTo({ left: pageIndex * pageWidth(), behavior: 'auto' });
  });

  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      stepPage(-1);
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      stepPage(1);
    }
  });

  window.refreshGalleryCarousel = () => {
    updateCounter();
    track.querySelectorAll('.gallery-carousel__img').forEach((img, i) => {
      img.alt = altText(i);
    });
  };

  viewport.scrollTo({ left: 0, behavior: 'auto' });
  updateCounter();
}

const FOOTER_CREDIT_TELEGRAM = 'eviniko';

function updateFooterCreditLink() {
  const text = tMessenger('footer.creditMsg');
  document.querySelectorAll('.footer-credit__link').forEach((el) => {
    el.href = `https://t.me/${FOOTER_CREDIT_TELEGRAM}?text=${encodeURIComponent(text)}`;
    el.target = '_blank';
    el.rel = 'noopener noreferrer';
  });
}

function initMessengerLinks() {
  document.querySelectorAll('[data-messenger]').forEach((el) => {
    const type = resolveTourType(el);
    const channel = el.dataset.channel || 'whatsapp';
    el.href = messengerUrl(type, channel);
    el.target = '_blank';
    el.rel = 'noopener noreferrer';
    if (!el.dataset.messengerBound) {
      el.dataset.messengerBound = '1';
      el.addEventListener('click', (e) => {
        e.preventDefault();
        openMessengerFromEl(el);
      });
    }
  });
  document.querySelectorAll('[data-social]').forEach((el) => {
    const key = el.dataset.social;
    const href = CONTACTS[key];
    if (href) {
      el.href = href;
      el.target = '_blank';
      el.rel = 'noopener noreferrer';
    }
  });
}

function initScrollCta() {
  document.querySelectorAll('[data-scroll]').forEach((el) => {
    el.addEventListener('click', (e) => {
      const id = el.dataset.scroll;
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        closeMobileMenu();
      }
    });
  });
}

function closeMobileMenu() {
  document.getElementById('mobile-menu')?.classList.remove('is-open');
  document.getElementById('menu-toggle')?.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
  document.getElementById('lang-dropdown')?.classList.remove('is-open');
  document.getElementById('lang-menu')?.setAttribute('hidden', '');
}

function initMobileNav() {
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');
  const backdrop = document.getElementById('menu-backdrop');

  const open = () => {
    menu?.classList.add('is-open');
    toggle?.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
  };

  toggle?.addEventListener('click', () => {
    if (menu?.classList.contains('is-open')) closeMobileMenu();
    else open();
  });

  backdrop?.addEventListener('click', closeMobileMenu);
  menu?.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMobileMenu));
}

function initStickyCta() {
  const bar = document.getElementById('sticky-cta');
  const hero = document.getElementById('hero');
  if (!bar || !hero) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      bar.classList.toggle('is-visible', !entry.isIntersecting);
    },
    { threshold: 0 }
  );
  observer.observe(hero);
}

function shouldLoadHeroVideo() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (conn?.saveData) return false;
  if (conn?.effectiveType && ['slow-2g', '2g'].includes(conn.effectiveType)) return false;
  return true;
}

function isMobileViewport() {
  return window.matchMedia('(max-width: 767px)').matches;
}

function getHeroVideoSrc(video) {
  const desktop = video.dataset.src || '/videos/hero.mp4';
  const mobile = video.dataset.srcMobile || '/videos/hero-mobile.mp4';
  return isMobileViewport() ? mobile : desktop;
}

function loadHeroVideoSource(video) {
  const src = getHeroVideoSrc(video);
  const source = video.querySelector('source') || document.createElement('source');
  if (source.getAttribute('src') !== src) {
    source.src = src;
    source.type = 'video/mp4';
    if (!source.parentElement) video.append(source);
    video.load();
  }
}

function prepHeroVideoEl(video) {
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.setAttribute('playsinline', '');
  video.setAttribute('webkit-playsinline', '');
  video.preload = isMobileViewport() ? 'none' : 'metadata';
}

function initPageVideo() {
  const video = document.getElementById('hero-video');
  const backdrop = document.querySelector('.page-backdrop');
  const unlockBtn = document.getElementById('hero-video-unlock');
  if (!video || !backdrop || video.dataset.heroInit === '1') return;
  video.dataset.heroInit = '1';

  if (!shouldLoadHeroVideo()) {
    backdrop.classList.add('is-video-disabled');
    return;
  }

  prepHeroVideoEl(video);
  const deferSource = isMobileViewport();

  const markReady = () => {
    backdrop.classList.add('is-video-ready');
    unlockBtn?.setAttribute('hidden', '');
  };

  const showUnlock = () => {
    if (backdrop.classList.contains('is-video-ready')) return;
    unlockBtn?.removeAttribute('hidden');
  };

  const tryPlay = () => {
    if (!video.querySelector('source[src]')) loadHeroVideoSource(video);
    video.play().then(markReady).catch(showUnlock);
  };

  video.addEventListener('playing', markReady, { once: true });
  video.addEventListener('loadeddata', markReady, { once: true });

  if (!deferSource) {
    loadHeroVideoSource(video);
    if (video.readyState >= 2) tryPlay();
    else video.addEventListener('canplay', tryPlay, { once: true });
  } else {
    showUnlock();
  }

  const unlock = () => {
    tryPlay();
  };
  unlockBtn?.addEventListener('click', unlock);
  document.addEventListener('touchstart', unlock, { once: true, capture: true });
  document.addEventListener('click', unlock, { once: true, capture: true });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && video.paused) tryPlay();
  });

  window.setTimeout(() => {
    if (!video.paused) markReady();
    else showUnlock();
  }, 1500);
}

function scheduleHeroVideo() {
  const backdrop = document.querySelector('.page-backdrop');
  if (!shouldLoadHeroVideo()) {
    backdrop?.classList.add('is-video-disabled');
    return;
  }
  initPageVideo();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', scheduleHeroVideo, { once: true });
} else {
  scheduleHeroVideo();
}

function initMapClickLoad() {
  const wrap = document.getElementById('map-wrap');
  const frame = document.getElementById('map-frame');
  const btn = document.getElementById('map-load-btn');
  if (!wrap || !frame?.dataset.src || !btn) return;

  const load = () => {
    if (frame.dataset.loaded === 'true') return;
    frame.src = frame.dataset.src;
    frame.dataset.loaded = 'true';
    wrap.classList.add('is-loaded');
    frame.classList.remove('map-frame--hidden');
  };

  btn.addEventListener('click', load);
}

function initWhenVisible(sectionId, initFn) {
  const section = document.getElementById(sectionId);
  if (!section) return;
  if (!('IntersectionObserver' in window)) {
    initFn();
    return;
  }
  const io = new IntersectionObserver(
    ([entry]) => {
      if (!entry?.isIntersecting) return;
      initFn();
      io.disconnect();
    },
    { rootMargin: '240px' }
  );
  io.observe(section);
}

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}

function boot() {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  restoreScrollPosition();
  initConfigurator();

  const tab = document.body.dataset.defaultTab;
  if (tab && PANEL_IDS[tab]) showConfigTab(tab);

  initLangDropdown();
  initBookingForm();
  updateBookingTimeOptions();
  initWhenVisible('reviews', initReviewsCarousel);
  initWhenVisible('gallery', initGalleryCarousel);
  refreshBookingUi();
  updateFooterCreditLink();
  initScrollCta();
  initMobileNav();
  initStickyCta();
  initMapClickLoad();
  registerServiceWorker();
}

initFaq();

initI18n(() => {
  updateBookingTimeOptions();
  refreshBookingUi();
  updateFooterCreditLink();
  updateStickyCta();
  closeMobileMenu();
  window.refreshGalleryCarousel?.();
  window.refreshReviewsCarousel?.();
}).then(boot);

export { getBookingMessage };
