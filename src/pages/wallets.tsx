// types
import type { Dayjs } from 'dayjs'
import type { GetRowDataType } from '@/components/Datatable'
import type { MUIDataTableColumn } from 'mui-datatables'
import type LaravelValidationException from '@/types/LaravelValidationException'
import type Wallet from '@/dataTypes/Wallet'
// vendors
import { useState } from 'react'
import axios from '@/lib/axios'
import dayjs from 'dayjs'
// materials
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Collapse from '@mui/material/Collapse'
import LoadingButton from '@mui/lab/LoadingButton'
// icons
import BackupTableIcon from '@mui/icons-material/BackupTable'
import DownloadIcon from '@mui/icons-material/Download'
// components
import AuthLayout from '@/components/Layouts/AuthLayout'
import Datatable from '@/components/Datatable'
import DatePicker from '@/components/DatePicker'
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
            <div
                style={{
                    marginBottom: '1em',
                }}>
                <DialogForDownloadXls />
            </div>

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

const DATATABLE_COLUMNS: MUIDataTableColumn[] = [
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
            customBodyRender: (_, rowMeta) =>
                getRowData(rowMeta.rowIndex)?.user?.id,
        },
    },
    {
        name: 'user.name',
        label: 'Nama Pengguna',
        options: {
            customBodyRender: (_, rowMeta) =>
                getRowData(rowMeta.rowIndex)?.user?.name,
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

function DialogForDownloadXls() {
    const [open, setOpen] = useState(false)
    const [fromDate, setFromDate] = useState<Dayjs>()
    const [toDate, setToDate] = useState<Dayjs>()
    const [isFetching, setIsFetching] = useState(false)

    const [success, setSuccess] = useState<string>()
    const [errors, setErrors] = useState<LaravelValidationException>()

    const [showSuccess, setShowSuccess] = useState(false)
    const [showError, setShowError] = useState(false)

    const downloadDisabled = !fromDate || !toDate || isFetching

    const handleFetching = () => {
        setIsFetching(true)

        setShowSuccess(false)
        setShowError(false)

        return axios
            .post('wallets/statements/download', {
                fromDate: fromDate?.format('YYYY-MM-DD'),
                toDate: toDate?.format('YYYY-MM-DD'),
            })
            .then(response => {
                if (response?.status === 200) {
                    setSuccess(response?.data)
                    setShowSuccess(true)
                } else if (response?.status === 208) {
                    setErrors({
                        message:
                            'Permintaan data ditolak. Rentang tanggal data yang diminta serupa dengan permintaan sebelumnya.',
                    } as LaravelValidationException)
                    setShowError(true)
                } else {
                    setErrors({
                        message: 'Terjadi kesalahan',
                    } as LaravelValidationException)
                    setShowError(true)
                }
            })
            .catch(error => {
                setErrors(error?.response?.data)
                setShowError(true)
            })
            .finally(() => setIsFetching(false))
    }

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                startIcon={<BackupTableIcon />}
                size="small"
                color="success">
                Unduh Mutasi
            </Button>

            <Dialog
                title="Unduh Mutasi"
                open={open}
                closeButtonProps={{
                    disabled: isFetching,
                    onClick: () => setOpen(false),
                }}
                actions={
                    <>
                        <LoadingButton
                            loading={isFetching}
                            color="success"
                            disabled={downloadDisabled}
                            onClick={handleFetching}
                            endIcon={<DownloadIcon />}>
                            Unduh
                        </LoadingButton>
                    </>
                }>
                <Collapse in={showSuccess}>
                    <Alert
                        variant="filled"
                        onClose={() => setShowSuccess(false)}
                        sx={{
                            mb: 1,
                        }}>
                        {success}
                    </Alert>
                </Collapse>

                <Collapse in={showError}>
                    <Alert
                        variant="filled"
                        severity="error"
                        onClose={() => setShowError(false)}
                        sx={{
                            mb: 1,
                        }}>
                        {errors?.message}
                    </Alert>
                </Collapse>

                <DatePicker
                    label="Dari"
                    disableFuture
                    disabled={isFetching}
                    disableHighlightToday
                    minDate={
                        toDate?.startOf('month').add(-2, 'months') ??
                        dayjs('2023-01-01')
                    }
                    slotProps={{
                        textField: {
                            helperText: errors?.errors?.fromDate?.[0],
                        },
                    }}
                    maxDate={toDate}
                    onChange={(date, { validationError }) =>
                        setFromDate(
                            Boolean(validationError) || !date
                                ? undefined
                                : date,
                        )
                    }
                />

                <DatePicker
                    label="Hingga"
                    disableFuture
                    disableHighlightToday
                    disabled={isFetching}
                    minDate={fromDate}
                    maxDate={fromDate?.endOf('month').add(2, 'months')}
                    slotProps={{
                        textField: {
                            helperText: errors?.errors?.toDate?.[0],
                        },
                    }}
                    onChange={(date, { validationError }) =>
                        setToDate(
                            validationError ? undefined : (date ?? undefined),
                        )
                    }
                />
            </Dialog>
        </>
    )
}
