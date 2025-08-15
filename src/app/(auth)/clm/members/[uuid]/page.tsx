'use client'

// vendors
import { useParams } from 'next/navigation'
import useSWR from 'swr'
// materials
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
// icons
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CropIcon from '@mui/icons-material/Crop'
import ForestIcon from '@mui/icons-material/Forest'
// components
import BackButton from '@/components/back-button'
import ChipSmall from '@/components/ChipSmall'
import LoadingCenter from '@/components/loading-center'
// features
import type ApiResponse from '@/features/clm-member-detail/types/api-response'
import Tabs from '@/features/clm-member-detail/tabs'
import UserStatCard from '@/features/clm-member-detail/user-stat-card'

export default function MemberDetailPage() {
    const params = useParams<{
        uuid?: string
    }>()

    const uuid = params?.uuid

    const { data } = useSWR<ApiResponse>(uuid ? `/clm/members/${uuid}` : null)

    if (!data) return <LoadingCenter />

    const { user, lands = [], requisite_users = [] } = data ?? {}
    const userLands = user?.lands ?? []

    const approvedRequisites = requisite_users.filter(
        req => !!req.approved_by_user_uuid,
    ).length

    const statCardProps = [
        {
            text: 'Total Lahan',
            value: lands.length,
            Icon: ForestIcon,
        },
        {
            text: 'Total Luas',
            value: userLands.reduce(
                (sum, land) => sum + land.n_area_hectares,
                0,
            ),
            unit: 'Ha',
            Icon: CropIcon,
        },
        {
            text: 'Syarat Perorangan',
            value: `${approvedRequisites}/${requisite_users.length}`,
            Icon: CheckCircleOutlineIcon,
        },
    ]

    return (
        <>
            <BackButton />

            <Box
                mb={8}
                display="flex"
                alignItems="center"
                gap={4}
                justifyContent="center"
                flexWrap="wrap">
                <Box
                    bgcolor="grey"
                    sx={{ borderRadius: '50%', width: 100, height: 100 }}
                />

                <Box>
                    <Typography variant="h5" component="div" gutterBottom>
                        {user?.name}
                        {user && (
                            <ChipSmall
                                label={`#${user.id}`}
                                color="info"
                                variant="outlined"
                                sx={{ ml: 1 }}
                            />
                        )}
                    </Typography>

                    {user?.socials?.map((social, i) => (
                        <Typography key={i} variant="body2" component="div">
                            {social.social.name}: {social.username}
                        </Typography>
                    ))}
                </Box>
            </Box>

            <Grid container spacing={2} mb={4}>
                {statCardProps.map((props, index) => (
                    <Grid key={index} size={{ xs: 12, sm: 'auto' }}>
                        <UserStatCard {...props} />
                    </Grid>
                ))}
            </Grid>

            <Tabs data={data} />
        </>
    )
}
