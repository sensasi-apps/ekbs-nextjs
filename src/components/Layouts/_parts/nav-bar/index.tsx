// vendors
import { useEffect, useState } from 'react'
// materials
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import Toolbar from '@mui/material/Toolbar'
// parts
import NavBarItemGroup from './_parts/item-group'
// constants
import NAV_ITEM_GROUPS from './NAV_ITEM_GROUPS'
import WIDTH from './WIDTH'

export default function NavBar({
    isDrawerOpen,
    toggleDrawer,
}: {
    isDrawerOpen: boolean
    toggleDrawer: () => void
}) {
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
            sx={{ width: { sm: WIDTH }, flexShrink: { sm: 0 } }}>
            <Drawer
                {...drawerProps}
                open={isDrawerOpen}
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
                        <NavBarItemGroup
                            data={items}
                            key={i}
                            onItemClick={toggleDrawer}
                        />
                    ))}
                </List>
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
