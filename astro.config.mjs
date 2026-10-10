import { readdirSync, readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Config runs before import.meta.glob exists, so read post dates straight from frontmatter.
// Pages without a content date ship without <lastmod> rather than a misleading build timestamp.
const postDates = Object.fromEntries(readdirSync(new URL('./src/posts/', import.meta.url)).filter(file => file.endsWith('.md')).map(file => {
  const frontmatter = readFileSync(new URL(`./src/posts/${file}`, import.meta.url), 'utf8').split('\n---')[0];
  return [`/blog/${frontmatter.match(/^slug:\s*(\S+)/m)[1]}/`, new Date(frontmatter.match(/^date:\s*'?([\d-]+)/m)[1])];
}));
const pageDates = { ...postDates, '/blog/': new Date(Math.max(...Object.values(postDates).map(Number))) };

export default defineConfig({
  site: 'https://artaza.in',
  output: 'static',
  trailingSlash: 'always',
  compressHTML: true,
  build: { inlineStylesheets: 'never' },
  devToolbar: { enabled: false },
  integrations: [sitemap({
    filter: page => !/\/(og|grid-shapes)\//.test(new URL(page).pathname),
    serialize: item => {
      const lastmod = pageDates[new URL(item.url).pathname];
      return lastmod ? { ...item, lastmod } : item;
    },
  })],
});
