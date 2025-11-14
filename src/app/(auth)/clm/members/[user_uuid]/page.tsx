'use client'

// icons
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CropIcon from '@mui/icons-material/Crop'
import ForestIcon from '@mui/icons-material/Forest'
import WarningIcon from '@mui/icons-material/Warning'
// materials
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
// vendors
import { useParams } from 'next/navigation'
import useClmMemberDetailSwr, {
    type ClmMemberDetailResponse,
} from '@/app/(auth)/clm/members/[user_uuid]/_components/use-member-detail-swr'
// components
import BackButton from '@/components/back-button'
import ChipSmall from '@/components/chip-small'
import LoadingCenter from '@/components/loading-center'
import CertificationUpdateForm from './_components/certification-update-form'
// features
import Tabs from './_components/tabs'
import UserStatCard from './_components/user-stat-card'

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
                alignItems="center"
                display="flex"
                flexWrap="wrap"
                gap={4}
                justifyContent="center"
                mb={8}>
                <Box
                    bgcolor="grey"
                    sx={{ borderRadius: '50%', height: 100, width: 100 }}
                />

                <Box>
                    <Typography component="div" gutterBottom variant="h5">
                        {user?.name}
                        {user && (
                            <ChipSmall
                                color="info"
                                label={`#${user.id}`}
                                sx={{ ml: 1 }}
                                variant="outlined"
                            />
                        )}
                    </Typography>

                    {user?.socials?.map(social => (
                        <Typography
                            component="div"
                            key={social.uuid}
                            variant="body2">
                            {social.social.name}: {social.username}
                        </Typography>
                    ))}
                </Box>

                <CertificationUpdateForm
                    certifications={data.certifications.map(c => `${c.id}`)}
                    onSubmitted={() => mutate()}
                    user_uuid={user_uuid}
                />
            </Box>

            <Grid container mb={4} spacing={2}>
                {getStatCardProps(data).map(props => (
                    <Grid key={props.text} size={{ sm: 'auto', xs: 12 }}>
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
            Icon: ForestIcon,
            text: 'Total Lahan',
            value: lands.length,
        },
        {
            Icon: CropIcon,
            text: 'Total Luas',
            unit: 'Ha',
            value: lands.reduce((sum, land) => sum + land.n_area_hectares, 0),
        },
        {
            Icon: isRequisitesFulfilled ? CheckCircleOutlineIcon : WarningIcon,
            iconColor: isRequisitesFulfilled ? undefined : 'error',
            text: 'Syarat Perorangan',
            value: `${nApprovedRequisites}/${requisite_users_with_default.length}`,
        },
        {
            Icon: isRequisiteLandsFulfilled
                ? CheckCircleOutlineIcon
                : WarningIcon,
            iconColor: isRequisiteLandsFulfilled ? undefined : 'error',
            text: 'Syarat Lahan',
            value: `${nApprovedRequisiteLands}/${nRequisiteLand}`,
        },
    ] as const
}
