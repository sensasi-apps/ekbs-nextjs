// vendors

// icons
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import PriorityHighIcon from '@mui/icons-material/PriorityHigh'
import ScheduleIcon from '@mui/icons-material/Schedule'
// materials
import Box from '@mui/material/Box'
import type { ReactNode } from 'react'
// components
import FlexBox from '@/components/flex-box'
import type RequisiteLandORM from '@/modules/clm//types/orms/requisite-land'
//
import type RequisiteUserORM from '@/modules/clm/types/orms/requisite-user'

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
            chipColor: 'success',
            chipLabel: 'selesai',
            icon: <CheckCircleOutlineIcon color="success" />,
            status: 'required',
        }
    }

    if (isOptional && !hasFiles) {
        return {
            chipColor: undefined,
            chipLabel: null,
            icon: <Box sx={{ width: 24 }} />,
            status: 'optional',
        }
    }

    if (hasFiles && !isApproved) {
        return {
            chipColor: 'warning',
            chipLabel: 'perlu ditinjau',
            icon: <ScheduleIcon color="warning" />,
            status: 'required',
        }
    }

    return {
        chipColor: 'error',
        chipLabel: (
            <FlexBox alignItems="center" gap={0.5}>
                belum dilengkapi
                <ArrowForwardIcon fontSize="inherit" />
            </FlexBox>
        ),
        icon: <PriorityHighIcon color="error" />,
        status: 'required',
    }
}
