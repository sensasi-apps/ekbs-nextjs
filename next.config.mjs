import { withSentryConfig } from '@sentry/nextjs'
import runtimeCaching from 'next-pwa/cache.js'
import withPWAConstructor from 'next-pwa'

const withPWA = withPWAConstructor({
    dest: 'public',
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
    reloadOnOnline: false,
    maximumFileSizeToCacheInBytes: 2.5 * 1024 * 1024,
    runtimeCaching: [
        {
            urlPattern: new RegExp(
                `^${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user`,
            ),
            handler: 'StaleWhileRevalidate',
            options: {
                cacheName: 'auth-user-cache',
            },
        },
        {
            urlPattern: new RegExp(
                `^${process.env.NEXT_PUBLIC_BACKEND_URL}/users/search?query=`,
            ),
            handler: 'StaleWhileRevalidate',
            options: {
                cacheName: 'users-search-cache',
            },
        },
        ...runtimeCaching,
    ],
})

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = withPWA({
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
})

export default withSentryConfig(nextConfig, {
    org: 'sensasi-apps',
    project: 'ekbs-nextjs',

    // An auth token is required for uploading source maps.
    authToken: process.env.SENTRY_AUTH_TOKEN,

    silent: false, // Can be used to suppress logs
})
