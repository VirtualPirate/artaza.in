---
slug: download-instagram-reels-by-scraping-using-nodejs
title: Download Instagram reels by scraping using NodeJS
description: Extracting direct video links with Puppeteer and Cheerio.
date: '2023-05-12'
dateLabel: May 12, 2023
readingTime: 1 min read
lead: An overview of my 2023 walkthrough for extracting an Instagram reel’s video URL with Puppeteer and Cheerio.
tags:
  - { label: Node.js, color: green }
  - { label: Puppeteer, color: purple }
  - { label: Cheerio, color: yellow }
sections:
  - { id: render-the-page, title: Render the page }
  - { id: extract-the-video, title: Extract the video URL }
---
<p>The original approach combines browser rendering with HTML parsing. Puppeteer runs the page’s JavaScript; Cheerio reads the resulting markup.</p>
<h2 id="render-the-page">Render the page</h2>
<p>Install the two packages, launch a headless browser, and navigate to the reel. Wait for the video element before reading the HTML with <code>page.content()</code>. A simple HTTP request misses the video element when it is added by JavaScript.</p>
<figure class="post-code">
  <figcaption>npm · Dependencies</figcaption>
  <pre tabindex="0" aria-label="Install Puppeteer and Cheerio"><code>npm install puppeteer cheerio</code></pre>
</figure>
<h2 id="extract-the-video">Extract the video URL</h2>
<p>Load the rendered HTML into Cheerio, find the video element, and read its <code>src</code> attribute. The result is the direct video URL. Close the page and browser after collecting the HTML.</p>
<figure class="post-code">
  <figcaption>JavaScript · Read the video source</figcaption>
  <pre tabindex="0" aria-label="Extract the video URL with Cheerio"><code><span class="code-keyword">const</span> $ = cheerio.load(html);
<span class="code-keyword">const</span> videoDirectLink = $(<span class="code-value">'video'</span>).attr(<span class="code-value">'src'</span>);</code></pre>
</figure>
<aside class="post-note" aria-label="Publication note"><strong>From the archive.</strong><p>Originally published May 12, 2023. This overview preserves the technique documented at the time.</p></aside>
