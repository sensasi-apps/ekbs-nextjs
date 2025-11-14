// components
import PageTitle from '@/components/page-title'
import ReceivablesDatatable from '@/components/receivables-datatable'
import BusinessUnit from '@/enums/business-unit'

export const metadata = {
    title: `Piutang Belayan Spare Parts — ${process.env.NEXT_PUBLIC_APP_NAME}`,
}

export default function Receivables() {
    return (
        <>
            <PageTitle subtitle="Belayan Spare Parts" title="Piutang" />

            <ReceivablesDatatable asManager type={BusinessUnit.BENGKEL} />
        </>
    )
}
