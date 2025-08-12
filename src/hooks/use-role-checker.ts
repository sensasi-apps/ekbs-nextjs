import Role from '@/enums/Role'
import useAuth from '@/providers/Auth'
import { enqueueSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import useAuthInfo from './use-auth-info'

export function useRoleChecker(
    roles: Role[] | Role,
    onUnauthorized: () => void = defaultOnUnauthorized,
) {
    const user = useAuthInfo()
    const { userHasRole } = useAuth()
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)

    useEffect(() => {
        if (user) {
            const isAuthorizedLocal = userHasRole(roles)
            setIsAuthorized(isAuthorizedLocal)
        }
    }, [user, roles, userHasRole])

    if (isAuthorized === false) onUnauthorized()

    return isAuthorized
}

function defaultOnUnauthorized() {
    enqueueSnackbar('Anda tidak memiliki akses untuk halaman ini', {
        variant: 'error',
        persist: true,
    })
}
