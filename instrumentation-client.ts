import { getCurrentAuthInfo } from '@/providers/Auth/functions/getCurrentAuthInfo'
import * as Sentry from '@sentry/nextjs'

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart

if (
    process.env.NEXT_PUBLIC_SENTRY_DSN &&
    process.env.NODE_ENV === 'production'
) {
    Sentry.init({
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

        // Replay may only be enabled for the client-side
        integrations: [Sentry.replayIntegration()],

        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for performance monitoring.
        // We recommend adjusting this value in production
        tracesSampleRate: 1.0,

        // Capture Replay for 10% of all sessions,
        // plus for 100% of sessions with an error
        // replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,

        // ...

        // Note: if you want to override the automatic release value, do not set a
        // `release` value here - use the environment variable `SENTRY_RELEASE`, so
        // that it will also get attached to your source maps
    })

    const user = getCurrentAuthInfo()

    Sentry.setUser(
        user
            ? {
                  id: user.id,
                  username: user.name,
              }
            : null,
    )
}
