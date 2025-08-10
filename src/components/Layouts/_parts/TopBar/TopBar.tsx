'use client'

// materials
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
// icons
import MenuIcon from '@mui/icons-material/Menu'
// utils
import AccountButton from './components/AccountButton'
import NoInternetIndicator from '@/components/no-internet-indicator'

export function TopBar({
    title,
    toggleDrawer,
    subtitle,
}: {
    title: string
    toggleDrawer: () => void
    subtitle: string | undefined
}) {
    return (
        <AppBar position="relative" color="success">
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

                <Box py={2}>
                    <Typography fontWeight="bold" noWrap component="div">
                        {title}
                    </Typography>

                    {subtitle && (
                        <Typography
                            variant="caption"
                            component="div"
                            color="textDisabled">
                            {subtitle}
                        </Typography>
                    )}
                </Box>

                <Box display="flex" alignItems="center" gap={1}>
                    <NoInternetIndicator />
                    <AccountButton />
                </Box>
            </Toolbar>
        </AppBar>
    )
}
