import { technologies } from "../data/technologies.js";

(() => {
      const surfaces = {
        hexagons: '<path class="surface" d="M-29-17 0-34 29-17 29 17 0 34-29 17Z"/>',
        diamonds: '<path class="surface" d="M0-36 36 0 0 36-36 0Z"/>',
        triangles: '<path class="surface" d="M0-37 32 18.5-32 18.5Z"/>',
        circles: '<circle class="surface" r="23"/>',
        capsules: '<rect class="surface" x="-42" y="-22" width="84" height="44" rx="22"/>',
        cubes: '<path class="surface" d="M0-40 34.64-20 34.64 20 0 40-34.64 20-34.64-20Z"/><path class="edge" d="M-34.64-20 0 0 34.64-20M0 0v40"/>',
      };
      const scenes = new Map();
      const dialog = document.querySelector('dialog');
      const fullScene = dialog.querySelector('.scene');
      const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
      let frame = 0;
      let nextScene = 0;

      function build(scene, shape) {
        const width = scene.clientWidth;
        const height = scene.clientHeight;
        if (!width || !height) return;
        const previous = scenes.get(scene);
        const id = previous?.id || `light-${++nextScene}`;
        scene.setAttribute('viewBox', `0 0 ${width} ${height}`);
        const markup = [];
        const cells = [];
        const [stepX, stepY] = { hexagons: [60, 52], diamonds: [74, 37], triangles: [34, 59], circles: [56, 56], capsules: [90, 50], cubes: [71, 61.5] }[shape];
        for (let row = -1; row * stepY < height + stepY; row++) {
          for (let column = -1; column * stepX < width + stepX; column++) {
            const offset = ['hexagons', 'diamonds', 'capsules', 'cubes'].includes(shape) && row % 2 !== 0 ? stepX / 2 : 0;
            const x = column * stepX + offset;
            const flipped = shape === 'triangles' && (row + column) % 2 !== 0;
            const y = row * stepY + (shape === 'triangles' ? (flipped ? -9.25 : 9.25) : 0);
            const hasLogo = row % Math.ceil(96 / stepY) === 0 && column % Math.ceil(96 / stepX) === 0 && Math.random() < .4;
            const [technology, color] = technologies[Math.floor(Math.random() * technologies.length)];
            const logoY = shape === 'cubes' ? -20 : 0;
            const logo = hasLogo ? `<svg class="logo" x="-12" y="${logoY - 12}" width="24" height="24" color="${color}" aria-hidden="true"><use href="#tech-${technology}"/></svg>` : '';
            markup.push(`<g transform="translate(${x} ${y})"><g class="tile">${flipped ? `<g transform="rotate(180)">${surfaces[shape]}</g>` : surfaces[shape]}${logo}</g></g>`);
            cells.push({ x, y, lift: 0 });
          }
        }
        scene.innerHTML = `<defs><radialGradient id="${id}"><stop stop-color="white" stop-opacity=".065"/><stop offset="1" stop-color="white" stop-opacity="0"/></radialGradient></defs><circle class="cursor-light" r="180" fill="url(#${id})"/>${markup.join('')}`;
        scene.querySelectorAll('.tile').forEach((element, index) => { cells[index].element = element; });
        scenes.set(scene, { id, shape, cells, cursor: null, light: scene.querySelector('.cursor-light') });
      }

      function update() {
        frame = 0;
        for (const state of scenes.values()) {
          const cursor = state.cursor;
          state.light.style.setProperty('--active', cursor ? 1 : 0);
          if (cursor) {
            state.light.setAttribute('cx', cursor.x);
            state.light.setAttribute('cy', cursor.y);
          }
          for (const cell of state.cells) {
            const lift = cursor ? Math.max(0, 1 - Math.hypot(cursor.x - cell.x, cursor.y - cell.y) / 150) ** 2 : 0;
            if (lift !== cell.lift) cell.element.style.setProperty('--lift', lift.toFixed(3));
            cell.lift = lift;
          }
        }
      }

      function schedule() { if (!frame) frame = requestAnimationFrame(update); }
      function hide(scene) { const state = scenes.get(scene); if (state) { state.cursor = null; schedule(); } }
      function point(scene, event) {
        if (reducedMotion.matches) return;
        const state = scenes.get(scene);
        if (!state) return;
        const bounds = scene.getBoundingClientRect();
        state.cursor = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
        schedule();
      }

      document.querySelectorAll('.scene').forEach(scene => {
        scene.addEventListener('pointermove', event => { if (event.pointerType !== 'touch') point(scene, event); }, { passive: true });
        scene.addEventListener('pointerdown', event => point(scene, event), { passive: true });
        scene.addEventListener('pointerleave', event => { if (event.pointerType !== 'touch') hide(scene); });
        scene.addEventListener('focus', () => {
          if (reducedMotion.matches) return;
          const state = scenes.get(scene);
          if (state) { state.cursor = { x: scene.clientWidth / 2, y: scene.clientHeight / 2 }; schedule(); }
        });
        scene.addEventListener('blur', () => hide(scene));
      });

      document.querySelectorAll('.demo').forEach(demo => {
        const scene = demo.querySelector('.scene');
        const shape = demo.dataset.shape;
        build(scene, shape);
        demo.querySelector('button').addEventListener('click', () => {
          document.querySelector('#preview-title').textContent = `${demo.querySelector('h2').textContent} — homepage preview`;
          dialog.showModal();
          build(fullScene, shape);
          fullScene.focus();
        });
      });
      dialog.querySelector('.close').addEventListener('click', () => dialog.close());
      dialog.addEventListener('close', () => hide(fullScene));
      window.addEventListener('blur', () => { for (const scene of scenes.keys()) hide(scene); });
      reducedMotion.addEventListener('change', () => { for (const scene of scenes.keys()) hide(scene); });
      const observer = new ResizeObserver(entries => {
        for (const { target } of entries) {
          const state = scenes.get(target);
          if (state) build(target, state.shape);
        }
      });
      document.querySelectorAll('.scene').forEach(scene => observer.observe(scene));
    })();
