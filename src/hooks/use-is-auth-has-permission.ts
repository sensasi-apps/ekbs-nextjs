import type { Permission } from '@/types/permission'
import userHasPermission from '@/providers/Auth/userHasPermission'
import useAuthInfo from './use-auth-info'

export default function useIsAuthHasPermission() {
    const authInfo = useAuthInfo()

    return (permissionName: Permission | Permission[]) =>
        userHasPermission(permissionName, authInfo)
}
