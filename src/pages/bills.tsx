// components
import AuthLayout from '@/components/auth-layout'
import ReceivablesDatatable from '@/components/ReceivablesDatatable'

export default function Bills() {
    return (
        <AuthLayout title="Tagihan Anda">
            <ReceivablesDatatable />
        </AuthLayout>
    )
}
