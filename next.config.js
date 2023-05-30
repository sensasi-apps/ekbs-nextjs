module.exports = {
    async rewrites() {
        return [
            {
                source: '/auth/google/callback',
                destination: 'http://localhost:8000/auth/google/callback',
            },
            {
                source: '/api/auth/:path*',
                destination: 'http://localhost:8000/api/auth/:path*',
            },
        ]
    },
}
