import type { MarkdownInstance } from 'astro';
import type { Tag } from './portfolio';

export interface PostData {
  slug: string;
  title: string;
  description: string;
  date: string;
  dateLabel: string;
  lead: string;
  readingTime: string;
  tags: Tag[];
  sections: { id: string; title: string }[];
  preview?: boolean;
}

const modules = import.meta.glob<MarkdownInstance<PostData>>('../posts/*.md', { eager: true });
export const posts = Object.values(modules)
  .map(module => ({ ...module, href: module.frontmatter.preview ? '/blog-post/' : `/blog/${module.frontmatter.slug}/` }))
  .sort((a, b) => b.frontmatter.date.localeCompare(a.frontmatter.date));
export const previewPost = posts.find(post => post.frontmatter.preview)!;
export type Post = (typeof posts)[number];
