import withSerwistInit from '@serwist/next'

const withSerwist = withSerwistInit({
    disable: process.env.NODE_ENV !== 'production',

    /**
     * @see https://github.com/serwist/serwist/discussions/228
     */
    exclude: [
        // https://github.com/shadowwalker/next-pwa/issues/424#issuecomment-1332258575
        ({ asset }) => {
            // Add here any file that fails pre-caching
            const excludeList = [
                // Default Serwist https://serwist.pages.dev/docs/next/configuring/exclude
                /\.map$/,
                /^manifest.*\.js$/,
                /^server\//,
                /^(((app-)?build-manifest|react-loadable-manifest|dynamic-css-manifest)\.json)$/,
            ]
            if (excludeList.some(r => r.test(asset.name))) {
                return true
            }
            return false
        },
    ],

    maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10 MB

    reloadOnOnline: false,

    swDest: 'public/sw.js',

    swSrc: 'src/sw.ts',
})

export default withSerwist
