'use client'

// icons
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
// materials
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
// vendors
import { useParams, usePathname } from 'next/navigation'
import Link from '@/components/next-link'
// types
import type NavItemGroup from '../../../types/nav-item-group'

export default function NavBarListItem({
    data,
}: {
    data: NavItemGroup['items'][number]
}) {
    const paramValues = Object.values(useParams()).map(value =>
        value?.toString(),
    )

    const route = usePathname()
        .split('/')
        .map(path => (paramValues.includes(path) ? '*' : path))
        .join('/')

    const { href, icon: Icon, label } = data

    const isActive = href === route || route.startsWith(href)

    return (
        <ListItem
            sx={{
                py: 0,
            }}>
            <ListItemButton
                disabled={isActive}
                disableGutters
                href={href}
                LinkComponent={Link}
                selected={isActive}
                sx={{
                    backgroundColor: isActive
                        ? 'rgba(var(--mui-palette-success-mainChannel) / var(--mui-palette-action-selectedOpacity)) !important'
                        : undefined,
                    borderRadius: 2,
                    color: isActive ? 'success.main' : 'text.secondary',
                    opacity: 'unset !important',
                    py: 0.9,
                }}>
                <ListItemIcon
                    sx={{
                        color: isActive ? 'success.main' : 'text.secondary',
                    }}>
                    <Icon />
                </ListItemIcon>
                <ListItemText
                    primary={label}
                    slotProps={{
                        primary: {
                            sx: {
                                fontSize: '0.9rem',
                                fontWeight: isActive ? 'bold' : undefined,
                            },
                        },
                    }}
                    sx={{
                        ml: 1,
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
