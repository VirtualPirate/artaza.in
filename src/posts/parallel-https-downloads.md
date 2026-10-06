---
slug: parallel-https-downloads
title: How Download Managers Speed Up Downloads with Parallel HTTP Requests
description: A plain explanation of how a download manager splits one file into byte ranges, fetches those slices together, and joins them back in order.
date: '2026-10-06'
dateLabel: October 6, 2026
readingTime: 5 min read
lead: A download manager does not download the file four times. It asks for four different slices, fetches them together, then stacks the slices back in order.
tags:
  - { label: HTTP, color: blue }
  - { label: Node.js, color: green }
  - { label: TypeScript, color: blue }
sections:
  - { id: the-idea, title: The idea }
  - { id: ask-for-a-slice, title: Ask for a slice }
  - { id: split-the-file, title: Split the file }
  - { id: download-together, title: Download together }
  - { id: put-it-back, title: Put it back }
  - { id: when-it-is-faster, title: When it is faster }
  - { id: try-a-slice, title: Try a slice }
---

<p>A normal download is one request. The server starts at the beginning of the file and keeps sending until the end.</p>
<p>A download manager opens several requests for the same URL. That only works because each request asks for a different stretch of bytes. Think of a book split across four people: each person copies different pages, then you stack the pages from first to last.</p>

<h2 id="the-idea">One file, several slices</h2>
<p>A byte is one unit of the file. In a 1,000-byte file, the first byte sits at position 0 and the last sits at position 999. Four requests can share that file like this:</p>
<figure class="post-diagram" aria-labelledby="ranges-caption">
  <ol class="flow-steps">
    <li><span>1</span><strong>Measure</strong><small>Learn how big the file is</small></li>
    <li><span>2</span><strong>Split</strong><small>Give each request its own range</small></li>
    <li><span>3</span><strong>Fetch</strong><small>Download the ranges together</small></li>
    <li><span>4</span><strong>Join</strong><small>Write the slices in byte order</small></li>
  </ol>
  <div class="file-strip">
    <p class="diagram-label">largefile.zip · one URL · 1,000 bytes</p>
    <div class="file-bar">
      <div class="file-slice diagram-part-0"><b>Part 0</b><span>0–249</span></div>
      <div class="file-slice diagram-part-1"><b>Part 1</b><span>250–499</span></div>
      <div class="file-slice diagram-part-2"><b>Part 2</b><span>500–749</span></div>
      <div class="file-slice diagram-part-3"><b>Part 3</b><span>750–999</span></div>
    </div>
    <div class="file-scale"><span>byte 0</span><span>byte 999</span></div>
  </div>
  <figcaption id="ranges-caption">Four requests cover the file once. Each slice is 250 bytes, and the next slice starts where the previous one stopped.</figcaption>
</figure>
<p>You do not need to understand a ZIP file or a video to do this. You are cutting the raw bytes, not the format. One slice may not open on its own. The joined file is the thing that should open.</p>
<p>The samples below follow <a href="https://gist.github.com/VirtualPirate/21a776cd9366c82fdab333dfe3d32486">my TypeScript downloader gist</a>. Node.js starts the requests together on its event loop. It does not need a worker thread per slice. <a href="https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop">Node.js describes that I/O model</a>.</p>

<h2 id="ask-for-a-slice">Ask the server for specific bytes</h2>
<p>A normal GET says “send the file.” Add one header and it says “send only this part.”</p>
<figure class="post-diagram" aria-labelledby="exchange-caption">
  <div class="exchange">
    <div class="exchange-card">
      <p class="exchange-who">You send</p>
      <p class="exchange-title">GET /largefile.zip</p>
      <code>Range: bytes=250-499</code>
      <p>One slice from the middle of the file.</p>
    </div>
    <div class="exchange-arrow" aria-hidden="true">→</div>
    <div class="exchange-card exchange-reply">
      <p class="exchange-who">Server replies</p>
      <p class="exchange-title">206 Partial Content</p>
      <code>bytes 250-499/1000</code>
      <p>250 bytes, taken from a 1,000-byte file.</p>
    </div>
  </div>
  <figcaption id="exchange-caption">The server sees an ordinary GET with a Range header. There is no special “parallel download” command.</figcaption>
</figure>
<p>Both ends of the range are included. <code>bytes=0-2</code> is three bytes, not two. You get the length by counting every position from the start through the end.</p>
<figure class="post-diagram" aria-labelledby="count-caption">
  <div class="count-demo">
    <p class="diagram-label"><code>Range: bytes=0-2</code></p>
    <div class="count-cells" role="img" aria-label="Bytes 0, 1, and 2 are included. Bytes 3 and 4 are not.">
      <span class="counted">0</span>
      <span class="counted">1</span>
      <span class="counted">2</span>
      <span>3</span>
      <span>4</span>
    </div>
  </div>
  <figcaption id="count-caption">The highlighted cells are the response. 2 − 0 + 1 = 3 bytes.</figcaption>
