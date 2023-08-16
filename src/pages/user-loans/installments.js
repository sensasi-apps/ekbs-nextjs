import Head from 'next/head'
import AuthLayout from '@/components/Layouts/AuthLayout'
import LoansInstallments from '@/components/Loans/Installments'

const UserLoansInstallments = () => (
    <AuthLayout title="Pembayaran Angsuran">
        <Head>
            <title>Pembayaran Angsuran</title>
        </Head>

        <LoansInstallments />
    </AuthLayout>
)

export default UserLoansInstallments
