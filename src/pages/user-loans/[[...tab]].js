import Head from 'next/head'
import dynamic from 'next/dynamic'

import AuthLayout from '@/components/Layouts/AuthLayout'
const LoanMain = dynamic(() => import('@/components/Loan/Main'))

const UserLoans = () => (
    <AuthLayout title="Kelola Pinjaman">
        <Head>
            <title>Kelola Pinjaman</title>
        </Head>

        <LoanMain mode="manager" />
    </AuthLayout>
)

export default UserLoans
