import { useRouter } from 'next/router'

import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import ConstructionIcon from '@mui/icons-material/Construction'
import RefreshIcon from '@mui/icons-material/Refresh'

import GuestFormLayout from '@/components/Layouts/GuestFormLayout'

export default function Maintenance() {
    const router = useRouter()

    return (
        <GuestFormLayout title="Mohon Maaf" icon={<ConstructionIcon />}>
            <Typography variant="h3" component="div" color="warning.main">
                E-KBS sedang dalam pemeliharaan, silakan coba lagi nanti.
            </Typography>

            <Button
                fullWidth
                variant="outlined"
                size="small"
                color="warning"
                startIcon={<RefreshIcon />}
                sx={{ mt: 3, mb: 1 }}
                onClick={() => router.reload()}>
                Muat ulang halaman
            </Button>
        </GuestFormLayout>
    )
}
