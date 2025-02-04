import type { ApiResponseType } from './me/participations'
// vendors
import useSWR from 'swr'
// materials
import Grid2 from '@mui/material/Grid2'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
// icons-materials
import FireTruck from '@mui/icons-material/FireTruck'
import Forest from '@mui/icons-material/Forest'
// components
import AuthLayout from '@/components/Layouts/AuthLayout'
import useAuth from '@/providers/Auth'
import ScrollableXBox from '@/components/ScrollableXBox'
import BigNumberCard from '@/components/big-number-card'
import AlertListCard from '@/components/pages/dashboard/AlertListCard'
// enums
import Role from '@/enums/Role'

/**
 * The `Page` component represents the dashboard page of the application.
 * It fetches user-specific data and displays various sections based on the user's role.
 *
 * @todo Add total participation (RP) section
 */
export default function Page() {
    const { user, userHasRole } = useAuth()

    const { data: { palmBunchesDelivery, palmBunches } = {} } =
        useSWR<ApiResponseType>(
            userHasRole([Role.FARMER, Role.COURIER])
                ? 'me/participations'
                : null,
        )

    return (
        <AuthLayout title="Dasbor">
            <Typography variant="h5" component="div" mb={4}>
                Selamat datang,{' '}
                {user?.name ? (
                    <Typography color="info.main" variant="h5" component="span">
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
            </Typography>

            <ScrollableXBox
                gap={3}
                flex="1 1 0"
                sx={{
                    '& > *': {
                        flex: '0 0 auto',
                    },
                }}
                mb={6}>
                {userHasRole(Role.FARMER) && palmBunches && (
                    <BigNumberCard
                        {...palmBunches.bigNumber1}
                        title={
                            <>
                                <Forest sx={{ mr: 1 }} /> Penjualan TBS bulan
                                ini
                            </>
                        }
                    />
                )}

                {userHasRole(Role.COURIER) && palmBunchesDelivery && (
                    <BigNumberCard
                        {...palmBunchesDelivery.bigNumber1}
                        title={
                            <>
                                <FireTruck sx={{ mr: 1 }} /> Pengangkutan TBS
                                bulan ini
                            </>
                        }
                    />
                )}
            </ScrollableXBox>

            <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 12, md: 4 }}>
                    <AlertListCard />
                </Grid2>
            </Grid2>
        </AuthLayout>
    )
}
