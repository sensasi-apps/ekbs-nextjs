'use client'

// icons-materials
import FireTruck from '@mui/icons-material/FireTruck'
import Forest from '@mui/icons-material/Forest'
// materials
import Box from '@mui/material/Box'
// vendors
import useSWR from 'swr'
import BigNumberCard from '@/components/big-number-card'
// enums
import Role from '@/enums/role'
// hooks
import useIsAuthHasRole from '@/hooks/use-is-auth-has-role'
import type ApiResponseType from '../me/participation/api-response-type'

/**
 * The `Page` component represents the dashboard page of the application.
 * It fetches user-specific data and displays various sections based on the user's role.
 *
 * @todo Add total participation (RP) section
 */
export default function TempCards() {
    const isAuthHasRole = useIsAuthHasRole()

    const { data: { palmBunchesDelivery, palmBunches } = {} } =
        useSWR<ApiResponseType>(
            isAuthHasRole([Role.FARMER, Role.COURIER])
                ? 'me/participations'
                : null,
        )

    return (
        <>
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
        </>
    )
}
