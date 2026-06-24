/**
 * Booking module — form state, validation, messenger URLs.
 */
import { buildMessengerUrl } from '../../lib/booking-url.js';
import { getBookingMessage } from '../../lib/booking-messages.js';
import { SITE } from '../site.js';

export const bookingState = { date: '', guests: '2', time: '', type: 'group' };
const DATE_DISPLAY_LOCALES = { ru: 'ru-RU', en: 'en-US', ko: 'ko-KR', kk: 'ru-RU' };
let highlightMessengerTimer;

export const TIME_OPTIONS = {
  group: {
    ru: [
      { value: '09:00–13:30', label: 'Дневной (09:00 – 13:30)' },
      { value: '15:00–19:30', label: 'Закатный (15:00 – 19:30)' },
    ],
    en: [
      { value: '09:00–13:30', label: 'Day Cruise (09:00 – 13:30)' },
      { value: '15:00–19:30', label: 'Sunset Cruise (15:00 – 19:30)' },
    ],
    ko: [
      { value: '09:00–13:30', label: '데이 크루즈 (09:00 – 13:30)' },
      { value: '15:00–19:30', label: '선셋 크루즈 (15:00 – 19:30)' },
    ],
    kk: [
      { value: '09:00–13:30', label: 'Күндізгі (09:00 – 13:30)' },
      { value: '15:00–19:30', label: 'Закат (15:00 – 19:30)' },
    ],
  },
  individual: {
    ru: [
      { value: '09:00–14:00', label: 'Дневной (09:00 – 14:00)' },
      { value: '15:00–20:00', label: 'Закатный (15:00 – 20:00)' },
    ],
    en: [
      { value: '09:00–14:00', label: 'Day Cruise (09:00 – 14:00)' },
      { value: '15:00–20:00', label: 'Sunset Cruise (15:00 – 20:00)' },
    ],
    ko: [
      { value: '09:00–14:00', label: '데이 크루즈 (09:00 – 14:00)' },
      { value: '15:00–20:00', label: '선셋 크루즈 (15:00 – 20:00)' },
    ],
    kk: [
      { value: '09:00–14:00', label: 'Күндізгі (09:00 – 14:00)' },
      { value: '15:00–20:00', label: 'Закат (15:00 – 20:00)' },
    ],
  },
};

const PANEL_IDS = { group: 'panel-group', individual: 'panel-individual', vip: 'panel-vip' };

export function isBookingReady() {
  return bookingState.type === 'vip' || Boolean(bookingState.date);
}

function formatBookingDate(isoDate, currentLang) {
  if (!isoDate) return '';
  const d = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(d.getTime())) return '';
  const locale = DATE_DISPLAY_LOCALES[currentLang] ?? 'ru-RU';
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
}

function setBookingDateError(show) {
  const form = document.getElementById('booking-form');
  const err = document.getElementById('booking-date-error');
  form?.classList.toggle('is-invalid', show);
  if (err) err.hidden = !show;
}

function flashCard(el) {
  if (!el) return;
  el.classList.remove('card-flash');
  void el.offsetWidth;
  el.classList.add('card-flash');
}

function isMobileViewport() {
  return window.matchMedia('(max-width: 767px)').matches;
}

export function syncBookingStateFromForm() {
  const dateEl = document.getElementById('booking-date');
  const guestsEl = document.getElementById('booking-guests');
  const timeEl = document.getElementById('booking-time');
  if (dateEl) bookingState.date = dateEl.value;
  if (guestsEl && bookingState.type !== 'vip') bookingState.guests = guestsEl.value;
  if (timeEl && bookingState.type !== 'vip') bookingState.time = timeEl.value;
}

export function updateDateDisplay(currentLang) {
  const display = document.getElementById('booking-date-display');
  if (!display) return;
  display.textContent = formatBookingDate(bookingState.date, currentLang);
}

export function updateBookingSteps() {
  const ready = isBookingReady();
  document.querySelectorAll('.booking-steps__item').forEach((item) => {
    const step = item.dataset.step;
    item.classList.remove('is-active', 'is-done');
    if (step === 'tour') item.classList.add('is-done');
    else if (step === 'params') {
      item.classList.toggle('is-done', ready);
      item.classList.toggle('is-active', !ready);
    } else if (step === 'send') {
      item.classList.toggle('is-done', ready);
      item.classList.toggle('is-active', ready);
    }
  });
}

