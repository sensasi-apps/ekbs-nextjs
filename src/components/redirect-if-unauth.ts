'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
// providers
import useAuthInfo from '@/hooks/use-auth-info'

export default function RedirectIfUnauth() {
    const authInfo = useAuthInfo()
    const { push } = useRouter()

    useEffect(() => {
        if (!authInfo) {
            const toLocation =
                location.pathname === '/logout'
                    ? '/'
                    : `/login?redirectTo=${location.pathname}`
            push(toLocation)
        }
    }, [authInfo, push])

    return null
}
