// materials
import Box from '@mui/material/Box'
import Grid2 from '@mui/material/Unstable_Grid2'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
// components
import AuthLayout from '@/components/Layouts/AuthLayout'
import useAuth from '@/providers/Auth'
// enums
import AlertListCard from '@/components/pages/dashboard/AlertListCard'

export default function Dashboard() {
    const { user } = useAuth()

    return (
        <AuthLayout title="Dasbor">
            <Box display="inline-flex" gap={1} mb={6} flexWrap="wrap">
                <Typography variant="h5" component="div">
                    Selamat datang,
                </Typography>

                {user?.name ? (
                    <Typography color="info.main" variant="h5" component="div">
                        {user?.name}
                    </Typography>
                ) : (
                    <Skeleton
                        variant="rounded"
                        component="span"
                        width="7rem"
                        height="2rem"
                    />
                )}
            </Box>

            <Grid2 container spacing={2}>
                <Grid2 xs={12} md={4}>
                    <AlertListCard />
                </Grid2>
            </Grid2>
        </AuthLayout>
    )
}
