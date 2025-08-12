'use client'

import type { ApiResponseType } from '../../../pages/me/participations'
// vendors
import useSWR from 'swr'
// materials
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
// icons-materials
import FireTruck from '@mui/icons-material/FireTruck'
import Forest from '@mui/icons-material/Forest'
// components
import useAuth from '@/providers/Auth'
import ScrollableXBox from '@/components/ScrollableXBox'
import BigNumberCard, {
    type BigNumberCardProps,
} from '@/components/big-number-card'
import AlertListCard from '@/components/pages/dashboard/AlertListCard'
// enums
import Role from '@/enums/Role'
import useAuthInfo from '@/hooks/use-auth-info'

/**
 * The `Page` component represents the dashboard page of the application.
 * It fetches user-specific data and displays various sections based on the user's role.
 *
 * @todo Add total participation (RP) section
 */
export default function Page() {
    const user = useAuthInfo()
    const { userHasRole } = useAuth()

    const { data: { palmBunchesDelivery, palmBunches } = {} } =
        useSWR<ApiResponseType>(
            userHasRole([Role.FARMER, Role.COURIER])
                ? 'me/participations'
                : null,
        )

    const { data = [] } = useSWR<BigNumberCardProps[]>(
        userHasRole([Role.SUPERMAN]) ? 'data/dashboard' : null,
    )

    return (
        <>
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
                alignItems="stretch"
                sx={{
                    '& > *': {
                        flex: '0 0 auto',
                        minWidth: '15rem',
                    },
                }}
                mb={6}>
                {userHasRole(Role.FARMER) && palmBunches && (
                    <BigNumberCard
                        {...palmBunches.bigNumber1}
                        title={
                            <Box display="flex" alignItems="center" gap={2}>
                                <Forest />
                                <div>Penjualan TBS bulan ini</div>
                            </Box>
                        }
                    />
                )}

                {userHasRole(Role.COURIER) && palmBunchesDelivery && (
                    <BigNumberCard
                        {...palmBunchesDelivery.bigNumber1}
                        title={
                            <Box display="flex" alignItems="center" gap={2}>
                                <FireTruck />
                                <div>Pengangkutan TBS bulan ini</div>
                            </Box>
                        }
                    />
                )}

                {data.map((item, index) => (
                    <BigNumberCard key={index} {...item} />
                ))}
            </ScrollableXBox>

            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <AlertListCard />
                </Grid>
            </Grid>
        </>
    )
}
