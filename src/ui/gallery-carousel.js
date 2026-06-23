/**
 * Gallery carousel — uses shared createCarousel.
 * Fetches /gallery-manifest.json, builds pages of GALLERY_PER_PAGE items.
 */
import { createCarousel } from './carousel.js';

const GALLERY_PER_PAGE = 6;

function chunkItems(items, size) {
  const pages = [];
  for (let i = 0; i < items.length; i += size) {
    pages.push(items.slice(i, i + size));
  }
  return pages;
}

export async function initGalleryCarousel(t) {
  const root = document.getElementById('gallery-carousel');
  const viewport = document.getElementById('gallery-viewport');
  const track = document.getElementById('gallery-track');
  const counter = document.getElementById('gallery-counter');
  const dotsEl = document.getElementById('gallery-dots');
  const prevBtn = document.getElementById('gallery-prev');
  const nextBtn = document.getElementById('gallery-next');
  if (!root || !viewport || !track) return null;

  /* Fetch gallery data */
  let items = [];
  try {
    const res = await fetch('/gallery-manifest.json');
    if (!res.ok) return null;
    const data = await res.json();
    items = (data.items ?? []).filter((item) => item.type === 'image');
  } catch {
    return null;
  }
  if (!items.length) return null;

  const pages = chunkItems(items, GALLERY_PER_PAGE);

  const altText = (globalIndex) => {
    const key = `gallery.alt${(globalIndex % 10) + 1}`;
    const label = t(key);
    return label === key ? `${t('gallery.altPhoto')} ${globalIndex + 1}` : label;
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

  return createCarousel({
    root,
    viewport,
    track,
    counter,
    dotsEl,
    prevBtn,
    nextBtn,
    buildPages: () => {
      track.replaceChildren();
      pages.forEach((pageItems, i) => track.append(buildPage(pageItems, i)));
      return { pageCount: pages.length };
    },
    extra: {
      t,
      onPageChange() {},
    },
  });
}
