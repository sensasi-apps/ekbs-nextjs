'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
// providers
import { useLocalStorage } from '@uidotdev/usehooks'
import type AuthInfo from '@/features/user--auth/types/auth-info'

export default function RedirectIfUnauth() {
    const [authInfo] = useLocalStorage<AuthInfo | undefined>('currentAuthInfo')
    const { push } = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (!authInfo) {
            const toLocation =
                pathname === '/logout' ? '/' : `/login?redirectTo=${pathname}`

            push(toLocation)
        }
    }, [authInfo, pathname, push])

    return null
}
