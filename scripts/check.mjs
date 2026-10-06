import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';
import { technologies } from '../src/data/technologies.js';

const root = new URL('../', import.meta.url);
const dist = new URL('dist/', root);
const read = path => readFileSync(new URL(path, root), 'utf8');
function htmlFiles(folder, prefix = '') {
  return readdirSync(folder, { withFileTypes: true }).flatMap(entry => entry.isDirectory()
    ? htmlFiles(new URL(`${entry.name}/`, folder), `${prefix}${entry.name}/`)
    : entry.name.endsWith('.html') ? [`${prefix}${entry.name}`] : []);
}
const pages = htmlFiles(dist);
for (const path of ['index.html', 'work/index.html', 'blog/index.html', 'blog-post/index.html', 'grid-shapes/index.html', '404.html']) assert.ok(pages.includes(path), `${path}: required page`);
const siteUrl = read('dist/index.html').match(/rel="canonical" href="([^"]+)"/)[1];
const home = read('dist/index.html');
assert.match(home, /Artaza Sameen/);
assert.match(home, /mailto:artaza\.developer@gmail\.com/);
assert.match(home, /https:\/\/www\.linkedin\.com\/in\/artaza-sameen-4b995b23a\//);
assert.match(read('dist/resume.txt'), /Finlens — SDE 2, Backend/);
for (const detail of ['Stock Register', 'id="skills-heading"', 'FastAPI', 'Education', 'Maulana Mazharul Haque']) assert.ok(read('dist/work/index.html').includes(detail), `Work page includes ${detail}`);
assert.match(read('dist/blog/index.html'), /Read on LinkedIn/);
for (const [slug, date] of [['download-instagram-reels-by-scraping-using-nodejs', '2023-05-12'], ['how-to-use-prismjs-in-react-js', '2023-01-14']]) assert.ok(read(`dist/blog/${slug}/index.html`).includes(`datetime="${date}"`), `${slug}: original publication date and URL`);
const projectCards = [...read('dist/work/index.html').matchAll(/<article class="work-card"[^>]*>[\s\S]*?<\/article>|<a class="work-card"[^>]*>[\s\S]*?<\/a>/g)].map(match => match[0]);
for (const [slug, title] of [['devsummary-desktop', 'DevSummary Desktop'], ['devsummary', 'DevSummary'], ['papersfly', 'papersfly'], ['command-king', 'Command King'], ['launchstack', 'LaunchStack']]) {
  const card = projectCards.find(card => card.includes(`href="/projects/${slug}/"`));
  assert.ok(card, `${slug}: project card links to detail page`);
  assert.ok(card.includes(title) && card.includes(`alt="${title} logo"`), `${slug}: title and original logo on card`);
  const detail = read(`dist/projects/${slug}/index.html`);
  assert.ok(detail.includes(`alt="${title} logo"`), `${slug}: logo on detail page`);
  if (slug !== 'devsummary') {
    assert.ok(detail.includes(`https://github.com/VirtualPirate/${slug}`), `${slug}: source repository`);
    assert.ok(detail.includes('class="project-image"'), `${slug}: screenshot on detail page`);
  }
  if (slug === 'papersfly') {
    assert.equal((card.match(/class="card-url"/g) || []).length, 2, 'Papersfly card has website and source links');
    for (const href of ['https://papersfly.com', 'https://github.com/VirtualPirate/papersfly']) {
      assert.ok(card.includes(`href="${href}"`) && detail.includes(`href="${href}"`), `Papersfly: ${href} on card and detail page`);
    }
  }
  if (slug.startsWith('devsummary')) {
    assert.ok(card.includes('An AI-powered Git reporting app for founders and managers.'), `${slug}: requested card description`);
    const links = slug === 'devsummary-desktop' ? ['https://github.com/VirtualPirate/devsummary-desktop', 'https://devsummary.com/desktop'] : ['https://devsummary.com'];
    assert.match(card, /^<article\b/, `${slug}: independent links without nested anchors`);
    assert.equal((card.match(/class="card-url"/g) || []).length, links.length, `${slug}: expected number of card links`);
    for (const href of links) {
      assert.ok(card.includes(`href="${href}"`) && detail.includes(`href="${href}"`), `${slug}: ${href} on card and detail page`);
    }
    if (slug === 'devsummary') {
      assert.ok(card.includes('Private repo'), 'Web app card identifies its private repository');
      assert.doesNotMatch(card + detail, /href="https:\/\/github\.com\//, 'Web app has no public repository link');
    }
  }
}
const titles = new Set();
const canonicals = new Set();
const sitemap = read('dist/sitemap.xml');
for (const name of pages) {
  const html = read(`dist/${name}`);
  assert.doesNotMatch(html, /Jordan Parker|Example Labs|Sample Systems|hello@example\.com|https:\/\/(?:github\.com\/example|example\.com)|dummy article|Sample post/, `${name}: no placeholder identity or content`);
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `${name}: one primary heading`);
  assert.match(html, /<html lang="en"/, `${name}: language`);
  assert.match(html, /id="main"/, `${name}: skip-link target`);
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  assert.ok(title && !titles.has(title), `${name}: unique title`);
  titles.add(title);
  const canonical = html.match(/rel="canonical" href="([^"]+)"/)?.[1];
  assert.ok(canonical?.startsWith(siteUrl) && !canonicals.has(canonical), `${name}: unique absolute canonical`);
  canonicals.add(canonical);
  for (const tag of ['description', 'robots', 'twitter:card', 'twitter:image']) assert.ok(html.includes(`name="${tag}"`), `${name}: ${tag}`);
  for (const tag of ['og:title', 'og:description', 'og:url', 'og:image']) assert.ok(html.includes(`property="${tag}"`), `${name}: ${tag}`);
  const socialImage = new URL(html.match(/property="og:image" content="([^"]+)"/)[1]);
  assert.ok(socialImage.pathname.endsWith('.png') && existsSync(new URL(socialImage.pathname.slice(1), dist)), `${name}: valid social image`);
  const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.equal(schema['@context'], 'https://schema.org');
  assert.ok(schema['@graph'].some(item => item['@type'] === 'Person'));
  const article = name.startsWith('blog/') && name !== 'blog/index.html' || name === 'blog-post/index.html';
  if (article) assert.ok(schema['@graph'].some(item => item['@type'] === 'BlogPosting' && item.datePublished && item.author));
  if (name === '404.html' || name.startsWith('grid-shapes/') || name.startsWith('og/')) {
    assert.match(html, /content="noindex, follow"/);
    assert.ok(!sitemap.includes(`<loc>${canonical}</loc>`));
  } else {
    assert.ok(sitemap.includes(`<loc>${canonical}</loc>`), `${name}: sitemap entry`);
    assert.equal((html.match(/aria-current="page"/g) || []).length, 1, `${name}: active navigation`);
  }
  if (name.startsWith('blog/') || name.startsWith('blog-post/')) {
    assert.equal((html.match(/<script\b/g) || []).length, name === 'blog/index.html' ? 3 : 1, `${name}: only the blog listing needs client pagination and grid animation`);
    assert.equal(html.includes('class="background-grid"'), name === 'blog/index.html', `${name}: animated background only on the blog listing`);
  }
  for (const [, path] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (/^[a-z]+:/i.test(path)) continue;
    const resolved = new URL(path, new URL(canonical));
    let targetPath = decodeURIComponent(resolved.pathname).slice(1);
    if (targetPath.endsWith('/') || !targetPath) targetPath += 'index.html';
    const target = new URL(path.startsWith('#') ? name : targetPath, dist);
    assert.ok(existsSync(fileURLToPath(target)), `${name}: broken local asset or link ${path}`);
    if (resolved.hash) assert.ok(readFileSync(target, 'utf8').includes(`id="${resolved.hash.slice(1)}"`), `${name}: missing anchor ${path}`);
  }
  for (const [, attributes] of html.matchAll(/<img\b([^>]+)>/g)) {
    assert.match(attributes, /alt="[^"]+"/, `${name}: image description`);
    assert.match(attributes, /width="\d+"/, `${name}: image width prevents layout shift`);
    assert.match(attributes, /height="\d+"/, `${name}: image height prevents layout shift`);
    assert.match(attributes, /srcset="[^"]+"/, `${name}: responsive images`);
  }
}
assert.equal((sitemap.match(/<loc>/g) || []).length, pages.filter(name => name !== '404.html' && !name.startsWith('grid-shapes/') && !name.startsWith('og/')).length);
const ogPreviews = read('dist/og/index.html');
const projectSlugs = [...read('src/data/portfolio.ts').matchAll(/slug: '([^']+)'/g)].map(match => match[1]);
assert.equal((ogPreviews.match(/data-og-card=/g) || []).length, projectSlugs.length + 1, 'Review gallery includes the website and every project');
for (const slug of ['site', ...projectSlugs]) {
  assert.ok(ogPreviews.includes(`href="/og/${slug}/"`), `${slug}: full-size preview link`);
  const preview = read(`dist/og/${slug}/index.html`);
  assert.equal((preview.match(/data-og-card=/g) || []).length, 1, `${slug}: one exportable card`);
  assert.ok(preview.includes(`data-og-card="${slug}"`), `${slug}: correct card`);
  assert.doesNotMatch(preview, /<script[^>]*src=/, `${slug}: deterministic preview without client scripts`);
}
assert.ok(read('dist/robots.txt').includes(`Sitemap: ${new URL('/sitemap.xml', siteUrl).href}`));
const jsFiles = readdirSync(new URL('_astro/', dist)).filter(name => name.endsWith('.js'));
assert.ok(jsFiles.reduce((total, name) => total + statSync(new URL(`_astro/${name}`, dist)).size, 0) < 10000, 'Keep all site JavaScript under 10 KB uncompressed');

