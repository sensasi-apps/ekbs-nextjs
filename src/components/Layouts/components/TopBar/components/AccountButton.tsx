// vendors
import { useRouter } from 'next/router'
import { useState } from 'react'
import {
    Chip,
    Divider,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Typography,
} from '@mui/material'
// components
import FlexColumnBox from '@/components/FlexColumnBox'
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

export default function AccountButton() {
    const { user } = useAuth()
    const router = useRouter()

    const [isOpenTncp, setIsOpenTncp] = useState(false)
    const [anchorEl, setAnchorEl] = useState<Element>()

    return (
        <>
            <Chip
                icon={<AccountCircleIcon />}
                label={user?.name ?? 'memuat...'}
                variant="filled"
                color="success"
                onClick={({ currentTarget }) => setAnchorEl(currentTarget)}
            />

            <Menu
                anchorEl={anchorEl}
                open={!!anchorEl}
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
                        #<strong>{user?.id}</strong> &mdash; {user?.name}
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
        </>
    )
}
