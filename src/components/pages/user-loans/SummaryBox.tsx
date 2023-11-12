// types
import type LoanType from '@/dataTypes/Loan'
import type { ReactNode } from 'react'
import type { BoxProps } from '@mui/material/Box'
// materials
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
// components
import toDmy from '@/utils/toDmy'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import numberToCurrency from '@/utils/numberToCurrency'
import TypographyWithLabel from './SummaryBox/TypographyWithLabel'
import formatNumber from '@/utils/formatNumber'

dayjs.extend(relativeTime)

export default function UserLoanSummaryBox({
    data: loan,
    ...props
}: BoxProps & {
    data: LoanType
    isLoading?: boolean
    handleEdit?: () => void
    children?: ReactNode
}) {
    const {
        proposed_at,
        proposed_rp,
        interest_percent,
        n_term,
        term_unit,
        purpose,
        responses,
        type,
    } = loan

    const tenor = `${n_term} ${term_unit}`
    const totalTenorRp = Math.ceil((proposed_rp * interest_percent) / 100)
    const hasResponses = responses.length > 0
    const installmentAmount = Math.ceil(
        proposed_rp / n_term + (proposed_rp * interest_percent) / 100,
    )

    return (
        <Box display="flex" flexDirection="column" gap={1} my={3} {...props}>
            <TypographyWithLabel label="Pinjaman:" variant="h4" component="div">
                {numberToCurrency(proposed_rp)}
            </TypographyWithLabel>

            <TypographyWithLabel label="Diajukan Tanggal:">
                {toDmy(proposed_at)}

                <Typography variant="caption" color="GrayText" component="span">
                    {' '}
                    {dayjs(proposed_at).fromNow()}
                </Typography>
            </TypographyWithLabel>

            <TypographyWithLabel label="Jenis:">{type}</TypographyWithLabel>

            <TypographyWithLabel label="Tenor:">{tenor}</TypographyWithLabel>

            <TypographyWithLabel label="Biaya Jasa:">
                {numberToCurrency(totalTenorRp)}
                <Typography component="span" color="GrayText">
                    {' '}
                    ({formatNumber(interest_percent)}%)/{term_unit}
                </Typography>
            </TypographyWithLabel>

            <TypographyWithLabel label="Angsuran:">
                {numberToCurrency(installmentAmount)}
                <Typography component="span" color="GrayText">
                    {' '}
                    /{term_unit}
                </Typography>
            </TypographyWithLabel>

            <TypographyWithLabel label="Keperluan:">
                {purpose}
            </TypographyWithLabel>

            <div>
                <Typography color="GrayText">Telah ditinjau oleh:</Typography>
                {!hasResponses && <i>Belum ada peninjauan</i>}
                {hasResponses && (
                    <ul
                        style={{
                            margin: 0,
                        }}>
                        {responses.map(response => (
                            <li key={response.by_user_uuid}>
                                {'by_user' in response
                                    ? response.by_user.name
                                    : ''}
                                :{' '}
                                <Typography
                                    color={
                                        response.is_approved
                                            ? 'success.main'
                                            : 'error.main'
                                    }
                                    component="span">
                                    {response.is_approved
                                        ? 'Menyetujui'
                                        : 'Menolak'}
                                </Typography>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </Box>
    )
}
