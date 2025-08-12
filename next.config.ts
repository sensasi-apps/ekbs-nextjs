import type { NextConfig } from 'next'

import withBundleAnalyzer from './next.config/bundle-analyzer'
import withSentry from './next.config/sentry'
import withSerwist from './next.config/serwist'

const nextConfig: NextConfig = {
    reactStrictMode: true,

    experimental: {
        optimizePackageImports: ['@mui/x-date-pickers', 'recharts'],
    },

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

export default withBundleAnalyzer(withSentry(withSerwist(nextConfig)))
