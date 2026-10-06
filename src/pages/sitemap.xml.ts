import type { APIRoute } from 'astro';
import { projects } from '../data/portfolio';
import { posts } from '../data/posts';

export const GET: APIRoute = ({ site }) => {
  const paths = ['/', '/blog/', '/work/', ...projects.map(project => `/projects/${project.slug}/`), ...posts.map(post => post.href)];
  const urls = paths.map(path => `<url><loc>${new URL(path, site).href}</loc></url>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
