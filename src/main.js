/**
 * Main entry point — bootstraps all modules.
 * Refactored: carousel, booking, video, navigation, FAQ are now separate modules.
 */
import './css/input.css';
import { initI18n, currentLang, t, tMessenger } from './i18n.js';
import { CONTACTS } from './site.js';
import { initGalleryCarousel } from './ui/gallery-carousel.js';
import { initReviewsCarousel } from './ui/reviews-carousel.js';
import {
  updateBookingTimeOptions,
  initConfigurator,
  initBookingForm,
  updateBookingPreview,
  openMessengerFromEl,
  messengerUrl,
  showConfigTab,
  syncAvailabilityErrorI18n,
} from './ui/booking.js';
import { scheduleHeroVideo } from './ui/video.js';
import {
  initMobileNav,
  initScrollCta,
  initStickyCta,
  closeMobileMenu,
  updateStickyCta,
} from './ui/navigation.js';
import { initFaq, syncFaqAria } from './ui/faq.js';

export { CONTACTS };

const PANEL_IDS = { group: 'panel-group', individual: 'panel-individual', vip: 'panel-vip' };

/* ── Messenger link binding ── */
function resolveTourType(el) {
  if (el?.dataset?.messengerType) return el.dataset.messengerType;
  return document.querySelector('[data-tab].is-active')?.dataset.tab || 'group';
}

function initMessengerLinks() {
  document.querySelectorAll('[data-messenger]').forEach((el) => {
    const type = resolveTourType(el);
    const channel = el.dataset.channel || 'whatsapp';
    el.href = messengerUrl(type, channel, currentLang);
    el.target = '_blank';
    el.rel = 'noopener noreferrer';
    if (!el.dataset.messengerBound) {
      el.dataset.messengerBound = '1';
      el.addEventListener('click', (e) => {
        e.preventDefault();
        openMessengerFromEl(el, currentLang, refreshBookingUi, t);
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

/* ── Footer credit ── */
function updateFooterCreditLink() {
  document.querySelectorAll('.footer-credit__link').forEach((el) => {
    el.href = `https://t.me/eviniko?text=${encodeURIComponent(tMessenger('footer.creditMsg'))}`;
    el.target = '_blank';
    el.rel = 'noopener noreferrer';
  });
}

/* ── Refresh all UI ── */
function refreshBookingUi() {
  initMessengerLinks();
  updateBookingPreview(currentLang);
  updateStickyCta();
}

function restoreScrollPosition() {
  try {
    const raw = sessionStorage.getItem('site-scroll-restore');
    if (!raw) return;
    sessionStorage.removeItem('site-scroll-restore');
    const data = JSON.parse(raw);
    if (data.tab && PANEL_IDS[data.tab]) {
      showConfigTab(data.tab, { scrollTab: false }, currentLang, t, refreshBookingUi);
    }
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

/* ── Map click-to-load ── */
function initMapClickLoad() {
  const wrap = document.getElementById('map-wrap');
  const frame = document.getElementById('map-frame');
  const btn = document.getElementById('map-load-btn');
  if (!wrap || !frame?.dataset.src || !btn) return;

  btn.addEventListener('click', () => {
    if (frame.dataset.loaded === 'true') return;
    frame.src = frame.dataset.src;
    frame.dataset.loaded = 'true';
    wrap.classList.add('is-loaded');
    frame.classList.remove('map-frame--hidden');
  });
}

/* ── Lazy init helpers ── */
function initWhenVisible(sectionId, initFn) {
  const section = document.getElementById(sectionId);
  if (!section) return;
  if (!('IntersectionObserver' in window)) { initFn(); return; }
  const io = new IntersectionObserver(
    ([entry]) => { if (entry?.isIntersecting) { initFn(); io.disconnect(); } },
    { rootMargin: '240px' }
  );
  io.observe(section);
}

/* ── Service Worker ── */
function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  const { hostname } = window.location;
  if (hostname === 'localhost' || hostname === '127.0.0.1') return;
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}

/* ── Lang dropdown ── */
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
  document.addEventListener('click', (e) => { if (!dropdown.contains(e.target)) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}

/* ── Boot ── */
function boot() {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  restoreScrollPosition();

  initConfigurator(currentLang, t, refreshBookingUi);

  const tab = document.body.dataset.defaultTab;
  if (tab && PANEL_IDS[tab]) showConfigTab(tab, {}, currentLang, t, refreshBookingUi);

  initLangDropdown();
  initBookingForm(currentLang, t, refreshBookingUi);
  updateBookingTimeOptions(currentLang);
  initWhenVisible('reviews', () => initReviewsCarousel(t));
  initWhenVisible('gallery', () => initGalleryCarousel(t));
  refreshBookingUi();
  updateFooterCreditLink();
  initScrollCta();
  initMobileNav();
  initStickyCta();
  initMapClickLoad();
  registerServiceWorker();
}

/* ── Kickoff ── */
initFaq();
scheduleHeroVideo();

initI18n(() => {
  updateBookingTimeOptions(currentLang);
  refreshBookingUi();
  updateFooterCreditLink();
  updateStickyCta();
  syncFaqAria();
  syncAvailabilityErrorI18n(t);
  closeMobileMenu();
  window.refreshReviewsCarousel?.();
}).then(boot);
