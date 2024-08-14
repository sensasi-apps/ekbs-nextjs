// vendor
import { useIsOnline } from 'react-use-is-online'
import dynamic from 'next/dynamic'
// materials
import AppBar from '@mui/material/AppBar'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
// import Tooltip from '@mui/material/Tooltip'
const Tooltip = dynamic(() => import('@mui/material/Tooltip'))
import Typography from '@mui/material/Typography'
// icons
import MenuIcon from '@mui/icons-material/Menu'
import SignalWifiStatusbarConnectedNoInternet4Icon from '@mui/icons-material/SignalWifiStatusbarConnectedNoInternet4'

// components
import { DRAWER_WIDTH } from '../../MenuList'

// utils
import blink from '@/utils/cssAnimations/blink'
import AccountButton from './components/AccountButton'

export function TopBar({
    title,
    toggleDrawer,
}: {
    title: string
    toggleDrawer: () => void
}) {
    const { isOffline } = useIsOnline()

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

                <Box>
                    {isOffline && (
                        <Tooltip
                            title={
                                <Alert severity="error" variant="filled">
                                    Perangkat anda sedang tidak terhubung ke
                                    internet, data yang anda lihat mungkin tidak
                                    muthakir.
                                </Alert>
                            }
                            arrow
                            placement="left">
                            <IconButton
                                size="small"
                                color="error"
                                disableTouchRipple>
                                <SignalWifiStatusbarConnectedNoInternet4Icon
                                    sx={{
                                        animation: `${blink} 1s linear infinite`,
                                    }}
                                />
                            </IconButton>
                        </Tooltip>
                    )}

                    <AccountButton />
                </Box>
            </Toolbar>
        </AppBar>
    )
}
