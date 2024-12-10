// materials
import Box from '@mui/material/Box'
import Button, { ButtonProps } from '@mui/material/Button'
import Typography from '@mui/material/Typography'
// icons
import AssessmentIcon from '@mui/icons-material/Assessment'
import LoginIcon from '@mui/icons-material/Login'
import WarehouseIcon from '@mui/icons-material/Warehouse'
// components
import LogoImage from '@/components/LogoImage'
import PublicLayout from '@/components/Layouts/PublicLayout'
// etc
import PrintHandler from '@/components/PrintHandler'
import { useRoleChecker } from '@/hooks/use-role-checker'
import Role from '@/enums/Role'

export default function Index() {
    if (!useRoleChecker(Role.SUPERMAN)) return null

    return (
        <span>
            <PublicMenu />
            <PublicMenu />
            <PublicMenu />
            <PublicMenu />
            <PublicMenu />
            <PublicMenu />
            <PublicMenu />
            <PublicMenu />

            <PublicMenu />

            <PrintHandler>
                <Typography variant="h1">Test</Typography>
            </PrintHandler>
        </span>
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
