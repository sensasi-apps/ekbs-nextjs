import { FC, useState, useRef } from 'react'
import Head from 'next/head'
import type { Moment } from 'moment'
import moment from 'moment'

import { ThemeProvider, createTheme } from '@mui/material/styles'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

import PointOfSaleIcon from '@mui/icons-material/PointOfSale'

import useFormData, { FormDataProvider } from '@/providers/useFormData'

import AuthLayout from '@/components/Layouts/AuthLayout'
import Dialog from '@/components/Global/Dialog'
import Datatable, { getDataRow, mutate } from '@/components/Global/Datatable'
import FormActions from '@/components/Global/Form/Actions'
import NumericFormat from '@/components/Global/NumericFormat'
import TxHistory from '@/components/Wallet/TxHistory'
import WalletWithdrawForm from '@/components/Wallet/WithdrawForm'
import WalletType from '@/dataTypes/Wallet'

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
    const [walletData, setWalletData] = useState<WalletType>()
    const [fromDate, setFromDate] = useState<Moment>(moment().startOf('month'))
    const [toDate, setToDate] = useState<Moment>(moment().endOf('month'))

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
                    getDataRow<WalletType>(rowMeta.rowIndex).user.id,
            },
        },
        {
            name: 'user.name',
            label: 'Nama Pengguna',
            options: {
                customBodyRender: (_: any, rowMeta: any) => {
                    const user = getDataRow<WalletType>(rowMeta.rowIndex).user

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

const WithdrawButtonAndForm: FC = () => {
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
