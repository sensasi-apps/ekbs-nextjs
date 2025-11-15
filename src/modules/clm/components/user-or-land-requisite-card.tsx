'use client'

// materials
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
// components
import ChipSmall from '@/components/chip-small'
// vendors
import Link from '@/components/next-link'
//
import type RequisiteLandORM from '@/modules/clm/types/orms/requisite-land'
import type RequisiteUserORM from '@/modules/clm/types/orms/requisite-user'
import getRequisiteStatus from '@/modules/clm/utils/get-requisite-status'

export default function UserOrLandRequisiteCard({
    data: userOrLandRequisite,
}: {
    data: RequisiteLandORM | RequisiteUserORM
}) {
    const { status, icon, chipColor, chipLabel } =
        getRequisiteStatus(userOrLandRequisite)

    const uuid =
        'land_uuid' in userOrLandRequisite
            ? userOrLandRequisite?.land_uuid
            : userOrLandRequisite?.user_uuid

    return (
        <Card
            sx={{
                height: '100%',
                mb: 2,
                opacity: status === 'optional' ? 0.5 : 1,
                width: '100%',
            }}>
            <CardActionArea
                href={`${uuid}/requisite/${userOrLandRequisite.requisite_id}`}
                LinkComponent={Link}>
                <CardContent
                    sx={{
                        alignItems: 'center',
                        display: 'flex',
                        gap: 2,
                        justifyContent: 'space-between',
                        p: `${status === 'optional' ? 6 : 24}px 32px !important`,
                    }}>
                    <Box alignItems="center" display="flex" gap={1}>
                        {icon}

                        <Box>
                            <Typography
                                component="div"
                                fontWeight="bold"
                                variant="h6">
                                {userOrLandRequisite.requisite?.name}
                                {userOrLandRequisite.requisite?.is_optional && (
                                    <Typography
                                        component="div"
                                        variant="caption">
                                        (opsional)
                                    </Typography>
                                )}
                            </Typography>

                            <Box maxWidth={350}>
                                <Typography component="div" variant="caption">
                                    {userOrLandRequisite.requisite?.description}
                                </Typography>

                                <Typography component="div" variant="body2">
                                    {userOrLandRequisite.note}
                                </Typography>

                                {(userOrLandRequisite.files?.length ?? 0) >
                                    0 && (
                                    <Typography
                                        color="textSecondary"
                                        component="div"
                                        variant="caption">
                                        {userOrLandRequisite.files?.length}{' '}
                                        berkas
                                    </Typography>
                                )}

                                {userOrLandRequisite.approved_at && (
                                    <Typography
                                        component="div"
                                        variant="caption">
                                        Disetujui oleh{' '}
                                        {
                                            userOrLandRequisite.approved_by_user
                                                ?.name
                                        }{' '}
                                        pada ({userOrLandRequisite.approved_at})
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    </Box>

                    {chipLabel && (
                        <ChipSmall color={chipColor} label={chipLabel} />
                    )}
                </CardContent>
            </CardActionArea>
        </Card>
    )
}
