import viewerImage from '../assets/projects/opengraph-viewer.jpg';
import apiImage from '../assets/projects/opengraph-api.jpg';
import studioImage from '../assets/projects/az-creation.png';
import algebraImage from '../assets/projects/algebra-api.jpg';

// Profile and experience: LinkedIn. Projects and contact details: artaza.in.
export const profile = {
  name: 'Artaza Sameen',
  brand: 'artaza',
  role: 'Backend engineer',
  tagline: 'Backend engineer. Systems, data & AI.',
  bio: ['I build fintech pipelines, reliable APIs, and AI automation.', 'Based in Kolkata, building at Finlens and contributing to Rust.'],
  description: 'Artaza Sameen, a backend engineer at Finlens based in Kolkata. Explore fintech systems, AI automation, side projects, Rust contributions, and writing.',
  email: 'artaza.developer@gmail.com',
  resume: '/resume.txt',
  socials: [
    { label: 'Email', href: 'mailto:artaza.developer@gmail.com' },
    { label: 'GitHub', href: 'https://github.com/VirtualPirate' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/artaza-sameen-4b995b23a/' },
    { label: 'Phone', href: 'tel:+917630033481' },
  ],
};

export const homeLinks = [
  { title: 'Work', description: 'Experience, side products & open source.', href: '/work/' },
  { title: 'Blog', description: 'A few things I’ve learned along the way.', href: '/blog/' },
];

export type Tag = { label: string; color: 'blue' | 'purple' | 'green' | 'yellow' | 'orange' };

export const experience = [
  { company: 'Finlens', logo: 'F', role: 'SDE 2 — Backend', start: '2025-03', startLabel: 'Mar 2025', end: null, endLabel: 'Present', description: 'Migrated infrastructure from AWS to GCP. Built accountant dashboards, role-based access for firm employees, and accountant task management.' },
  { company: 'Finlens', logo: 'F', role: 'Full Stack Developer', start: '2023-07', startLabel: 'Jul 2023', end: '2025-03', endLabel: 'Mar 2025', description: 'Built bank integrations, AI transaction categorization, Stripe payments and revenue recognition, and fast financial reporting APIs. Migrated Express to NestJS and set up CI/CD with Docker and GitHub Actions.' },
  { company: 'Stock Register', logo: 'SR', role: 'Frontend Web Developer · Internship', start: '2023-03', startLabel: 'Mar 2023', end: '2023-07', endLabel: 'Jul 2023', description: 'Launched an inventory management web app with real-time asset visibility. Used React and TanStack Query for responsive lists and filtering, and standardized state management across complex workflows.' },
];

export const about = 'I’m a self-taught programmer who started at 14. Today, I have over three years of production experience building SaaS products, multi-tenant fintech systems, and AI automation. My work spans data modeling, background jobs, and reliable API design in TypeScript and Python.';

export const skillGroups = [
  { title: 'Backend & data', tags: [{ label: 'TypeScript', color: 'blue' }, { label: 'NestJS', color: 'purple' }, { label: 'Python', color: 'yellow' }, { label: 'FastAPI', color: 'green' }, { label: 'PostgreSQL', color: 'blue' }, { label: 'MongoDB', color: 'green' }, { label: 'TypeORM', color: 'orange' }, { label: 'SQLAlchemy', color: 'orange' }, { label: 'Rust', color: 'orange' }] as Tag[] },
  { title: 'Infrastructure & async systems', tags: [{ label: 'Docker', color: 'blue' }, { label: 'AWS', color: 'orange' }, { label: 'GCP Cloud Run', color: 'blue' }, { label: 'GitHub Actions', color: 'purple' }, { label: 'Redis', color: 'orange' }, { label: 'BullMQ', color: 'yellow' }, { label: 'Celery', color: 'green' }, { label: 'RabbitMQ', color: 'orange' }] as Tag[] },
  { title: 'Frontend', tags: [{ label: 'React', color: 'blue' }, { label: 'Next.js', color: 'purple' }, { label: 'Svelte', color: 'orange' }, { label: 'JavaScript', color: 'yellow' }, { label: 'Tailwind CSS', color: 'blue' }] as Tag[] },
];

export const specialties = 'Workspace-scoped financial integrations with Stripe, Plaid, and QuickBooks; resilient background processing; and AI voice orchestration with FastAPI, PostgreSQL, OpenAI structured outputs, and Langfuse.';

export const education = {
  university: 'Maulana Mazharul Haque Arabic & Persian University, Patna',
  degree: 'Bachelor of Technology (BTech), Information Technology',
  start: '2022-12', end: '2025-12', startLabel: 'Dec 2022', endLabel: 'Dec 2025',
};

export const projects = [
  {
    slug: 'opengraph-viewer', title: 'OpenGraph Viewer', logo: 'OG', theme: 'opengraph',
    tags: [{ label: 'Web app', color: 'blue' }, { label: 'Developer tool', color: 'purple' }] as Tag[],
    detailTags: [{ label: 'Web app', color: 'blue' }, { label: 'React', color: 'purple' }] as Tag[],
    description: 'Preview a link’s Open Graph card before sharing it.',
    summary: 'A React web app for inspecting a website’s Open Graph metadata. Enter a URL to see its title, description, and preview image using the companion OpenGraph API.',
    urlLabel: 'opengraph-viewer.netlify.app', icon: 'browser' as const,
    links: [{ label: 'Visit website', href: 'https://opengraph-viewer.netlify.app/' }, { label: 'Source code', href: 'https://github.com/VirtualPirate/OpenGraph-Viewer' }, { label: 'Explore the API', href: '/projects/opengraph-api/' }],
    image: viewerImage, imageAlt: 'OpenGraph Viewer interface with a wordmark, URL input, and Check Website button.', imageCaption: 'The OpenGraph Viewer link preview interface.',
  },
  {
    slug: 'opengraph-api', title: 'OpenGraph API', logo: '</>', theme: 'opengraph',
    tags: [{ label: 'API', color: 'green' }, { label: 'JavaScript', color: 'yellow' }] as Tag[],
    detailTags: [{ label: 'API', color: 'green' }, { label: 'JavaScript', color: 'yellow' }, { label: 'MongoDB', color: 'green' }] as Tag[],
    description: 'Fetch link metadata through the API that powers OpenGraph Viewer.',
    summary: 'A Node.js API that fetches Open Graph metadata from a URL. It returns the site name, title, description, URL, and image as structured data and powers OpenGraph Viewer.',
    urlLabel: 'github.com/VirtualPirate/OpenGraph-API', icon: 'github' as const,
    links: [{ label: 'Source code', href: 'https://github.com/VirtualPirate/OpenGraph-API' }, { label: 'Documentation', href: 'https://github.com/VirtualPirate/OpenGraph-API#readme' }, { label: 'Open the viewer', href: '/projects/opengraph-viewer/' }],
    image: apiImage, imageAlt: 'OpenGraph API documentation showing a GET endpoint, URL parameter, and JavaScript request.', imageCaption: 'OpenGraph API endpoint documentation and a JavaScript request.',
  },
  {
    slug: 'az-creation', title: 'AZCreation Studio', logo: 'AZ', theme: 'az',
    tags: [{ label: 'Website', color: 'blue' }, { label: 'Next.js', color: 'purple' }] as Tag[],
    detailTags: [{ label: 'Website', color: 'blue' }, { label: 'Next.js', color: 'purple' }, { label: 'TypeScript', color: 'blue' }] as Tag[],
    description: 'An animated client portfolio with a custom gallery, built with Next.js and TypeScript.',
    summary: 'A portfolio for AZCreation Studio, built with Next.js and TypeScript. The design pairs an animated presentation with a custom gallery to showcase the client’s work across devices.',
    urlLabel: 'azcreation.pages.dev', icon: 'browser' as const,
    links: [{ label: 'Visit website', href: 'https://azcreation.pages.dev/' }, { label: 'Source code', href: 'https://github.com/VirtualPirate/azcreation' }],
    image: studioImage, imageAlt: 'AZCreation Studio homepage using a green and black palette, portrait, and introduction.', imageCaption: 'AZCreation Studio’s homepage and visual identity.',
  },
  {
    slug: 'algebra-api', title: 'Algebra API', logo: 'ƒx', theme: 'algebra',
    tags: [{ label: 'API', color: 'green' }, { label: 'C++', color: 'blue' }] as Tag[],
    detailTags: [{ label: 'API', color: 'green' }, { label: 'JavaScript', color: 'yellow' }, { label: 'C++', color: 'blue' }] as Tag[],
    description: 'Solve algebraic equations through a JavaScript and C++ service.',
    summary: 'An algebra solver API built with JavaScript and C++. Submit an expression to receive step-by-step simplification, with optional values for variable substitution and support for arithmetic and powers.',
    urlLabel: 'github.com/VirtualPirate/Algebra-API', icon: 'github' as const,
    links: [{ label: 'Source code', href: 'https://github.com/VirtualPirate/Algebra-API' }, { label: 'Documentation', href: 'https://github.com/VirtualPirate/Algebra-API#readme' }],
    image: algebraImage, imageAlt: 'Algebra API documentation with an expression input, variable parameters, and supported operators.', imageCaption: 'Algebra API expression input and variable substitution documentation.',
  },
];

export const contributions = [
  { title: 'Rust ecosystem', logo: 'Rs', tags: [{ label: 'Open source', color: 'green' }, { label: 'Rust', color: 'orange' }] as Tag[], description: 'I contribute to the open-source Rust ecosystem. Explore my public pull requests on GitHub.', href: 'https://github.com/search?q=is%3Apr+author%3AVirtualPirate&type=pullrequests', urlLabel: 'GitHub · Public pull requests', icon: 'github' as const },
];

export const repositoryLink = 'https://github.com/VirtualPirate?tab=repositories';

export const linkedInArticles = [
  { title: 'Technical Debt Carved in Stone: Why Your DB Schema is the Most Important Decision You’ll Make', description: 'On database schemas as the foundation of backend systems.', href: 'https://www.linkedin.com/pulse/technical-debt-carved-stone-why-your-db-schema-most-important-sameen-wqizc/', tags: [{ label: 'Databases', color: 'blue' }, { label: 'System design', color: 'purple' }] as Tag[] },
  { title: 'The Upsert–Prune Synchronization Pattern: Keeping Data in Sync Without Webhooks', description: 'Keeping local data in sync with third-party APIs when webhooks aren’t available.', href: 'https://www.linkedin.com/pulse/upsertprune-synchronization-pattern-keeping-data-sync-artaza-sameen-sdaec/', tags: [{ label: 'Data pipelines', color: 'green' }, { label: 'APIs', color: 'blue' }] as Tag[] },
];
