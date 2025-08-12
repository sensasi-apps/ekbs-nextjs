'use client'

// types
import type NavItemGroup from '../../../types/nav-item-group'
// vendors
import { usePathname } from 'next/navigation'
// materials
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
// icons
import ArrowRightIcon from '@mui/icons-material/ArrowRight'

export default function NavBarListItem({
    data,
}: {
    data: NavItemGroup['items'][0]
}) {
    const currPathname = usePathname()

    const { href, icon: Icon, label, pathname } = data

    const pathnameOrHref = pathname ?? href

    const isActive =
        typeof pathnameOrHref === 'string'
            ? pathnameOrHref === currPathname
            : pathnameOrHref.includes(currPathname ?? '')

    return (
        <ListItem
            sx={{
                py: 0,
            }}>
            <ListItemButton
                href={href}
                disabled={isActive}
                selected={isActive}
                disableGutters
                sx={{
                    py: 0.9,
                    backgroundColor: isActive
                        ? 'rgba(var(--mui-palette-success-mainChannel) / var(--mui-palette-action-selectedOpacity)) !important'
                        : undefined,
                    color: isActive ? 'success.main' : 'text.secondary',
                    opacity: 'unset !important',
                    borderRadius: 2,
                }}>
                <ListItemIcon
                    sx={{
                        color: isActive ? 'success.main' : 'text.secondary',
                    }}>
                    <Icon />
                </ListItemIcon>
                <ListItemText
                    primary={label}
                    sx={{
                        ml: 1,
                    }}
                    slotProps={{
                        primary: {
                            sx: {
                                fontSize: '0.9rem',
                                fontWeight: isActive ? 'bold' : undefined,
                            },
                        },
                    }}
                />

                {isActive && (
                    <ListItemIcon
                        sx={{
                            color: isActive ? 'success.main' : undefined,
                        }}>
                        <ArrowRightIcon />
                    </ListItemIcon>
                )}
            </ListItemButton>
        </ListItem>
    )
}
