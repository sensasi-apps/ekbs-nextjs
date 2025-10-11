'use client'

// icons-materials
import FireTruck from '@mui/icons-material/FireTruck'
import Forest from '@mui/icons-material/Forest'
// materials
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
// vendors
import useSWR from 'swr'
import BigNumberCard, {
    type BigNumberCardProps,
} from '@/components/big-number-card'
import AlertListCard from '@/components/pages/dashboard/AlertListCard'
// components
import ScrollableXBox from '@/components/ScrollableXBox'
// enums
import Role from '@/enums/role'
// hooks
import useAuthInfo from '@/hooks/use-auth-info'
import useIsAuthHasRole from '@/hooks/use-is-auth-has-role'
import type { ApiResponseType } from '../me/participation/page'

/**
 * The `Page` component represents the dashboard page of the application.
 * It fetches user-specific data and displays various sections based on the user's role.
 *
 * @todo Add total participation (RP) section
 */
export default function Page() {
    const user = useAuthInfo()
    const isAuthHasRole = useIsAuthHasRole()

    const { data: { palmBunchesDelivery, palmBunches } = {} } =
        useSWR<ApiResponseType>(
            isAuthHasRole([Role.FARMER, Role.COURIER])
                ? 'me/participations'
                : null,
        )

    const { data = [] } = useSWR<BigNumberCardProps[]>(
        isAuthHasRole([Role.SUPERMAN]) ? 'data/dashboard' : null,
    )

    return (
        <>
            <Typography component="div" mb={4} variant="h5">
                Selamat datang,{' '}
                {user?.name ? (
                    <Typography color="info.main" component="span" variant="h5">
                        {user?.name}
                    </Typography>
                ) : (
                    <Skeleton
                        component="span"
                        height="2rem"
                        variant="rounded"
                        width="7rem"
                    />
                )}
            </Typography>

            <ScrollableXBox
                alignItems="stretch"
                flex="1 1 0"
                gap={3}
                mb={6}
                sx={{
                    '& > *': {
                        flex: '0 0 auto',
                        minWidth: '15rem',
                    },
                }}>
                {isAuthHasRole(Role.FARMER) && palmBunches && (
                    <BigNumberCard
                        {...palmBunches.bigNumber1}
                        title={
                            <Box alignItems="center" display="flex" gap={2}>
                                <Forest />
                                <div>Penjualan TBS bulan ini</div>
                            </Box>
                        }
                    />
                )}

                {isAuthHasRole(Role.COURIER) && palmBunchesDelivery && (
                    <BigNumberCard
                        {...palmBunchesDelivery.bigNumber1}
                        title={
                            <Box alignItems="center" display="flex" gap={2}>
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
                <Grid size={{ md: 4, xs: 12 }}>
                    <AlertListCard />
                </Grid>
            </Grid>
        </>
    )
}
