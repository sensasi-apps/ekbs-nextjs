import useAuth from '@/providers/Auth'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export function useRedirectIfUnauth() {
    const { user } = useAuth()
    const { replace, pathname } = useRouter()

    useEffect(() => {
        if (user === null) {
            if (pathname === '/logout') {
                replace(`/`)
            } else {
                replace(`/login?redirectTo=${pathname}`)
            }
        }
    }, [user, replace, pathname])
}
