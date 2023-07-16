import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useContext } from 'react'

import AppContext from '@/providers/App'
import MENUS_DATA from './menusData'
import debounce from '@/lib/debounce'

import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Toolbar from '@mui/material/Toolbar'

function MenuList({ isDrawerOpen, toggleDrawer }) {
    const drawerWidth = 240

    const {
        auth: { user },
    } = useContext(AppContext)
    const [drawerProps, setDrawerProps] = useState({})

    function GET_DRAWER_PROPS() {
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

    useEffect(() => {
        setDrawerProps(GET_DRAWER_PROPS())

        window.addEventListener(
            'resize',
            debounce(() => {
                setDrawerProps(GET_DRAWER_PROPS())
            }, 300),
        )
    }, [])

    function isAuthorized(user, menu) {
        if (
            user?.role_names?.includes('superman') ||
            !menu.forRoles ||
            !menu.forPermissions
        ) {
            return true
        }

        let isAuthorized = false

        user?.role_names?.forEach(role => {
            if (menu.forRoles.includes(role)) {
                isAuthorized = true
                return
            }
        })

        if (isAuthorized) {
            return isAuthorized
        }

        user?.permission_names?.forEach(permission => {
            if (menu.forPermissions.includes(permission)) {
                isAuthorized = true
                return
            }
        })

        return isAuthorized
    }

    function CustomListItem({ data, user, ...props }) {
        const router = useRouter()

        if (!isAuthorized(user, data)) {
            return
        }

        if (data.component) {
            return data.component
        }

        return (
            <ListItem disablePadding>
                <ListItemButton
                    shallow={true}
                    passHref
                    href={data.href}
                    selected={router.pathname === data.pathname}
                    {...props}>
                    <ListItemIcon>{data.icon}</ListItemIcon>
                    <ListItemText primary={data.label} />
                </ListItemButton>
            </ListItem>
        )
    }

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

                {MENUS_DATA.map((data, index) => (
                    <CustomListItem
                        key={index}
                        data={data}
                        user={user}
                        onClick={debounce(toggleDrawer, 300)}
                    />
                ))}
            </Drawer>
        </Box>
    )
}

export default MenuList
