'use client'

// icons
import BackupTableIcon from '@mui/icons-material/BackupTable'
import DownloadIcon from '@mui/icons-material/Download'
// materials
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Collapse from '@mui/material/Collapse'
// types
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
// vendors
import { useRef, useState } from 'react'
import type { DatatableProps, GetRowDataType } from '@/components/Datatable'
// components
import Datatable from '@/components/Datatable'
import DatePicker from '@/components/DatePicker'
import Dialog from '@/components/Global/Dialog'
import PageTitle from '@/components/page-title'
import TxHistory from '@/components/Wallet/TxHistory'
import axios from '@/lib/axios'
import type LaravelValidationException from '@/types/laravel-validation-exception-response'
import type Wallet from '@/types/orms/wallet'
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
        <>
            <PageTitle title="Wallet Pengguna EKBS" />

            <div
                style={{
                    marginBottom: '1em',
                }}>
                <DialogForDownloadXls />
            </div>

            <Datatable
                apiUrl="/wallets/datatable"
                columns={DATATABLE_COLUMNS}
                defaultSortOrder={{ direction: 'desc', name: 'balance' }}
                getRowDataCallback={fn => {
                    getRowData.current = fn
                }}
                onRowClick={(_, { dataIndex }, event) => {
                    if (event.detail === 2) {
                        const data = getRowData.current?.(dataIndex)
                        if (data) return setWalletData(data)
                    }
                }}
                tableId="wallets-datatable"
                title="Daftar Wallet Pengguna"
            />

            <Dialog
                closeButtonProps={{
                    onClick: () => setWalletData(undefined),
                }}
                fullWidth={false}
                maxWidth="md"
                open={Boolean(walletData?.uuid)}
                title="Riwayat Transaksi Wallet">
                {walletData && (
                    <TxHistory
                        canExportExcel
                        canPrint
                        walletData={walletData}
                    />
                )}
            </Dialog>
        </>
    )
}

const DATATABLE_COLUMNS: DatatableProps<DataType>['columns'] = [
    {
        label: 'UUID',
        name: 'uuid',
        options: {
            display: false,
        },
    },
    {
        label: 'ID Pengguna',
        name: 'user.id',
    },
    {
        label: 'Nama Pengguna',
        name: 'user.name',
    },
    {
        label: 'Saldo',
        name: 'balance',
        options: {
            customBodyRender: (value: number) => formatNumber(value),
            setCellProps: () => ({
                style: {
                    textAlign: 'right',
                },
            }),
        },
    },
    {
        label: 'Total Angsuran (Rp)',
        name: 'unpaid_installment_total_rp',
        options: {
            customBodyRender: (value: number) => formatNumber(value),
            setCellProps: () => ({
                style: {
                    textAlign: 'right',
                },
            }),
        },
    },
    {
        label: 'Total Koreksi (Rp)',
        name: 'correction_total_rp',
        options: {
            customBodyRender: (value: number) => formatNumber(value),
            setCellProps: () => ({
                style: {
                    textAlign: 'right',
                },
            }),
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
                color="success"
                onClick={() => setOpen(true)}
                size="small"
                startIcon={<BackupTableIcon />}>
                Unduh Mutasi
            </Button>

            <Dialog
                actions={
                    <Button
                        color="success"
                        disabled={downloadDisabled}
                        endIcon={<DownloadIcon />}
                        loading={isFetching}
                        onClick={handleFetching}>
                        Unduh
                    </Button>
                }
                closeButtonProps={{
                    disabled: isFetching,
                    onClick: () => setOpen(false),
                }}
                open={open}
                title="Unduh Mutasi">
                <Collapse in={showSuccess}>
                    <Alert
                        onClose={() => setShowSuccess(false)}
                        sx={{
                            mb: 1,
                        }}
                        variant="filled">
                        {success}
                    </Alert>
                </Collapse>

                <Collapse in={showError}>
                    <Alert
                        onClose={() => setShowError(false)}
                        severity="error"
                        sx={{
                            mb: 1,
                        }}
                        variant="filled">
                        {errors?.message}
                    </Alert>
                </Collapse>

                <DatePicker
                    disabled={isFetching}
                    disableFuture
                    disableHighlightToday
                    label="Dari"
                    maxDate={toDate}
                    minDate={
                        toDate?.startOf('month').add(-2, 'months') ??
                        dayjs('2023-01-01')
                    }
                    onChange={(date, { validationError }) =>
                        setFromDate(
                            Boolean(validationError) || !date
                                ? undefined
                                : date,
                        )
                    }
                    slotProps={{
                        textField: {
                            helperText: errors?.errors?.fromDate?.[0],
                        },
                    }}
                />

                <DatePicker
                    disabled={isFetching}
                    disableFuture
                    disableHighlightToday
                    label="Hingga"
                    maxDate={fromDate?.endOf('month').add(2, 'months')}
                    minDate={fromDate}
                    onChange={(date, { validationError }) =>
                        setToDate(
                            validationError ? undefined : (date ?? undefined),
                        )
                    }
                    slotProps={{
                        textField: {
                            helperText: errors?.errors?.toDate?.[0],
                        },
                    }}
                />
            </Dialog>
        </>
    )
}
