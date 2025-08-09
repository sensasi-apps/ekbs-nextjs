import { useEffect } from 'react'
import { redirect, usePathname } from 'next/navigation'
// providers
import useAuth from '@/providers/Auth'

export function useRedirectIfUnauth() {
    const { user } = useAuth()
    const pathname = usePathname()

    useEffect(() => {
        if (user === null) {
            if (pathname === '/logout') {
                redirect(`/`)
            } else {
                redirect(`/login?redirectTo=${pathname}`)
            }
        }
    }, [user, pathname])
}
