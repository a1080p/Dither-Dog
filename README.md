# Dither Dog

Real-time dithering effect web-based application

## Features

- **Next.js 15** with App Router
- **React 19** for interactive components
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **MDX Blog** with markdown support
- **Responsive Design** that works on all devices

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
greatt/
├── app/                  # Next.js app directory
│   ├── blog/            # Blog pages
│   ├── about/           # About page
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Homepage
│   └── globals.css      # Global styles
├── components/          # React components
│   ├── Navigation.tsx   # Navigation bar
│   ├── InteractiveCounter.tsx
│   └── AnimatedCard.tsx
├── content/             # Blog content
│   └── blog/           # Blog posts (markdown)
├── lib/                # Utility functions
│   └── blog.ts         # Blog utilities
└── public/             # Static assets
```

## Adding Blog Posts

Create a new markdown file in `content/blog/` with frontmatter:

```markdown
---
title: "Your Post Title"
date: "2025-01-22"
excerpt: "A brief description"
readTime: "5 min read"
---

Your content here...
```

## Building for Production

```bash
npm run build
npm start
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)

## License

MIT
