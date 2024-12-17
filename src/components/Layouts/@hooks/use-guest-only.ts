import useAuth from '@/providers/Auth'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export function useGuestOnly() {
    const { replace, pathname, query } = useRouter()
    const { user } = useAuth()

    useEffect(() => {
        if (user) {
            const redirectTo = query.redirectTo

            if (redirectTo) {
                replace(redirectTo.toString())
            } else {
                replace('/dashboard')
            }
        }
    }, [user, replace, pathname, query])
}
