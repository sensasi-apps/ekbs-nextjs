import Head from 'next/head'
import AuthLayout from '@/components/Layouts/AuthLayout'
import LoansDisburses from '@/components/Loans/Disburses'

const UserLoansDisburses = () => (
    <AuthLayout title="Pencairan Pinjaman">
        <Head>
            <title>Pencairan Pinjaman</title>
        </Head>

        <LoansDisburses />
    </AuthLayout>
)

export default UserLoansDisburses
