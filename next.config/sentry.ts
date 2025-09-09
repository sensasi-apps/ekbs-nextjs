import { withSentryConfig, type SentryBuildOptions } from '@sentry/nextjs'
import type { NextConfig } from 'next'

const SENTRY_CONFIG: SentryBuildOptions = {
    // An auth token is required for uploading source maps.
    authToken: process.env.SENTRY_AUTH_TOKEN,

    org: 'sensasi-apps',

    project: 'ekbs-nextjs',

    silent: false, // Can be used to suppress logs

    telemetry: false,

    widenClientFileUpload: true,
}

export default function withSentry(nextConfig: NextConfig) {
    return withSentryConfig(nextConfig, SENTRY_CONFIG)
}
