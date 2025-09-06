'use client'

// vendors
import { useParams } from 'next/navigation'
// materials
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
// icons
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import WarningIcon from '@mui/icons-material/Warning'
import CropIcon from '@mui/icons-material/Crop'
import ForestIcon from '@mui/icons-material/Forest'
// components
import BackButton from '@/components/back-button'
import ChipSmall from '@/components/ChipSmall'
import LoadingCenter from '@/components/loading-center'
// features
import Tabs from './_components/tabs'
import UserStatCard from './_components/user-stat-card'
import CertificationUpdateForm from './_components/certification-update-form'
import useClmMemberDetailSwr, {
    type ClmMemberDetailResponse,
} from '@/app/(auth)/clm/members/[user_uuid]/_components/use-member-detail-swr'

export default function MemberDetailPage() {
    const { user_uuid } = useParams<{
        user_uuid: string
    }>()

    const { data, mutate } = useClmMemberDetailSwr(user_uuid)

    if (!data) return <LoadingCenter />

    const { user } = data

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

                <CertificationUpdateForm
                    user_uuid={user_uuid}
                    certifications={data.certifications.map(c => `${c.id}`)}
                    onSubmitted={() => mutate()}
                />
            </Box>

            <Grid container spacing={2} mb={4}>
                {getStatCardProps(data).map((props, index) => (
                    <Grid key={index} size={{ xs: 12, sm: 'auto' }}>
                        <UserStatCard {...props} />
                    </Grid>
                ))}
            </Grid>

            <Tabs data={data} />
        </>
    )
}

function getStatCardProps({
    lands,
    requisite_users_with_default,
}: ClmMemberDetailResponse) {
    const nApprovedRequisites = requisite_users_with_default.filter(
        req => !!req.approved_by_user_uuid,
    ).length

    const nRequiredRequisites = requisite_users_with_default.filter(
        req => !req.requisite?.is_optional,
    ).length

    const isRequisitesFulfilled = nApprovedRequisites === nRequiredRequisites

    const nApprovedRequisiteLands = lands.reduce(
        (sum, land) =>
            sum +
            (land.requisite_lands_with_default ?? []).filter(
                requisiteLand => requisiteLand.approved_by_user_uuid,
            ).length,
        0,
    )

    const nRequisiteLand = lands.reduce(
        (sum, land) => sum + (land?.requisite_lands_with_default ?? []).length,
        0,
    )

    const isRequisiteLandsFulfilled = nApprovedRequisiteLands === nRequisiteLand

    return [
        {
            text: 'Total Lahan',
            value: lands.length,
            Icon: ForestIcon,
        },
        {
            text: 'Total Luas',
            value: lands.reduce((sum, land) => sum + land.n_area_hectares, 0),
            unit: 'Ha',
            Icon: CropIcon,
        },
        {
            text: 'Syarat Perorangan',
            value: `${nApprovedRequisites}/${requisite_users_with_default.length}`,
            Icon: isRequisitesFulfilled ? CheckCircleOutlineIcon : WarningIcon,
            iconColor: isRequisitesFulfilled ? undefined : 'error',
        },
        {
            text: 'Syarat Lahan',
            value: `${nApprovedRequisiteLands}/${nRequisiteLand}`,
            Icon: isRequisiteLandsFulfilled
                ? CheckCircleOutlineIcon
                : WarningIcon,
            iconColor: isRequisiteLandsFulfilled ? undefined : 'error',
        },
    ] as const
}
