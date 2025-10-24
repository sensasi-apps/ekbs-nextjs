import Role from '@/enums/role'
import type AuthInfo from '@/modules/user/types/auth-info'
import useAuthInfo from './use-auth-info'

export default function useIsAuthHasRole() {
    const authInfo = useAuthInfo()

    return (roleName: Role | Role[]) => isUserHasRole(roleName, authInfo)
}

export function isUserHasRole(
    roleName: Role | Role[],
    userParam:
        | {
              role_names?: AuthInfo['role_names']
              role_names_id?: AuthInfo['role_names_id']
          }
        | undefined,
) {
    if (!userParam) return false

    if (userParam.role_names?.includes(Role.SUPERMAN)) {
        return true
    }

    if (Array.isArray(roleName)) {
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
