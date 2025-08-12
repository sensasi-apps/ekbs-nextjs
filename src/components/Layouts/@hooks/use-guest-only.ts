import useAuthInfo from '@/hooks/use-auth-info'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export function useGuestOnly() {
    const authInfo = useAuthInfo()
    const pathname = usePathname()
    const query = useSearchParams()
    const { replace } = useRouter()

    useEffect(() => {
        if (authInfo) {
            const redirectTo = query?.get('redirectTo')

            if (redirectTo) {
                replace(redirectTo.toString())
            } else {
                replace('/dashboard')
            }
        }
    }, [authInfo, replace, pathname, query])
}
