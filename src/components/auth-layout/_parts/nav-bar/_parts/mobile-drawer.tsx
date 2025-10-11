'use client'

// materials
import Drawer from '@mui/material/Drawer'
import Toolbar from '@mui/material/Toolbar'
// vendors
import type { ReactNode } from 'react'
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
            onClose={toggleDrawer}
            open={isDrawerOpen}
            slotProps={{
                root: { keepMounted: true }, // Improve mobile performance
            }}
            sx={{
                '& .MuiDrawer-paper': drawerPaperSx,
                display: { sm: 'none', xs: 'block' },
            }}
            variant="temporary">
            <Toolbar />
            {children}
        </Drawer>
    )
}
