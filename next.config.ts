import type { NextConfig } from 'next'

import withBundleAnalyzer from './next.config/bundle-analyzer'
import withMDX from './next.config/mdx'
import withRspack from './next.config/rspack'
import withSentry from './next.config/sentry'
import withSerwist from './next.config/serwist'

const nextConfig: NextConfig = {
    experimental: {
        /**
         * Not listed all packages because this config has some libraries are optimized by default
         *
         * @see https://nextjs.org/docs/app/api-reference/config/next-config-js/optimizePackageImports
         */
        optimizePackageImports: ['@mui/x-date-pickers', 'recharts', 'formik'],
    },

    pageExtensions: ['md', 'mdx', 'ts', 'tsx'],

    productionBrowserSourceMaps: true,

    reactStrictMode: true,

    async rewrites() {
        return [
            {
                destination:
                    process.env.NEXT_PUBLIC_BACKEND_URL + '/oauth/:path*',
                source: '/oauth/:path*',
            },
            {
                destination:
                    process.env.NEXT_PUBLIC_BACKEND_URL +
                    '/oauth/:path*/callback',
                source: '/oauth/:path*/callback',
            },
        ]
    },

    typedRoutes: true,
}

export default withBundleAnalyzer(
    withSentry(withSerwist(withMDX(withRspack(nextConfig)))),
)
