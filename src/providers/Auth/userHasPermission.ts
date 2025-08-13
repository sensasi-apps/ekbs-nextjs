import type AuthInfo from '@/features/user--auth/types/auth-info'
import Role from '@/enums/Role'
import type { Permission } from '@/types/permission'

export default function userHasPermission(
    permissionName: Permission | Permission[],
    userParam?: AuthInfo,
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
