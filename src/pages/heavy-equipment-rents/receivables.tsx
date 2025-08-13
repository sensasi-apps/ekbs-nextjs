// components
import AuthLayout from '@/components/auth-layout'
import ReceivablesDatatable from '@/components/ReceivablesDatatable'

export default function Receivables() {
    return (
        <AuthLayout title="Piutang">
            <ReceivablesDatatable asManager type="rent-item-rent" />
        </AuthLayout>
    )
}
