// vendors
import type { JSX } from 'react'
// materials
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
// icons
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import PriorityHighIcon from '@mui/icons-material/PriorityHigh'
import ScheduleIcon from '@mui/icons-material/Schedule'
// components
import ChipSmall from '@/components/ChipSmall'
//
import type RequisiteUser from '../clm/types/requisite-user'

export default function UserRequisiteCard({
    requisiteUser,
}: {
    requisiteUser: RequisiteUser
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
            <CardActionArea>
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
                                {requisiteUser.requisite?.description && (
                                    <Typography variant="body2" component="div">
                                        {requisiteUser.requisite?.description}
                                    </Typography>
                                )}

                                {requisiteUser?.approved_by_user_uuid && (
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

function getRequisiteStatus(requisiteUser: RequisiteUser): {
    status: 'required' | 'optional'
    chipLabel: string | null
    chipColor: 'error' | 'warning' | 'success' | undefined
    icon: JSX.Element
} {
    const isApproved = !!requisiteUser?.approved_by_user_uuid

    if (!requisiteUser.requisite?.is_optional) {
        if (!requisiteUser.uuid) {
            return {
                status: 'required',
                chipLabel: 'belum dilengkapi',
                chipColor: 'error',
                icon: <PriorityHighIcon color="error" />,
            }
        }

        if (!isApproved) {
            return {
                status: 'required',
                chipLabel: 'perlu ditinjau',
                chipColor: 'warning',
                icon: <ScheduleIcon color="warning" />,
            }
        }
    }

    if (isApproved) {
        return {
            status: 'required',
            chipLabel: 'selesai',
            chipColor: 'success',
            icon: <CheckCircleOutlineIcon color="success" />,
        }
    }

    return {
        status: 'optional',
        chipLabel: null,
        chipColor: undefined,
        icon: <Box sx={{ width: 24 }} />,
    }
}
