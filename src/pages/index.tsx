// materials
import Box from '@mui/material/Box'
import Button, { ButtonProps } from '@mui/material/Button'
import Typography from '@mui/material/Typography'
// icons
import AssessmentIcon from '@mui/icons-material/Assessment'
import LogoImage from '@/components/LogoImage'
import WarehouseIcon from '@mui/icons-material/Warehouse'
// layouts
import PublicLayout from '@/components/Layouts/PublicLayout'

export default function Index() {
    return (
        <PublicLayout
            loginButton
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
                    startIcon={<WarehouseIcon {...ICON_DEFAULT_PROPS} />}>
                    Katalog Saprodi
                </Button>
                <Button
                    {...BUTTON_DEFAULT_PROPS}
                    href="laporan-performa"
                    startIcon={<AssessmentIcon {...ICON_DEFAULT_PROPS} />}>
                    Laporan Performa
                </Button>
            </Box>
        </PublicLayout>
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
        width: '1.5em',
        height: '1.5em',
    },
}
