// vendors

// materials
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import Toolbar from '@mui/material/Toolbar'
import type { ReactNode } from 'react'
import NavBarItemGroup from './_parts/item-group'
// parts
import MobileDrawer from './_parts/mobile-drawer'
// constants
import NAV_ITEM_GROUPS from './NAV_ITEM_GROUPS'
import WIDTH from './WIDTH'

export default function NavBar() {
    const navItems = (
        <List
            sx={{
                '& .MuiListItemIcon-root': {
                    justifyContent: 'center',
                },
                mb: 16,
            }}>
            {NAV_ITEM_GROUPS.map((items, index) => (
                <NavBarItemGroup data={items} key={index} />
            ))}
        </List>
    )

    return (
        <Box
            component="nav"
            sx={{ flexShrink: { sm: 0 }, width: { sm: WIDTH } }}>
            <DesktopDrawer>{navItems}</DesktopDrawer>
            <MobileDrawer>{navItems}</MobileDrawer>
        </Box>
    )
}

const drawerPaperSx = {
    boxSizing: 'border-box',
    width: WIDTH,
}

function DesktopDrawer({ children }: { children: ReactNode }) {
    return (
        <Drawer
            sx={{
                '& .MuiDrawer-paper': drawerPaperSx,
                display: { sm: 'block', xs: 'none' },
            }}
            variant="permanent">
            <Toolbar />
            {children}
        </Drawer>
    )
}
