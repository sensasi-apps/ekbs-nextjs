import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { NavItemGroup } from './@types/nav-item-group'
import { MenuListItem } from './menu-list-item'
import useAuth from '@/providers/Auth'

export function MenuItemGroup({
    data: { label, items },
    onItemClick,
}: {
    data: NavItemGroup
    onItemClick: () => void
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
                ml={2}
                mt={2}
                variant="overline"
                color="grey"
                fontWeight="bold"
                component="div">
                {label}
            </Typography>

            {filteredItems.map((item, i) => (
                <MenuListItem data={item} key={i} onClick={onItemClick} />
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
) {
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
