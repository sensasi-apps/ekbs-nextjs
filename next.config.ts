import type { NextConfig } from 'next'

import { withSentryConfig } from '@sentry/nextjs'
import withSerwistInit from '@serwist/next'

const nextConfig: NextConfig = {
    reactStrictMode: true,

    async rewrites() {
        return [
            {
                source: '/oauth/:path*',
                destination:
                    process.env.NEXT_PUBLIC_BACKEND_URL + '/oauth/:path*',
            },
            {
                source: '/oauth/:path*/callback',
                destination:
                    process.env.NEXT_PUBLIC_BACKEND_URL +
                    '/oauth/:path*/callback',
            },
        ]
    },
}

const withSerwist = withSerwistInit({
    swSrc: 'src/sw.ts',
    swDest: 'public/sw.js',

    /**
     * @see https://github.com/serwist/serwist/discussions/228
     */
    exclude: [
        // https://github.com/shadowwalker/next-pwa/issues/424#issuecomment-1332258575
        ({ asset }) => {
            // Add here any file that fails pre-caching
            const excludeList = [
                // Default Serwist https://serwist.pages.dev/docs/next/configuring/exclude
                /\.map$/,
                /^manifest.*\.js$/,
                /^server\//,
                /^(((app-)?build-manifest|react-loadable-manifest|dynamic-css-manifest)\.json)$/,
            ]
            if (excludeList.some(r => r.test(asset.name))) {
                return true
            }
            return false
        },
    ],
    reloadOnOnline: false,
})

export default withSentryConfig(withSerwist(nextConfig), {
    org: 'sensasi-apps',
    project: 'ekbs-nextjs',

    // An auth token is required for uploading source maps.
    authToken: process.env.SENTRY_AUTH_TOKEN,

    silent: false, // Can be used to suppress logs

    sourcemaps: {
        disable: process.env.VERCEL_ENV !== `production`,
    },

    telemetry: process.env.VERCEL_ENV === `production`,
})
