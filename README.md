# Maison Élite

Marketing site for **Maison Élite**, a luxury beauty salon brand. The app is a **visual prototype** with a “quiet luxury” look: landing page, services and social proof sections, and secondary pages for booking, contact, team, careers, and about.

Content is localized for **Bulgarian** (default HTML `lang`) and **English** via a client-side `LanguageProvider` and shared translation maps in `lib/i18n/`.

## Stack

| Layer | Technology |
|--------|------------|
| Framework | [Next.js](https://nextjs.org/) 16 (App Router) |
| UI | [React](https://react.dev/) 19 |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) v4, [PostCSS](https://postcss.org/) |
| Components | [Radix UI](https://www.radix-ui.com/) primitives, [shadcn/ui](https://ui.shadcn.com/)–style setup (`components.json`, “New York” style) |
| Forms | [react-hook-form](https://react-hook-form.com/), [Zod](https://zod.dev/), [@hookform/resolvers](https://github.com/react-hook-form/resolvers) |
| Icons | [Lucide React](https://lucide.dev/) |
| Fonts | [next/font](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) — Geist, Geist Mono, Playfair Display |
| Charts / misc UI | [Recharts](https://recharts.org/), [Embla Carousel](https://www.embla-carousel.com/), [Sonner](https://sonner.emilkowal.ski/) (toasts), [Vaul](https://vaul.emilkowal.ski/) (drawers), [cmdk](https://cmdk.paco.me/) |
| Observability | [Sentry](https://sentry.io/) (`@sentry/nextjs`), [Vercel Analytics](https://vercel.com/docs/analytics) |

ESLint uses `eslint-config-next`. Animations: `tw-animate-css`.

## Prerequisites

- **Node.js** (LTS recommended) and **npm** (or compatible client)

## Getting started

Install dependencies and run the dev server (default port **8080**):

```bash
npm install
npm run dev
```

Open [http://localhost:8080](http://localhost:8080).

Other scripts:

```bash
npm run build   # production build
npm run start   # run production server (after build)
npm run lint    # ESLint
```

## Project layout (short)

- `app/` — App Router: `layout.tsx`, `globals.css`, home `page.tsx`, and routes under `booking/`, `contact/`, `team/`, `careers/`, `about/`
- `components/` — `sections/` (hero, services, gallery, FAQ, …), `navigation/`, `footer/`, reusable `ui/`
- `lib/` — utilities (`lib/utils.ts`), i18n (`lib/i18n/`)
- `hooks/` — shared React hooks

Sentry is wired via `next.config.mjs`, `sentry.*.config.ts`, and `instrumentation*.ts`. Configure DSN and org/project via environment variables as described in the [Sentry Next.js docs](https://docs.sentry.io/platforms/javascript/guides/nextjs/) when deploying or debugging reporting locally.

## Notes for contributors

- Path alias `@/` maps to the repo root (see `tsconfig.json`).
- `next.config.mjs` currently sets `typescript.ignoreBuildErrors: true` and `images.unoptimized: true`; adjust if you need stricter CI or optimized images.
