'use client'

// vendors
import { useCallback, useState, type MouseEventHandler } from 'react'
// materials
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Link from '@mui/material/Link'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
// components
import ChipSmall from '@/components/ChipSmall'
import FlexBox from '@/components/flex-box'
import FooterBox from '@/components/footer-box'
// parts
import DarkModeSwitch from './_parts/dark-mode-switch-menu-item'
import FullscreenMenuItem from './_parts/fullscreen-menu-item'
import TncpMenuItem from './_parts/tncp-menu-item'
// icons
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LogoutIcon from '@mui/icons-material/Logout'
import SyncIcon from '@mui/icons-material/Sync'
// providers
import useAuthInfo from '@/hooks/use-auth-info'

type Color =
    | 'inherit'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'error'
    | 'info'
    | 'warning'

interface AccountButtonProps {
    color?: Color
}

export default function AccountButton({
    color = 'inherit',
}: AccountButtonProps) {
    const user = useAuthInfo()
    const [anchorEl, setAnchorEl] = useState<Element>()

    const handleOpenMenu = useCallback<MouseEventHandler>(
        event => setAnchorEl(event.currentTarget as Element),
        [],
    )

    const handleCloseMenu = useCallback(() => setAnchorEl(undefined), [])

    if (!user) return null

    return (
        <>
            <MobileAccountButton color={color} onClick={handleOpenMenu} />
            <DesktopAccountButton
                color={color}
                label={user.name}
                onClick={handleOpenMenu}
            />

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}>
                <FlexBox alignItems="center" justifyContent="center" my={1}>
                    <ChipSmall
                        label={`#${user.id}`}
                        variant="outlined"
                        color="info"
                    />
                    <Typography fontWeight="bold" component="div">
                        {user.name}
                    </Typography>
                </FlexBox>

                <Divider sx={{ pt: 1 }} />

                <DarkModeSwitch />
                <FullscreenMenuItem />

                <MenuItem onClick={() => window.location.reload()}>
                    <ListItemIcon>
                        <SyncIcon />
                    </ListItemIcon>
                    <ListItemText>Muat Ulang Halaman</ListItemText>
                    <Typography variant="body2" color="text.secondary">
                        F5
                    </Typography>
                </MenuItem>

                <Divider />
                <TncpMenuItem />
                <Divider />

                <MenuItem href="/logout" component={Link}>
                    <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    Logout
                </MenuItem>

                <FooterBox mt={2} mb={1} component="div" />
            </Menu>
        </>
    )
}

interface DesktopAccountButtonProps {
    color: Color
    label: string
    onClick: MouseEventHandler<HTMLDivElement>
}

function DesktopAccountButton({
    color,
    label,
    onClick,
}: DesktopAccountButtonProps) {
    const isInherit = color === 'inherit'

    return (
        <Chip
            aria-label="akun desktop"
            icon={
                <AccountCircleIcon color={isInherit ? 'inherit' : undefined} />
            }
            label={label}
            variant="filled"
            color={isInherit ? undefined : color}
            sx={{
                color: isInherit ? '#e0e0e0' : undefined,
                display: { xs: 'none', sm: 'inline-flex' },
            }}
            onClick={onClick}
        />
    )
}

interface MobileAccountButtonProps {
    color: Color
    onClick: MouseEventHandler<HTMLButtonElement>
}

function MobileAccountButton({ color, onClick }: MobileAccountButtonProps) {
    const isInherit = color === 'inherit'

    return (
        <IconButton
            color={isInherit ? 'inherit' : undefined}
            onClick={onClick}
            aria-label="akun mobile"
            sx={{ display: { xs: 'inline-flex', sm: 'none' } }}>
            <AccountCircleIcon />
        </IconButton>
    )
}
