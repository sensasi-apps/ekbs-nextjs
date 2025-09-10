import type { NextConfig } from 'next'

// import withBundleAnalyzer from './next.config/bundle-analyzer'
import withMDX from './next.config/mdx'
import withSentry from './next.config/sentry'
// import withSerwist from './next.config/serwist'
// import withRspack from './next.config/rspack'

const nextConfig: NextConfig = {
    pageExtensions: ['md', 'mdx', 'ts', 'tsx'],

    productionBrowserSourceMaps: true,

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

    transpilePackages: [
        '@mui/icons-material',
        '@mui/material',
        '@mui/lab',
        '@mui/material-nextjs',
        '@mui/x-date-pickers',
    ],
}

export default withSentry(withMDX(nextConfig))
