// components
import AuthLayout from '@/components/Layouts/AuthLayout'
import ReceivablesDatatable from '@/components/ReceivablesDatatable'

export default function Bills() {
    return (
        <AuthLayout title="Tagihan Anda">
            <ReceivablesDatatable />
        </AuthLayout>
    )
}
