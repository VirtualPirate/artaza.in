# Static Astro portfolio

An Astro copy of `../minimal-portfolio`, preserving the black and white design,
spacing, responsive layouts, grid elevation, sparse colored logos, hover effects,
accessible work tabs, article styling, project pages, and grid-shapes previews.
All content is rendered at build time. No UI framework, client hydration, remote
fonts, or runtime API is needed.

Requires Node.js 22.12 or newer.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

```sh
pnpm test       # Type checking, production build, links, SEO, and interactions
pnpm preview    # Serve the built site locally
```

`npm run dev`, `npm run build`, and `npm run preview` also work after installing
dependencies. Deploy only `dist/` to any static host. Configure that host to serve
`404.html` for missing pages. The grid-shapes demo lives at `/grid-shapes/`.

Review the website and all six project OG cards at `/og/`. Each card has a
full-size HTML view at `/og/site/` or `/og/{project-slug}/`, with a fixed
1200 × 630 canvas. Edit `src/components/OGCard.astro` to adjust the designs;
project names, descriptions, logos, and tags come from the portfolio data.
These previews are marked `noindex` and excluded from the sitemap. Image
export and social metadata updates follow design review.

## Content

- `src/data/portfolio.ts`: profile, contact/social links, experience, skills,
  education, projects, open source, and LinkedIn article links.
- `src/posts/*.md`: article metadata and content. Add a file with a unique
  slug to generate a new article, blog card, and sitemap entry automatically.
  The file marked `preview: true` supplies the original `/blog-post/` preview.
- `src/assets/projects/`: source screenshots of the featured projects.
  Astro generates responsive WebP versions at build time.
- `public/artaza_resume.pdf`: downloadable PDF résumé linked through `profile.resume`.
- `src/assets/social.svg` and `public/favicon.svg`: sharing image and icon.
  After editing the SVG, regenerate the PNG used for social cards:

  ```sh
  node --input-type=module -e "import sharp from 'sharp'; await sharp('src/assets/social.svg').png().toFile('src/assets/social.png');"
  ```
- `astro.config.mjs`: set `site` to your production URL. Canonicals, social URLs,
  JSON-LD, `robots.txt`, and the sitemap all use this value.

Content was checked on October 6, 2026 against [artaza.in](https://artaza.in/)
and [Artaza’s LinkedIn profile](https://www.linkedin.com/in/artaza-sameen-4b995b23a/).
Employment dates, education, and backend specialties follow LinkedIn. Public
contact details and project links follow the old portfolio, with project
descriptions checked against their GitHub repositories. The two 2023 articles
are concise overviews with their original publication dates and URL paths.

Shared layouts provide navigation, footer, and SEO metadata. Repeated card and tag
markup lives in Astro components. The original CSS lives in `src/styles/`; small
interaction scripts live in `src/scripts/`. The blog uses a static grid, just like
the source. Touch/coarse-pointer and reduced-motion visitors get the CSS grid
without generating hundreds of decorative elements.

Astro emits compressed HTML and hashed assets. On your host, give `/_astro/*`
long-lived immutable caching and let HTML revalidate. The grid demo and 404 page
are marked `noindex` and excluded from the sitemap.

Implementation uses Astro’s [static routing](https://docs.astro.build/en/guides/routing/),
[processed scripts](https://docs.astro.build/en/guides/client-side-scripts/), and
[build-time image optimization](https://docs.astro.build/en/guides/images/).
