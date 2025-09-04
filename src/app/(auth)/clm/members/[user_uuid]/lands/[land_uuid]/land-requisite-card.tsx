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

export default function RequisiteLandCard({
    requisiteLand,
}: {
    requisiteLand: RequisiteLandORM
}) {
    const { status, icon, chipColor, chipLabel } =
        getRequisiteStatus(requisiteLand)

    return (
        <Card
            sx={{
                width: '100%',
                height: '100%',
                mb: 2,
                opacity: status === 'optional' ? 0.5 : 1,
            }}>
            <CardActionArea
                href={`${requisiteLand.land_uuid}/requisite/${requisiteLand.requisite_id}`}
                component={Link}>
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
                                {requisiteLand.requisite?.name}
                                {requisiteLand.requisite?.is_optional && (
                                    <Typography
                                        variant="caption"
                                        component="div">
                                        (opsional)
                                    </Typography>
                                )}
                            </Typography>

                            <Box maxWidth={350}>
                                <Typography variant="caption" component="div">
                                    {requisiteLand.requisite?.description}
                                </Typography>

                                <Typography variant="body2" component="div">
                                    {requisiteLand.note}
                                </Typography>

                                {(requisiteLand.files?.length ?? 0) > 0 && (
                                    <Typography
                                        variant="caption"
                                        component="div"
                                        color="textSecondary">
                                        {requisiteLand.files?.length} berkas
                                    </Typography>
                                )}

                                {requisiteLand.approved_at && (
                                    <Typography
                                        variant="caption"
                                        component="div">
                                        Disetujui oleh{' '}
                                        {requisiteLand.approved_by_user?.name}{' '}
                                        pada ({requisiteLand.approved_at})
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
