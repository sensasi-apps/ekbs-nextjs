import PageTitle from '@/components/page-title'
import UnitTxs from '@/components/UnitTxs'
// enums
import BusinessUnit from '@/enums/BusinessUnit'

export default function Cashes() {
    return (
        <>
            <PageTitle title="Kas Unit Bisnis TBS" />
            <UnitTxs businessUnit={BusinessUnit.TBS} />
        </>
    )
}
