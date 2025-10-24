'use client'

// vendors
import * as Sentry from '@sentry/nextjs'
import NextError from 'next/error'
import { useEffect } from 'react'
// utils
import { getCurrentAuthInfo } from '@/utils/get-current-auth-info'

export default function GlobalError({
    error,
}: {
    error: Error & { digest?: string }
}) {
    useEffect(() => {
        setSentryUser()
        Sentry.captureException(error)
    }, [error])

    return (
        <html lang="en">
            <body>
                <NextError statusCode={0} />
            </body>
        </html>
    )
}

function setSentryUser() {
    const user = getCurrentAuthInfo()

    if (user) {
        const { id, name: username } = user

        Sentry.setUser({
            id,
            username,
        })
    } else {
        Sentry.setUser(null)
    }
}
