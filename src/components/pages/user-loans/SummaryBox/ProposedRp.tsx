import numberToCurrency from '@/utils/number-to-currency'
import TypographyWithLabel from './TypographyWithLabel'

export default function UserLoanSummaryBoxProposedRp({
    proposedRp,
}: {
    proposedRp: number
}) {
    return (
        <TypographyWithLabel label="Pinjaman:" variant="h4" component="div">
            {numberToCurrency(proposedRp)}
        </TypographyWithLabel>
    )
}
