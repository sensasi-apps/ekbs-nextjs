import type { NextConfig } from 'next'

import withBundleAnalyzer from './next.config/bundle-analyzer'
import withMDX from './next.config/mdx'
import withSentry from './next.config/sentry'
import withSerwist from './next.config/serwist'
import withRspack from './next.config/rspack'

const nextConfig: NextConfig = {
    experimental: {
        optimizePackageImports: ['@mui/x-date-pickers', 'recharts'],
    },

    pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],

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

export default withBundleAnalyzer(
    withSentry(withSerwist(withMDX(withRspack(nextConfig)))),
)
