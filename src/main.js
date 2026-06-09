import './css/input.css';
import { buildMessengerUrl } from '@lib/booking-url.js';
import { getBookingMessage } from '@lib/booking-messages.js';
import { initI18n, currentLang, t } from './i18n.js';
import { SITE } from './site.js';

export const CONTACTS = SITE.contacts;

const bookingState = { date: '', guests: '2', time: '', type: 'group' };
const GALLERY_PER_PAGE = 6;

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

function initBookingForm() {
  const dateEl = document.getElementById('booking-date');
  const guestsEl = document.getElementById('booking-guests');
  const timeEl = document.getElementById('booking-time');

  if (dateEl) {
    dateEl.min = new Date().toISOString().slice(0, 10);
    dateEl.addEventListener('change', () => {
      bookingState.date = dateEl.value;
      initMessengerLinks();
    });
  }

  if (guestsEl) {
    bookingState.guests = guestsEl.value;
    guestsEl.addEventListener('input', () => {
      bookingState.guests = guestsEl.value;
      initMessengerLinks();
    });
  }

  if (timeEl) {
    timeEl.addEventListener('change', () => {
      bookingState.time = timeEl.value;
      initMessengerLinks();
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

function showConfigTab(tabId) {
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

  if (tabId === 'vip') {
    guestsWrap?.toggleAttribute('hidden', true);
    timeWrap?.toggleAttribute('hidden', true);
    bookingState.guests = '';
    bookingState.time = '';
  } else {
    guestsWrap?.toggleAttribute('hidden', false);
    timeWrap?.toggleAttribute('hidden', false);
    const guestsEl = document.getElementById('booking-guests');
    if (guestsEl) bookingState.guests = guestsEl.value;
    updateBookingTimeOptions();
  }

  initMessengerLinks();
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

function chunkGalleryItems(items, size) {
  const pages = [];
  for (let i = 0; i < items.length; i += size) {
    pages.push(items.slice(i, i + size));
  }
  return pages;
}

function bindCarouselTouchSwipe(viewport, { isBlocked, onDrag, onRelease }) {
  let dragStartX = 0;
  let dragStartY = 0;
  let dragOffset = 0;
  let isDragging = false;
  let axis = null;
  let pointerId = null;
  let usePointer = false;

  const setSwiping = (active) => {
    viewport.classList.toggle('is-swiping', active);
  };

  const start = (x, y, id = null) => {
    if (isBlocked()) return;
    isDragging = true;
    axis = null;
    dragStartX = x;
    dragStartY = y;
    dragOffset = 0;
    pointerId = id;
  };

  const move = (x, y, e) => {
    if (!isDragging || isBlocked()) return;
    const dx = x - dragStartX;
    const dy = y - dragStartY;
    if (axis === null && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) {
      axis = Math.abs(dx) >= Math.abs(dy) ? 'x' : 'y';
    }
    if (axis === 'y') {
      setSwiping(false);
      return;
    }
    if (axis === 'x') {
      if (e?.cancelable) e.preventDefault();
      setSwiping(true);
      dragOffset = dx;
      onDrag(dragOffset);
    }
  };

  const finish = () => {
    if (!isDragging) return;
    const offset = dragOffset;
    isDragging = false;
    axis = null;
    dragOffset = 0;
    pointerId = null;
    usePointer = false;
    setSwiping(false);
    onRelease(offset);
  };

  if (window.PointerEvent) {
    viewport.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'touch' && e.pointerType !== 'pen') return;
      usePointer = true;
      start(e.clientX, e.clientY, e.pointerId);
      viewport.setPointerCapture(e.pointerId);
    });

    viewport.addEventListener('pointermove', (e) => {
      if (!usePointer || e.pointerId !== pointerId) return;
      move(e.clientX, e.clientY, e);
    });

    viewport.addEventListener('pointerup', (e) => {
      if (!usePointer || e.pointerId !== pointerId) return;
      viewport.releasePointerCapture(e.pointerId);
      finish();
    });

    viewport.addEventListener('pointercancel', (e) => {
      if (e.pointerId !== pointerId) return;
      finish();
    });
  }

  viewport.addEventListener(
    'touchstart',
    (e) => {
      if (usePointer || isBlocked()) return;
      start(e.touches[0].clientX, e.touches[0].clientY);
    },
    { passive: true }
  );

  viewport.addEventListener(
    'touchmove',
    (e) => {
      if (usePointer || !isDragging) return;
      move(e.touches[0].clientX, e.touches[0].clientY, e);
    },
    { passive: false }
  );

  viewport.addEventListener(
    'touchend',
    () => {
      if (usePointer) return;
      finish();
    },
    { passive: true }
  );

  viewport.addEventListener(
    'touchcancel',
    () => {
      if (usePointer) return;
      finish();
    },
    { passive: true }
  );
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
  const prevBtn = document.getElementById('reviews-prev');
  const nextBtn = document.getElementById('reviews-next');
  if (!root || !viewport || !track) return;

  const sourceCards = [...track.querySelectorAll('.review-card')];
  if (!sourceCards.length) return;

  let pageIndex = 0;
  let pageCount = 1;
  let isAnimating = false;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
  };

  const updateCounter = () => {
    if (!counter) return;
    counter.textContent = t('gallery.counter')
      .replace('{current}', String(pageIndex + 1))
      .replace('{total}', String(pageCount));
  };

  const pageWidth = () => viewport.clientWidth;

  const applyTransform = (dragPx = 0, animate = false) => {
    const x = -pageIndex * pageWidth() + dragPx;
    track.classList.toggle('is-dragging', !animate);
    track.style.transform = `translate3d(${x}px, 0, 0)`;
  };

  const finishTransition = () => {
    isAnimating = false;
  };

  const snapToPage = (animate = true) => {
    if (!animate || prefersReducedMotion) {
      applyTransform(0, false);
      finishTransition();
      return;
    }
    isAnimating = true;
    track.classList.remove('is-dragging');
    requestAnimationFrame(() => applyTransform(0, true));
    const onEnd = (e) => {
      if (e.propertyName !== 'transform') return;
      track.removeEventListener('transitionend', onEnd);
      finishTransition();
    };
    track.addEventListener('transitionend', onEnd);
  };

  const goToPage = (nextIndex, animate = true) => {
    if (isAnimating && animate) return;
    const newIndex = ((nextIndex % pageCount) + pageCount) % pageCount;
    if (newIndex === pageIndex && animate) return;
    pageIndex = newIndex;
    updateCounter();
    snapToPage(animate);
  };

  const stepPage = (delta) => goToPage(pageIndex + delta);

  prevBtn?.addEventListener('click', () => stepPage(-1));
  nextBtn?.addEventListener('click', () => stepPage(1));

  const releaseSwipe = (offset) => {
    const w = pageWidth();
    const threshold = w * 0.12;
    if (offset < -threshold) goToPage(pageIndex + 1);
    else if (offset > threshold) goToPage(pageIndex - 1);
    else snapToPage(true);
  };

  bindCarouselTouchSwipe(viewport, {
    isBlocked: () => isAnimating,
    onDrag: (offset) => applyTransform(offset, false),
    onRelease: releaseSwipe,
  });

  let dragStartX = 0;
  let dragOffset = 0;
  let isDragging = false;

  viewport.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'touch' || isAnimating) return;
    isDragging = true;
    dragStartX = e.clientX;
    dragOffset = 0;
    viewport.setPointerCapture(e.pointerId);
  });

  viewport.addEventListener('pointermove', (e) => {
    if (!isDragging || e.pointerType === 'touch') return;
    dragOffset = e.clientX - dragStartX;
    applyTransform(dragOffset, false);
  });

  viewport.addEventListener('pointerup', (e) => {
    if (e.pointerType === 'touch') return;
    if (isDragging) viewport.releasePointerCapture(e.pointerId);
    if (isDragging) releaseSwipe(dragOffset);
    isDragging = false;
    dragOffset = 0;
  });

  viewport.addEventListener('pointercancel', () => {
    isDragging = false;
    snapToPage(true);
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      rebuildPages();
      applyTransform(0, false);
      updateCounter();
    }, 150);
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

  window.refreshReviewsCarousel = () => updateCounter();

  rebuildPages();
  applyTransform(0, false);
  updateCounter();
}

