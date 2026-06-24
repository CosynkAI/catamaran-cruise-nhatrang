/**
 * Gallery lightbox — fullscreen image view with keyboard nav.
 */
export function initGalleryLightbox(t) {
  const root = document.getElementById('gallery-lightbox');
  const img = document.getElementById('gallery-lightbox-img');
  const caption = document.getElementById('gallery-lightbox-caption');
  const closeBtn = document.getElementById('gallery-lightbox-close');
  const prevBtn = document.getElementById('gallery-lightbox-prev');
  const nextBtn = document.getElementById('gallery-lightbox-next');
  if (!root || !img) return null;

  let slides = [];
  let index = 0;
  let lastFocus = null;

  const render = () => {
    const slide = slides[index];
    if (!slide) return;
    img.src = slide.src;
    if (slide.srcset) img.srcset = slide.srcset;
    else img.removeAttribute('srcset');
    img.sizes = '100vw';
    img.alt = slide.alt;
    caption.textContent = slide.alt;
    root.setAttribute('aria-label', slide.alt);
    prevBtn?.toggleAttribute('hidden', slides.length <= 1);
    nextBtn?.toggleAttribute('hidden', slides.length <= 1);
  };

  const close = () => {
    root.hidden = true;
    document.body.classList.remove('lightbox-open');
    img.removeAttribute('src');
    img.removeAttribute('srcset');
    lastFocus?.focus?.();
    lastFocus = null;
  };

  const step = (delta) => {
    if (slides.length <= 1) return;
    index = (index + delta + slides.length) % slides.length;
    render();
  };

  const open = (list, startIndex) => {
    if (!list?.length) return;
    slides = list;
    index = Math.min(Math.max(0, startIndex), list.length - 1);
    lastFocus = document.activeElement;
    render();
    root.hidden = false;
    document.body.classList.add('lightbox-open');
    closeBtn?.focus();
  };

  closeBtn?.addEventListener('click', close);
  prevBtn?.addEventListener('click', () => step(-1));
  nextBtn?.addEventListener('click', () => step(1));
  root.addEventListener('click', (e) => {
    if (e.target === root) close();
  });
  document.addEventListener('keydown', (e) => {
    if (root.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });

  closeBtn?.setAttribute('aria-label', t('gallery.lightboxClose'));
  prevBtn?.setAttribute('aria-label', t('gallery.prev'));
  nextBtn?.setAttribute('aria-label', t('gallery.next'));

  return { open };
}
