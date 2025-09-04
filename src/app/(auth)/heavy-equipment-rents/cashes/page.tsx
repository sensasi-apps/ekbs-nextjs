// components
import PageTitle from '@/components/page-title'
import UnitTxs from '@/components/UnitTxs'
// enums
import BusinessUnit from '@/enums/business-unit'

export default function Cashes() {
    return (
        <>
            <PageTitle title="Kas Bisnis Alat Berat" />
            <UnitTxs businessUnit={BusinessUnit.ALAT_BERAT} />
        </>
    )
}
