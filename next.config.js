module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/oauth/:path*',
        destination: process.env.NEXT_PUBLIC_BACKEND_URL + '/oauth/:path*',
      }
    ]
  },
}


// Injected content via Sentry wizard below

const prod = process.env.NODE_ENV === "production";

if (prod) {
  const { withSentryConfig } = require("@sentry/nextjs");

  module.exports = withSentryConfig(
    module.exports,
    {
      // For all available options, see:
      // https://github.com/getsentry/sentry-webpack-plugin#options

      // Suppresses source map uploading logs during build
      silent: true,

      org: "sensasi-apps",
      project: "ekbs-nextjs",
    },
    {
      // For all available options, see:
      // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

      // Upload a larger set of source maps for prettier stack traces (increases build time)
      widenClientFileUpload: true,

      // Transpiles SDK to be compatible with IE11 (increases bundle size)
      transpileClientSDK: true,

      // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
      tunnelRoute: "/monitoring",

      // Hides source maps from generated client bundles
      hideSourceMaps: true,

      // Automatically tree-shake Sentry logger statements to reduce bundle size
      disableLogger: true,
    }
  );
}