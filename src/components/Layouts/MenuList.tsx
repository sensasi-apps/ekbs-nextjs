import { useEffect, useState, memo, FC } from 'react'
import { useRouter } from 'next/router'

import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Skeleton from '@mui/material/Skeleton'
import Toolbar from '@mui/material/Toolbar'

import useAuth from '@/providers/Auth'
import MENUS_DATA from './menusData'

const MenuList: FC<{
    isDrawerOpen: boolean
    toggleDrawer: () => void
}> = ({ isDrawerOpen, toggleDrawer }) => {
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
            sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}
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
                        width: DRAWER_WIDTH,
                    },
                }}>
                <Toolbar />

                {!currentUser && <MenuListSkeleton />}

                {currentUser &&
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

export const DRAWER_WIDTH = 240

const CustomListItem: FC<{
    data: any
    onClick: () => void
}> = ({ data: menuData, onClick }) => {
    const router = useRouter()
    const { userHasRole } = useAuth()

    if (menuData.forRoles.length === 0 || !userHasRole(menuData.forRoles)) {
        return
    }

    if (menuData.component) {
        return menuData.component
    }

    return (
        <ListItem disablePadding>
            <ListItemButton
                href={menuData.href}
                selected={router.pathname === menuData.pathname}
                onClick={onClick}>
                <ListItemIcon>{menuData.icon}</ListItemIcon>
                <ListItemText primary={menuData.label} />
            </ListItemButton>
        </ListItem>
    )
}

const MenuListSkeleton: FC = () => (
    <Box px={4}>
        <Skeleton height="4em" />
        <Skeleton height="4em" />
        <Skeleton height="4em" />
        <Skeleton height="4em" />
        <Skeleton height="4em" />
    </Box>
)
