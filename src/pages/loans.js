import Head from 'next/head'
import AuthLayout from '@/components/Layouts/AuthLayout'
import LoanMain from '@/components/Loan/Main'

const Loans = () => {
    return (
        <AuthLayout title="Pinjaman Anda">
            <Head>
                <title>Pinjaman Anda</title>
            </Head>

            <LoanMain mode="applier" />
        </AuthLayout>
    )
}

export default Loans
