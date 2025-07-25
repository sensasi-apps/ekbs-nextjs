// vendors
import { useState, memo } from 'react'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
// components
import Datatable, {
    type DatatableProps,
    getRowData,
} from '@/components/Datatable'

enum UserLoanInstallmentDatatableApiUrlEnum {
    All = '/user-loans/installments/datatable',
    Unpaid = '/user-loans/installments/datatable?status=unpaid',
}

const UserLoanInstallmentDatatable = memo(
    function UserLoanInstallmentDatatable({
        onEdit,
    }: {
        onEdit: (userLoan: InstallmentUserLoan) => void
    }) {
        const [apiUrl, setApiUrl] = useState(
            UserLoanInstallmentDatatableApiUrlEnum.Unpaid,
        )

        return (
            <>
                <Box display="flex" gap={1} mb={2}>
                    <Chip
                        color={
                            apiUrl ===
                            UserLoanInstallmentDatatableApiUrlEnum.All
                                ? 'success'
                                : undefined
                        }
                        label="Semua"
                        onClick={() =>
                            setApiUrl(
                                UserLoanInstallmentDatatableApiUrlEnum.All,
                            )
                        }
                    />

                    <Chip
                        color={
                            apiUrl ===
                            UserLoanInstallmentDatatableApiUrlEnum.Unpaid
                                ? 'success'
                                : undefined
                        }
                        label="Belum dibayar"
                        onClick={() =>
                            setApiUrl(
                                UserLoanInstallmentDatatableApiUrlEnum.Unpaid,
                            )
                        }
                    />
                </Box>

                <Datatable
                    title="Daftar Pinjaman"
                    tableId="disburse-user-loans-datatable"
                    apiUrl={apiUrl}
                    onRowClick={(_, { dataIndex }, event) => {
                        if (event.detail === 2) {
                            const data =
                                getRowData<InstallmentUserLoan>(dataIndex)

                            if (data) {
                                onEdit(data)
                            }
                        }
                    }}
                    columns={DATATABLE_COLUMNS}
                    defaultSortOrder={DEFAULT_SORT_ORDER}
                />

                <DatatableInfoBox />
            </>
        )
    },
)

export default UserLoanInstallmentDatatable

import toDmy from '@/utils/toDmy'
import type {
    InstallmentUserLoan,
    InstallmentWithTransactionType,
} from '@/dataTypes/Installment'
import numberToCurrency from '@/utils/numberToCurrency'
import dayjs, { extend } from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

extend(relativeTime)

const DEFAULT_SORT_ORDER = {
    name: 'should_be_paid_at',
    direction: 'asc' as const,
}

const DATATABLE_COLUMNS: DatatableProps['columns'] = [
    {
        name: 'uuid',
        label: 'UUID',
        options: {
            display: false,
        },
    },
    {
        name: 'should_be_paid_at',
        label: 'Jatuh Tempo',
        options: {
            customBodyRender: toDmy,
        },
    },
    {
        name: 'should_be_paid_at',
        label: 'Selisih hari',
        options: {
            customBodyRenderLite: dataIndex => {
                const installment =
                    getRowData<InstallmentWithTransactionType>(dataIndex)

                if (!installment) return ''

                const valueDate = dayjs(installment.should_be_paid_at)
                const isPaid = Boolean(installment.transaction)
                const diff = valueDate.diff()

                let color

                if (isPaid) {
                    // do nothing, keep color undefined
                } else if (diff < 0) {
                    color = 'error.main'
                } else if (diff < 604800000) {
                    // 7 days = 604800000 ms
                    color = 'warning.main'
                }

                return (
                    <Box component="span" color={color}>
                        {valueDate.fromNow()}
                    </Box>
                )
            },
        },
    },
    {
        name: 'userLoan.user.name',
        label: 'Kreditur',
        options: {
            customBodyRenderLite: dataIndex =>
                getRowData<InstallmentUserLoan>(dataIndex)?.user_loan.user.name,
        },
    },
    {
        name: 'n_th',
        label: 'Angsuran ke-',
    },
    {
        name: 'amount_rp',
        label: 'Tagihan',
        options: {
            setCellProps: () => ({
                style: {
                    whiteSpace: 'nowrap',
                },
            }),
            customBodyRender: (value: number) => numberToCurrency(value),
        },
    },
    {
        name: 'transaction.at',
        label: 'Tanggal Lunas',
        options: {
            customBodyRenderLite: dataIndex => {
                const transactionAt =
                    getRowData<InstallmentWithTransactionType>(dataIndex)
                        ?.transaction?.at

                return transactionAt ? toDmy(transactionAt) : '-'
            },
        },
    },
]

const DatatableInfoBox = memo(function DatatableInfoBox() {
    return (
        <Box mt={1}>
            <Typography variant="caption">Informasi:</Typography>
            <Box component="ul" m={0}>
                <Typography variant="caption" component="li">
                    Selisih hari berwarna{' '}
                    <Typography
                        variant="caption"
                        color="warning.main"
                        component="span">
                        kuning
                    </Typography>{' '}
                    menandaan bahwa jatuh tempo dalam rentang 7 hari.
                </Typography>
                <Typography variant="caption" component="li">
                    Selisih hari berwarna{' '}
                    <Typography
                        variant="caption"
                        color="error.main"
                        component="span">
                        merah
                    </Typography>{' '}
                    menandaan bahwa jatuh tempo telah lewat.
                </Typography>
            </Box>
        </Box>
    )
})
