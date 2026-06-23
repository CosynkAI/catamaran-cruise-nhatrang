/**
 * Reviews carousel — uses shared createCarousel.
 * Takes existing .review-card elements and chunks them into pages.
 */
import { createCarousel } from './carousel.js';

function getReviewsPerPage() {
  if (window.innerWidth >= 1024) return 3;
  if (window.innerWidth >= 640) return 2;
  return 1;
}

function chunkItems(items, size) {
  const pages = [];
  for (let i = 0; i < items.length; i += size) pages.push(items.slice(i, i + size));
  return pages;
}

export function initReviewsCarousel(t) {
  const root = document.getElementById('reviews-carousel');
  const viewport = document.getElementById('reviews-viewport');
  const track = document.getElementById('reviews-track');
  const counter = document.getElementById('reviews-counter');
  const dotsEl = document.getElementById('reviews-dots');
  const prevBtn = document.getElementById('reviews-prev');
  const nextBtn = document.getElementById('reviews-next');
  if (!root || !viewport || !track) return null;

  const sourceCards = [...track.querySelectorAll('.review-card')];
  if (!sourceCards.length) return null;

  const carousel = createCarousel({
    root,
    viewport,
    track,
    counter,
    dotsEl,
    prevBtn,
    nextBtn,
    buildPages: () => {
      const chunks = chunkItems(sourceCards, getReviewsPerPage());
      track.replaceChildren();
      chunks.forEach((cards) => {
        const page = document.createElement('div');
        page.className = 'reviews-carousel__page';
        cards.forEach((card) => page.append(card));
        track.append(page);
      });
      return { pageCount: chunks.length };
    },
    extra: { t },
  });

  if (carousel) {
    window.refreshReviewsCarousel = () => {
      requestAnimationFrame(() => carousel.refresh());
    };
  }

  return carousel;
}
