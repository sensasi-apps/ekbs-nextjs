import { useState } from 'react'
import { useRouter } from 'next/router'
import { useTheme } from '@mui/material'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import FormControlLabel from '@mui/material/FormControlLabel'
import ListItemIcon from '@mui/material/ListItemIcon'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Switch from '@mui/material/Switch'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

import MenuIcon from '@mui/icons-material/Menu'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LogoutIcon from '@mui/icons-material/Logout'
import TncpDialog from '../TncpDialog'

import GradingIcon from '@mui/icons-material/Grading'
import useAuth from '@/providers/Auth'
import { DRAWER_WIDTH } from './MenuList'

// TODO: fix topbar js
// optimize theme provider
const TopBar = ({ title, toggleDrawer }) => {
    const { user } = useAuth()

    const router = useRouter()
    const theme = useTheme()

    const [isOpenTncp, setIsOpenTncp] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)

    const handleClick = event => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
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
                    <IconButton color="inherit" onClick={handleClick}>
                        <AccountCircleIcon />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}>
                        <Box textAlign="center">
                            <Typography variant="overline">
                                {user?.name}
                            </Typography>
                        </Box>

                        <MenuItem onClick={theme.palette.toggleColorMode}>
                            <FormControlLabel
                                label="Mode Gelap"
                                control={
                                    <Switch
                                        onClick={theme.palette.toggleColorMode}
                                        checked={theme.palette.mode === 'dark'}
                                    />
                                }
                            />
                        </MenuItem>

                        <Divider />
                        <MenuItem onClick={() => setIsOpenTncp(true)}>
                            <ListItemIcon>
                                <GradingIcon fontSize="small" />
                            </ListItemIcon>
                            Syarat, Ketentuan, dan Kebijakan Privasi
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={() => router.push('/logout')}>
                            <ListItemIcon>
                                <LogoutIcon fontSize="small" />
                            </ListItemIcon>
                            Logout
                        </MenuItem>
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