async function initGalleryCarousel() {
  const root = document.getElementById('gallery-carousel');
  const viewport = document.getElementById('gallery-viewport');
  const track = document.getElementById('gallery-track');
  const counter = document.getElementById('gallery-counter');
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

  const updateCounter = () => {
    if (!counter) return;
    counter.textContent = t('gallery.counter')
      .replace('{current}', String(pageIndex + 1))
      .replace('{total}', String(pages.length));
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
      img.sizes = '(max-width: 640px) 44vw, (max-width: 1024px) 28vw, 220px';
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

function initMessengerLinks() {
  document.querySelectorAll('[data-messenger]').forEach((el) => {
    const type = resolveTourType(el);
    const channel = el.dataset.channel || 'whatsapp';
    el.href = messengerUrl(type, channel);
    el.target = '_blank';
    el.rel = 'noopener noreferrer';
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
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function isMobileViewport() {
  return window.matchMedia('(max-width: 767px)').matches;
}

function prepHeroVideoEl(video) {
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.setAttribute('playsinline', '');
  video.setAttribute('webkit-playsinline', '');
  video.preload = isMobileViewport() ? 'metadata' : 'auto';
}

function initPageVideo() {
  const video = document.getElementById('hero-video');
  const backdrop = document.querySelector('.page-backdrop');
  if (!video || !backdrop || video.dataset.heroInit === '1') return;
  video.dataset.heroInit = '1';

  if (!shouldLoadHeroVideo()) {
    backdrop.classList.add('is-video-disabled');
    return;
  }

  prepHeroVideoEl(video);

  const markReady = () => backdrop.classList.add('is-video-ready');

  const tryPlay = () => {
    video.play().then(markReady).catch(() => {});
  };

  video.addEventListener('playing', markReady, { once: true });
  video.addEventListener('loadeddata', markReady, { once: true });

  if (video.readyState >= 2) tryPlay();
  else video.addEventListener('canplay', tryPlay, { once: true });

  const unlock = () => {
    tryPlay();
    markReady();
  };
  document.addEventListener('touchstart', unlock, { once: true, capture: true });
  document.addEventListener('click', unlock, { once: true, capture: true });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && video.paused) tryPlay();
  });

  window.setTimeout(() => {
    if (!video.paused) markReady();
  }, 800);
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

function initLazyMap() {
  const frame = document.getElementById('map-frame');
  if (!frame?.dataset.src) return;

  const load = () => {
    if (frame.dataset.loaded === 'true') return;
    frame.src = frame.dataset.src;
    frame.dataset.loaded = 'true';
  };

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        load();
        io.disconnect();
      },
      { rootMargin: '300px' }
    );
    io.observe(frame);
    return;
  }

  load();
}

function initGalleryWhenVisible() {
  initGalleryCarousel();
}

function boot() {
  initConfigurator();

  const tab = document.body.dataset.defaultTab;
  if (tab && PANEL_IDS[tab]) showConfigTab(tab);

  initLangDropdown();
  initBookingForm();
  updateBookingTimeOptions();
  initReviewsCarousel();
  initGalleryWhenVisible();
  initMessengerLinks();
  initScrollCta();
  initMobileNav();
  initStickyCta();
  initLazyMap();
}

initFaq();

initI18n(() => {
  updateBookingTimeOptions();
  initMessengerLinks();
  closeMobileMenu();
  window.refreshGalleryCarousel?.();
  window.refreshReviewsCarousel?.();
}).then(boot);

export { getBookingMessage };
