'use client'

import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import type NavItemGroup from '../../types/nav-item-group'
import NavBarListItem from './_parts/list-item'
// hooks
import useIsAuthHasPermission from '@/hooks/use-is-auth-has-permission'
import useIsAuthHasRole from '@/hooks/use-is-auth-has-role'

export default function NavBarItemGroup({
    data: { label, items },
}: {
    data: NavItemGroup
}) {
    const getIsShowMenuItemToUser = useIsShowMenu()

    const filteredItems = items.filter(({ forRole, forPermission }) =>
        getIsShowMenuItemToUser(forRole, forPermission),
    )

    if (filteredItems.length === 0) return

    return (
        <>
            <Divider
                style={{
                    marginTop: '1rem',
                }}
            />

            <Typography
                ml={4}
                mt={2}
                variant="overline"
                color="grey"
                fontWeight="bold"
                component="div">
                {label}
            </Typography>

            {filteredItems.map((item, i) => (
                <NavBarListItem data={item} key={i} />
            ))}
        </>
    )
}

function useIsShowMenu() {
    const isAuthHasPermission = useIsAuthHasPermission()
    const isAuthHasRole = useIsAuthHasRole()

    return function getIsShowMenuItemToUser(
        forRole: NavItemGroup['items'][number]['forRole'],
        forPermission: NavItemGroup['items'][number]['forPermission'],
    ): boolean {
        if (forRole && forPermission) {
            return isAuthHasRole(forRole) || isAuthHasPermission(forPermission)
        }

        if (forRole) {
            return isAuthHasRole(forRole)
        }

        if (forPermission) {
            return isAuthHasPermission(forPermission)
        }

        return true
    }
}
