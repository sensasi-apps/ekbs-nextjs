// vendors
import { useEffect, useState } from 'react'
// materials
import { Box, Drawer, List, Skeleton, Toolbar } from '@mui/material'
// components
import { MenuItemGroup } from './components/menu-item-group'
// etc
import useAuth from '@/providers/Auth'
import { NAV_ITEM_GROUPS } from './components/menu-list-data'
import { DRAWER_WIDTH } from '.'

export function MenuList({
    isDrawerOpen,
    toggleDrawer,
}: {
    isDrawerOpen: boolean
    toggleDrawer: () => void
}) {
    const { user: currentUser } = useAuth()
    const [drawerProps, setDrawerProps] = useState({})

    useEffect(() => {
        function handleResize() {
            setDrawerProps(makeDrawerProps(toggleDrawer))
        }

        handleResize()

        window.addEventListener('resize', handleResize, false)

        return () => window.removeEventListener('resize', handleResize, false)
    }, [toggleDrawer])

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
                            mb: 16,
                            '& .MuiListItemIcon-root': {
                                justifyContent: 'center',
                            },
                        }}>
                        {NAV_ITEM_GROUPS.map((items, i) => (
                            <MenuItemGroup
                                data={items}
                                key={i}
                                onItemClick={toggleDrawer}
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
}

const PERMANENT_DRAWER_PROP = {
    variant: 'permanent',
    onClose: null,
}

function makeDrawerProps(toggleDrawer: () => void) {
    if (window.innerWidth < 600) {
        return {
            variant: 'temporary',
            onClose: toggleDrawer,
        }
    }

    return PERMANENT_DRAWER_PROP
}
