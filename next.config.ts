import type { NextConfig } from 'next'

import { withSentryConfig } from '@sentry/nextjs'
import withSerwistInit from '@serwist/next'

const nextConfig: NextConfig = {
    reactStrictMode: true,

    /** DISABLED DUE #328 changes */
    // rewrites() {
    //     return [
    //         {
    //             source: '/api/oauth/:path*',
    //             destination:
    //                 process.env.NEXT_PUBLIC_BACKEND_URL + '/oauth/:path*',
    //         },
    //     ]
    // },
}

const withSerwist = withSerwistInit({
    swSrc: 'src/sw.ts',
    swDest: 'public/sw.js',
    exclude: [/public\/sw.js/, /dynamic-css-manifest.json/], // explicitly excluding the file causing problem
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
})
