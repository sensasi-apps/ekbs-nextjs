import type { AuthInfo } from '@/@types/Data/auth-info'
import Role from '@/enums/Role'

export default function userHasRole(
    roleName: Role | Role[],
    userParam: AuthInfo | undefined = undefined,
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
