// types
import type { NavItemGroup } from './@types/nav-item-group'
// vendors
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'

export function MenuListItem({
    data,
    onClick,
}: {
    data: NavItemGroup['items'][0]
    onClick: () => void
}) {
    const { pathname: currPathname } = useRouter()
    const myRef = useRef<HTMLLIElement>()

    const { href, icon: Icon, label, pathname } = data

    const pathnameOrHref = pathname ?? href

    const isActive =
        typeof pathnameOrHref === 'string'
            ? pathnameOrHref === currPathname
            : pathnameOrHref.includes(currPathname)

    const executeScroll = () => myRef.current?.scrollIntoView()

    useEffect(() => {
        if (isActive) {
            executeScroll()
        }
    })

    return (
        <ListItem disablePadding>
            <ListItemButton
                href={href}
                disabled={isActive}
                selected={isActive}
                onClick={onClick}
                sx={{
                    backgroundColor: isActive
                        ? 'rgba(var(--mui-palette-success-mainChannel) / var(--mui-palette-action-selectedOpacity)) !important'
                        : undefined,
                    color: isActive ? 'success.main' : undefined,
                    opacity: 'unset !important',
                }}>
                <ListItemIcon
                    sx={{
                        color: isActive ? 'success.main' : undefined,
                    }}>
                    <Icon />
                </ListItemIcon>
                <ListItemText primary={label} />
            </ListItemButton>
        </ListItem>
    )
}
