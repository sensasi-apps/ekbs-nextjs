// vendors
import { useEffect } from 'react'
import { useRouter } from 'next/router'
// materials
import Box from '@mui/material/Box'
import Button, { ButtonProps } from '@mui/material/Button'
import Fade from '@mui/material/Fade'
import Typography from '@mui/material/Typography'
// icons
import AssessmentIcon from '@mui/icons-material/Assessment'
import LoginIcon from '@mui/icons-material/Login'
import WarehouseIcon from '@mui/icons-material/Warehouse'
// components
import LogoImage from '@/components/LogoImage'
import LogoLoadingBox from '@/components/LogoLoadingBox'
import PublicLayout from '@/components/Layouts/PublicLayout'
// etc
import useAuth from '@/providers/Auth'

export default function Index() {
    const { replace } = useRouter()
    const { user } = useAuth()

    useEffect(() => {
        if (user) {
            replace('/dashboard')
        }
    }, [user, replace])

    const isLoading = user === undefined
    const isGuest = user === null

    return (
        <>
            <Fade in={isLoading} unmountOnExit>
                <span>
                    <LogoLoadingBox />
                </span>
            </Fade>

            <Fade in={isGuest} unmountOnExit>
                <span>
                    <PublicMenu />
                </span>
            </Fade>
        </>
    )
}

const BUTTON_DEFAULT_PROPS: ButtonProps = {
    fullWidth: true,
    size: 'large',
    variant: 'outlined',
}

const ICON_DEFAULT_SX = {
    width: '1em',
    height: '1em',
}

function PublicMenu() {
    return (
        <PublicLayout
            footerTextOnly
            maxWidth="xs"
            title={process.env.NEXT_PUBLIC_APP_NAME ?? ''}>
            <Box display="flex" alignItems="start">
                <Box flexGrow={1}>
                    <LogoImage />
                </Box>
            </Box>

            <Typography variant="h4" component="h1" mb={4}>
                {process.env.NEXT_PUBLIC_APP_NAME}
            </Typography>

            <Typography variant="caption" component="div" gutterBottom>
                Halaman publik
            </Typography>

            <Box display="flex" gap={1} flexWrap="wrap">
                <Button
                    {...BUTTON_DEFAULT_PROPS}
                    href="katalog-saprodi"
                    startIcon={<WarehouseIcon sx={ICON_DEFAULT_SX} />}>
                    Katalog Saprodi
                </Button>
                <Button
                    {...BUTTON_DEFAULT_PROPS}
                    href="laporan-performa"
                    startIcon={<AssessmentIcon sx={ICON_DEFAULT_SX} />}>
                    Performa Koperasi
                </Button>
            </Box>

            <Typography variant="caption" component="div" gutterBottom mt={2}>
                Atau
            </Typography>

            <Box display="flex" gap={1} flexWrap="wrap">
                <Button
                    {...BUTTON_DEFAULT_PROPS}
                    href="login"
                    color="success"
                    endIcon={<LoginIcon sx={ICON_DEFAULT_SX} />}>
                    Masuk Aplikasi
                </Button>
            </Box>
        </PublicLayout>
    )
}
