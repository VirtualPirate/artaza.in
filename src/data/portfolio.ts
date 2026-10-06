import launchstackImage from '../assets/projects/launchstack.png';
import launchstackLogo from '../assets/projects/launchstack-logo.png';
import devsummaryImage from '../assets/projects/devsummary-desktop.png';
import devsummaryLogo from '../assets/projects/devsummary-logo.png';
import papersflyImage from '../assets/projects/papersfly.jpg';
import papersflyLogo from '../assets/projects/papersfly-logo.png';
import commandKingImage from '../assets/projects/command-king.png';
import commandKingLogo from '../assets/projects/command-king-logo.png';
import algebraImage from '../assets/projects/algebra-api.jpg';
import finlensLogo from '../assets/companies/finlens-logo.jpg';
import stockRegisterLogo from '../assets/companies/stock-register-logo.jpg';
import tauriLogo from '../assets/contributions/tauri-logo.png';

// Profile and experience: LinkedIn. Projects and contact details: artaza.in.
export const profile = {
  name: 'Artaza Sameen',
  brand: 'artaza',
  role: 'Backend engineer',
  tagline: 'Backend engineer. Systems, data & AI.',
  bio: ['I build fintech pipelines, reliable APIs, and AI automation,', 'building at Finlens (YC W20) and open source contributor at the Rust Ecosystem.'],
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
  { company: 'Finlens', logoImage: finlensLogo, role: 'SDE 2 — Backend', start: '2025-03', startLabel: 'Mar 2025', end: null, endLabel: 'Present', description: 'Migrated infrastructure from AWS to GCP. Built accountant dashboards, role-based access for firm employees, and accountant task management.' },
  { company: 'Finlens', logoImage: finlensLogo, role: 'Full Stack Developer', start: '2023-07', startLabel: 'Jul 2023', end: '2025-03', endLabel: 'Mar 2025', description: 'Built bank integrations, AI transaction categorization, Stripe payments and revenue recognition, and fast financial reporting APIs. Migrated Express to NestJS and set up CI/CD with Docker and GitHub Actions.' },
  { company: 'Stock Register', logoImage: stockRegisterLogo, role: 'Frontend Web Developer · Internship', start: '2023-03', startLabel: 'Mar 2023', end: '2023-07', endLabel: 'Jul 2023', description: 'Launched an inventory management web app with real-time asset visibility. Used React and TanStack Query for responsive lists and filtering, and standardized state management across complex workflows.' },
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
    slug: 'launchstack', title: 'LaunchStack', logo: 'LS', logoImage: launchstackLogo, theme: 'launchstack',
    tags: [{ label: 'SaaS starter', color: 'green' }, { label: 'TypeScript', color: 'blue' }] as Tag[],
    detailTags: [{ label: 'NestJS', color: 'purple' }, { label: 'React', color: 'blue' }, { label: 'PostgreSQL', color: 'blue' }, { label: 'Kysely', color: 'green' }] as Tag[],
    description: 'A full-stack TypeScript SaaS starter with auth, organizations, roles, and email built in.',
    summary: 'A full-stack TypeScript template for building multi-tenant SaaS products. Includes email and Google sign-in, email verification, organizations, role-based access, member invitations, and transactional email. Built with NestJS, React, PostgreSQL, Kysely, and Better Auth, with shared API types and validation.',
    urlLabel: 'github.com/VirtualPirate/launchstack', icon: 'github' as const,
    links: [{ label: 'Source code', href: 'https://github.com/VirtualPirate/launchstack' }, { label: 'Documentation', href: 'https://github.com/VirtualPirate/launchstack#readme' }],
    image: launchstackImage, imageAlt: 'LaunchStack dashboard with sidebar navigation and organization controls.', imageCaption: 'LaunchStack’s dashboard from the project repository.',
  },
  {
    slug: 'devsummary-desktop', title: 'DevSummary Desktop', logo: 'DS', logoImage: devsummaryLogo, theme: 'devsummary',
    tags: [{ label: 'Desktop app', color: 'blue' }, { label: 'AI', color: 'purple' }] as Tag[],
    detailTags: [{ label: 'Electron', color: 'blue' }, { label: 'NestJS', color: 'purple' }, { label: 'React', color: 'blue' }, { label: 'PGlite', color: 'green' }] as Tag[],
    description: 'An AI-powered Git reporting app for founders and managers.',
    summary: 'An AI-powered Git reporting app for founders and managers. DevSummary tracks selected GitHub branches, classifies commits, and generates scheduled or on-demand briefs for projects, teams, and repositories. Built with Electron, NestJS, React, and PGlite, with the database and credentials stored on your computer.',
    urlLabel: 'github.com/VirtualPirate/devsummary-desktop', icon: 'github' as const,
    links: [{ label: 'Source code', href: 'https://github.com/VirtualPirate/devsummary-desktop' }, { label: 'Visit desktop website', href: 'https://devsummary.com/desktop' }],
    image: devsummaryImage, imageAlt: 'DevSummary dashboard preview showing code changes, commit volume, work categories, and activity charts.', imageCaption: 'DevSummary’s dashboard preview from the project repository.',
  },
  {
    slug: 'devsummary', title: 'DevSummary', logo: 'DS', logoImage: devsummaryLogo, theme: 'devsummary',
    tags: [{ label: 'Web app', color: 'blue' }, { label: 'AI', color: 'purple' }, { label: 'Private repo', color: 'yellow' }] as Tag[],
    detailTags: [{ label: 'Web app', color: 'blue' }, { label: 'AI', color: 'purple' }] as Tag[],
    description: 'An AI-powered Git reporting app for founders and managers.',
    summary: 'The web app version of DevSummary, an AI-powered Git reporting app for founders and managers. Its source repository is private.',
    urlLabel: 'devsummary.com', icon: 'browser' as const,
    links: [{ label: 'Visit web app', href: 'https://devsummary.com' }],
  },
  {
    slug: 'papersfly', title: 'papersfly', logo: 'PF', logoImage: papersflyLogo, theme: 'papersfly',
    tags: [{ label: 'Web app', color: 'blue' }, { label: 'PDF builder', color: 'green' }] as Tag[],
    detailTags: [{ label: 'Astro', color: 'orange' }, { label: 'React', color: 'blue' }, { label: 'TypeScript', color: 'blue' }, { label: 'jsPDF', color: 'green' }] as Tag[],
    description: 'Create resumes, invoices, and cover letters with live previews and vector PDF exports.',
    summary: 'A browser-based document builder for resumes, invoices, and cover letters. Choose a template, edit your content alongside a live preview, and export a PDF with selectable text and embedded fonts. Document editing and PDF generation run on your device, with no account required.',
    urlLabel: 'papersfly.com', icon: 'browser' as const,
    links: [{ label: 'Visit website', href: 'https://papersfly.com' }, { label: 'Source code', href: 'https://github.com/VirtualPirate/papersfly' }],
    image: papersflyImage, imageAlt: 'Papersfly’s Classic resume editor with a content form, live document preview, and Download PDF button.', imageCaption: 'The live Classic resume editor, shown with Papersfly’s sample content.',
  },
  {
    slug: 'command-king', title: 'Command King', logo: 'CK', logoImage: commandKingLogo, theme: 'command-king',
    tags: [{ label: 'VS Code extension', color: 'blue' }, { label: 'Developer tool', color: 'purple' }] as Tag[],
    detailTags: [{ label: 'VS Code', color: 'blue' }, { label: 'TypeScript', color: 'blue' }, { label: 'Developer tool', color: 'purple' }] as Tag[],
    description: 'Organize workspace commands and npm scripts in VS Code, then run them in the terminal.',
    summary: 'A VS Code extension that discovers custom commands in .cmdk files and npm scripts in package.json. Organize commands in a nested tree, add descriptions, and run them in the integrated terminal. Create, edit, or delete custom commands from the sidebar, with file changes reflected automatically.',
    urlLabel: 'github.com/VirtualPirate/command-king', icon: 'github' as const,
    links: [{ label: 'Source code', href: 'https://github.com/VirtualPirate/command-king' }, { label: 'Documentation', href: 'https://github.com/VirtualPirate/command-king#readme' }],
    image: commandKingImage, imageAlt: 'Command King running in VS Code with a workspace command tree, a .cmdk configuration, and an integrated terminal.', imageCaption: 'A frame from Command King’s repository demo.',
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
  {
    title: 'Tauri — Upload Plugin', logo: 'T', logoImage: tauriLogo,
    tags: [{ label: 'Rust', color: 'orange' }, { label: 'TypeScript', color: 'blue' }, { label: 'Merged', color: 'green' }] as Tag[],
    description: 'Added upload and download speed reporting to Tauri’s official file-transfer plugin. Built Rust transfer tracking and exposed transferSpeed in TypeScript progress callbacks, letting apps display transfer rates without relying on JavaScript timers. Merged November 4, 2024.',
    href: 'https://github.com/tauri-apps/plugins-workspace/pull/1797', urlLabel: 'tauri-apps/plugins-workspace · PR #1797', icon: 'github' as const,
  },
  {
    title: 'ffmpeg-sidecar', logo: 'FF',
    tags: [{ label: 'Rust', color: 'orange' }, { label: 'FFmpeg', color: 'yellow' }, { label: '2 merged PRs', color: 'green' }] as Tag[],
    description: 'Made FFmpeg setup more self-contained in this Rust library. Replaced command-line curl with reqwest downloads and added the download_ffmpeg feature (#48). Replaced the external tar command with Rust archive extraction for Linux, Windows, and macOS (#51). Both PRs merged in October 2024.',
    href: 'https://github.com/nathanbabcock/ffmpeg-sidecar', urlLabel: 'nathanbabcock/ffmpeg-sidecar', icon: 'github' as const,
    links: [{ label: 'PR #48 · reqwest downloads', href: 'https://github.com/nathanbabcock/ffmpeg-sidecar/pull/48' }, { label: 'PR #51 · Rust archive extraction', href: 'https://github.com/nathanbabcock/ffmpeg-sidecar/pull/51' }],
  },
];

export const repositoryLink = 'https://github.com/VirtualPirate?tab=repositories';

export const linkedInArticles = [
  { title: 'Technical Debt Carved in Stone: Why Your DB Schema is the Most Important Decision You’ll Make', description: 'On database schemas as the foundation of backend systems.', href: 'https://www.linkedin.com/pulse/technical-debt-carved-stone-why-your-db-schema-most-important-sameen-wqizc/', tags: [{ label: 'Databases', color: 'blue' }, { label: 'System design', color: 'purple' }] as Tag[] },
  { title: 'The Upsert–Prune Synchronization Pattern: Keeping Data in Sync Without Webhooks', description: 'Keeping local data in sync with third-party APIs when webhooks aren’t available.', href: 'https://www.linkedin.com/pulse/upsertprune-synchronization-pattern-keeping-data-sync-artaza-sameen-sdaec/', tags: [{ label: 'Data pipelines', color: 'green' }, { label: 'APIs', color: 'blue' }] as Tag[] },
];
