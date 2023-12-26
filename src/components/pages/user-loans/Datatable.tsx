// types
import type LoanType from '@/dataTypes/Loan'
import type { OnRowClickType } from '@/components/Datatable'
import type { MUISortOptions, MUIDataTableColumn } from 'mui-datatables'
import type { GetRowDataType } from '@/components/Datatable'
// vendors
import { useCallback } from 'react'
// materials
import Typography from '@mui/material/Typography'
// components
import Datatable from '@/components/Datatable'
// utils
import getLoanStatusColor from '@/utils/getLoanStatusColor'
import numberToCurrency from '@/utils/numberToCurrency'
import toDmy from '@/utils/toDmy'

let getRowData: GetRowDataType<LoanType>

export default function LoanDatatable({
    mode,
    onEdit,
}: {
    mode: 'applier' | 'manager'
    onEdit: (values: LoanType) => void
}) {
    const handleRowClick: OnRowClickType = useCallback(
        (_, { rowIndex }, event) => {
            if (event.detail === 2) {
                const data = getRowData(rowIndex)
                if (data) {
                    return onEdit(data)
                }
            }
        },
        [],
    )

    const API_URL =
        mode === 'manager' ? '/user-loans/datatable' : '/loans/datatable'

    const TITLE = mode === 'manager' ? 'Daftar Pengajuan Pinjaman' : 'Riwayat'

    const columns = [...DATATABLE_COLUMNS]

    if (mode === 'manager') {
        columns.splice(2, 0, {
            name: 'user.name',
            label: 'Nama',
            options: {
                customBodyRenderLite: dataIndex => {
                    const user = getRowData(dataIndex)?.user

                    if (!user) return ''

                    const { id, name } = user

                    return `#${id} ${name}`
                },
            },
        })
    }

    return (
        <Datatable
            apiUrl={API_URL}
            columns={columns}
            defaultSortOrder={DEFAULT_SORT_ORDER}
            onRowClick={handleRowClick}
            tableId="loans-table"
            title={TITLE}
            getRowDataCallback={fn => (getRowData = fn)}
        />
    )
}

export const DEFAULT_SORT_ORDER: MUISortOptions = {
    name: 'proposed_at',
    direction: 'desc',
}

const DATATABLE_COLUMNS: MUIDataTableColumn[] = [
    {
        name: 'uuid',
        label: 'uuid',
        options: {
            display: false,
        },
    },
    {
        name: 'proposed_at',
        label: 'Tanggal Pengajuan',
        options: {
            customBodyRender: toDmy,
        },
    },
    {
        name: 'proposed_rp',
        label: 'Jumlah Pengajuan',
        options: {
            customBodyRender: numberToCurrency,
        },
    },
    {
        name: 'type',
        label: 'Jenis',
    },

    {
        name: 'purpose',
        label: 'Keperluan',
    },
    {
        name: 'status',
        label: 'Status',
        options: {
            searchable: false,
            sort: false,
            customBodyRender: (value: LoanType['status']) => (
                <Typography
                    variant="body2"
                    color={getLoanStatusColor(value, '.main')}
                    component="span"
                    textTransform="capitalize">
                    {value}
                </Typography>
            ),
        },
    },
]
