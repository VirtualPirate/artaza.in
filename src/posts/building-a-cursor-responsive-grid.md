---
slug: building-a-cursor-responsive-grid
title: Building a cursor-responsive grid
description: A sample blog-post layout about building an interactive grid with CSS and a little JavaScript.
date: '2026-10-06'
dateLabel: October 6, 2026
readingTime: 3 min read
preview: true
lead: 'A quiet background that comes to life as you move. Here’s how the grid behind this portfolio works, from a few CSS lines to a little cursor tracking.'
tags:
  - { label: CSS, color: blue }
  - { label: JavaScript, color: yellow }
  - { label: Interaction design, color: purple }
sections:
  - { id: start-with-css, title: Start with CSS }
  - { id: follow-the-cursor, title: Follow the cursor }
  - { id: keep-it-quiet, title: Keep it quiet }
---

<p>A portfolio is mostly words and links. I wanted the background to give it a little depth without getting in the way of either. The result is a grid that stays faint until the cursor moves nearby: cells lift, their edges catch the light, and a few technology logos appear.</p>
<p>The useful constraint is that the page still needs to work when none of that happens. The writing comes first. The effect is an extra layer.</p>

<h2 id="start-with-css">Start with CSS</h2>
<p>The resting grid is just two perpendicular gradients. Each draws a one-pixel line, then leaves the rest of the cell transparent. Repeating them every 48 pixels gives the page its square pattern.</p>
<figure class="post-code">
  <figcaption>CSS · The static grid</figcaption>
  <pre tabindex="0" aria-label="CSS example for the static grid"><code><span class="code-selector">.grid-page</span> {
  <span class="code-property">background-image</span>:
    linear-gradient(<span class="code-value">#ffffff0a</span> 1px, transparent 1px),
    linear-gradient(90deg, <span class="code-value">#ffffff0a</span> 1px, transparent 1px);
  <span class="code-property">background-size</span>: <span class="code-value">48px 48px</span>;
}</code></pre>
</figure>
<p>This also serves as the fallback. If JavaScript is unavailable, there’s still a complete page with the same visual rhythm.</p>

<h2 id="follow-the-cursor">Follow the cursor</h2>
<p>For the interactive layer, each cell gets a value called <code>--lift</code>. It ranges from zero to one, based on the distance between the cell’s center and the cursor. Nearby cells rise; distant cells stay flat.</p>
<figure class="post-code">
  <figcaption>JavaScript · Distance becomes elevation</figcaption>
  <pre tabindex="0" aria-label="JavaScript example for cursor proximity"><code><span class="code-keyword">const</span> distance = Math.hypot(x - cell.x, y - cell.y);
<span class="code-keyword">const</span> lift = Math.max(0, 1 - distance / 180) ** 2;

cell.element.style.setProperty(<span class="code-value">'--lift'</span>, lift.toFixed(3));</code></pre>
</figure>
<p>Squaring the value makes the effect fall away more quickly at the edges. CSS uses that single value for the upward translation, the highlighted border, and the shadow beneath each cell.</p>
<p>Pointer movement schedules an update with <code>requestAnimationFrame</code>. Several events can arrive before the browser draws again, so they share one pending update. Scrolling also updates the cursor’s position relative to the page.</p>

<blockquote><p>One proximity value is enough to make the lift, light, and logos feel like parts of the same effect.</p></blockquote>

<h2 id="keep-it-quiet">Keep it quiet</h2>
<p>The visual effect works best when most of the page stays still. A few choices keep it in the background:</p>
<ul>
  <li><strong>Leave space between logos.</strong> They only appear on a sparse selection of cells, with at least one empty cell between them.</li>
  <li><strong>Keep the resting lines faint.</strong> The contrast increases near the cursor, where it has a reason to be visible.</li>
  <li><strong>Respect the reader’s preferences.</strong> Touch input and reduced-motion settings leave the grid still.</li>
</ul>
<aside class="post-note" aria-label="Accessibility note">
  <strong>The grid is decoration.</strong>
  <p>It stays out of the accessibility tree, doesn’t intercept clicks, and never carries information you need to read the page.</p>
</aside>
<p>That’s the whole idea: a small detail that rewards curiosity while leaving the content easy to read.</p>
