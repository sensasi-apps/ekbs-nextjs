'use client'

// icons
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import GradingIcon from '@mui/icons-material/Grading'
import LogoutIcon from '@mui/icons-material/Logout'
import SyncIcon from '@mui/icons-material/Sync'
// materials
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import NextLink from 'next/link'
// vendors
import { type MouseEventHandler, useState } from 'react'
// components
import ChipSmall from '@/components/chip-small'
import FlexBox from '@/components/flex-box'
import FooterBox from '@/components/footer-box'
// providers
import useAuthInfo from '@/hooks/use-auth-info'
// parts
import DarkModeSwitch from './_parts/dark-mode-switch-menu-item'
import FullscreenMenuItem from './_parts/fullscreen-menu-item'

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

    const handleOpenMenu: MouseEventHandler = event => {
        setAnchorEl(event.currentTarget as Element)
    }

    const handleCloseMenu = () => setAnchorEl(undefined)

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
                onClose={handleCloseMenu}
                open={Boolean(anchorEl)}>
                <FlexBox alignItems="center" justifyContent="center" my={1}>
                    <ChipSmall
                        color="info"
                        label={`#${user.id}`}
                        variant="outlined"
                    />
                    <Typography component="div" fontWeight="bold">
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
                    <Typography color="text.secondary" variant="body2">
                        F5
                    </Typography>
                </MenuItem>

                <Divider />

                <MenuItem component={NextLink} href="/policy">
                    <ListItemIcon>
                        <GradingIcon fontSize="small" />
                    </ListItemIcon>

                    <ListItemText>
                        Syarat, Ketentuan, dan Kebijakan Privasi
                    </ListItemText>
                </MenuItem>

                <Divider />

                <MenuItem component={NextLink} href="/logout">
                    <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                    </ListItemIcon>

                    <ListItemText>Logout</ListItemText>
                </MenuItem>

                <FooterBox component="div" mb={1} mt={2} />
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
            color={isInherit ? undefined : color}
            icon={
                <AccountCircleIcon color={isInherit ? 'inherit' : undefined} />
            }
            label={label}
            onClick={onClick}
            sx={{
                color: isInherit ? '#e0e0e0' : undefined,
                display: { sm: 'inline-flex', xs: 'none' },
            }}
            variant="filled"
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
            aria-label="akun mobile"
            color={isInherit ? 'inherit' : undefined}
            onClick={onClick}
            sx={{ display: { sm: 'none', xs: 'inline-flex' } }}>
            <AccountCircleIcon />
        </IconButton>
    )
}
