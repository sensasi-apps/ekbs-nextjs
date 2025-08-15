'use client'
import useAuthInfo from '@/hooks/use-auth-info'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

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
            const redirectTo = searchParams?.get('redirectTo') ?? '/dashboard'

            replace(redirectTo)
        }
    }, [authInfo, pathname, replace, searchParams])
}
