import { technologies } from "../data/technologies.js";

(() => {
  const grid = document.querySelector('.background-grid');
  if (!grid) return;

  const motion = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  const style = document.body.style;
  let cells = [];
  let cursor = null;
  let frame = 0;

  function buildGrid() {
    // Touch and reduced-motion visitors keep the CSS grid without decorative DOM.
    if (!motion.matches) {
      grid.replaceChildren();
      cells = [];
      document.body.classList.remove('grid-ready');
      hideGlow();
      return;
    }
    const fragment = document.createDocumentFragment();
    cells = [];
    for (let row = 0; row * 48 < grid.clientHeight + 48; row++) {
      for (let left = 0; left < grid.clientWidth; left += 48) {
        const cell = document.createElement('span');
        cell.className = 'grid-cell';
        cell.style.left = `${left}px`;
        cell.style.top = `${row * 48}px`;
        if (row % 2 === 0 && left % 96 === 0 && Math.random() < 0.4) {
          const [technology, color] = technologies[Math.floor(Math.random() * technologies.length)];
          cell.innerHTML = `<svg class="grid-logo" color="${color}" aria-hidden="true" focusable="false"><use href="#tech-${technology}"/></svg>`;
        }
        fragment.append(cell);
        cells.push({ element: cell, x: left + 24, y: row * 48 + 24, lift: 0 });
      }
    }
    grid.replaceChildren(fragment);
    document.body.classList.add('grid-ready');
    hideGlow();
  }

  function updateGrid() {
    frame = 0;
    const bounds = cursor && grid.getBoundingClientRect();
    const x = cursor ? cursor.x - bounds.left : 0;
    const y = cursor ? cursor.y - bounds.top : 0;
    if (cursor) {
      style.setProperty('--cursor-x', `${x}px`);
      style.setProperty('--cursor-y', `${y}px`);
    }
    for (const cell of cells) {
      const lift = cursor ? Math.max(0, 1 - Math.hypot(x - cell.x, y - cell.y) / 180) ** 2 : 0;
      if (lift !== cell.lift) cell.element.style.setProperty('--lift', lift.toFixed(3));
      cell.lift = lift;
    }
  }

  function hideGlow() {
    cursor = null;
    if (frame) cancelAnimationFrame(frame);
    updateGrid();
    style.setProperty('--grid-active', '0');
  }

  document.addEventListener('pointermove', event => {
    if (!motion.matches || event.pointerType === 'touch') { hideGlow(); return; }
    cursor = { x: event.clientX, y: event.clientY };
    style.setProperty('--grid-active', '1');
    if (!frame) frame = requestAnimationFrame(updateGrid);
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', hideGlow);
  window.addEventListener('blur', hideGlow);
  new ResizeObserver(buildGrid).observe(grid);
  window.addEventListener('scroll', () => {
    if (cursor && !frame) frame = requestAnimationFrame(updateGrid);
  }, { passive: true });
  motion.addEventListener('change', buildGrid);
  buildGrid();
})();
