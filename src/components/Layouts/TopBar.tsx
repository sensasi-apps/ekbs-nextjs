// vendor
import { useState } from 'react'
import { useRouter } from 'next/router'
// materials
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
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

export default function TopBar({
    title,
    toggleDrawer,
}: {
    title: string
    toggleDrawer: () => void
}) {
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

            <TncpDialog
                open={isOpenTncp}
                handleClose={() => setIsOpenTncp(false)}
            />
        </AppBar>
    )
}
