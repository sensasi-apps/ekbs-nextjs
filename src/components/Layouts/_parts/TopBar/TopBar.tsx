// materials
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
// parts
import TopBarNavbarToggleButton from './_parts/toggle-button'
// utils
import AccountButton from './components/AccountButton'
import NoInternetIndicator from '@/components/no-internet-indicator'

export function TopBar({
    title,
    subtitle,
}: {
    title: string
    subtitle: string | undefined
}) {
    return (
        <AppBar position="relative" color="success">
            <Toolbar
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}>
                <TopBarNavbarToggleButton />

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
