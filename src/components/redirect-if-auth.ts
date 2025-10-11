'use client'

import type { Route } from 'next'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import useAuthInfo from '@/hooks/use-auth-info'

export default function RedirectIfAuth() {
    useAuthOnly()

    return null
}

function useAuthOnly() {
    const authInfo = useAuthInfo()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const { replace } = useRouter()

    useEffect(() => {
        if (
            authInfo &&
            pathname &&
            !['/logout', '/policy'].includes(pathname)
        ) {
            const redirectTo =
                (searchParams?.get('redirectTo') as Route) ?? '/dashboard'

            replace(redirectTo)
        }
    }, [authInfo, pathname, replace, searchParams])
}
