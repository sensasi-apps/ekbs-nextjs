'use client'

// vendors
import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'
import { useParams, usePathname, useRouter } from 'next/navigation'
// components
import type AuthInfo from '@/features/user--auth/types/auth-info'
import NAV_ITEM_GROUPS from '@/components/auth-layout/_parts/nav-bar/NAV_ITEM_GROUPS'
import ErrorMessageView from '@/app/(auth)/_parts/error-message-view'
import LoadingCenter from '@/components/loading-center'
// hooks
import { isUserHasPermission } from '@/hooks/use-is-auth-has-permission'
import { isUserHasRole } from '@/hooks/use-is-auth-has-role'
import useAuthInfo from '@/hooks/use-auth-info'

const EXCLUDE_PATHS = ['/policy', '/logout']

export default function ContentGuard({
    children,
}: {
    children: React.ReactNode
}) {
    const { push } = useRouter()
    const authInfo = useAuthInfo()
    const paramValues = Object.values(useParams()).map(value =>
        value?.toString(),
    )

    const route = usePathname()
        .split('/')
        .map(path => (paramValues.includes(path) ? '*' : path))
        .join('/')

    useEffect(() => {
        if (authInfo && !authInfo.is_agreed_tncp) return push('/policy')
    }, [authInfo, push])

    if (!authInfo || !route) return <LoadingCenter />

    if (EXCLUDE_PATHS.includes(route)) return children

    if (!authInfo?.is_active) return <ErrorMessageView code="inactive" />

    /**
     * Loading first before redirecting page (done by useEffect) to prevent flickering
     */
    if (!authInfo.is_agreed_tncp) return <LoadingCenter />

    if (!isAuthHasRoleOrPermissionForPath(authInfo, route))
        return <ErrorMessageView code={403} />

    return children
}

const NAV_ITEMS = NAV_ITEM_GROUPS.flatMap(group => group.items)

function isAuthHasRoleOrPermissionForPath(authInfo: AuthInfo, route: string) {
    const navItem = NAV_ITEMS.find(
        item => item.href === route || route.startsWith(item.href),
    )

    if (!navItem) {
        Sentry.captureMessage(
            '`navItem` is undefined for pathname: ' + route,
            'fatal',
        )
    }

    if (navItem?.forRole === undefined && navItem?.forPermission === undefined)
        return true

    return (
        (navItem.forRole && isUserHasRole(navItem.forRole, authInfo)) ||
        (navItem.forPermission &&
            isUserHasPermission(navItem.forPermission, authInfo))
    )
}
