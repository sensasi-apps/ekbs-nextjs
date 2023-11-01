import AuthLayout from '@/components/Layouts/AuthLayout'
import LoansDisburses from '@/components/Loans/Disburses'

export default function UserLoansDisburses() {
    return (
        <AuthLayout title="Pencairan Pinjaman">
            <LoansDisburses />
        </AuthLayout>
    )
}
