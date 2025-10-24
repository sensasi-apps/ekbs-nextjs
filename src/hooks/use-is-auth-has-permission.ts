import Role from '@/enums/role'
import type AuthInfo from '@/modules/user/types/auth-info'
import type { Permission } from '@/types/permission'
import useAuthInfo from './use-auth-info'

export default function useIsAuthHasPermission() {
    const authInfo = useAuthInfo()

    return (permissionName: Permission | Permission[]) =>
        isUserHasPermission(permissionName, authInfo)
}

export function isUserHasPermission(
    permissionName: Permission | Permission[],
    userParam: AuthInfo | undefined,
) {
    if (!userParam) return false

    if (userParam.role_names?.includes(Role.SUPERMAN)) {
        return true
    }

    if (Array.isArray(permissionName)) {
        return (
            permissionName.findIndex(p =>
                userParam.permission_names?.includes(p),
            ) !== -1
        )
    }

    return userParam.permission_names?.includes(permissionName)
}
