import { withSentryConfig } from '@sentry/nextjs'
import type { NextConfig } from 'next'

const SENTRY_CONFIG = {
    org: 'sensasi-apps',
    project: 'ekbs-nextjs',

    // An auth token is required for uploading source maps.
    authToken: process.env.SENTRY_AUTH_TOKEN,

    silent: false, // Can be used to suppress logs

    sourcemaps: {
        disable: process.env.VERCEL_ENV !== `production`,
    },

    telemetry: process.env.VERCEL_ENV === `production`,
}

export default function withSentry(nextConfig: NextConfig) {
    return withSentryConfig(nextConfig, SENTRY_CONFIG)
}
