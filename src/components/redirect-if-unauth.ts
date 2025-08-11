'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
// providers
import useAuth from '@/providers/Auth'

export default function RedirectIfUnauth() {
    const { user } = useAuth()
    const { push } = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (user === null) {
            const toLocation =
                pathname === '/logout' ? '/' : `/login?redirectTo=${pathname}`

            push(toLocation)
        }
    }, [user, pathname, push])

    return null
}
