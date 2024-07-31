import { withSentryConfig } from '@sentry/nextjs'
import withSerwistInit from '@serwist/next'

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    reactStrictMode: true,
    rewrites() {
        return [
            {
                source: '/api/oauth/:path*',
                destination:
                    process.env.NEXT_PUBLIC_BACKEND_URL + '/oauth/:path*',
            },
        ]
    },
}

const withSerwist = withSerwistInit({
    swSrc: 'src/sw/index.ts',
    swDest: 'public/sw.js',
})

export default withSentryConfig(withSerwist(nextConfig), {
    org: 'sensasi-apps',
    project: 'ekbs-nextjs',

    // An auth token is required for uploading source maps.
    authToken: process.env.SENTRY_AUTH_TOKEN,

    silent: false, // Can be used to suppress logs
})
