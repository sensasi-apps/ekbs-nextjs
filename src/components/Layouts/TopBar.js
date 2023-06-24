import { useContext, useState } from 'react'
import { AppContext } from '../AppContext'
import { useRouter } from 'next/router'
import { useAuth } from '@/hooks/auth'

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

const drawerWidth = 240

export default function TopBar({ pageTitle }) {
    const { themeColorMode, toggleColorMode, toggleDrawer } =
        useContext(AppContext)
    const router = useRouter()

    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const { user } = useAuth({ middleware: 'auth' })

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
                width: { sm: `calc(100% - ${drawerWidth}px)` },
                ml: { sm: `${drawerWidth}px` },
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
                    {pageTitle}
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

                        <MenuItem onClick={toggleColorMode}>
                            <FormControlLabel
                                label="Mode Gelap"
                                control={
                                    <Switch
                                        onClick={toggleColorMode}
                                        checked={themeColorMode === 'dark'}
                                    />
                                }
                            />
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
        </AppBar>
    )
}
