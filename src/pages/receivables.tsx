// components
import AuthLayout from '@/components/Layouts/AuthLayout'
import ReceivablesDatatable from '@/components/ReceivablesDatatable'

export default function Receivables() {
    return (
        <AuthLayout title="Piutang">
            <ReceivablesDatatable />
        </AuthLayout>
    )
}
