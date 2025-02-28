// types
import type Wallet from '@/dataTypes/Wallet'
// vendors
import useSWR from 'swr'
// components
import AuthLayout from '@/components/Layouts/AuthLayout'
import TxHistory from '@/components/Wallet/TxHistory'
import Skeletons from '@/components/Global/Skeletons'
import useDisablePage from '@/hooks/useDisablePage'

/**
 * User wallet page for checking wallet transaction history and balance
 *
 * @deprecated - Disabled by request from JAMALUDDIN (2024-11-29)
 */
export default function WalletPage() {
    useDisablePage()

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
