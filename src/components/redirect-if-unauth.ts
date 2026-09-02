'use client'

import type { Route } from 'next'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import useAuthInfo from '@/hooks/use-auth-info'
import { currentAuthInfoPromise } from '@/lib/axios'

export default function RedirectIfUnauth() {
    const { push } = useRouter()
    const authInfo = useAuthInfo()
    const [isInitialized, setIsInitialized] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        currentAuthInfoPromise.then(
            () => setIsInitialized(true),
            () => setIsInitialized(true),
        )
    }, [])

    useEffect(() => {
        if (!isInitialized || !pathname || authInfo) return

        const toLocation: Route = ['/logout', '/policy'].includes(pathname)
            ? '/'
            : `/login?redirectTo=${pathname}`

        push(toLocation)
    }, [authInfo, isInitialized, pathname, push])

    return null
}
