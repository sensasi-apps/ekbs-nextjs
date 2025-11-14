// components
import PageTitle from '@/components/page-title'
import UnitTxs from '@/components/unit-txs'
// enums
import BusinessUnit from '@/enums/business-unit'

export default function CashesPage() {
    return (
        <>
            <PageTitle title="Kas SPP" />
            <UnitTxs businessUnit={BusinessUnit.SPP} />
        </>
    )
}
