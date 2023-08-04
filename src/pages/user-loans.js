import Head from 'next/head'
import AuthLayout from '@/components/Layouts/AuthLayout'
import LoanMain from '@/components/Loan/Main'

const UserLoans = () => {
    return (
        <AuthLayout title="Kelola Pinjaman">
            <Head>
                <title>Kelola Pinjaman</title>
            </Head>

            <LoanMain mode="manager" />
        </AuthLayout>
    )
}

export default UserLoans
