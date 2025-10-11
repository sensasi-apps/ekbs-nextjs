// types

import type { BoxProps } from '@mui/material/Box'
// materials
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { ReactNode } from 'react'
import type UserLoanORM from '@/modules/installment/types/orms/user-loan'
import formatNumber from '@/utils/format-number'
// components
import numberToCurrency from '@/utils/number-to-currency'
import UserLoanSummaryBoxProposedAt from './ProposedAt'
import UserLoanSummaryBoxProposedRp from './ProposedRp'
import UserLoanSummaryBoxReviewers from './Reviewers'
import TypographyWithLabel from './TypographyWithLabel'

export default function UserLoanSummaryBox({
    data: loan,
    ...props
}: BoxProps & {
    data: UserLoanORM
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
                <Typography color="GrayText" component="span">
                    {' '}
                    ({formatNumber(interest_percent)}%)/{term_unit}
                </Typography>
            </TypographyWithLabel>

            <TypographyWithLabel label="Angsuran:">
                {numberToCurrency(installmentAmount)}
                <Typography color="GrayText" component="span">
                    /{term_unit}
                </Typography>
            </TypographyWithLabel>

            <TypographyWithLabel label="Keperluan:">
                {purpose}
            </TypographyWithLabel>

            <UserLoanSummaryBoxReviewers responses={responses ?? []} />
        </Box>
    )
}
