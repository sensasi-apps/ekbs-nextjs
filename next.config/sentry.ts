import { withSentryConfig, type SentryBuildOptions } from '@sentry/nextjs'
import type { NextConfig } from 'next'

const SENTRY_CONFIG: SentryBuildOptions = {
    disableLogger: true,

    org: 'sensasi-apps',

    project: 'ekbs-nextjs',

    silent: !process.env.CI,

    sourcemaps: {
        deleteSourcemapsAfterUpload: true,
    },

    widenClientFileUpload: true,
}

export default function withSentry(nextConfig: NextConfig) {
    return withSentryConfig(nextConfig, SENTRY_CONFIG)
}
