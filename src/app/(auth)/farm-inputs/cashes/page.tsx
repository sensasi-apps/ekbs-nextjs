// components
import PageTitle from '@/components/page-title'
import UnitTxs from '@/components/UnitTxs'
// utils
import BusinessUnit from '@/enums/business-unit'

export default function Cashes() {
    return (
        <>
            <PageTitle title="Kas SAPRODI" />
            <UnitTxs businessUnit={BusinessUnit.SAPRODI} />
        </>
    )
}
