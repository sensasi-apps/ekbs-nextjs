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
    const router = useRouter()
    const { user } = useAuth()

    useEffect(() => {
        if (user) {
            router.replace('/dashboard')
        }
    }, [user])

    return (
        <>
            <Fade in={user !== null} unmountOnExit>
                <Box>
                    <LogoLoadingBox />
                </Box>
            </Fade>

            <Fade in={user === null} unmountOnExit>
                <Box>
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

                        <Typography
                            variant="caption"
                            component="div"
                            gutterBottom>
                            Halaman publik
                        </Typography>

                        <Box display="flex" gap={1} flexWrap="wrap">
                            <Button
                                {...BUTTON_DEFAULT_PROPS}
                                href="katalog-saprodi"
                                startIcon={
                                    <WarehouseIcon {...ICON_DEFAULT_PROPS} />
                                }>
                                Katalog Saprodi
                            </Button>
                            <Button
                                {...BUTTON_DEFAULT_PROPS}
                                href="laporan-performa"
                                startIcon={
                                    <AssessmentIcon {...ICON_DEFAULT_PROPS} />
                                }>
                                Performa Koperasi
                            </Button>
                        </Box>

                        <Typography
                            variant="caption"
                            component="div"
                            gutterBottom
                            mt={2}>
                            Atau
                        </Typography>

                        <Box display="flex" gap={1} flexWrap="wrap">
                            <Button
                                {...BUTTON_DEFAULT_PROPS}
                                href="login"
                                color="success"
                                endIcon={<LoginIcon {...ICON_DEFAULT_PROPS} />}>
                                Masuk Aplikasi
                            </Button>
                        </Box>
                    </PublicLayout>
                </Box>
            </Fade>
        </>
    )
}

const BUTTON_DEFAULT_PROPS: {
    fullWidth: ButtonProps['fullWidth']
    size: ButtonProps['size']
    variant: ButtonProps['variant']
} = {
    fullWidth: true,
    size: 'large',
    variant: 'outlined',
}

const ICON_DEFAULT_PROPS: {
    sx: {
        width: string
        height: string
    }
} = {
    sx: {
        width: '1em',
        height: '1em',
    },
}
