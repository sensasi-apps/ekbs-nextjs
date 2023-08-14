import Head from 'next/head'
import dynamic from 'next/dynamic'

import AuthLayout from '@/components/Layouts/AuthLayout'
const LoanMain = dynamic(() => import('@/components/Loan/Main'))

const UserLoans = () => (
    <AuthLayout title="Pinjaman Anda">
        <Head>
            <title>Pinjaman Anda</title>
        </Head>

        <LoanMain mode="applier" />
    </AuthLayout>
)

export default UserLoans
