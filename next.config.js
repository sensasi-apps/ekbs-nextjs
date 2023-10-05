// eslint-disable-next-line
const runtimeCaching = require('next-pwa/cache')
// eslint-disable-next-line
const withPWA = require('next-pwa')({
    dest: 'public',
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
    reloadOnOnline: false,
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
    rewrites() {
        return [
            {
                source: '/api/oauth/:path*',
                destination:
                    process.env.NEXT_PUBLIC_BACKEND_URL + '/oauth/:path*',
            },
        ]
    },

    sentry: {
        hideSourceMaps: true,
    },
})

// eslint-disable-next-line
const { withSentryConfig } = require('@sentry/nextjs')

module.exports = withSentryConfig(nextConfig)
