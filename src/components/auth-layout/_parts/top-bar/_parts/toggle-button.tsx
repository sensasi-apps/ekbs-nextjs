'use client'

import MenuIcon from '@mui/icons-material/Menu'
import IconButton from '@mui/material/IconButton'
import { useToggleIsNavbarOpen } from '@/atoms/is-navbar-open'

export default function TopBarNavbarToggleButton() {
    const toggleDrawer = useToggleIsNavbarOpen()
    return (
        <IconButton
            aria-label="open drawer"
            color="inherit"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2, visibility: { sm: 'hidden' } }}>
            <MenuIcon />
        </IconButton>
    )
}
