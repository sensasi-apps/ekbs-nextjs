// types
import type NavItemGroup from '../../../types/nav-item-group'
// vendors
import MuiListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

export default function NavBarListItem({
    data,
    onClick,
}: {
    data: NavItemGroup['items'][0]
    onClick: () => void
}) {
    const currPathname = usePathname()
    const myRef = useRef<HTMLLIElement | undefined>(undefined)

    const { href, icon: Icon, label, pathname } = data

    const pathnameOrHref = pathname ?? href

    const isActive =
        typeof pathnameOrHref === 'string'
            ? pathnameOrHref === currPathname
            : pathnameOrHref.includes(currPathname ?? '')

    const executeScroll = () => myRef.current?.scrollIntoView()

    useEffect(() => {
        if (isActive) {
            executeScroll()
        }
    })

    return (
        <MuiListItem disablePadding>
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
        </MuiListItem>
    )
}
