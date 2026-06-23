/**
 * FAQ module — accordion behavior with accessibility improvements.
 */
export function initFaq() {
  const root = document.getElementById('faq');
  if (!root || root.dataset.faqReady) return;
  root.dataset.faqReady = '1';

  const items = root.querySelectorAll('details.faq-item');
  items.forEach((item) => {
    /* Sync aria-expanded on open/close */
    const summary = item.querySelector('summary');
    const observer = new MutationObserver(() => {
      summary?.setAttribute('aria-expanded', item.open ? 'true' : 'false');
    });
    observer.observe(item, { attributes: true, attributeFilter: ['open'] });

    item.addEventListener('toggle', () => {
      if (!item.open) return;
      items.forEach((other) => {
        if (other !== item) other.removeAttribute('open');
      });
    });
  });
}

export function syncFaqAria() {
  document.querySelectorAll('details.faq-item').forEach((item) => {
    const summary = item.querySelector('summary');
    if (summary) summary.setAttribute('aria-expanded', item.open ? 'true' : 'false');
  });
}
