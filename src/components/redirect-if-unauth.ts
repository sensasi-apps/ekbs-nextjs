'use client'

import type { Route } from 'next'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
// providers
import useAuthInfo from '@/hooks/use-auth-info'

export default function RedirectIfUnauth() {
    const { push } = useRouter()
    const authInfo = useAuthInfo()
    const pathname = usePathname()

    useEffect(() => {
        if (!pathname || authInfo) return

        const toLocation: Route = ['/logout', '/policy'].includes(pathname)
            ? '/'
            : `/login?redirectTo=${pathname}`

        push(toLocation)
    }, [authInfo, pathname, push])

    return null
}
