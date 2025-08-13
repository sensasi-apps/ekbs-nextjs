import Role from '@/enums/Role'
import { enqueueSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import useAuthInfo from './use-auth-info'
import useIsAuthHasRole from './use-is-auth-has-role'

export function useRoleChecker(
    roles: Role[] | Role,
    onUnauthorized: () => void = defaultOnUnauthorized,
) {
    const user = useAuthInfo()
    const isAuthHasRole = useIsAuthHasRole()
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)

    useEffect(() => {
        if (user) {
            const isAuthorizedLocal = isAuthHasRole(roles)
            setIsAuthorized(isAuthorizedLocal)
        }
    }, [user, roles, isAuthHasRole])

    if (isAuthorized === false) onUnauthorized()

    return isAuthorized
}

function defaultOnUnauthorized() {
    enqueueSnackbar('Anda tidak memiliki akses untuk halaman ini', {
        variant: 'error',
        persist: true,
    })
}
