// materials
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
// icons
import MenuIcon from '@mui/icons-material/Menu'
// components
import { DRAWER_WIDTH } from '../menu-list'
// utils
import AccountButton from './components/AccountButton'
import NoInternetIndicator from '@/components/no-internet-indicator'

export function TopBar({
    title,
    toggleDrawer,
}: {
    title: string
    toggleDrawer: () => void
}) {
    return (
        <AppBar
            position="fixed"
            color="success"
            sx={{
                width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
                ml: { sm: `${DRAWER_WIDTH}px` },
            }}>
            <Toolbar
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={toggleDrawer}
                    sx={{ mr: 2, display: { sm: 'none' } }}>
                    <MenuIcon />
                </IconButton>

                <Typography variant="h6" noWrap component="div">
                    {title}
                </Typography>

                <Box display="flex" alignItems="center" gap={1}>
                    <NoInternetIndicator />
                    <AccountButton />
                </Box>
            </Toolbar>
        </AppBar>
    )
}
