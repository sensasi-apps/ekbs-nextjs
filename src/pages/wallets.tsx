import { FC, useState, useRef } from 'react'
import Head from 'next/head'
import moment from 'moment'

import { ThemeProvider, createTheme } from '@mui/material/styles'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

import PointOfSaleIcon from '@mui/icons-material/PointOfSale'

import AuthLayout from '@/components/Layouts/AuthLayout'
import Datatable, { getDataRow } from '@/components/Global/Datatable'
import NumericFormat from '@/components/Global/NumericFormat'
import Dialog from '@/components/Global/Dialog'

import TxHistory from '@/components/Wallet/TxHistory'
import WalletWithdrawForm from '@/components/Wallet/WithdrawForm'
import useFormData, { FormDataProvider } from '@/providers/useFormData'
import DialogWithUseFormData from '@/components/Global/Dialog/WithUseFormData'
import FormActions from '@/components/Global/Form/Actions'
import { mutate } from 'swr'

const WalletsPage: FC = () => {
    return (
        <AuthLayout title="Wallet EKBS">
            <Head>
                <title>{`Wallet EKBS — ${process.env.NEXT_PUBLIC_APP_NAME}`}</title>
            </Head>

            <FormDataProvider>
                <WithdrawButtonAndForm />
            </FormDataProvider>

            <MainContent />
        </AuthLayout>
    )
}

export default WalletsPage

const theme = createTheme()

const MainContent: FC = () => {
    const [walletData, setWalletData] = useState<any>(undefined)
    const [fromDate, setFromDate] = useState<any>(moment().startOf('month'))
    const [toDate, setToDate] = useState<any>(moment().endOf('month'))

    const componentRef = useRef(null)

    const columns = [
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
                    getDataRow(rowMeta.rowIndex).user.id,
            },
        },
        {
            name: 'user.name',
            label: 'Nama Pengguna',
            options: {
                customBodyRender: (_: any, rowMeta: any) => {
                    const user = getDataRow(rowMeta.rowIndex).user

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

    return (
        <>
            <Datatable
                title="Daftar Wallet Pengguna"
                tableId="wallets-datatable"
                apiUrl="/wallets/datatable"
                onRowClick={(_, rowMeta) =>
                    setWalletData(getDataRow(rowMeta.rowIndex))
                }
                columns={columns}
                defaultSortOrder={{ name: 'balance', direction: 'desc' }}
            />

            <Dialog
                title="Riwayat Transaksi Wallet"
                open={Boolean(walletData?.uuid)}
                closeButtonProps={{
                    onClick: () => setWalletData(undefined),
                }}>
                <TxHistory
                    walletData={walletData}
                    printContent={() => componentRef.current}
                    fromDate={fromDate}
                    setFromDate={setFromDate}
                    toDate={toDate}
                    setToDate={setToDate}
                />

                <div
                    style={{
                        display: 'none',
                    }}>
                    <div ref={componentRef}>
                        <ThemeProvider theme={theme}>
                            <TxHistory
                                walletData={walletData}
                                fromDate={fromDate}
                                setFromDate={setFromDate}
                                toDate={toDate}
                                setToDate={setToDate}
                            />
                        </ThemeProvider>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

const WithdrawButtonAndForm: FC = () => {
    const { handleCreate, loading, handleClose, submitting, setSubmitting } =
        useFormData()
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

            <DialogWithUseFormData title="Penarikan Dana" maxWidth="sm">
                <WalletWithdrawForm
                    handleClose={() => {
                        mutate('/wallets/datatable')
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
            </DialogWithUseFormData>
        </>
    )
}
