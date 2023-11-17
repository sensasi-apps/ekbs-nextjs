// types
import type LoanType from '@/dataTypes/Loan'
import type { ReactNode } from 'react'
import type { BoxProps } from '@mui/material/Box'
// materials
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
// components
import numberToCurrency from '@/utils/numberToCurrency'
import TypographyWithLabel from './TypographyWithLabel'
import formatNumber from '@/utils/formatNumber'
import UserLoanSummaryBoxProposedAt from './ProposedAt'
import UserLoanSummaryBoxProposedRp from './ProposedRp'
import UserLoanSummaryBoxReviewers from './Reviewers'

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

    const installmentAmount = Math.ceil(
        proposed_rp / n_term + (proposed_rp * interest_percent) / 100,
    )

    return (
        <Box display="flex" flexDirection="column" gap={1} my={3} {...props}>
            <UserLoanSummaryBoxProposedRp proposedRp={proposed_rp} />

            <UserLoanSummaryBoxProposedAt proposedAt={proposed_at} />

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
                    /{term_unit}
                </Typography>
            </TypographyWithLabel>

            <TypographyWithLabel label="Keperluan:">
                {purpose}
            </TypographyWithLabel>

            <UserLoanSummaryBoxReviewers responses={responses} />
        </Box>
    )
}
