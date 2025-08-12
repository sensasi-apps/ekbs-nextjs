'use client'

// vendors
import { useEffect, useState } from 'react'
// materials
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import Toolbar from '@mui/material/Toolbar'
// parts
import NavBarItemGroup from './_parts/item-group'
// atoms
import { useIsNavbarOpen, useToggleIsNavbarOpen } from '@/atoms/is-navbar-open'
// constants
import NAV_ITEM_GROUPS from './NAV_ITEM_GROUPS'
import WIDTH from './WIDTH'

export default function NavBar() {
    const isDrawerOpen = useIsNavbarOpen()
    const toggleDrawer = useToggleIsNavbarOpen()

    const [drawerVariant, setDrawerVariant] = useState<
        'temporary' | 'permanent'
    >(window.innerWidth < 600 ? 'temporary' : 'permanent')

    useEffect(() => {
        function handleResize() {
            if (window.innerWidth < 600) {
                setDrawerVariant('temporary')
            } else {
                setDrawerVariant('permanent')
            }
        }

        window.addEventListener('resize', handleResize, { passive: true })

        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <Box
            component="nav"
            sx={{ width: { sm: WIDTH }, flexShrink: { sm: 0 } }}>
            <Drawer
                variant={drawerVariant}
                open={isDrawerOpen}
                onClose={toggleDrawer}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: WIDTH,
                    },
                }}>
                <Toolbar />

                <List
                    sx={{
                        mb: 16,
                        '& .MuiListItemIcon-root': {
                            justifyContent: 'center',
                        },
                    }}>
                    {NAV_ITEM_GROUPS.map((items, i) => (
                        <NavBarItemGroup data={items} key={i} />
                    ))}
                </List>
            </Drawer>
        </Box>
    )
}
