// components
import PageTitle from '@/components/page-title'
import ReceivablesDatatable from '@/components/ReceivablesDatatable'

export default function Receivables() {
    return (
        <>
            <PageTitle title="Piutang Alat Berat" />
            <ReceivablesDatatable asManager type="rent-item-rent" />
        </>
    )
}
