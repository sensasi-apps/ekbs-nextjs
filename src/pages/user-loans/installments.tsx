import AuthLayout from '@/components/Layouts/AuthLayout'
import LoansInstallments from '@/components/Loans/Installments'

export default function UserLoansInstallments() {
    return (
        <AuthLayout title="Pembayaran Angsuran">
            <LoansInstallments />
        </AuthLayout>
    )
}
