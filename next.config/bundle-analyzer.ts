import withBundleAnalyzerInit from '@next/bundle-analyzer'

const withBundleAnalyzer = withBundleAnalyzerInit({
    enabled: process.env.ANALYZE === 'true',
})

export default withBundleAnalyzer