// Exercise the actual browser scripts without introducing a test framework.
const work = read('dist/work/index.html');
let focused;
const element = id => ({
  id, attrs: {}, events: {},
  setAttribute(name, value) { this.attrs[name] = value; },
  addEventListener(name, callback) { this.events[name] = callback; },
  focus() { focused = this; },
  click() { this.events.click({ preventDefault() {} }); },
});
const tabs = [...work.matchAll(/<a id="(tab-[^"]+)" href="(#[^"]+)"/g)]
  .map(([, id, hash]) => Object.assign(element(id), { hash }));
assert.equal(tabs.length, 3);
const panels = tabs.map(tab => element(tab.hash.slice(1)));
for (const panel of panels) assert.ok(work.includes(`id="${panel.id}"`));
const tablist = Object.assign(element('tabs'), { querySelectorAll: () => tabs });
const location = { hash: '' };
const events = {};
runInNewContext(read('src/scripts/tabs.js'), {
  document: {
    documentElement: { classList: { add() {} } },
    querySelector: selector => selector === '.work-tabs' ? tablist : panels.find(panel => `#${panel.id}` === selector),
  },
  location,
  history: { pushState(_state, _title, hash) { location.hash = hash; } },
  window: { addEventListener(name, callback) { events[name] = callback; } },
});
function selected(index) {
  tabs.forEach((tab, i) => {
    assert.equal(tab.attrs['aria-selected'], String(i === index));
    assert.equal(tab.tabIndex, i === index ? 0 : -1);
    assert.equal(panels[i].hidden, i !== index);
    assert.equal(tab.attrs['aria-controls'], panels[i].id);
  });
}
selected(0);
tabs.forEach((tab, i) => { tab.click(); selected(i); assert.equal(location.hash, tab.hash); });
for (const [from, key, to] of [[2, 'ArrowRight', 0], [0, 'ArrowLeft', 2], [2, 'Home', 0], [0, 'End', 2]]) {
  tabs[from].events.keydown({ key, preventDefault() {} });
  selected(to);
  assert.equal(focused, tabs[to]);
}
location.hash = '#side-products'; events.hashchange(); selected(1);
location.hash = '#experience'; events.popstate(); selected(0);
location.hash = '#unknown'; events.hashchange(); selected(0);
tabs[0].events.keydown({ key: 'Tab', preventDefault() { assert.fail('Tab must keep its native behavior'); } });

{
  assert.doesNotMatch(work + read('dist/sitemap.xml') + read('dist/resume.txt'), /opengraph-viewer|opengraph-api|AZCreation|az-creation/i, 'Removed projects must stay out of listings, sitemap, and résumé');
  for (const slug of ['opengraph-viewer', 'opengraph-api', 'az-creation']) assert.ok(!pages.includes('projects/' + slug + '/index.html'));
  function listing(html, markup, label) {
    const cards = markup.map((card, index) => Object.assign(element(String(index)), {
      dataset: { tags: (card.match(/data-tags="([^"]+)"/)?.[1] || '[]').replace(/&(?:quot|#34);/g, '"') },
    }));
    const filter = html.includes('<select data-tag-filter>') ? Object.assign(element('tag-filter'), { value: '' }) : null;
    const controls = { hidden: true }, pagination = { hidden: true }, status = {};
    const previous = element('previous'), next = element('next');
    return {
      dataset: { pageSize: html.match(/data-page-size="(\d+)"/)[1], itemLabel: label },
      cards, filter, controls, pagination, status, previous, next,
      querySelector(selector) { return { '[data-list-items]': { children: cards }, '[data-previous]': previous, '[data-next]': next, '[data-pagination-status]': status, '[data-tag-filter]': filter, '[data-filter-controls]': filter ? controls : null, '.pagination': pagination }[selector]; },
    };
  }
  const projects = listing(work, projectCards.filter(card => /href="\/projects\//.test(card)), 'projects');
  const blogHtml = read('dist/blog/index.html');
  const articles = [...blogHtml.matchAll(/<a class="work-card blog-entry"[^>]*>[\s\S]*?<\/a>/g)].map(match => match[0]);
  const blog = listing(blogHtml, articles, 'articles');
  const longBlog = listing(blogHtml, [...articles, ...articles, ...articles.slice(0, 1)].slice(0, 9), 'articles');
  const empty = listing(blogHtml, [], 'articles');
  assert.match(work, /<option value="" selected>All tags<\/option>/, 'The native tag dropdown defaults to all projects');
  assert.equal(projects.cards.length, 6);
  assert.equal(blog.cards.length, 5);
  assert.ok(projects.cards.every(card => card.hidden === undefined), 'Every card is available before JavaScript runs');
  runInNewContext(read('src/scripts/lists.js'), { document: { querySelectorAll: () => [projects, blog, longBlog, empty] } });
  const visible = list => list.cards.filter(card => !card.hidden).map(card => card.id);
  assert.deepEqual(visible(projects), ['0', '1', '2', '3']);
  assert.ok(projects.previous.disabled && !projects.next.disabled && !projects.controls.hidden && !projects.pagination.hidden);
  projects.next.click();
  assert.deepEqual(visible(projects), ['4', '5']);
  assert.match(projects.status.textContent, /5–6 of 6 projects · Page 2 of 2/);
  assert.ok(projects.next.disabled);
  projects.next.click();
  assert.deepEqual(visible(projects), ['4', '5'], 'Pagination must stay within its last page');
  projects.filter.value = 'AI';
  projects.filter.events.change();
  assert.deepEqual(visible(projects), ['1', '2'], 'Filtering on page two must reset to page one');
  assert.equal(projects.filter.value, 'AI');
  assert.ok(projects.previous.disabled && projects.next.disabled);
  projects.filter.value = 'API'; projects.filter.events.change();
  assert.deepEqual(visible(projects), ['5'], 'Tag matching is exact');
  assert.match(projects.status.textContent, /1–1 of 1 project · Page 1 of 1/);
  projects.filter.value = ''; projects.filter.events.change();
  assert.deepEqual(visible(projects), ['0', '1', '2', '3']);
  projects.next.click(); projects.previous.click();
  assert.deepEqual(visible(projects), ['0', '1', '2', '3']);
  assert.equal(visible(blog).length, 4, 'Blog pagination is independent of project filtering');
  assert.ok(blog.previous.disabled && !blog.next.disabled && !blog.pagination.hidden);
  blog.next.click();
  assert.deepEqual(visible(blog), ['4'], 'The additional article appears on page two');
  blog.previous.click();
  longBlog.next.click();
  assert.deepEqual(visible(longBlog), ['4', '5', '6', '7']);
  longBlog.next.click();
  assert.deepEqual(visible(longBlog), ['8']);
  assert.ok(longBlog.next.disabled);
  longBlog.previous.click();
  assert.deepEqual(visible(longBlog), ['4', '5', '6', '7']);
  assert.deepEqual(visible(empty), []);
  assert.ok(empty.previous.disabled && empty.next.disabled);
  assert.match(empty.status.textContent, /0–0 of 0 articles · Page 1 of 1/);
}

const glowScript = read('src/scripts/grid.js').replace(/^import .*?;\n/, '');
const css = read('src/styles/grid.css');
const glow = {};
const pointerEvents = {};
const grid = {
  clientWidth: 800, clientHeight: 1100,
  getBoundingClientRect() { return { left: -viewport.scrollX, top: -viewport.scrollY }; },
  replaceChildren(fragment) { this.children = fragment?.children || []; },
};
const motion = { matches: true, addEventListener(name, callback) { pointerEvents[name] = callback; } };
const pointer = { matches: true, addEventListener(_name, callback) { pointerEvents.pointerChange = callback; } };
const frames = new Map();
let nextFrame = 1, resizeGrid, gridMarkup;
const viewport = { innerWidth: 800, innerHeight: 600, scrollX: 0, scrollY: 0, hidden: false, addEventListener(name, callback) { pointerEvents[name] = callback; } };
const randomValues = Array.from({ length: 8 }, (_, index) => [0.1, index / 8, 0.9]).flat();
let randomIndex = 0;
runInNewContext(glowScript, {
  technologies,
  Math: Object.assign(Object.create(Math), { random: () => randomValues[randomIndex++ % randomValues.length] }),
  matchMedia: query => query === '(hover: hover) and (pointer: fine)' ? pointer : motion,
  requestAnimationFrame(callback) { const id = nextFrame++; frames.set(id, callback); return id; },
  cancelAnimationFrame(id) { frames.delete(id); },
  document: {
    get hidden() { return viewport.hidden; },
    body: { style: { setProperty(name, value) { glow[name] = value; } }, classList: { add() {}, remove() {} }, insertAdjacentHTML(_position, markup) { gridMarkup = markup; } },
    querySelector: () => grid,
    createDocumentFragment: () => ({ children: [], append(cell) { this.children.push(cell); } }),
    createElement: () => ({ style: { setProperty(name, value) { this[name] = value; } } }),
    addEventListener(name, callback) { pointerEvents[name] = callback; },
    documentElement: { addEventListener(name, callback) { pointerEvents[name] = callback; } },
  },
  window: viewport,
  ResizeObserver: class {
    constructor(callback) { resizeGrid = callback; }
    observe(target) { assert.equal(target, grid, 'Observe the full-page grid to handle tab and content height changes'); }
  },
});
assert.ok(read('dist/index.html').includes('class="background-grid" aria-hidden="true"'), 'Astro renders the decorative grid');
gridMarkup = read('src/components/TechSymbols.astro');
assert.equal((gridMarkup.match(/<symbol id="tech-/g) || []).length, 8, 'All logo symbols are rendered statically');
const flushFrame = (time = 0) => { const callbacks = [...frames.values()]; frames.clear(); callbacks.forEach(callback => callback(time)); };
const lift = cell => Number(cell.style['--lift'] || 0);
const movePointer = () => pointerEvents.pointermove({ pointerType: 'mouse', clientX: 240, clientY: 180 });
assert.ok(grid.children.length > 100, 'Grid cells must cover the viewport');
assert.ok(grid.children.some(cell => Number.parseInt(cell.style.top) >= grid.clientHeight - 48), 'Grid cells must cover the full page beyond the viewport');
const firstRow = grid.children.filter(cell => cell.style.top === '0px');
const secondRow = grid.children.filter(cell => cell.style.top === '48px');
assert.deepEqual(firstRow.map(cell => cell.style.left), secondRow.map(cell => cell.style.left), 'Square grid columns must align across rows');
assert.equal(firstRow[1].style.left, '48px', 'Grid cells must use equal horizontal and vertical spacing');
const logos = grid.children.map(cell => cell.innerHTML);
assert.ok(logos.some(Boolean) && logos.some(logo => !logo), 'Only a random subset of cells should contain logos');
const logoCells = grid.children.filter(cell => cell.innerHTML);
assert.ok(logoCells.length < grid.children.length * 0.15, 'Logos must stay sparse');
for (const [index, cell] of logoCells.entries()) {
  for (const other of logoCells.slice(index + 1)) assert.ok(Math.hypot(parseInt(cell.style.left) - parseInt(other.style.left), parseInt(cell.style.top) - parseInt(other.style.top)) >= 96, 'Logos must have at least one empty cell between them');
}
const logoIds = [...new Set(logos.filter(Boolean).map(logo => logo.match(/href="#([^"]+)"/)[1]))];
assert.equal(logoIds.length, 8, 'Random selection must cover all eight technologies');
for (const id of logoIds) assert.ok(gridMarkup.includes(`<symbol id="${id}"`), `${id}: logo symbol must exist`);
for (const logo of logos.filter(Boolean)) assert.match(logo, /aria-hidden="true" focusable="false"/, 'Logos must stay decorative');
const logoColors = new Set(logos.filter(Boolean).map(logo => logo.match(/color="(#[a-f0-9]{6})"/)[1]));
assert.equal(logoColors.size, 8, 'Each technology must have a distinct color');
assert.ok(!logoColors.has('#ffffff') && !logoColors.has('#000000'), 'Logo colors must remain visible and colored');
assert.match(css, /\.grid-logo \{[^}]*fill: none;[^}]*stroke: currentColor;[^}]*opacity: clamp\(0, calc\(\(var\(--lift\) - 0\.08\) \* 1\.7\), 0\.95\);[^}]*filter: drop-shadow\(0 0 3px currentColor\) drop-shadow\(0 0 8px currentColor\)/, 'Outline logos and their glows must use their technology colors only on highlighted cells');
movePointer();
movePointer();
assert.equal(frames.size, 1, 'Pointer events must share one animation frame');
flushFrame();
assert.deepEqual(grid.children.map(cell => cell.innerHTML), logos, 'Pointer movement must keep random logos stable');
assert.equal(glow['--cursor-x'], '240px');
assert.equal(glow['--cursor-y'], '180px');
assert.equal(glow['--grid-active'], '1');
assert.ok(Math.max(...grid.children.map(lift)) > 0.6, 'Nearby grid cells must rise');
assert.equal(lift(grid.children[0]), 0, 'Distant grid cells must stay flat');
const centeredCell = grid.children.find(cell => cell.style.left === '192px' && cell.style.top === '192px');
pointerEvents.pointermove({ pointerType: 'mouse', clientX: 216, clientY: 216 });
flushFrame();
assert.equal(lift(centeredCell), 1, 'The grid cell under the cursor must reach full elevation');
viewport.scrollY = 480;
pointerEvents.scroll();
pointerEvents.scroll();
assert.equal(frames.size, 1, 'Scroll events must share one animation frame');
flushFrame();
const scrolledCell = grid.children.find(cell => cell.style.left === '192px' && cell.style.top === '672px');
assert.equal(lift(scrolledCell), 1, 'Scrolling must highlight the grid cell under a stationary cursor');
assert.equal(lift(centeredCell), 0, 'The previous grid cell must settle after scrolling away');
assert.equal(glow['--cursor-y'], '696px', 'The glow must use page coordinates after scrolling');
viewport.scrollX = 48;
pointerEvents.pointermove({ pointerType: 'mouse', clientX: 216, clientY: 216 });
flushFrame();
assert.equal(glow['--cursor-x'], '264px');
assert.equal(lift(grid.children.find(cell => cell.style.left === '240px' && cell.style.top === '672px')), 1, 'Pointer movement must account for both scroll offsets');
viewport.scrollX = viewport.scrollY = 0;
pointerEvents.scroll(); flushFrame();
pointerEvents.pointermove({ pointerType: 'mouse', clientX: 780, clientY: 20 });
flushFrame();
assert.equal(lift(centeredCell), 0, 'Grid cells must settle when the cursor moves away');
for (const hide of [pointerEvents.pointerleave, pointerEvents.blur, () => pointerEvents.pointermove({ pointerType: 'touch' })]) {
  movePointer();
  flushFrame();
  movePointer();
  hide();
  assert.equal(glow['--grid-active'], '0');
  assert.ok(grid.children.every(cell => lift(cell) === 0));
  assert.equal(frames.size, 0, 'Leaving must cancel pending animation');
}
movePointer(); flushFrame();
motion.matches = false; pointerEvents.change();
movePointer(); flushFrame();
assert.equal(glow['--grid-active'], '0');
assert.ok(grid.children.every(cell => lift(cell) === 0), 'Reduced motion must keep grid cells still');
assert.equal(grid.children.length, 0, 'Reduced motion must avoid decorative DOM entirely');
motion.matches = true; pointerEvents.change();
const count = grid.children.length;
viewport.innerWidth = 1200; viewport.innerHeight = 900;
grid.clientWidth = 1200; grid.clientHeight = 1600; resizeGrid();
assert.ok(grid.children.length > count, 'Grid cells must rebuild when the viewport grows');
assert.ok(grid.children.every(cell => lift(cell) === 0));
grid.clientHeight = 2400; resizeGrid();
assert.ok(grid.children.some(cell => Number.parseInt(cell.style.top) >= 2352), 'A taller work tab or loaded content must get full grid coverage without a window resize');
grid.clientHeight = 600; resizeGrid();
assert.ok(grid.children.every(cell => Number.parseInt(cell.style.top) < 648), 'The grid must shrink when switching to a shorter tab');

pointer.matches = false;
viewport.innerWidth = grid.clientWidth = 390;
viewport.innerHeight = 844;
grid.clientHeight = 2400;
resizeGrid();
assert.ok(grid.children.length > 0, 'Touch devices need real grid cells for elevation');
assert.equal(frames.size, 1, 'Mobile elevation must start without a pointer event');
flushFrame(0);
assert.ok(grid.children.some(cell => lift(cell) > 0.6), 'Mobile grid cells must rise automatically');
assert.equal(glow['--grid-active'], '1');
const mobileLifts = grid.children.map(lift);
const mobileLogos = grid.children.map(cell => cell.innerHTML);
flushFrame(6000);
assert.notDeepEqual(grid.children.map(lift), mobileLifts, 'Automatic elevation must move across the grid');
assert.deepEqual(grid.children.map(cell => cell.innerHTML), mobileLogos, 'Animation must keep logos stable');
pointerEvents.pointermove({ pointerType: 'touch', clientX: 10, clientY: 10 });
pointerEvents.pointerleave();
assert.equal(frames.size, 1, 'Touch events must not interrupt or duplicate the animation');
viewport.scrollY = 1000;
pointerEvents.scroll();
flushFrame(6000);
assert.ok(grid.children.some(cell => lift(cell) > 0.6 && parseInt(cell.style.top) >= 1000), 'Mobile animation must follow the visible viewport after scrolling');
assert.ok(grid.children.filter(cell => parseInt(cell.style.top) < 800).every(cell => lift(cell) === 0), 'Offscreen cells must settle after scrolling');
resizeGrid();
assert.equal(frames.size, 1, 'Resizing must keep a single mobile animation loop');
viewport.hidden = true;
pointerEvents.visibilitychange();
assert.equal(frames.size, 0, 'Hidden pages must pause automatic elevation');
assert.ok(grid.children.every(cell => lift(cell) === 0));
viewport.hidden = false;
pointerEvents.visibilitychange();
pointerEvents.focus();
assert.equal(frames.size, 1, 'Returning to the page must resume only one animation loop');
flushFrame(8000);
pointerEvents.blur();
assert.equal(frames.size, 0, 'An unfocused page must pause automatic elevation');
pointerEvents.focus();
assert.equal(frames.size, 1);
motion.matches = false; pointerEvents.change();
pointerEvents.focus();
assert.equal(grid.children.length, 0, 'Reduced motion must keep the static mobile background');
assert.equal(frames.size, 0, 'Reduced motion must stop the mobile animation');
motion.matches = true; pointerEvents.change();
assert.equal(frames.size, 1, 'Turning motion back on must restart mobile elevation');
pointer.matches = true; pointerEvents.pointerChange();
assert.equal(frames.size, 0, 'Switching to a fine pointer must stop automatic elevation');
movePointer(); flushFrame();
assert.ok(grid.children.some(cell => lift(cell) > 0.6), 'Desktop cursor elevation must still work after switching input devices');

{
const html = read('dist/grid-shapes/index.html');
const gridScript = read('src/components/TechSymbols.astro');
const script = read('src/scripts/shapes.js').replace(/^import .*?;\n/, '');
const shapeMotion = { matches: false, addEventListener(_name, callback) { motionChanged = callback; } };
const element = () => ({
  events: {}, attrs: {}, style: { setProperty(name, value) { this[name] = value; } },
  addEventListener(name, callback) { this.events[name] = callback; },
  setAttribute(name, value) { this.attrs[name] = value; },
  focus() { this.events.focus?.(); },
});
function scene() {
  const svg = Object.assign(element(), {
    clientWidth: 380, clientHeight: 270,
    getBoundingClientRect() { return { left: 50, top: 80 }; },
    querySelectorAll() { return this.tiles; },
    querySelector() { return this.light; },
  });
  Object.defineProperty(svg, 'innerHTML', {
    set(markup) {
      this.markup = markup;
      this.tiles = [...markup.matchAll(/<g transform="translate\(([-\d.]+) ([-\d.]+)\)"><g class="tile">/g)]
        .map(([, x, y]) => Object.assign(element(), { x: Number(x), y: Number(y) }));
      this.light = element();
    },
  });
  return svg;
}
const demos = [...html.matchAll(/<section class="demo" data-shape="([^"]+)">[\s\S]*?<h2>([^<]+)<\/h2>/g)]
  .map(([, shape, name]) => {
    const svg = scene(), button = element();
    return { dataset: { shape }, svg, button, querySelector(selector) { return selector === '.scene' ? svg : selector === 'button' ? button : { textContent: name }; } };
  });
assert.equal(demos.length, 6);
assert.equal(new Set(demos.map(demo => demo.dataset.shape)).size, 6);
const fullScene = scene(), close = element(), title = {};
const dialog = Object.assign(element(), {
  open: false,
  querySelector(selector) { return selector === '.scene' ? fullScene : close; },
  showModal() { this.open = true; },
  close() { this.open = false; this.events.close(); },
});
const allScenes = [...demos.map(demo => demo.svg), fullScene];
const windowEvents = {};
const frames = new Map();
let frameId = 0, resized, motionChanged;
runInNewContext(script, {
  technologies,
  document: {
    querySelector(selector) { return selector === 'dialog' ? dialog : title; },
    querySelectorAll(selector) { return selector === '.demo' ? demos : allScenes; },
  },
  window: { addEventListener(name, callback) { windowEvents[name] = callback; } },
  matchMedia: () => shapeMotion,
  requestAnimationFrame(callback) { frames.set(++frameId, callback); return frameId; },
  ResizeObserver: class { constructor(callback) { resized = callback; } observe() {} },
});
const flush = () => { const callbacks = [...frames.values()]; frames.clear(); callbacks.forEach(callback => callback()); };
const lift = tile => Number(tile.style['--lift'] || 0);
const clear = svg => { assert.ok(svg.tiles.every(tile => lift(tile) === 0)); assert.equal(svg.light.style['--active'], 0); };
const hit = svg => {
  const tile = svg.tiles.find(tile => tile.x > 60 && tile.x < svg.clientWidth - 60 && tile.y > 60 && tile.y < svg.clientHeight - 60);
  const event = { pointerType: 'mouse', clientX: tile.x + 50, clientY: tile.y + 80 };
  svg.events.pointermove(event);
  svg.events.pointermove(event);
  assert.equal(frames.size, 1, 'Repeated pointer events must share a frame');
  flush();
  assert.equal(lift(tile), 1, 'The tile centered under the cursor must lift fully');
  assert.equal(svg.light.attrs.cx, tile.x, 'Cursor light must use local coordinates');
  assert.equal(svg.light.attrs.cy, tile.y);
  return event;
};
for (const demo of demos) {
  const svg = demo.svg;
  assert.ok(svg.tiles.length > 20, 'Each preview must be filled with tiles');
  assert.equal(svg.attrs.viewBox, '0 0 380 270');
  const markup = svg.markup;
  for (const [, symbol] of markup.matchAll(/href="#([^"]+)"/g)) assert.ok(gridScript.includes(`id="${symbol}"`));
  hit(svg);
  assert.equal(svg.markup, markup, 'Pointer movement must not shuffle logos');
  svg.events.pointerleave({ pointerType: 'mouse' }); flush(); clear(svg);
  svg.events.pointermove({ pointerType: 'touch', clientX: 100, clientY: 100 });
  assert.equal(frames.size, 0, 'Touch scrolling must not drag the highlight');
  svg.events.pointerdown({ pointerType: 'touch', clientX: 230, clientY: 215 }); flush();
  assert.ok(svg.tiles.some(tile => lift(tile) > .5), 'Tapping must show the effect');
  windowEvents.blur(); flush(); clear(svg);
  svg.focus(); flush();
  assert.ok(svg.tiles.some(tile => lift(tile) > .5), 'Keyboard focus must show the effect');
  svg.events.blur(); flush(); clear(svg);
  demo.button.events.click(); flush();
  assert.ok(dialog.open);
  assert.ok(title.textContent.endsWith('homepage preview'));
  hit(fullScene);
  close.events.click(); flush();
  assert.equal(dialog.open, false); clear(fullScene);
}
const svg = demos[0].svg, count = svg.tiles.length;
svg.clientWidth = 800; svg.clientHeight = 600;
resized([{ target: svg }]);
assert.ok(svg.tiles.length > count, 'Resizing must cover the new area');
assert.equal(svg.attrs.viewBox, '0 0 800 600');
hit(svg); shapeMotion.matches = true; motionChanged(); flush(); clear(svg);
svg.events.pointermove({ pointerType: 'mouse', clientX: 200, clientY: 200 });
svg.focus(); flush(); clear(svg);
assert.equal(frames.size, 0, 'Reduced motion must ignore pointer and keyboard effects');
}
console.log(`Passed: ${pages.length} static pages, ${projectSlugs.length + 1} OG previews, links/anchors, SEO/schema/sitemap, responsive images, JS budget, keyboard tabs/history, project tags and list pagination, full-page grid, six shape previews, and touch/reduced-motion behavior.`);
