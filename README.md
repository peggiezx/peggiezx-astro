# Peggie Zhong - Developer Advocate Portfolio

A modern, responsive portfolio website built with Astro 5, showcasing projects, blog posts, and video content. Features glassmorphism design, content collections, and dynamic functionality.

## 🌟 Features

- **Modern Design**: Glassmorphism effects with responsive layout
- **Content Management**: Astro content collections for blogs and projects
- **Dynamic Sections**: Expandable project, blog, and video sections
- **SEO Optimized**: Meta tags, structured data, and semantic HTML
- **Performance First**: Static site generation with Astro
- **Responsive**: Mobile-first design that works on all devices
- **Blog System**: MDX support with frontmatter and topic organization
- **Project Showcase**: Detailed project pages with tech stacks
- **Video Integration**: YouTube video cards with metadata

## 🚀 Tech Stack

- **Framework**: [Astro 5.12.3](https://astro.build)
- **Styling**: [Tailwind CSS 4.1.11](https://tailwindcss.com)
- **Content**: [MDX](https://mdxjs.com) with Astro content collections
- **Deployment**: Static site generation
- **Development**: TypeScript, PostCSS, Autoprefixer

## 📁 Project Structure

```text
/
├── public/
│   ├── images/           # Static images and assets
│   └── favicon.ico
├── src/
│   ├── assets/           # Optimized images and assets
│   │   └── projects/     # Project screenshots
│   ├── components/       # Reusable components
│   │   ├── BaseHead.astro
│   │   ├── Header.astro
│   │   ├── Hero.astro
│   │   └── Footer.astro
│   ├── content/          # Content collections
│   │   ├── blog/         # Blog posts (MDX)
│   │   ├── projects/     # Project descriptions
│   │   └── config.ts     # Content schema definitions
│   ├── layouts/          # Layout components
│   │   └── BaseLayout.astro
│   ├── pages/            # Page routes
│   │   ├── index.astro   # Homepage
│   │   ├── blog/         # Blog routes
│   │   │   └── [...slug].astro
│   │   └── projects/     # Project routes
│   │       └── [...slug].astro
│   ├── styles/           # Global styles
│   │   └── global.css
│   └── consts.ts         # Site configuration
├── astro.config.mjs      # Astro configuration
├── tailwind.config.mjs   # Tailwind configuration
└── package.json
```

## 🛠️ Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/peggiezx/peggiezx-astro.git
cd peggiezx-astro
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm run dev
```

The site will be available at `http://localhost:4321`

### Commands

| Command | Action |
| :--- | :--- |
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server at `localhost:4321` |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview build locally |
| `npm run astro` | Access Astro CLI commands |

## 📝 Content Management

### Adding Blog Posts

Create MDX files in `src/content/blog/` with this structure:

```yaml
---
title: "Your Post Title"
description: "Brief description"
pubDate: 2024-01-15
tags: ["tag1", "tag2"]
draft: false
---

Your content here...
```

Blog posts are automatically organized by topic (folder structure) and sorted by publication date.

### Adding Projects

Create markdown files in `src/content/projects/` with this structure:

```yaml
---
title: "Project Name"
description: "Project description"
image: "../../assets/projects/project-image.png"
github: "https://github.com/username/repo"
demo: "https://project-demo.com"
stack: ["React", "Node.js", "MongoDB"]
featured: true
---

Detailed project description...
```

## 🎨 Customization

### Site Configuration

Update `src/consts.ts` to customize:
- Site title and description
- Navigation items
- Personal information
- SEO defaults

### Styling

The site uses Tailwind CSS with custom CSS variables for theming. Key files:
- `src/styles/global.css` - Global styles and CSS variables
- `tailwind.config.mjs` - Tailwind configuration
- Component-specific styles in `.astro` files

### Theme Colors

```css
:root {
  --bg: #ffffff;
  --fg: #2d3748;
  --accent: #3182ce;
  --success: #38a169;
  /* ... */
}
```

## 🚀 Deployment

The site builds to static files and can be deployed to any static hosting service:

1. Build the site
```bash
npm run build
```

2. Deploy the `dist/` folder to your hosting provider

### Recommended Hosting
- [Netlify](https://netlify.com)
- [Vercel](https://vercel.com)
- [GitHub Pages](https://pages.github.com)
- [Cloudflare Pages](https://pages.cloudflare.com)

## 📱 Features in Detail

### Expandable Sections
- **Projects**: Shows 2 initially, expands to show all
- **Blog**: Shows 1 topic initially, expands to show all topics
- **Videos**: Shows 2 initially, expands to show all

### Blog Navigation
- Previous/Next navigation within the same topic
- Topic-scoped navigation (doesn't cross between different projects)
- Responsive card layout with clear visual hierarchy

### Responsive Design
- Mobile-first approach
- Fixed margins with flexible content gaps
- Glassmorphism effects that work across devices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Peggie Zhong**
- Portfolio: [peggiezx.github.io](https://peggiezx.github.io)
- GitHub: [@peggiezx](https://github.com/peggiezx)
- Email: peggiezx@gmail.com

---

Built with ❤️ using [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com)