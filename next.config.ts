import type { NextConfig } from 'next'

import withSerwist from './next.config/serwist'
import withSentry from './next.config/sentry'

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

export default withSentry(withSerwist(nextConfig))
