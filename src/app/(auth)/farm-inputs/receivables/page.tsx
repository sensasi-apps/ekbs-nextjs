// components
import PageTitle from '@/components/page-title'
import ReceivablesDatatable from '@/components/receivables-datatable'

export default function Receivables() {
    return (
        <>
            <PageTitle title="Piutang" />

            <ReceivablesDatatable asManager type="product-sale" />
        </>
    )
}
