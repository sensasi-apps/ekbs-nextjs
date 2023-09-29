// eslint-disable-next-line
const withPWA = require('next-pwa')({
    dest: 'public',
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
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
