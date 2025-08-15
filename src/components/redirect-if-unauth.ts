'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
// providers
import useAuthInfo from '@/hooks/use-auth-info'

export default function RedirectIfUnauth() {
    const { push } = useRouter()
    const authInfo = useAuthInfo()
    const pathname = usePathname()

    useEffect(() => {
        if (!pathname || authInfo) return

        const toLocation = ['/logout', '/policy'].includes(pathname)
            ? '/'
            : `/login?redirectTo=${pathname}`

        push(toLocation)
    }, [authInfo, pathname, push])

    return null
}
