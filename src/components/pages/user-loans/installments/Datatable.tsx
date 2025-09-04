// vendors
import { useState, memo, useRef, type RefObject } from 'react'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
// components
import Datatable, {
    type DatatableProps,
    type GetRowDataType,
} from '@/components/Datatable'

enum UserLoanInstallmentDatatableApiUrlEnum {
    All = '/user-loans/installments/datatable',
    Unpaid = '/user-loans/installments/datatable?status=unpaid',
}

let getRowDataGlobal: RefObject<GetRowDataType<InstallmentORM> | undefined>

export default function UserLoanInstallmentDatatable({
    onEdit,
}: {
    onEdit: (userLoan: InstallmentORM) => void
}) {
    const getRowData = useRef<GetRowDataType<InstallmentORM>>(undefined)
    getRowDataGlobal = getRowData

    const [apiUrl, setApiUrl] = useState(
        UserLoanInstallmentDatatableApiUrlEnum.Unpaid,
    )

    return (
        <>
            <Box display="flex" gap={1} mb={2}>
                <Chip
                    color={
                        apiUrl === UserLoanInstallmentDatatableApiUrlEnum.All
                            ? 'success'
                            : undefined
                    }
                    label="Semua"
                    onClick={() =>
                        setApiUrl(UserLoanInstallmentDatatableApiUrlEnum.All)
                    }
                />

                <Chip
                    color={
                        apiUrl === UserLoanInstallmentDatatableApiUrlEnum.Unpaid
                            ? 'success'
                            : undefined
                    }
                    label="Belum dibayar"
                    onClick={() =>
                        setApiUrl(UserLoanInstallmentDatatableApiUrlEnum.Unpaid)
                    }
                />
            </Box>

            <Datatable<InstallmentORM>
                title="Daftar Pinjaman"
                tableId="disburse-user-loans-datatable"
                apiUrl={apiUrl}
                onRowClick={(_, { dataIndex }, event) => {
                    if (event.detail === 2) {
                        const data = getRowData?.current?.(dataIndex)

                        if (data) {
                            onEdit(data)
                        }
                    }
                }}
                getRowDataCallback={fn => {
                    getRowData.current = fn
                }}
                columns={DATATABLE_COLUMNS}
                defaultSortOrder={DEFAULT_SORT_ORDER}
            />

            <DatatableInfoBox />
        </>
    )
}

import toDmy from '@/utils/to-dmy'
import type InstallmentORM from '@/modules/installment/types/orms/installment'
import numberToCurrency from '@/utils/number-to-currency'
import dayjs, { extend } from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

extend(relativeTime)

const DEFAULT_SORT_ORDER = {
    name: 'should_be_paid_at',
    direction: 'asc' as const,
}

const DATATABLE_COLUMNS: DatatableProps<InstallmentORM>['columns'] = [
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
                const installment = getRowDataGlobal.current?.(dataIndex)

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
                getRowDataGlobal.current?.(dataIndex)?.user_loan?.user.name,
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
            customBodyRender: value => (value ? toDmy(value) : '-'),
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
                    menandakan bahwa jatuh tempo dalam rentang 7 hari.
                </Typography>
                <Typography variant="caption" component="li">
                    Selisih hari berwarna{' '}
                    <Typography
                        variant="caption"
                        color="error.main"
                        component="span">
                        merah
                    </Typography>{' '}
                    menandakan bahwa jatuh tempo telah lewat.
                </Typography>
            </Box>
        </Box>
    )
})
