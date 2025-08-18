// materials
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
// components
import AccountButton from '@/components/account-button'
import NoInternetIndicator from '@/components/no-internet-indicator'
// parts
import TopBarNavbarToggleButton from './_parts/toggle-button'

export default function TopBar() {
    return (
        <AppBar position="relative" color="success">
            <Toolbar
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}>
                <TopBarNavbarToggleButton />

                <Box display="flex" alignItems="center" gap={1}>
                    <NoInternetIndicator />
                    <AccountButton />
                </Box>
            </Toolbar>
        </AppBar>
    )
}