/* ── Availability check ── */
/** @type {Record<string, { data: { available: boolean }, ts: number }>} */
let _availabilityCache = {};
const AVAILABILITY_CACHE_MS = 60000;

function availabilityMessage(tFn) {
  return tFn('form.dateUnavailable');
}

function setAvailabilityError(tFn, show) {
  const availError = document.getElementById('booking-date-availability-error');
  if (!availError) return;
  if (show) {
    availError.textContent = availabilityMessage(tFn);
    availError.hidden = false;
  } else {
    availError.hidden = true;
  }
}

export function syncAvailabilityErrorI18n(tFn) {
  const availError = document.getElementById('booking-date-availability-error');
  if (availError && !availError.hidden) {
    availError.textContent = availabilityMessage(tFn);
  }
}

async function checkAvailability(date) {
  if (!date) return { available: true };
  const cached = _availabilityCache[date];
  if (cached && Date.now() - cached.ts < AVAILABILITY_CACHE_MS) {
    return cached.data;
  }
  try {
    const res = await fetch(`/api/availability?date=${encodeURIComponent(date)}`);
    if (!res.ok) return { available: true }; /* Fail open */
    const data = await res.json();
    _availabilityCache[date] = { data, ts: Date.now() };
    return data;
  } catch {
    return { available: true }; /* Fail open — don't block booking on network error */
  }
}

async function handleDateChange(tFn, refreshUi) {
  const dateEl = document.getElementById('booking-date');
  if (!dateEl?.value) {
    setAvailabilityError(tFn, false);
    return;
  }

  const result = await checkAvailability(dateEl.value);
  setAvailabilityError(tFn, !result.available);
  refreshUi?.();
}

function highlightActiveMessenger() {
  const row = document.querySelector('.config-panel:not([hidden]) .messenger-row--config');
  if (!row) return;
  row.classList.remove('is-highlight');
  void row.offsetWidth;
  row.classList.add('is-highlight');
  clearTimeout(highlightMessengerTimer);
  highlightMessengerTimer = setTimeout(() => row.classList.remove('is-highlight'), 1200);
}

function scrollActiveTabIntoView() {
  if (!isMobileViewport()) return;
  const tabs = document.querySelector('.scroll-tabs');
  const active = tabs?.querySelector('.tab-btn.is-active');
  if (!tabs || !active) return;
  const targetLeft = active.offsetLeft - (tabs.clientWidth - active.offsetWidth) / 2;
  tabs.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
}

export function messengerUrl(type, channel, currentLang) {
  return buildMessengerUrl(SITE, {
    type,
    lang: currentLang,
    channel,
    date: bookingState.date,
    guests: bookingState.guests,
    time: bookingState.time,
  });
}

export function updateBookingTimeOptions(currentLang) {
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

  if (options.some((o) => o.value === prevVal)) timeEl.value = prevVal;
  else if (options[0]) timeEl.value = options[0].value;
  bookingState.time = timeEl.value;
}

export function showConfigTab(tabId, { scrollTab = true } = {}, currentLang, t, refreshUi) {
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
    if (t) setAvailabilityError(t, false);
  } else {
    dateWrap?.toggleAttribute('hidden', false);
    vipHint?.setAttribute('hidden', '');
    guestsWrap?.toggleAttribute('hidden', false);
    timeWrap?.toggleAttribute('hidden', false);
    const guestsEl = document.getElementById('booking-guests');
    if (guestsEl) bookingState.guests = guestsEl.value;
    updateBookingTimeOptions(currentLang);
  }

  refreshUi?.();
  if (scrollTab) scrollActiveTabIntoView();
}

