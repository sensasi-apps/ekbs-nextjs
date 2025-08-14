'use client'

import NAV_ITEM_GROUPS from '@/components/auth-layout/_parts/nav-bar/NAV_ITEM_GROUPS'
import ErrorMessageView from '@/app/(auth)/_parts/error-message-view'
import useAuthInfo from '@/hooks/use-auth-info'
import { isUserHasPermission } from '@/hooks/use-is-auth-has-permission'
import { isUserHasRole } from '@/hooks/use-is-auth-has-role'
import { usePathname } from 'next/navigation'
import type AuthInfo from '@/features/user--auth/types/auth-info'
import LoadingCenter from '@/components/loading-center'

export default function ContentGuard({
    children,
}: {
    children: React.ReactNode
}) {
    const authInfo = useAuthInfo()
    const pathname = usePathname()

    if (pathname === '/logout') return children

    if (!authInfo) return <LoadingCenter />

    if (!authInfo?.is_active) return <ErrorMessageView code="inactive" />

    if (!isAuthHasRoleOrPermissionForPath(authInfo, pathname))
        return <ErrorMessageView code={403} />

    return children
}

const NAV_ITEMS = NAV_ITEM_GROUPS.flatMap(group => group.items)

function isAuthHasRoleOrPermissionForPath(
    authInfo: AuthInfo | undefined,
    pathname: string | null,
) {
    if (!pathname) return false

    const navItem = NAV_ITEMS.find(
        item => item.href === pathname || item.pathname?.includes(pathname),
    )

    if (navItem?.forRole === undefined && navItem?.forPermission === undefined)
        return true

    return (
        (navItem.forRole && isUserHasRole(navItem.forRole, authInfo)) ||
        (navItem.forPermission &&
            isUserHasPermission(navItem.forPermission, authInfo))
    )
}
