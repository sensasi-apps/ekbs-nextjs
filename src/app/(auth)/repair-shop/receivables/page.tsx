// components
import PageTitle from '@/components/page-title'
import ReceivablesDatatable from '@/components/ReceivablesDatatable'
import BusinessUnit from '@/enums/business-unit'

export const metadata = {
    title: `Piutang Belayan Spare Parts — ${process.env.NEXT_PUBLIC_APP_NAME}`,
}

export default function Receivables() {
    return (
        <>
            <PageTitle title="Piutang" subtitle="Belayan Spare Parts" />

            <ReceivablesDatatable asManager type={BusinessUnit.BENGKEL} />
        </>
    )
}
