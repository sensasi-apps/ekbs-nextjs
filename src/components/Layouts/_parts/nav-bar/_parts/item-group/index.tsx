import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import type NavItemGroup from '../../types/nav-item-group'
import NavBarListItem from './_parts/list-item'
import useAuth from '@/providers/Auth'

export default function NavBarItemGroup({
    data: { label, items },
}: {
    data: NavItemGroup
}) {
    const { userHasRole, userHasPermission } = useAuth()

    const filteredItems = items.filter(({ forRole, forPermission }) =>
        getIsShowMenuItemToUser(
            forRole,
            forPermission,
            userHasRole,
            userHasPermission,
        ),
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

type AuthContextType = ReturnType<typeof useAuth>

function getIsShowMenuItemToUser(
    forRole: NavItemGroup['items'][0]['forRole'],
    forPermission: NavItemGroup['items'][0]['forPermission'],
    userHasRole: AuthContextType['userHasRole'],
    userHasPermission: AuthContextType['userHasPermission'],
): boolean {
    if (forRole && forPermission) {
        return userHasRole(forRole) || userHasPermission(forPermission)
    }

    if (forRole) {
        return userHasRole(forRole)
    }

    if (forPermission) {
        return userHasPermission(forPermission)
    }

    return true
}
