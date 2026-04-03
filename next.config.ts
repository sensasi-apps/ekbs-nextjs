import type { NextConfig } from 'next'

import withBundleAnalyzer from './next.config/bundle-analyzer'
import withSentry from './next.config/sentry'
import withSerwist from './next.config/serwist'

const nextConfig: NextConfig = {
    enablePrerenderSourceMaps: process.env.NODE_ENV === 'production',

    experimental: {
        /**
         * Not listed all packages because this config has some libraries are optimized by default
         *
         * @see https://nextjs.org/docs/app/api-reference/config/next-config-js/optimizePackageImports
         */
        optimizePackageImports: ['@mui/x-date-pickers', 'recharts', 'formik'],

        preloadEntriesOnStart: false,

        serverSourceMaps: process.env.NODE_ENV === 'production',
    },

    logging: {
        browserToTerminal: false,
    },

    pageExtensions: ['ts', 'tsx'],

    productionBrowserSourceMaps: process.env.NODE_ENV === 'production',

    reactCompiler: true,

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

    typescript: {
        ignoreBuildErrors: process.env.NODE_ENV !== 'production',
    },
}

const baseConfig = withSentry(withSerwist(nextConfig))

const exportDefault =
    process.env.ANALYZE === 'true'
        ? withBundleAnalyzer(baseConfig)
        : process.env.NODE_ENV == 'production'
          ? baseConfig
          : nextConfig

export default exportDefault
