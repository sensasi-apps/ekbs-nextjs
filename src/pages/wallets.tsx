// types
import type { Dayjs } from 'dayjs'
import type { DatatableProps, GetRowDataType } from '@/components/Datatable'
import type LaravelValidationException from '@/types/LaravelValidationException'
import type Wallet from '@/dataTypes/Wallet'
// vendors
import { useRef, useState } from 'react'
import axios from '@/lib/axios'
import dayjs from 'dayjs'
// materials
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Collapse from '@mui/material/Collapse'
// icons
import BackupTableIcon from '@mui/icons-material/BackupTable'
import DownloadIcon from '@mui/icons-material/Download'
// components
import AuthLayout from '@/components/auth-layout'
import Datatable from '@/components/Datatable'
import DatePicker from '@/components/DatePicker'
import Dialog from '@/components/Global/Dialog'
import TxHistory from '@/components/Wallet/TxHistory'
// utils
import formatNumber from '@/utils/format-number'

export type DataType = Wallet & {
    unpaid_installment_total_rp: number
    correction_total_rp: number
}

export default function WalletsPage() {
    const [walletData, setWalletData] = useState<DataType>()
    const getRowData = useRef<GetRowDataType<DataType> | undefined>(undefined)

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
                        const data = getRowData.current?.(dataIndex)
                        if (data) return setWalletData(data)
                    }
                }}
                getRowDataCallback={fn => (getRowData.current = fn)}
                columns={DATATABLE_COLUMNS}
                defaultSortOrder={{ name: 'balance', direction: 'desc' }}
            />

            <Dialog
                title="Riwayat Transaksi Wallet"
                open={Boolean(walletData?.uuid)}
                maxWidth="md"
                fullWidth={false}
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

const DATATABLE_COLUMNS: DatatableProps<DataType>['columns'] = [
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
    },
    {
        name: 'user.name',
        label: 'Nama Pengguna',
    },
    {
        name: 'balance',
        label: 'Saldo',
        options: {
            setCellProps: () => ({
                style: {
                    textAlign: 'right',
                },
            }),
            customBodyRender: (value: number) => formatNumber(value),
        },
    },
    {
        name: 'unpaid_installment_total_rp',
        label: 'Total Angsuran (Rp)',
        options: {
            setCellProps: () => ({
                style: {
                    textAlign: 'right',
                },
            }),
            customBodyRender: (value: number) => formatNumber(value),
        },
    },
    {
        name: 'correction_total_rp',
        label: 'Total Koreksi (Rp)',
        options: {
            setCellProps: () => ({
                style: {
                    textAlign: 'right',
                },
            }),
            customBodyRender: (value: number) => formatNumber(value),
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
                    <Button
                        loading={isFetching}
                        color="success"
                        disabled={downloadDisabled}
                        onClick={handleFetching}
                        endIcon={<DownloadIcon />}>
                        Unduh
                    </Button>
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
