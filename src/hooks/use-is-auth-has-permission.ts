import type { Permission } from '@/types/permission'
import useAuthInfo from './use-auth-info'
import type AuthInfo from '@/modules/user/types/auth-info'
import Role from '@/enums/role'

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

    if (permissionName instanceof Array) {
        return (
            permissionName.findIndex(p =>
                userParam.permission_names?.includes(p),
            ) !== -1
        )
    }

    return userParam.permission_names?.includes(permissionName)
}
