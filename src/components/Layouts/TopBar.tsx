// vendor
import { useIsOnline } from 'react-use-is-online'
import { useRouter } from 'next/router'
import { useState } from 'react'
// materials
import AppBar from '@mui/material/AppBar'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
// icons
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import GradingIcon from '@mui/icons-material/Grading'
import LogoutIcon from '@mui/icons-material/Logout'
import MenuIcon from '@mui/icons-material/Menu'
import SignalWifiStatusbarConnectedNoInternet4Icon from '@mui/icons-material/SignalWifiStatusbarConnectedNoInternet4'
import SyncIcon from '@mui/icons-material/Sync'
// providers
import useAuth from '@/providers/Auth'
// components
import TncpDialog from '@/components/TncpDialog'
import { DRAWER_WIDTH } from './MenuList'
import DarkModeSwitch from './TopBar/DarkModeSwitch'
import FullscreenMenuItem from './TopBar/FullscreenMenuItem'
import FooterBox from './FooterBox'
import FlexColumnBox from '../FlexColumnBox'
// utils
import blink from '@/utils/cssAnimations/blink'

export default function TopBar({
    title,
    toggleDrawer,
}: {
    title: string
    toggleDrawer: () => void
}) {
    const { isOffline } = useIsOnline()
    const { user } = useAuth()
    const router = useRouter()

    const [isOpenTncp, setIsOpenTncp] = useState(false)
    const [anchorEl, setAnchorEl] = useState<Element>()
    const open = Boolean(anchorEl)

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

                    <IconButton
                        color="inherit"
                        size="small"
                        onClick={event => setAnchorEl(event.currentTarget)}>
                        <AccountCircleIcon />
                    </IconButton>

                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={() => setAnchorEl(undefined)}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}>
                        <FlexColumnBox
                            alignItems="center"
                            textAlign="center"
                            gap={0}
                            my={1}>
                            <Typography variant="overline" lineHeight="1rem">
                                #<strong>{user?.id}</strong> &mdash;{' '}
                                {user?.name}
                            </Typography>
                        </FlexColumnBox>

                        <Divider sx={{ pt: 1 }} />

                        <DarkModeSwitch />

                        <FullscreenMenuItem />

                        <MenuItem onClick={() => router.reload()}>
                            <ListItemIcon>
                                <SyncIcon />
                            </ListItemIcon>

                            <ListItemText>Muat Ulang Halaman</ListItemText>

                            <Typography variant="body2" color="text.secondary">
                                F5
                            </Typography>
                        </MenuItem>

                        <Divider />

                        <MenuItem onClick={() => setIsOpenTncp(true)}>
                            <ListItemIcon>
                                <GradingIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>
                                Syarat, Ketentuan, dan Kebijakan Privasi
                            </ListItemText>
                        </MenuItem>

                        <TncpDialog
                            open={isOpenTncp}
                            handleClose={() => setIsOpenTncp(false)}
                        />

                        <Divider />

                        <MenuItem onClick={() => router.push('/logout')}>
                            <ListItemIcon>
                                <LogoutIcon fontSize="small" />
                            </ListItemIcon>
                            Logout
                        </MenuItem>

                        <FooterBox mt={2} mb={1} component="div" />
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    )
}
