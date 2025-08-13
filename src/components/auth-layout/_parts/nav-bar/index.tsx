// vendors
import type { ReactNode } from 'react'
// materials
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import Toolbar from '@mui/material/Toolbar'
// parts
import MobileDrawer from './_parts/mobile-drawer'
import NavBarItemGroup from './_parts/item-group'
// constants
import NAV_ITEM_GROUPS from './NAV_ITEM_GROUPS'
import WIDTH from './WIDTH'

export default function NavBar() {
    const navItems = (
        <List
            sx={{
                mb: 16,
                '& .MuiListItemIcon-root': {
                    justifyContent: 'center',
                },
            }}>
            {NAV_ITEM_GROUPS.map((items, index) => (
                <NavBarItemGroup data={items} key={index} />
            ))}
        </List>
    )

    return (
        <Box
            component="nav"
            sx={{ width: { sm: WIDTH }, flexShrink: { sm: 0 } }}>
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
            variant="permanent"
            sx={{
                display: { xs: 'none', sm: 'block' },
                '& .MuiDrawer-paper': drawerPaperSx,
            }}>
            <Toolbar />
            {children}
        </Drawer>
    )
}
