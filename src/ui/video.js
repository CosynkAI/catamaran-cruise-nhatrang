/**
 * Hero video module — lazy loads and manages the hero background video.
 * Respects prefers-reduced-motion, saveData, and effective connection type.
 */
export function isMobileViewport() {
  return window.matchMedia('(max-width: 767px)').matches;
}

function shouldLoadHeroVideo() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (conn?.saveData) return false;
  if (conn?.effectiveType && ['slow-2g', '2g'].includes(conn.effectiveType)) return false;
  return true;
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

export function initPageVideo() {
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

  const unlock = () => tryPlay();
  unlockBtn?.addEventListener('click', unlock);
  document.addEventListener('touchstart', unlock, { once: true, capture: true });
  document.addEventListener('click', unlock, { once: true, capture: true });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && video.paused) tryPlay();
  });

  setTimeout(() => {
    if (!video.paused) markReady();
    else showUnlock();
  }, 1500);
}

export function scheduleHeroVideo() {
  const backdrop = document.querySelector('.page-backdrop');
  if (!shouldLoadHeroVideo()) {
    backdrop?.classList.add('is-video-disabled');
    return;
  }
  initPageVideo();
}