</figure>
<p><code>206 Partial Content</code> means you received a slice. <code>Content-Range: bytes 250-499/1000</code> tells you where it belongs, and that the whole file is 1,000 bytes. <code>Content-Length: 250</code> is the size of this response, not the size of the file. <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Range">MDN documents the Range header</a>.</p>
<p>Read the status before you save anything. <code>200 OK</code> means the server ignored the range and sent the whole file. <code>416 Range Not Satisfiable</code> means that slice does not exist. Neither one is a successful part.</p>
<p>You need the size before you can plan the slices. A <code>HEAD</code> request returns headers, including <code>Content-Length</code>, and skips the body. You can also ask for the first byte with <code>Range: bytes=0-0</code>. A useful answer looks like <code>Content-Range: bytes 0-0/1000</code>: ranges work, and the file is 1,000 bytes. <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Range_requests">MDN shows both checks</a>.</p>

<h2 id="split-the-file">Leave no gaps and no overlaps</h2>
<p>Divide the size by the number of pieces, then walk from the start. Each new slice begins on the byte after the previous slice ends.</p>
<figure class="post-code" aria-label="Plan download ranges that cover a file once">
  <figcaption>JavaScript · Plan the ranges</figcaption>

```javascript
function planSegments(fileSize, pieces) {
  const segmentSize = Math.ceil(fileSize / pieces);
  const segments = [];

  for (let start = 0; start < fileSize; start += segmentSize) {
    segments.push({
      start,
      end: Math.min(start + segmentSize - 1, fileSize - 1),
    });
  }

  return segments;
}
```

</figure>
<p><code>planSegments(1000, 4)</code> returns the four equal slices in the diagram above. A 5-byte file does not divide into four useful pieces. The same function stops at the end of the file:</p>
<figure class="post-diagram" aria-labelledby="uneven-caption">
  <div class="split-example">
    <p class="diagram-label">5 bytes, asked for 4 pieces</p>
    <div class="file-bar file-bar-uneven">
      <div class="file-slice diagram-part-0" style="flex: 2"><b>0–1</b><span>2 bytes</span></div>
      <div class="file-slice diagram-part-1" style="flex: 2"><b>2–3</b><span>2 bytes</span></div>
      <div class="file-slice diagram-part-2" style="flex: 1"><b>4</b><span>1 byte</span></div>
    </div>
  </div>
  <figcaption id="uneven-caption">Three requests cover bytes 0 through 4 once. A fourth request would start past the end of the file.</figcaption>
</figure>
<p>The rule is small: start at byte 0, never skip a byte, never repeat a byte, and stop at the last byte.</p>

<h2 id="download-together">Start every request, then wait</h2>
<p>Waiting for one slice before starting the next is a normal download with extra steps. Start them all, then wait for the group:</p>
<figure class="post-code" aria-label="Start every range request before waiting for the group">
  <figcaption>JavaScript · Keep the planned order</figcaption>

```javascript
const segments = planSegments(fileSize, 4);
const parts = await Promise.all(
  segments.map((segment) => downloadPart(url, segment))
);
```

</figure>
<p>The requests begin when <code>downloadPart</code> is called. <code>Promise.all</code> only waits. Its array stays in plan order even when part 3 finishes first. <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all">MDN documents that order</a>.</p>
<figure class="post-diagram" aria-labelledby="concurrency-caption">
  <div class="time-compare">
    <div>
      <p class="diagram-label">One after another</p>
      <div class="time-chart">
        <div class="time-row"><span>Part 0</span><span class="time-track"><span class="time-bar diagram-part-0" style="--offset: 0%; --length: 25%"></span></span></div>
        <div class="time-row"><span>Part 1</span><span class="time-track"><span class="time-bar diagram-part-1" style="--offset: 25%; --length: 25%"></span></span></div>
        <div class="time-row"><span>Part 2</span><span class="time-track"><span class="time-bar diagram-part-2" style="--offset: 50%; --length: 25%"></span></span></div>
        <div class="time-row"><span>Part 3</span><span class="time-track"><span class="time-bar diagram-part-3" style="--offset: 75%; --length: 25%"></span></span></div>
      </div>
      <p class="time-total">Done when the last wait ends</p>
    </div>
    <div>
      <p class="diagram-label">At the same time</p>
      <div class="time-chart">
        <div class="time-row"><span>Part 0</span><span class="time-track"><span class="time-bar diagram-part-0" style="--length: 70%"></span></span></div>
        <div class="time-row"><span>Part 1</span><span class="time-track"><span class="time-bar diagram-part-1" style="--length: 100%"></span></span></div>
        <div class="time-row"><span>Part 2</span><span class="time-track"><span class="time-bar diagram-part-2" style="--length: 46%"></span></span></div>
        <div class="time-row"><span>Part 3</span><span class="time-track"><span class="time-bar diagram-part-3" style="--length: 62%"></span></span></div>
      </div>
      <p class="time-total">Done when the slowest part ends</p>
    </div>
  </div>
  <figcaption id="concurrency-caption">The colored bars are download time. Sequential parts wait their turn. Concurrent parts overlap, so the clock stops with the slowest one.</figcaption>
