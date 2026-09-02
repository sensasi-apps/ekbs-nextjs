'use client'

import type { Route } from 'next'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import useAuthInfo from '@/hooks/use-auth-info'
import { currentAuthInfoPromise } from '@/lib/axios'

export default function RedirectIfAuth() {
    useAuthOnly()

    return null
}

function useAuthOnly() {
    const authInfo = useAuthInfo()
    const [isInitialized, setIsInitialized] = useState(false)
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const { replace } = useRouter()

    useEffect(() => {
        currentAuthInfoPromise.then(
            () => setIsInitialized(true),
            () => setIsInitialized(true),
        )
    }, [])

    useEffect(() => {
        if (
            isInitialized &&
            authInfo &&
            pathname &&
            !['/logout', '/policy'].includes(pathname)
        ) {
            const redirectTo =
                (searchParams?.get('redirectTo') as Route) ?? '/dashboard'

            replace(redirectTo)
        }
    }, [authInfo, isInitialized, pathname, replace, searchParams])
}
