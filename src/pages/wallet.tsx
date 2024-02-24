// types
import Wallet from '@/dataTypes/Wallet'
// vendors
import useSWR from 'swr'
// components
import AuthLayout from '@/components/Layouts/AuthLayout'
import TxHistory from '@/components/Wallet/TxHistory'
import Skeletons from '@/components/Global/Skeletons'

export default function WalletPage() {
    const { data: walletData, isLoading } = useSWR<Wallet>('/wallet')

    return (
        <AuthLayout title="Wallet EKBS Anda">
            {isLoading ? (
                <Skeletons />
            ) : walletData ? (
                <TxHistory walletData={walletData} />
            ) : (
                'terjadi kesalahan'
            )}
        </AuthLayout>
    )
}
