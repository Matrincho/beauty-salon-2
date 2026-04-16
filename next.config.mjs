import { withSentryConfig } from '@sentry/nextjs'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Default Server Action body limit is 1 MB. Avatar uploads need room above the 5 MB app/bucket cap for multipart overhead.
  // Next 15+ reads top-level `serverActions`; keep experimental copy for older config normalizers / Sentry merges.
  serverActions: {
    bodySizeLimit: '6mb',
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '6mb',
    },
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
    ],
  },
}

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "futuremadeai",

  project: "beuty-salon-demo",

  // Turbopack runs release creation + source map upload in `runAfterProductionCompile`. Vercel
  // often sets SENTRY_AUTH_TOKEN (integration or placeholder); an invalid token still makes
  // sentry-cli fail and the deployment goes red. Opt-in only: set SENTRY_UPLOAD_SOURCEMAPS=true
  // in env when you have a valid token and want uploads. Default = skip upload, deploy succeeds.
  ...(process.env.SENTRY_UPLOAD_SOURCEMAPS === 'true'
    ? {}
    : {
        sourcemaps: { disable: true },
        useRunAfterProductionCompileHook: false,
      }),

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  // tunnelRoute: "/monitoring",

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },
});
