import * as Sentry from '@sentry/nextjs'

if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'production') {
    Sentry.init({
        dsn: 'https://0abfd6d239ca40fbadc2d0f9606e1e3b@o1289319.ingest.sentry.io/4505351364870144',

        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for performance monitoring.
        // We recommend adjusting this value in production
        tracesSampleRate: 1.0,

        // ...

        // Note: if you want to override the automatic release value, do not set a
        // `release` value here - use the environment variable `SENTRY_RELEASE`, so
        // that it will also get attached to your source maps
    })
}
