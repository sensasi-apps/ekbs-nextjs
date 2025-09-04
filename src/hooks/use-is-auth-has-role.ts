import type AuthInfo from '@/modules/auth/types/auth-info'
import Role from '@/enums/Role'
import useAuthInfo from './use-auth-info'

export default function useIsAuthHasRole() {
    const authInfo = useAuthInfo()

    return (roleName: Role | Role[]) => isUserHasRole(roleName, authInfo)
}

export function isUserHasRole(
    roleName: Role | Role[],
    userParam: AuthInfo | undefined,
) {
    if (!userParam) return false

    if (userParam.role_names?.includes(Role.SUPERMAN)) {
        return true
    }

    if (roleName instanceof Array) {
        return (
            roleName.findIndex(r => userParam.role_names?.includes(r)) !== -1 ||
            roleName.findIndex(r => userParam.role_names_id?.includes(r)) !== -1
        )
    }

    return Boolean(
        userParam.role_names?.includes(roleName) ||
            userParam.role_names_id?.includes(roleName),
    )
}
