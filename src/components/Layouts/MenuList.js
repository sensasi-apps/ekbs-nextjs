import { useEffect, useState, memo } from 'react'
import { useRouter } from 'next/router'
import { useContext } from 'react'

import AppContext from '@/providers/App'
import MENUS_DATA from './menusData'

import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Skeleton from '@mui/material/Skeleton'
import Toolbar from '@mui/material/Toolbar'

const isAuthorized = menuData => {
    const {
        auth: { userHasRole },
    } = useContext(AppContext)

    if (userHasRole('superman')) {
        return true
    }

    if (!menuData.forRoles) {
        return true
    }

    return menuData.forRoles.findIndex(role => userHasRole(role)) !== -1
}

const CustomListItem = ({ data: menuData, ...props }) => {
    const router = useRouter()

    if (!isAuthorized(menuData)) {
        return
    }

    if (menuData.component) {
        return menuData.component
    }

    return (
        <ListItem disablePadding>
            <ListItemButton
                shallow={true}
                passHref
                href={menuData.href}
                selected={router.pathname === menuData.pathname}
                {...props}>
                <ListItemIcon>{menuData.icon}</ListItemIcon>
                <ListItemText primary={menuData.label} />
            </ListItemButton>
        </ListItem>
    )
}

const GET_DRAWER_PROPS = toggleDrawer => {
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

const MenuList = ({ isDrawerOpen, toggleDrawer }) => {
    const {
        auth: { user },
    } = useContext(AppContext)

    const drawerWidth = 240

    const [drawerProps, setDrawerProps] = useState({})

    function handleResize() {
        setDrawerProps(GET_DRAWER_PROPS(toggleDrawer))
    }

    useEffect(() => {
        setDrawerProps(GET_DRAWER_PROPS(toggleDrawer))

        window.addEventListener('resize', handleResize, { passive: true })

        return () =>
            window.removeEventListener('resize', handleResize, {
                passive: true,
            })
    }, [])

    return (
        <Box
            component="nav"
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            aria-label="mailbox folders">
            <Drawer
                {...drawerProps}
                open={isDrawerOpen}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: drawerWidth,
                    },
                }}>
                <Toolbar />

                {!user && (
                    <Box px={4}>
                        <Skeleton height="4em" />
                        <Skeleton height="4em" />
                        <Skeleton height="4em" />
                        <Skeleton height="4em" />
                        <Skeleton height="4em" />
                    </Box>
                )}

                {user &&
                    MENUS_DATA.map((data, index) => (
                        <CustomListItem
                            key={index}
                            data={data}
                            onClick={toggleDrawer}
                        />
                    ))}
            </Drawer>
        </Box>
    )
}

export default memo(MenuList)
