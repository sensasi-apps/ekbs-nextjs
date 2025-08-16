// components
import PageTitle from '@/components/page-title'
import UnitTxs from '@/components/UnitTxs'
// enums
import BusinessUnit from '@/enums/BusinessUnit'

export default function CashesPage() {
    return (
        <>
            <PageTitle title="Kas SPP" />
            <UnitTxs businessUnit={BusinessUnit.SPP} />
        </>
    )
}
