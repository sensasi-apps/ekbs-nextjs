// types
import type { NavItem } from './menusData'
// vendors
import { memo, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
// materials
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Skeleton from '@mui/material/Skeleton'
import Toolbar from '@mui/material/Toolbar'
// etc
import useAuth from '@/providers/Auth'
import MENUS_DATA from './menusData'

const MenuList = memo(function MenuList({
    isDrawerOpen,
    toggleDrawer,
}: {
    isDrawerOpen: boolean
    toggleDrawer: () => void
}) {
    const { user: currentUser } = useAuth()
    const [drawerProps, setDrawerProps] = useState({})

    const makeDrawerProps = () => {
        if (window.innerWidth < 600) {
            return {
                variant: 'temporary',
                onClose: toggleDrawer,
            }
        }

        return {
            variant: 'permanent',
            onClose: null,
        }
    }

    const handleResize = () => {
        setDrawerProps(makeDrawerProps())
    }

    useEffect(() => {
        setDrawerProps(makeDrawerProps())

        window.addEventListener('resize', handleResize, false)

        return () => window.removeEventListener('resize', handleResize, false)
    }, [])

    return (
        <Box
            component="nav"
            sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}>
            <Drawer
                {...drawerProps}
                open={isDrawerOpen}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: DRAWER_WIDTH,
                    },
                }}>
                <Toolbar />

                {currentUser ? (
                    <List
                        sx={{
                            '& .MuiListItemIcon-root': {
                                justifyContent: 'center',
                            },
                        }}>
                        {MENUS_DATA.map((data, index) => (
                            <CustomListItem
                                key={index}
                                data={data}
                                onClick={toggleDrawer}
                            />
                        ))}
                    </List>
                ) : (
                    <Box px={4}>
                        <Skeleton height="4em" />
                        <Skeleton height="4em" />
                        <Skeleton height="4em" />
                        <Skeleton height="4em" />
                        <Skeleton height="4em" />
                    </Box>
                )}
            </Drawer>
        </Box>
    )
})

export default memo(MenuList)

export const DRAWER_WIDTH = 240

const CustomListItem = memo(function CustomListItem({
    data,
    onClick,
}: {
    data: NavItem
    onClick: () => void
}) {
    const { pathname: currPathname } = useRouter()
    const { userHasRole, userHasPermission } = useAuth()
    const { forRole, forPermission } = data

    if (
        (forRole && !userHasRole(forRole)) ||
        (forPermission && !userHasPermission(forPermission))
    )
        return

    if (data.children) return data.children

    const { href, icon, label, pathname } = data

    const isSelected =
        typeof pathname === 'string'
            ? pathname === currPathname
            : pathname.includes(currPathname)

    return (
        <ListItem disablePadding>
            <ListItemButton href={href} selected={isSelected} onClick={onClick}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={label} />
            </ListItemButton>
        </ListItem>
    )
})
