---
slug: how-to-use-prismjs-in-react-js
title: How to use PrismJS in ReactJS
description: Adding PrismJS themes, language support, and syntax highlighting to React.
date: '2023-01-14'
dateLabel: January 14, 2023
readingTime: 1 min read
lead: An overview of my 2023 guide to highlighting code in React with PrismJS, using C++ as the example language.
tags:
  - { label: React, color: blue }
  - { label: Prism.js, color: purple }
  - { label: JavaScript, color: yellow }
sections:
  - { id: load-prism, title: Load Prism and its theme }
  - { id: add-language-support, title: Add language support }
  - { id: highlight-after-render, title: Highlight after rendering }
---
<h2 id="load-prism">Load Prism and its theme</h2>
<p>Install PrismJS in an existing React project, then import Prism and a theme stylesheet. The original example uses the Okaidia theme.</p>
<figure class="post-code">
  <figcaption>JavaScript · Prism and theme imports</figcaption>
  <pre tabindex="0" aria-label="Import PrismJS and the Okaidia theme"><code><span class="code-keyword">import</span> Prism <span class="code-keyword">from</span> <span class="code-value">'prismjs'</span>;
<span class="code-keyword">import</span> <span class="code-value">'prismjs/themes/prism-okaidia.min.css'</span>;</code></pre>
</figure>
<h2 id="add-language-support">Add language support</h2>
<p>Load the C language component before the C++ component, since C++ highlighting depends on it. The guide also uses Prism’s normalize-whitespace plugin to tidy the code.</p>
<h2 id="highlight-after-render">Highlight after rendering</h2>
<p>Place the source inside <code>pre</code> and <code>code</code> elements, using <code>className="language-cpp"</code> on the code element. Call <code>Prism.highlightAll()</code> from React’s <code>useEffect</code> after the component renders so Prism can highlight the DOM.</p>
<aside class="post-note" aria-label="Publication note"><strong>From the archive.</strong><p>Originally published January 14, 2023. The original guide also covers using this approach with Next.js.</p></aside>
