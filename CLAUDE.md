# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

Run all commands from the project root:

- `npm run dev` - Start development server at localhost:4321
- `npm run build` - Build production site to ./dist/
- `npm run preview` - Preview production build locally  
- `npm run astro` - Access Astro CLI commands

## Project Architecture

This is an Astro-based portfolio website for Peggie Zhong (Developer Advocate) with the following structure:

### Core Technologies
- **Astro 5.12.3** - Static site generator with modern web framework
- **Tailwind CSS 4.1.11** - Utility-first CSS framework with custom theme
- **MDX** - Markdown with JSX components for blog content
- **TypeScript** - Type safety and better developer experience

### Content Architecture
- **Blog System**: Content collections in `src/content/blog/` using Astro's content layer
  - Schema defined in `src/content/config.ts` with title, pubDate, tags, and draft fields
  - Blog posts are MDX files with frontmatter
  - Collection automatically sorted by publication date

### Component Structure
- **BaseLayout.astro** - Main layout wrapper with Header/Footer
- **BaseHead.astro** - HTML head with SEO and meta tags
- **Hero.astro** - Homepage hero section
- **ProjectCard.astro** - Reusable project showcase component
- **Header.astro/Footer.astro** - Site navigation and footer

### Styling System
- Custom Tailwind config with:
  - CSS variables for theming (bg, fg, accent, code-bg, border)
  - Inter font for sans-serif, JetBrains Mono for monospace
  - Custom line-clamp utilities for text truncation
- Global styles in `src/styles/global.css` with smooth scrolling and transitions

### Site Configuration
- Constants in `src/consts.ts`:
  - Site metadata (title, description, author)
  - Navigation items
  - Personal contact information
  - SEO defaults

### Page Structure
- **Homepage** (`src/pages/index.astro`): Hero + Featured Projects + Recent Blog Posts
- **Blog** (`src/pages/blog/`): Collection-based blog with individual post pages
- **Projects** (`src/pages/projects/`): Project showcase pages

### Key Features
- Static site generation with dynamic content collections
- SEO-optimized with structured metadata
- Responsive design with mobile-first approach
- Smooth animations and transitions
- Type-safe content schema with Zod validation

## Development Notes

The site uses Astro's content collections for blog management. When adding new blog posts, create MDX files in `src/content/blog/` following the schema in `config.ts`. The homepage automatically displays the 3 most recent posts.

Custom CSS variables allow for easy theming changes in the Tailwind config. The typography plugin is included for rich text content in blog posts.