import numberToCurrency from '@/utils/number-to-currency'
import TypographyWithLabel from './TypographyWithLabel'

export default function UserLoanSummaryBoxProposedRp({
    proposedRp,
}: {
    proposedRp: number
}) {
    return (
        <TypographyWithLabel component="div" label="Pinjaman:" variant="h4">
            {numberToCurrency(proposedRp)}
        </TypographyWithLabel>
    )
}
