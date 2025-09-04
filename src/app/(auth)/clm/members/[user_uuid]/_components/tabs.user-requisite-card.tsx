// materials
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
// icons
// components
import ChipSmall from '@/components/ChipSmall'
//
import type RequisiteUserORM from '@/modules/clm/types/orms/requisite-user'
import getRequisiteStatus from '@/modules/clm/utils/get-requisite-status'

export default function RequisiteUserCard({
    requisiteUser,
}: {
    requisiteUser: RequisiteUserORM
}) {
    const { status, icon, chipColor, chipLabel } =
        getRequisiteStatus(requisiteUser)

    return (
        <Card
            sx={{
                width: '100%',
                height: '100%',
                mb: 2,
                opacity: status === 'optional' ? 0.5 : 1,
            }}>
            <CardActionArea
                href={
                    requisiteUser.user_uuid +
                    '/requisite/' +
                    requisiteUser.requisite_id
                }
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
                                {requisiteUser.requisite?.name}
                                {requisiteUser.requisite?.is_optional && (
                                    <Typography
                                        variant="caption"
                                        component="div">
                                        (opsional)
                                    </Typography>
                                )}
                            </Typography>

                            <Box maxWidth={350}>
                                <Typography variant="caption" component="div">
                                    {requisiteUser.requisite?.description}
                                </Typography>

                                <Typography variant="body2" component="div">
                                    {requisiteUser.note}
                                </Typography>

                                {(requisiteUser.files?.length ?? 0) > 0 && (
                                    <Typography
                                        variant="caption"
                                        component="div"
                                        color="textSecondary">
                                        {requisiteUser.files?.length} berkas
                                    </Typography>
                                )}

                                {requisiteUser.approved_at && (
                                    <Typography
                                        variant="caption"
                                        component="div">
                                        Disetujui oleh{' '}
                                        {requisiteUser.approved_by_user?.name}{' '}
                                        pada ({requisiteUser.approved_at})
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
