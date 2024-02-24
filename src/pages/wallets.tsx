// types
import type Wallet from '@/dataTypes/Wallet'
// vendors
import { Formik } from 'formik'
import { useState } from 'react'
import axios from '@/lib/axios'
// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
// icons
import PointOfSaleIcon from '@mui/icons-material/PointOfSale'
// components
import AuthLayout from '@/components/Layouts/AuthLayout'
import Datatable, {
    MutateType,
    type GetRowDataType,
} from '@/components/Datatable'
import Dialog from '@/components/Global/Dialog'
import TxHistory from '@/components/Wallet/TxHistory'
import numberToCurrency from '@/utils/numberToCurrency'
import WalletWithdrawForm from '@/components/Wallet/WithdrawForm'
// utils
import handle422 from '@/utils/errorCatcher'

let mutate: MutateType<Wallet>
let getRowData: GetRowDataType<Wallet>

export default function WalletsPage() {
    const [walletData, setWalletData] = useState<Wallet>()

    return (
        <AuthLayout title="Wallet EKBS">
            <Box mb={2} display="flex" gap={2}>
                <WithdrawButtonAndForm />
            </Box>

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
                mutateCallback={fn => (mutate = fn)}
                getRowDataCallback={fn => (getRowData = fn)}
                columns={DATATABLE_COLUMNS}
                defaultSortOrder={{ name: 'balance', direction: 'desc' }}
            />

            {walletData && (
                <Dialog
                    title="Riwayat Transaksi Wallet"
                    open={Boolean(walletData.uuid)}
                    closeButtonProps={{
                        onClick: () => setWalletData(undefined),
                    }}>
                    <TxHistory
                        walletData={walletData}
                        canPrint
                        canExportExcel
                    />
                </Dialog>
            )}
        </AuthLayout>
    )
}

function WithdrawButtonAndForm() {
    const [open, setOpen] = useState(false)

    function handleCreate() {
        setOpen(true)
    }

    function handleClose() {
        setOpen(false)
    }

    return (
        <>
            <Button
                startIcon={<PointOfSaleIcon />}
                color="success"
                variant="contained"
                onClick={handleCreate}>
                Penarikan Saldo
            </Button>

            <Dialog title="Penarikan Saldo Wallet" open={open} maxWidth="xs">
                <Formik
                    initialValues={{}}
                    onSubmit={(values, { setErrors }) =>
                        axios
                            .post('/wallets/withdraw', values)
                            .then(() => {
                                handleClose()
                                mutate()
                            })
                            .catch(error => handle422(error, setErrors))
                    }
                    onReset={handleClose}
                    component={WalletWithdrawForm}
                />
            </Dialog>
        </>
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
                getRowData(rowMeta.rowIndex)?.user.id,
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
