import { withSentryConfig, type SentryBuildOptions } from '@sentry/nextjs'
import type { NextConfig } from 'next'

const SENTRY_CONFIG: SentryBuildOptions = {
    disableLogger: true,

    org: 'sensasi-apps',

    project: 'ekbs-nextjs',

    silent: !process.env.CI,

    sourcemaps: {
        deleteSourcemapsAfterUpload: true,

        disable: process.env.VERCEL_ENV !== `production`,
    },

    widenClientFileUpload: true,
}

export default function withSentry(nextConfig: NextConfig) {
    return withSentryConfig(nextConfig, SENTRY_CONFIG)
}
