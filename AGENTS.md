# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Project Overview

Restia is a personal blog site ("Pyon Pyon Today" / pyonpyon.today) built with Astro 7, React 19 (for islands), and
TypeScript. Blog posts are written in Markdown with frontmatter metadata stored in `src/content/posts/`.

## Commands

- `yarn install` - Install dependencies (Yarn 4 with `nodeLinker: node-modules` via `.yarnrc.yml`)
- `yarn develop` - Start dev server at localhost:4321
- `yarn build` - Production build (outputs to `dist/`)
- `yarn preview` - Serve production build locally
- `yarn lint` - Run all linters (ESLint + Prettier check, via concurrently)
- `yarn lint:eslint` - ESLint only
- `yarn lint:format` - Prettier check only
- `yarn fix` - Auto-fix ESLint then Prettier
- `yarn test` - Alias for `yarn lint`
- `yarn playwright test` - E2E tests (Playwright, requires running site; uses `RESTIA_E2E_URL` env var, defaults to
  localhost:4321)
- `RESTIA_E2E_URL=http://127.0.0.1:<port> yarn playwright test tests/post-entry-layout.spec.ts --project=chromium --reporter=line` -
  Focused regression test for homepage post-entry layout stability while cover images load

Node version: 24.15.0 (see `.node-version`, managed by proto)

When the system `node`/`yarn` resolves to a broken Homebrew Node, prefer the proto shims:
`PATH=/Users/kafuuchino/.proto/shims:$PATH yarn ...`.

Astro may choose another port if `4321` is occupied; pass the actual URL through `RESTIA_E2E_URL` when running
Playwright.

## Architecture

### Content Pipeline

- **Posts**: Markdown files in `src/content/posts/` with frontmatter (`title`, `date`, `tags`, `category`, `cover`,
  `update`). Named `YYYY-MM-<slug>.md`.
- **Content collections**: Defined in `src/content.config.ts` with Zod schema and `glob()` loader.
- **Static assets**: `public/photo/`, `public/image/`, `public/lilypond/` - served as-is by Astro.
- **Responsive image artifacts**: `src/util/images.ts` stores reusable processed images in `.cache/restia-images/` and
  materializes served files into `public/_img/` for dev plus `dist/_img/` during production builds.
- **Slug generation**: Post IDs from filenames (via `generateId` in content config). Routes at `/p/<id>`.
- **Pagination**: 9 posts per page. First page is `src/pages/index.astro`, subsequent pages use
  `src/pages/page/[page].astro` at `/page/<n>`.

### Styling

Astro scoped CSS via `<style>` blocks in `.astro` components. Global styles in `src/styles/global.css`.

Typography scale uses CSS `pow()` with custom properties `--font-ratio-primary` (1.5) and `--font-ratio-secondary`
(1.25). Responsive breakpoints: small (<=1070px), large (1071-1430px), hires (>=1431px).

### Key Files

- `astro.config.ts` - Site config, integrations (React, Sitemap), remark/rehype plugins
- `src/content.config.ts` - Zod schema for posts collection
- `src/layouts/Layout.astro` - Root layout with parallax background, nav, SEO meta, ClientRouter
- `src/components/PostEntry.astro` - Post card with dynamic grid spans (string-width based)
- `src/components/PostEntryList.astro` - Responsive post grid
- `src/components/Comments.tsx` - React island for Disqus (client:visible)
- `src/pages/p/[...slug].astro` - Individual post pages
- `src/pages/page/[page].astro` - Paginated post list
- `src/pages/rss.xml.ts` - RSS feed endpoint (latest 16 posts)
- `src/plugins/remark-audio.ts` - Custom remark plugin for audio embeds

### TypeScript Config

Single `tsconfig.json` extending `astro/tsconfigs/strict`.

## Code Conventions

- **Module system**: Strict ESM (`"type": "module"` in package.json). Local imports use explicit `.ts` extensions.
- **Formatting**: Prettier with 120 print width, no semicolons, single quotes, 4-space indent (2 for YAML).
  `prettier-plugin-astro` for `.astro` files.
- **Imports**: `eslint-plugin-simple-import-sort` enforces sorted imports; use `type` imports (`consistent-type-imports`
  rule)
- **Naming**: camelCase default, PascalCase for types, `T`-prefixed type parameters (enforced by
  `@typescript-eslint/naming-convention`)
- **Commits**: Conventional commits via commitizen/cz-customizable. Types: `feat`, `fix`, `docs`, `refactor`, `style`,
  `test`, `chore`
- **Main branch**: `incarnation`

## CI

GitHub Actions (`.github/workflows/main.yml`):

- **build** job: build → lint → deploy to Cloudflare Pages (from `dist/`)
- **e2e** job (depends on build): Playwright tests against the deployed URL
- Both jobs use `step-security/harden-runner` with `egress-policy: audit`
