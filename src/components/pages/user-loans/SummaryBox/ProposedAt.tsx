import type { Ymd } from '@/types/DateString'
import toDmy from '@/utils/to-dmy'
import TypographyWithLabel from './TypographyWithLabel'
import Typography from '@mui/material/Typography'
// dayjs
import dayjs, { extend } from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
extend(relativeTime)

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
