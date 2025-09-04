// vendors
import type { ReactNode } from 'react'
// materials
import Box from '@mui/material/Box'
// icons
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import PriorityHighIcon from '@mui/icons-material/PriorityHigh'
import ScheduleIcon from '@mui/icons-material/Schedule'
// components
import FlexBox from '@/components/flex-box'
//
import type RequisiteUserORM from '@/modules/clm/types/orms/requisite-user'
import type RequisiteLandORM from '@/modules/clm//types/orms/requisite-land'

export default function getRequisiteStatus({
    requisite,
    approved_at,
    files,
}: RequisiteUserORM | RequisiteLandORM): {
    status: 'required' | 'optional'
    chipLabel: string | ReactNode
    chipColor: 'error' | 'warning' | 'success' | undefined
    icon: ReactNode
} {
    const isOptional = requisite?.is_optional ?? false
    const isApproved = Boolean(approved_at)
    const hasFiles = files?.length ?? 0 > 0

    if (isApproved) {
        return {
            status: 'required',
            chipLabel: 'selesai',
            chipColor: 'success',
            icon: <CheckCircleOutlineIcon color="success" />,
        }
    }

    if (isOptional && !hasFiles) {
        return {
            status: 'optional',
            chipLabel: null,
            chipColor: undefined,
            icon: <Box sx={{ width: 24 }} />,
        }
    }

    if (hasFiles && !isApproved) {
        return {
            status: 'required',
            chipLabel: 'perlu ditinjau',
            chipColor: 'warning',
            icon: <ScheduleIcon color="warning" />,
        }
    }

    return {
        status: 'required',
        chipLabel: (
            <FlexBox alignItems="center" gap={0.5}>
                belum dilengkapi
                <ArrowForwardIcon fontSize="inherit" />
            </FlexBox>
        ),
        chipColor: 'error',
        icon: <PriorityHighIcon color="error" />,
    }
}
