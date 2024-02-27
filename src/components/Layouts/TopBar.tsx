// vendor
import { useState } from 'react'
import { useRouter } from 'next/router'
// materials
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
// icons
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import GradingIcon from '@mui/icons-material/Grading'
import LogoutIcon from '@mui/icons-material/Logout'
import MenuIcon from '@mui/icons-material/Menu'
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
import { useOnlineStatus } from '@/hooks/useOnlineStatus'

export default function TopBar({
    title,
    toggleDrawer,
}: {
    title: string
    toggleDrawer: () => void
}) {
    const { user } = useAuth()
    const isOnline = useOnlineStatus()
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
                    <IconButton
                        color="inherit"
                        size="small"
                        sx={{ position: 'relative' }}
                        onClick={event => setAnchorEl(event.currentTarget)}>
                        <AccountCircleIcon />
                        {!isOnline && router.isReady && (
                            <CircularProgress
                                color="error"
                                size={30}
                                variant="determinate"
                                value={100}
                                sx={{
                                    animation: `${blink} 1s linear infinite`,
                                    position: 'absolute',
                                }}
                            />
                        )}
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
                            {!isOnline && router.isReady && (
                                <Typography
                                    variant="overline"
                                    lineHeight="1rem"
                                    width="20rem"
                                    p={1}
                                    sx={{
                                        backgroundColor: 'error.main',
                                    }}
                                    mb={2}>
                                    Perangkat anda sedang tidak terhubung ke
                                    internet, data yang anda lihat mungkin tidak
                                    ter-<i>update</i>.
                                </Typography>
                            )}
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
