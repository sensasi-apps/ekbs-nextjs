// vendors

import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
// vendors
import { type RefObject, useRef, useState } from 'react'
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
                apiUrl={apiUrl}
                columns={DATATABLE_COLUMNS}
                defaultSortOrder={DEFAULT_SORT_ORDER}
                getRowDataCallback={fn => {
                    getRowData.current = fn
                }}
                onRowClick={(_, { dataIndex }, event) => {
                    if (event.detail === 2) {
                        const data = getRowData?.current?.(dataIndex)

                        if (data) {
                            onEdit(data)
                        }
                    }
                }}
                tableId="disburse-user-loans-datatable"
                title="Daftar Pinjaman"
            />

            <DatatableInfoBox />
        </>
    )
}

import dayjs, { extend } from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import type InstallmentORM from '@/modules/installment/types/orms/installment'
import numberToCurrency from '@/utils/number-to-currency'
import toDmy from '@/utils/to-dmy'

extend(relativeTime)

const DEFAULT_SORT_ORDER = {
    direction: 'asc' as const,
    name: 'should_be_paid_at',
}

const DATATABLE_COLUMNS: DatatableProps<InstallmentORM>['columns'] = [
    {
        label: 'UUID',
        name: 'uuid',
        options: {
            display: false,
        },
    },
    {
        label: 'Jatuh Tempo',
        name: 'should_be_paid_at',
        options: {
            customBodyRender: toDmy,
        },
    },
    {
        label: 'Selisih hari',
        name: 'should_be_paid_at',
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
                    <Box color={color} component="span">
                        {valueDate.fromNow()}
                    </Box>
                )
            },
        },
    },

    {
        label: 'Kreditur',
        name: 'userLoan.user.name',
        options: {
            customBodyRenderLite: dataIndex =>
                getRowDataGlobal.current?.(dataIndex)?.user_loan?.user.name,
        },
    },

    {
        label: 'Angsuran ke-',
        name: 'n_th',
    },
    {
        label: 'Tagihan',
        name: 'amount_rp',
        options: {
            customBodyRender: (value: number) => numberToCurrency(value),
            setCellProps: () => ({
                style: {
                    whiteSpace: 'nowrap',
                },
            }),
        },
    },
    {
        label: 'Tanggal Lunas',
        name: 'transaction.at',
        options: {
            customBodyRender: value => (value ? toDmy(value) : '-'),
        },
    },
]

function DatatableInfoBox() {
    return (
        <Box mt={1}>
            <Typography variant="caption">Informasi:</Typography>
            <Box component="ul" m={0}>
                <Typography component="li" variant="caption">
                    Selisih hari berwarna{' '}
                    <Typography
                        color="warning.main"
                        component="span"
                        variant="caption">
                        kuning
                    </Typography>{' '}
                    menandakan bahwa jatuh tempo dalam rentang 7 hari.
                </Typography>
                <Typography component="li" variant="caption">
                    Selisih hari berwarna{' '}
                    <Typography
                        color="error.main"
                        component="span"
                        variant="caption">
                        merah
                    </Typography>{' '}
                    menandakan bahwa jatuh tempo telah lewat.
                </Typography>
            </Box>
        </Box>
    )
}
