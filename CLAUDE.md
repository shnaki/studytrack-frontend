# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

StudyTrack Frontend — a learning progress tracking web app built with Next.js 16, React 19, TypeScript, and Tailwind CSS v4. The API specification is in `docs/openapi.yaml`.

## Commands

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run lint` — run ESLint (includes unused-import checks)
- `npx prettier --check .` — check formatting
- `npx prettier --write .` — auto-format

No test framework is configured yet.

## Architecture

- **Next.js App Router** — all pages/layouts live under `src/app/`
- **React Compiler** enabled in `next.config.ts` (`reactCompiler: true`)
- **Path alias**: `@/*` maps to `./src/*`

## Code Style & Conventions

- **No semicolons**, single quotes, trailing commas, 90-char print width (`.prettierrc`)
- **Import order** (auto-sorted by Prettier plugin): `react` → `next` → third-party → `@/` aliases → relative
- **Unused imports** are errors (auto-fixed by `eslint-plugin-unused-imports`); unused vars prefixed with `_` are allowed
- **CSS utilities**: use `clsx` for conditional classes and `twMerge` for merging Tailwind classes (both are registered as `tailwindFunctions` in Prettier config)
- **Tailwind CSS v4** via PostCSS — dark mode uses `prefers-color-scheme`
- **Fonts**: Geist (sans) and Geist Mono via `next/font/google`, applied as CSS variables `--font-geist-sans` / `--font-geist-mono`
