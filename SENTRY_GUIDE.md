# Sentry setup (beauty-salon-2)

Short reference for error reporting and User Feedback. Track implementation against [Issue #3](https://github.com/Matrincho/beauty-salon-2/issues/3).

---

## 1. Account and project

1. Go to [sentry.io](https://sentry.io) and sign up (or log in).
2. Create an **organization** if prompted.
3. **Create project** → choose **Next.js** (matches this repo).
4. Note the **DSN** from *Project → Settings → Client Keys (DSN)*. You will not commit it.

---

## 2. Environment variables

Add to `.env.local` (local only; never commit real values):

| Variable | Purpose |
|----------|---------|
| `SENTRY_DSN` | Browser and server event ingestion |
| `NEXT_PUBLIC_SENTRY_DSN` | If you split public/client DSN (follow wizard output) |
| `SENTRY_AUTH_TOKEN` | Upload source maps in CI/build (optional but recommended) |
| `SENTRY_ORG`, `SENTRY_PROJECT` | Often set by the Sentry Next.js plugin for releases |

Copy the exact names from the Sentry onboarding / `@sentry/nextjs` wizard after you run it—they must match what `sentry.*.config` files expect.

On **Vercel** (or your host): add the same keys under Project → Settings → Environment Variables, per environment (Production / Preview / Development).

---

## 3. Install SDK

From the repo root:

```bash
npx @sentry/wizard@latest -i nextjs --saas --org futuremadeai --project beuty-salon-demo
```

If the wizard cannot run in a non-interactive shell, apply the same files manually (`instrumentation-client.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`, `instrumentation.ts`, `app/global-error.tsx`) and wire `next.config`. **Do not** keep both `sentry.client.config.ts` and `instrumentation-client.ts` with `Sentry.init()` — Next.js + Turbopack expects a single client entry (see `@sentry/nextjs` docs).

---

## 4. User Feedback

In Sentry: **Project → Settings → User Feedback** (or enable via SDK per current docs). The Next.js integration typically exposes a widget you can trigger from the client; align with whatever the wizard generated.

Verify: open the app, trigger the feedback UI, confirm the event appears under **User Feedback** in the project.

---

## 5. Verify errors

1. Trigger a test exception in dev (e.g. temporary button that throws).
2. In Sentry: **Issues** → confirm the error, environment (`development` / `production`), and release if configured.

---

## 6. GitHub (optional)

Sentry → **Settings → Integrations → GitHub**: connect the org/repo to link commits/releases and stack traces to code.

---

## Links

- [Sentry for Next.js](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [User Feedback](https://docs.sentry.io/platforms/javascript/guides/nextjs/user-feedback/)
