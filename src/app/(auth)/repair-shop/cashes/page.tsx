// components
import PageTitle from '@/components/page-title'
import UnitTxs from '@/components/UnitTxs'
// utils
import BusinessUnit from '@/enums/business-unit'

export default function Cashes() {
    return (
        <>
            <PageTitle subtitle="Belayan Spare Parts" title="Kas" />
            <UnitTxs businessUnit={BusinessUnit.BENGKEL} />
        </>
    )
}
