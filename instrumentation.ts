import * as Sentry from '@sentry/nextjs'
import type { Instrumentation } from 'next'

export const onRequestError: Instrumentation.onRequestError = (...args) => {
  Sentry.captureRequestError(...args)
}

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config')
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config')
  }
}
