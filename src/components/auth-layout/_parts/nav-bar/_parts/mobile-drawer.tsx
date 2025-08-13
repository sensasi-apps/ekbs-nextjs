'use client'

// vendors
import type { ReactNode } from 'react'
// materials
import Drawer from '@mui/material/Drawer'
import Toolbar from '@mui/material/Toolbar'
// atoms
import { useIsNavbarOpen, useToggleIsNavbarOpen } from '@/atoms/is-navbar-open'
// constants
import WIDTH from '../WIDTH'

const drawerPaperSx = {
    boxSizing: 'border-box',
    width: WIDTH,
}

type MobileDrawerProps = {
    children: ReactNode
}

export default function MobileDrawer({ children }: MobileDrawerProps) {
    const isDrawerOpen = useIsNavbarOpen()
    const toggleDrawer = useToggleIsNavbarOpen()

    return (
        <Drawer
            variant="temporary"
            open={isDrawerOpen}
            onClose={toggleDrawer}
            slotProps={{
                root: { keepMounted: true }, // Improve mobile performance
            }}
            sx={{
                display: { xs: 'block', sm: 'none' },
                '& .MuiDrawer-paper': drawerPaperSx,
            }}>
            <Toolbar />
            {children}
        </Drawer>
    )
}
