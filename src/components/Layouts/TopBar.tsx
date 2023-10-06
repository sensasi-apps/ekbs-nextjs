import { FC, useState } from 'react'
import { useRouter } from 'next/router'
import moment from 'moment'

import { useTheme } from '@mui/material/styles'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Switch from '@mui/material/Switch'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
// icons
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import FullscreenIcon from '@mui/icons-material/Fullscreen'
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit'
import GradingIcon from '@mui/icons-material/Grading'
import LogoutIcon from '@mui/icons-material/Logout'
import MenuIcon from '@mui/icons-material/Menu'
import SyncIcon from '@mui/icons-material/Sync'
// providers
import useAuth from '@/providers/Auth'
import { toggleColorMode } from '@/providers/useTheme'
// components
import TncpDialog from '@/components/TncpDialog'
import { DRAWER_WIDTH } from './MenuList'

import packageJson from '@/../package.json'

const TopBar: FC<{
    title: string
    toggleDrawer: () => void
}> = ({ title, toggleDrawer }) => {
    const { user } = useAuth()

    const router = useRouter()
    const theme = useTheme()

    const [isOpenTncp, setIsOpenTncp] = useState(false)
    const [anchorEl, setAnchorEl] = useState<Element>()
    const [isFullscreen, setIsFullscreen] = useState(false)
    const open = Boolean(anchorEl)

    const toggleFullscreen = () => {
        if (!isFullscreen) {
            document.documentElement.requestFullscreen()
        } else {
            document.exitFullscreen()
        }

        setIsFullscreen(prev => !prev)
    }

    return (
        <AppBar
            position="fixed"
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
                        <Box textAlign="center">
                            <Typography variant="overline">
                                {user?.name}
                            </Typography>
                        </Box>

                        <MenuItem onClick={toggleColorMode}>
                            <FormControlLabel
                                label="Mode Gelap"
                                control={
                                    <Switch
                                        checked={theme.palette.mode === 'dark'}
                                    />
                                }
                            />
                        </MenuItem>

                        <MenuItem onClick={toggleFullscreen}>
                            <ListItemIcon>
                                {isFullscreen ? (
                                    <FullscreenExitIcon fontSize="small" />
                                ) : (
                                    <FullscreenIcon fontSize="small" />
                                )}
                            </ListItemIcon>
                            <ListItemText>
                                {isFullscreen && 'Tutup '}Layar Penuh
                            </ListItemText>

                            <Typography variant="body2" color="text.secondary">
                                F11
                            </Typography>
                        </MenuItem>
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
                        <Divider />
                        <MenuItem onClick={() => router.push('/logout')}>
                            <ListItemIcon>
                                <LogoutIcon fontSize="small" />
                            </ListItemIcon>
                            Logout
                        </MenuItem>
                        <Box mt={2} mb={1} textAlign="center" color="GrayText">
                            <Typography variant="caption" component="div">
                                Koperasi Belayan Sejahtera Elektronik
                            </Typography>
                            <Typography variant="caption" component="div">
                                v{packageJson.version} &mdash;
                                {moment(packageJson.versionDate).format(
                                    ' DD-MM-YYYY',
                                )}
                            </Typography>
                            <Typography variant="caption" component="div">
                                <Link
                                    color="inherit"
                                    href="https://github.com/sensasi-apps"
                                    target="_blank">
                                    Sensasi Apps
                                </Link>
                                {' © '}
                                {new Date().getFullYear()}
                                {'.'}
                            </Typography>
                        </Box>
                    </Menu>
                </Box>
            </Toolbar>

            <TncpDialog
                open={isOpenTncp}
                handleClose={() => setIsOpenTncp(false)}
            />
        </AppBar>
    )
}

export default TopBar
