import { FC, useState } from 'react'
import Head from 'next/head'
import moment, { Moment } from 'moment'

import AuthLayout from '@/components/Layouts/AuthLayout'

import TxHistory from '@/components/Wallet/TxHistory'
import useSWR from 'swr'
import axios from '@/lib/axios'
import Skeletons from '@/components/Global/Skeletons'

const WalletPage: FC = () => {
    const [fromDate, setFromDate] = useState<Moment>(moment().startOf('month'))
    const [toDate, setToDate] = useState<Moment>(moment().endOf('month'))

    const { data: walletData, isLoading } = useSWR('/wallet', url =>
        axios.get(url).then(res => res.data),
    )

    return (
        <AuthLayout title="Wallet EKBS Anda">
            <Head>
                <title>{`Wallet EKBS Anda— ${process.env.NEXT_PUBLIC_APP_NAME}`}</title>
            </Head>

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

export default WalletPage
