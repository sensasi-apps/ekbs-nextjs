'use client'

// vendors
import Link from 'next/link'
// materials
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

// components
import ChipSmall from '@/components/ChipSmall'
//
import type RequisiteLandORM from '@/modules/clm/types/orms/requisite-land'
import getRequisiteStatus from '@/modules/clm/utils/get-requisite-status'
import type RequisiteUserORM from '@/modules/clm/types/orms/requisite-user'

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
                width: '100%',
                height: '100%',
                mb: 2,
                opacity: status === 'optional' ? 0.5 : 1,
            }}>
            <CardActionArea
                href={`${uuid}/requisite/${userOrLandRequisite.requisite_id}`}
                LinkComponent={Link}>
                <CardContent
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 2,
                        p: `${status === 'optional' ? 6 : 24}px 32px !important`,
                    }}>
                    <Box display="flex" alignItems="center" gap={1}>
                        {icon}

                        <Box>
                            <Typography
                                variant="h6"
                                fontWeight="bold"
                                component="div">
                                {userOrLandRequisite.requisite?.name}
                                {userOrLandRequisite.requisite?.is_optional && (
                                    <Typography
                                        variant="caption"
                                        component="div">
                                        (opsional)
                                    </Typography>
                                )}
                            </Typography>

                            <Box maxWidth={350}>
                                <Typography variant="caption" component="div">
                                    {userOrLandRequisite.requisite?.description}
                                </Typography>

                                <Typography variant="body2" component="div">
                                    {userOrLandRequisite.note}
                                </Typography>

                                {(userOrLandRequisite.files?.length ?? 0) >
                                    0 && (
                                    <Typography
                                        variant="caption"
                                        component="div"
                                        color="textSecondary">
                                        {userOrLandRequisite.files?.length}{' '}
                                        berkas
                                    </Typography>
                                )}

                                {userOrLandRequisite.approved_at && (
                                    <Typography
                                        variant="caption"
                                        component="div">
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
                        <ChipSmall label={chipLabel} color={chipColor} />
                    )}
                </CardContent>
            </CardActionArea>
        </Card>
    )
}
