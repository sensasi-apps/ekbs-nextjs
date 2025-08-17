import PageTitle from '@/components/page-title'
import ReceivablesDatatable from '@/components/ReceivablesDatatable'

export default function Bills() {
    return (
        <>
            <PageTitle title="Tagihan Anda" />

            <ReceivablesDatatable />
        </>
    )
}
