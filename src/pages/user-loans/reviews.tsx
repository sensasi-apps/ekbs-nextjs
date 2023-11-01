import AuthLayout from '@/components/Layouts/AuthLayout'
import LoansReviews from '@/components/Loans/Reviews'

export default function UserLoansReviews() {
    return (
        <AuthLayout title="Persetujuan Pinjaman">
            <LoansReviews />
        </AuthLayout>
    )
}
