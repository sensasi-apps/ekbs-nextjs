'use client'

// vendors
import { useRouter } from 'next/navigation'
import { useState } from 'react'
// materials
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
// components
import ChipSmall from '@/components/ChipSmall'
import FlexBox from '@/components/flex-box'
import FooterBox from '@/components/Layouts/FooterBox'
// local components
import DarkModeSwitch from './DarkModeSwitch'
import FullscreenMenuItem from './FullscreenMenuItem'
import GradingIcon from '@mui/icons-material/Grading'
import LogoutIcon from '@mui/icons-material/Logout'
import TncpDialog from './TncpDialog'
// icons
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import SyncIcon from '@mui/icons-material/Sync'
// providers
import useAuth from '@/providers/Auth'

export default function AccountButton({
    color = 'inherit',
}: {
    color?:
        | 'inherit'
        | 'primary'
        | 'secondary'
        | 'success'
        | 'error'
        | 'info'
        | 'warning'
}) {
    const { user } = useAuth()
    const router = useRouter()

    const [isOpenTncp, setIsOpenTncp] = useState(false)
    const [anchorEl, setAnchorEl] = useState<Element>()

    if (!user) return null

    return (
        <>
            <IconButton
                aria-label="akun"
                onClick={({ currentTarget }) => setAnchorEl(currentTarget)}
                color={color}
                sx={{
                    display: {
                        xs: 'inline-flex',
                        sm: 'none',
                    },
                }}>
                <AccountCircleIcon />
            </IconButton>

            <Chip
                aria-label="akun"
                icon={
                    <AccountCircleIcon
                        color={color === 'inherit' ? 'inherit' : undefined}
                    />
                }
                label={user.name}
                variant="filled"
                color={color === 'inherit' ? undefined : color}
                sx={{
                    color: color === 'inherit' ? '#e0e0e0' : undefined,
                    display: {
                        xs: 'none',
                        sm: 'inline-flex',
                    },
                }}
                onClick={({ currentTarget }) => setAnchorEl(currentTarget)}
            />

            <Menu
                anchorEl={anchorEl}
                open={!!anchorEl}
                onClose={() => setAnchorEl(undefined)}>
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

                <MenuItem onClick={() => router.refresh()}>
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

            <TncpDialog
                open={isOpenTncp}
                handleClose={() => setIsOpenTncp(false)}
            />
        </>
    )
}
