// types
import type Wallet from '@/dataTypes/Wallet'
import type {
    // MutateType,
    GetRowDataType,
} from '@/components/Datatable'
// vendors
import { useState } from 'react'
// components
import AuthLayout from '@/components/Layouts/AuthLayout'
import Datatable from '@/components/Datatable'
import Dialog from '@/components/Global/Dialog'
import TxHistory from '@/components/Wallet/TxHistory'
// utils
import numberToCurrency from '@/utils/numberToCurrency'

// let mutate: MutateType<Wallet>
let getRowData: GetRowDataType<Wallet>

export default function WalletsPage() {
    const [walletData, setWalletData] = useState<Wallet>()

    return (
        <AuthLayout title="Wallet Pengguna EKBS">
            <Datatable
                title="Daftar Wallet Pengguna"
                tableId="wallets-datatable"
                apiUrl="/wallets/datatable"
                onRowClick={(_, { dataIndex }, event) => {
                    if (event.detail === 2) {
                        const data = getRowData(dataIndex)
                        if (data) return setWalletData(data)
                    }
                }}
                // mutateCallback={fn => (mutate = fn)}
                getRowDataCallback={fn => (getRowData = fn)}
                columns={DATATABLE_COLUMNS}
                defaultSortOrder={{ name: 'balance', direction: 'desc' }}
            />

            <Dialog
                title="Riwayat Transaksi Wallet"
                open={Boolean(walletData?.uuid)}
                closeButtonProps={{
                    onClick: () => setWalletData(undefined),
                }}>
                {walletData && (
                    <TxHistory
                        walletData={walletData}
                        canPrint
                        canExportExcel
                    />
                )}
            </Dialog>
        </AuthLayout>
    )
}

const DATATABLE_COLUMNS = [
    {
        name: 'uuid',
        label: 'UUID',
        options: {
            display: false,
        },
    },
    {
        name: 'user.id',
        label: 'ID Pengguna',
        options: {
            display: false,
            customBodyRender: (_: any, rowMeta: any) =>
                getRowData(rowMeta.rowIndex)?.user?.id,
        },
    },
    {
        name: 'user.name',
        label: 'Nama Pengguna',
        options: {
            customBodyRender: (_: any, rowMeta: any) => {
                const user = getRowData(rowMeta.rowIndex)?.user
                if (!user) return

                return `#${user.id} ${user.name}`
            },
        },
    },
    {
        name: 'balance',
        label: 'Saldo',
        options: {
            customBodyRender: (value: number) => numberToCurrency(value),
        },
    },
]
