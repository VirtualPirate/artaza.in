import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://artaza.in',
  output: 'static',
  trailingSlash: 'always',
  compressHTML: true,
  build: { inlineStylesheets: 'never' },
  devToolbar: { enabled: false },
});
