// types
import type WalletType from '@/dataTypes/Wallet'
// vendors
import { useState, useRef } from 'react'
import dayjs from 'dayjs'
import { ThemeProvider, createTheme } from '@mui/material/styles'
// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
// icons
import PointOfSaleIcon from '@mui/icons-material/PointOfSale'
// providers
import useFormData, { FormDataProvider } from '@/providers/useFormData'
// components
import AuthLayout from '@/components/Layouts/AuthLayout'
import Datatable, { getDataRow, mutate } from '@/components/Datatable'
// global components
import Dialog from '@/components/Global/Dialog'
import FormActions from '@/components/Global/Form/Actions'
import NumericFormat from '@/components/Global/NumericFormat'
// components/Wallet
import TxHistory from '@/components/Wallet/TxHistory'
import WalletWithdrawForm from '@/components/Wallet/WithdrawForm'

export default function WalletsPage() {
    return (
        <AuthLayout title="Wallet EKBS">
            <FormDataProvider>
                <WithdrawButtonAndForm />
            </FormDataProvider>

            <MainContent />
        </AuthLayout>
    )
}

const theme = createTheme()

function MainContent() {
    const [walletData, setWalletData] = useState<WalletType>()
    const [fromDate, setFromDate] = useState(dayjs().startOf('month'))
    const [toDate, setToDate] = useState(dayjs().endOf('month'))

    const componentRef = useRef(null)

    return (
        <>
            <Datatable
                title="Daftar Wallet Pengguna"
                tableId="wallets-datatable"
                apiUrl="/wallets/datatable"
                onRowClick={(_, { dataIndex }, event) => {
                    if (event.detail === 2) {
                        const data = getDataRow<WalletType>(dataIndex)
                        if (data) return setWalletData(data)
                    }
                }}
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
                        printContent={() => componentRef.current}
                        fromDate={fromDate}
                        setFromDate={setFromDate}
                        toDate={toDate}
                        setToDate={setToDate}
                    />
                )}

                <div
                    style={{
                        display: 'none',
                    }}>
                    <div ref={componentRef}>
                        <ThemeProvider theme={theme}>
                            {walletData && (
                                <TxHistory
                                    walletData={walletData}
                                    fromDate={fromDate}
                                    setFromDate={setFromDate}
                                    toDate={toDate}
                                    setToDate={setToDate}
                                />
                            )}
                        </ThemeProvider>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

function WithdrawButtonAndForm() {
    const {
        formOpen,
        handleCreate,
        loading,
        handleClose,
        submitting,
        setSubmitting,
    } = useFormData()
    return (
        <>
            <Box mb={2}>
                <Button
                    startIcon={<PointOfSaleIcon />}
                    color="success"
                    variant="contained"
                    onClick={handleCreate}>
                    Penarikan Dana
                </Button>
            </Box>

            <Dialog
                title="Penarikan Dana"
                open={formOpen}
                closeButtonProps={{
                    onClick: handleClose,
                }}
                maxWidth="sm">
                <WalletWithdrawForm
                    data={undefined}
                    onSubmitted={async () => {
                        await mutate()
                        handleClose()
                    }}
                    loading={loading}
                    setSubmitting={setSubmitting}
                    actionsSlot={
                        <FormActions
                            onCancel={handleClose}
                            submitting={submitting}
                        />
                    }
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
                getDataRow<WalletType>(rowMeta.rowIndex)?.user.id,
        },
    },
    {
        name: 'user.name',
        label: 'Nama Pengguna',
        options: {
            customBodyRender: (_: any, rowMeta: any) => {
                const user = getDataRow<WalletType>(rowMeta.rowIndex)?.user
                if (!user) return

                return `#${user.id} ${user.name}`
            },
        },
    },
    {
        name: 'balance',
        label: 'Saldo',
        options: {
            customBodyRender: (value: number) => (
                <NumericFormat
                    value={value}
                    prefix="Rp. "
                    decimalScale={0}
                    displayType="text"
                />
            ),
        },
    },
]