</figure>
<p>Each request should accept only <code>206</code>, and the saved slice should contain every byte in that range and nothing outside it. If one request fails, cancel the others. <code>Promise.all</code> will reject, but it will not stop the requests that are still running.</p>

<h2 id="put-it-back">Join the slices in file order</h2>
<p>Parts can finish in any order. Joining them in that order scrambles the file, even when every byte arrived.</p>
<figure class="post-diagram" aria-labelledby="assembly-caption">
  <div class="join-compare">
    <div>
      <p class="diagram-label">Order they finished</p>
      <ol class="join-stack">
        <li class="diagram-part-2"><span>1st</span><strong>Part 2</strong><small>bytes 500–749</small></li>
        <li class="diagram-part-0"><span>2nd</span><strong>Part 0</strong><small>bytes 0–249</small></li>
        <li class="diagram-part-3"><span>3rd</span><strong>Part 3</strong><small>bytes 750–999</small></li>
        <li class="diagram-part-1"><span>4th</span><strong>Part 1</strong><small>bytes 250–499</small></li>
      </ol>
      <p class="join-note join-bad">Saving this order breaks the file</p>
    </div>
    <div class="join-arrow" aria-hidden="true">→</div>
    <div>
      <p class="diagram-label">Order to save them</p>
      <ol class="join-stack">
        <li class="diagram-part-0"><span>0</span><strong>Part 0</strong><small>bytes 0–249</small></li>
        <li class="diagram-part-1"><span>1</span><strong>Part 1</strong><small>bytes 250–499</small></li>
        <li class="diagram-part-2"><span>2</span><strong>Part 2</strong><small>bytes 500–749</small></li>
        <li class="diagram-part-3"><span>3</span><strong>Part 3</strong><small>bytes 750–999</small></li>
      </ol>
      <p class="join-note join-good">Saving this order rebuilds the file</p>
    </div>
  </div>
  <figcaption id="assembly-caption">Finish order can change from download to download. Save order is always part 0, part 1, part 2, part 3.</figcaption>
</figure>
<p><code>Promise.all</code> already returns the slices in plan order, so you can write them from the start of that array to the end. Check that the finished file is 1,000 bytes. If the publisher gives you a checksum, compare that too. Write to a temporary file first, and rename it only after those checks pass.</p>
<p>One more mismatch is easy to miss. The file on the server can change while your requests are in flight. A slice from the old file and a slice from the new file can still add up to the right length. If the first response includes a strong <code>ETag</code>, send it back with <code>If-Range</code> so every slice is tied to that same version. <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/If-Range">MDN explains If-Range</a>.</p>

<h2 id="when-it-is-faster">More requests are not always faster</h2>
<p>Parallel downloads help when one connection is not allowed to use your full internet speed. Picture a server that limits each connection to 2 MB/s, while your connection can receive 10 MB/s. A 100 MB file takes about 50 seconds on one connection. Four connections can use about 8 MB/s and finish in about 12.5 seconds.</p>
<figure class="post-diagram" aria-labelledby="speed-caption">
  <div class="speed-chart">
    <div class="speed-row">
      <span>1 connection</span>
      <span class="speed-track"><span class="speed-fill" style="width: 100%"></span></span>
      <span>50s</span>
    </div>
    <div class="speed-row">
      <span>4 connections</span>
      <span class="speed-track"><span class="speed-fill speed-fast" style="width: 25%"></span></span>
      <span>12.5s</span>
    </div>
  </div>
  <figcaption id="speed-caption">An example, not a measurement. Each connection is capped at 2 MB/s, and the link can carry 10 MB/s. Four connections use 8 MB/s.</figcaption>
</figure>
<p>If one connection already fills the link, four requests just share that same speed. They cannot turn 10 MB/s into 40 MB/s. Try one request, then two, then four, on the server you actually use.</p>

<h2 id="try-a-slice">Look at one slice with curl</h2>
<p>Use a file URL you are allowed to download. This asks for the first byte and prints the response headers:</p>
<figure class="post-code" aria-label="Request the first byte of a file with curl">
  <figcaption>Shell · Ask for byte 0</figcaption>

```bash
curl --location --max-time 15 \
  --header 'Range: bytes=0-0' \
  --header 'Accept-Encoding: identity' \
  --dump-header - --output probe.bin \
  'https://downloads.your-domain.test/largefile.zip'
```

</figure>
<p>A working range server answers <code>206</code>, returns a matching <code>Content-Range</code>, and leaves <code>probe.bin</code> as a one-byte file. A <code>200</code> means this server did not honor the range. <code>Accept-Encoding: identity</code> asks for the raw bytes, so compression does not shift the positions you planned.</p>
<p>After that, three checks decide whether the download is real:</p>
<ul>
  <li><strong>Coverage.</strong> Every byte appears in exactly one slice.</li>
  <li><strong>The same file.</strong> Every slice belongs to the same version.</li>
  <li><strong>Order.</strong> You join the slices by byte position, not by which request finished first.</li>
</ul>
<p>Concurrency is what creates the chance of a faster download. Those three checks are what make the file correct.</p>
