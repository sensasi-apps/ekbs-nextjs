import Head from 'next/head'
import AuthLayout from '@/components/Layouts/AuthLayout'
import LoansReviews from '@/components/Loans/Reviews'

const UserLoansReviews = () => (
    <AuthLayout title="Persetujuan Pinjaman">
        <Head>
            <title>Persetujuan Pinjaman</title>
        </Head>

        <LoansReviews />
    </AuthLayout>
)

export default UserLoansReviews
