/**
 * Shared carousel module.
 * Wraps a scroll-snap viewport with prev/next buttons, dot navigation,
 * counter display, resize handling, and keyboard support.
 *
 * @param {Object} opts
 * @param {HTMLElement} opts.root     — carousel container (id ref)
 * @param {HTMLElement} opts.viewport — scrollable viewport element
 * @param {HTMLElement} opts.track    — inner track element
 * @param {HTMLElement} [opts.counter]— counter text element
 * @param {HTMLElement} [opts.dotsEl] — dot navigation container
 * @param {HTMLElement} [opts.prevBtn]— prev button
 * @param {HTMLElement} [opts.nextBtn]— next button
 * @param {Function}    opts.buildPages— () => { pageCount, replaceChildren, layoutPages, updateCounter }
 * @param {Object}      [opts.extra]  — extra callbacks
 * @returns {{ goToPage: Function, stepPage: Function, rebuild: Function }}
 */
export function createCarousel({
  root,
  viewport,
  track,
  counter,
  dotsEl,
  prevBtn,
  nextBtn,
  buildPages,
  extra = {},
}) {
  if (!root || !viewport || !track) return null;

  let pageIndex = 0;
  let pageCount = 1;
  let syncDots = () => {};
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const pageWidth = () => viewport.clientWidth;

  const layoutPages = () => {
    const w = pageWidth();
    if (!w) return;
    track.style.width = `${w * pageCount}px`;
    track.querySelectorAll('.gallery-carousel__page, .reviews-carousel__page').forEach((page) => {
      page.style.flex = `0 0 ${w}px`;
      page.style.width = `${w}px`;
    });
  };

  const updateCounterDisplay = () => {
    if (counter && extra.t) {
      counter.textContent = extra
        .t('gallery.counter')
        .replace('{current}', String(pageIndex + 1))
        .replace('{total}', String(pageCount));
    }
    syncDots();
  };

  const syncIndexFromScroll = () => {
    const w = pageWidth();
    if (!w) return;
    const next = Math.min(pageCount - 1, Math.max(0, Math.round(viewport.scrollLeft / w)));
    if (next !== pageIndex) {
      pageIndex = next;
      updateCounterDisplay();
      extra.onPageChange?.(pageIndex);
    }
  };

  const scrollToPage = (behavior = 'auto') => {
    viewport.scrollTo({ left: pageIndex * pageWidth(), behavior });
  };

  const goToPage = (nextIndex) => {
    pageIndex = ((nextIndex % pageCount) + pageCount) % pageCount;
    scrollToPage(prefersReducedMotion ? 'auto' : 'smooth');
    updateCounterDisplay();
  };

  const stepPage = (delta) => goToPage(pageIndex + delta);

  /* ── Dot navigation ── */
  if (dotsEl) {
    const refreshDots = () => {
      dotsEl.replaceChildren();
      for (let i = 0; i < pageCount; i += 1) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'carousel-dots__dot';
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-label', String(i + 1));
        btn.addEventListener('click', () => goToPage(i));
        dotsEl.append(btn);
      }
    };
    syncDots = () => {
      const idx = pageIndex;
      dotsEl.querySelectorAll('.carousel-dots__dot').forEach((dot, i) => {
        dot.classList.toggle('is-active', i === idx);
        dot.setAttribute('aria-selected', i === idx ? 'true' : 'false');
      });
    };
    const origBuildPages = buildPages;
    buildPages = () => {
      const result = origBuildPages();
      pageCount = result.pageCount;
      refreshDots();
      return result;
    };
  }

  /* ── Controls ── */
  prevBtn?.addEventListener('click', () => stepPage(-1));
  nextBtn?.addEventListener('click', () => stepPage(1));

  /* ── Scroll sync ── */
  viewport.addEventListener('scroll', () => requestAnimationFrame(syncIndexFromScroll), {
    passive: true,
  });

  /* ── Resize ── */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const result = buildPages();
      pageCount = result.pageCount;
      pageIndex = Math.min(pageIndex, Math.max(0, pageCount - 1));
      layoutPages();
      scrollToPage('auto');
      updateCounterDisplay();
    }, 150);
  });

  /* ── Keyboard ── */
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

  /* ── Build ── */
  const result = buildPages();
  pageCount = result.pageCount;
  layoutPages();
  scrollToPage('auto');
  updateCounterDisplay();

  return {
    goToPage,
    stepPage,
    rebuild: () => {
      const result = buildPages();
      pageCount = result.pageCount;
      pageIndex = 0;
      layoutPages();
      scrollToPage('auto');
      updateCounterDisplay();
    },
    refresh: () => {
      layoutPages();
      scrollToPage('auto');
      updateCounterDisplay();
    },
  };
}
