for (const list of document.querySelectorAll('.paginated-list')) {
  const cards = [...list.querySelector('[data-list-items]').children].map(element => ({
    element, tags: JSON.parse(element.dataset.tags || '[]'),
  }));
  const filter = list.querySelector('[data-tag-filter]');
  const previous = list.querySelector('[data-previous]');
  const next = list.querySelector('[data-next]');
  const status = list.querySelector('[data-pagination-status]');
  const size = Number(list.dataset.pageSize);
  let tag = '', page = 1;

  function render() {
    const matches = cards.filter(card => !tag || card.tags.includes(tag));
    const pages = Math.max(1, Math.ceil(matches.length / size));
    page = Math.max(1, Math.min(page, pages));
    const start = (page - 1) * size;
    cards.forEach(card => { card.element.hidden = true; });
    matches.slice(start, start + size).forEach(card => { card.element.hidden = false; });
    previous.disabled = page === 1;
    next.disabled = page === pages;
    const label = matches.length === 1 ? list.dataset.itemLabel.slice(0, -1) : list.dataset.itemLabel;
    status.textContent = `${matches.length ? start + 1 : 0}–${Math.min(start + size, matches.length)} of ${matches.length} ${label} · Page ${page} of ${pages}`;
  }

  filter?.addEventListener('change', () => {
    tag = filter.value;
    page = 1;
    render();
  });
  previous.addEventListener('click', () => { page--; render(); });
  next.addEventListener('click', () => { page++; render(); });
  render();
  const controls = list.querySelector('[data-filter-controls]');
  if (controls) controls.hidden = false;
  list.querySelector('.pagination').hidden = false;
}
