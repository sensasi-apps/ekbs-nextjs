// vendors
import { useState } from 'react'
import dayjs from 'dayjs'
import useSWR from 'swr'
// components
import AuthLayout from '@/components/Layouts/AuthLayout'
import TxHistory from '@/components/Wallet/TxHistory'
import Skeletons from '@/components/Global/Skeletons'

export default function WalletPage() {
    const [fromDate, setFromDate] = useState(dayjs().startOf('month'))
    const [toDate, setToDate] = useState(dayjs())

    const { data: walletData, isLoading } = useSWR('/wallet')

    return (
        <AuthLayout title="Wallet EKBS Anda">
            {isLoading ? (
                <Skeletons />
            ) : (
                <TxHistory
                    walletData={walletData}
                    fromDate={fromDate}
                    setFromDate={setFromDate}
                    toDate={toDate}
                    setToDate={setToDate}
                />
            )}
        </AuthLayout>
    )
}
