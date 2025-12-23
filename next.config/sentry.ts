import { type SentryBuildOptions, withSentryConfig } from '@sentry/nextjs'
import type { NextConfig } from 'next'

const SENTRY_CONFIG: SentryBuildOptions = {
    org: 'sensasi-apps',

    project: 'ekbs-nextjs',

    silent: !process.env.CI,

    sourcemaps: {
        deleteSourcemapsAfterUpload: true,

        disable: process.env.VERCEL_ENV !== `production`,
    },

    telemetry: process.env.VERCEL_ENV === `production`,

    widenClientFileUpload: process.env.VERCEL_ENV === `production`,
}

export default function withSentry(nextConfig: NextConfig) {
    return withSentryConfig(nextConfig, SENTRY_CONFIG)
}
