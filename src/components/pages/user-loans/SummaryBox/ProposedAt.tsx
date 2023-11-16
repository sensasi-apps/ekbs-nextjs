import type { Ymd } from '@/types/DateString'
import toDmy from '@/utils/toDmy'
import dayjs from 'dayjs'
import TypographyWithLabel from './TypographyWithLabel'
import { Typography } from '@mui/material'

import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

export default function UserLoanSummaryBoxProposedAt({
    proposedAt,
}: {
    proposedAt: Ymd
}) {
    return (
        <TypographyWithLabel label="Diajukan Tanggal:">
            {toDmy(proposedAt)}

            <Typography variant="caption" color="GrayText" component="span">
                {' '}
                {dayjs(proposedAt).fromNow()}
            </Typography>
        </TypographyWithLabel>
    )
}
