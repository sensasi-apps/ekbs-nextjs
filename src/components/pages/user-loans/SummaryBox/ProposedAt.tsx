import Typography from '@mui/material/Typography'
// dayjs
import dayjs, { extend } from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import type { Ymd } from '@/types/date-string'
import toDmy from '@/utils/to-dmy'
import TypographyWithLabel from './TypographyWithLabel'

extend(relativeTime)

export default function UserLoanSummaryBoxProposedAt({
    proposedAt,
}: {
    proposedAt: Ymd
}) {
    return (
        <TypographyWithLabel label="Diajukan Tanggal:">
            {toDmy(proposedAt)}

            <Typography color="GrayText" component="span" variant="caption">
                {' '}
                {dayjs(proposedAt).fromNow()}
            </Typography>
        </TypographyWithLabel>
    )
}
