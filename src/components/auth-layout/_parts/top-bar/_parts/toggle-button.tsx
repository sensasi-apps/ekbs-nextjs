'use client'

import { useToggleIsNavbarOpen } from '@/atoms/is-navbar-open'
import MenuIcon from '@mui/icons-material/Menu'
import IconButton from '@mui/material/IconButton'

export default function TopBarNavbarToggleButton() {
    const toggleDrawer = useToggleIsNavbarOpen()
    return (
        <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2, display: { sm: 'none' } }}>
            <MenuIcon />
        </IconButton>
    )
}
