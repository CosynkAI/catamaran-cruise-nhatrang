/**
 * Navigation module — mobile menu with focus trap, sticky CTA, floating WhatsApp.
 */
import { isBookingReady } from './booking.js';

let pastHero = false;

function isMobileViewport() {
  return window.matchMedia('(max-width: 767px)').matches;
}

/* ── Focus trap for mobile menu ── */
function trapFocus(element) {
  const focusable = element.querySelectorAll(
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  if (!focusable.length) return () => {};
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  const handler = (e) => {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  };
  element.addEventListener('keydown', handler);
  return () => element.removeEventListener('keydown', handler);
}

/* ── Mobile menu ── */
function updateFloatingWhatsapp() {
  const el = document.getElementById('floating-whatsapp');
  if (!el) return;
  const show = pastHero && !isBookingReady() && isMobileViewport();
  el.classList.toggle('is-visible', show);
  el.toggleAttribute('hidden', !show);
}

let untrapFocus = null;

export function closeMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const toggle = document.getElementById('menu-toggle');
  menu?.classList.remove('is-open');
  toggle?.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
  document.getElementById('lang-dropdown')?.classList.remove('is-open');
  document.getElementById('lang-menu')?.setAttribute('hidden', '');
  untrapFocus?.();
  untrapFocus = null;
  updateFloatingWhatsapp();
}

function openMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const toggle = document.getElementById('menu-toggle');
  menu?.classList.add('is-open');
  toggle?.setAttribute('aria-expanded', 'true');
  document.body.classList.add('menu-open');
  updateFloatingWhatsapp();
  untrapFocus = trapFocus(menu);
  /* Focus first link */
  const firstLink = menu?.querySelector('a');
  firstLink?.focus();
}

export function initMobileNav() {
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');
  const backdrop = document.getElementById('menu-backdrop');

  toggle?.addEventListener('click', () => {
    menu?.classList.contains('is-open') ? closeMobileMenu() : openMobileMenu();
  });
  backdrop?.addEventListener('click', closeMobileMenu);
  menu?.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMobileMenu));
}

/* ── Scroll links ── */
export function initScrollCta() {
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

/* ── Sticky CTA + floating WhatsApp ── */
export function updateStickyCta() {
  const browse = document.getElementById('sticky-cta-browse');
  const ready = document.getElementById('sticky-cta-ready');
  const readyState = isBookingReady();
  browse?.toggleAttribute('hidden', readyState);
  ready?.toggleAttribute('hidden', !readyState);
  updateFloatingWhatsapp();
}

export function initStickyCta() {
  const bar = document.getElementById('sticky-cta');
  const hero = document.getElementById('hero');
  if (!bar || !hero) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      pastHero = !entry.isIntersecting;
      bar.classList.toggle('is-visible', pastHero);
      updateFloatingWhatsapp();
    },
    { threshold: 0 }
  );
  observer.observe(hero);
  window.addEventListener('resize', updateFloatingWhatsapp, { passive: true });
}