export function initConfigurator(currentLang, t, refreshUi) {
  document.querySelectorAll('[data-tab]').forEach((tab) => {
    tab.addEventListener('click', () => showConfigTab(tab.dataset.tab, {}, currentLang, t, refreshUi));
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

export function initBookingForm(currentLang, t, refreshUi) {
  const dateEl = document.getElementById('booking-date');
  const guestsEl = document.getElementById('booking-guests');
  const timeEl = document.getElementById('booking-time');

  if (dateEl) {
    dateEl.min = new Date().toISOString().slice(0, 10);
    dateEl.required = bookingState.type !== 'vip';
    const dateWrap = dateEl.closest('.booking-form__date-wrap');
    const openDatePicker = () => {
      if (typeof dateEl.showPicker === 'function') {
        try {
          dateEl.showPicker();
          return;
        } catch {
          /* fall through */
        }
      }
      dateEl.focus();
    };
    dateWrap?.addEventListener('click', () => openDatePicker());
    dateEl.addEventListener('change', async () => {
      bookingState.date = dateEl.value;
      await handleDateChange(t, refreshUi);
      if (bookingState.date) {
        setBookingDateError(false);
        highlightActiveMessenger();
      }
      refreshUi();
    });
  }

  const clampGuests = (value) => Math.min(40, Math.max(1, Number(value) || 1));
  const setGuests = (value) => {
    if (!guestsEl) return;
    const next = String(clampGuests(value));
    guestsEl.value = next;
    bookingState.guests = next;
    refreshUi();
  };

  if (guestsEl) {
    bookingState.guests = guestsEl.value;
    guestsEl.addEventListener('input', () => setGuests(guestsEl.value));
    guestsEl.addEventListener('change', () => setGuests(guestsEl.value));
  }

  document.getElementById('guests-minus')?.addEventListener('click', () => {
    hapticTap();
    setGuests(Number(guestsEl.value) - 1);
  });
  document.getElementById('guests-plus')?.addEventListener('click', () => {
    hapticTap();
    setGuests(Number(guestsEl.value) + 1);
  });

  document.getElementById('booking-copy')?.addEventListener('click', () => copyBookingMessage(currentLang, t));

  if (timeEl) {
    timeEl.addEventListener('change', () => {
      bookingState.time = timeEl.value;
      refreshUi();
    });
  }
}

async function copyBookingMessage(currentLang, tFn) {
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
      toast.textContent = tFn('form.copyDone');
      toast.hidden = false;
      setTimeout(() => { toast.hidden = true; }, 2200);
    }
  } catch {
    if (toast) {
      toast.textContent = tFn('form.copyFail');
      toast.hidden = false;
    }
  }
}

function hapticTap() {
  navigator.vibrate?.(12);
}

export function updateBookingPreview(currentLang) {
  const preview = document.getElementById('booking-preview');
  const previewWrap = document.getElementById('booking-preview-wrap');
  if (!preview) return;
  syncBookingStateFromForm();
  updateDateDisplay(currentLang);
  preview.textContent = getBookingMessage(currentLang, bookingState.type, {
    date: bookingState.date || undefined,
    guests: bookingState.guests || undefined,
    time: bookingState.time || undefined,
  });
  previewWrap?.classList.toggle('is-ready', isBookingReady());
  updateBookingSteps();
}

function resolveTourType(el) {
  if (el?.dataset?.messengerType) return el.dataset.messengerType;
  return document.querySelector('[data-tab].is-active')?.dataset.tab || 'group';
}

const SCROLL_RESTORE_KEY = 'site-scroll-restore';

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

export async function openMessengerFromEl(el, currentLang, refreshUi, tFn) {
  syncBookingStateFromForm();
  const type = resolveTourType(el);
  const channel = el.dataset.channel || 'whatsapp';
  if (type !== 'vip' && !bookingState.date) {
    showConfigTab(type, {}, currentLang, tFn, refreshUi ?? (() => {}));
    const form = document.getElementById('booking-form');
    form?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setBookingDateError(true);
    document.getElementById('booking-date')?.focus();
    return;
  }

  /* Check availability before proceeding */
  if (type !== 'vip' && bookingState.date) {
    const result = await checkAvailability(bookingState.date);
    if (!result.available) {
      setAvailabilityError(tFn, true);
      return;
    }
  }

  setAvailabilityError(tFn, false);
  const url = messengerUrl(type, channel, currentLang);
  saveScrollForReturn();
  if (isMobileViewport()) {
    window.location.assign(url);
    return;
  }
  window.open(url, '_blank', 'noopener,noreferrer');
}
