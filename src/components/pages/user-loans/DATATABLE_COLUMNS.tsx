// types

// materials
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
// utils
import { type DatatableProps, getRowData } from '@/components/Datatable'
import type UserLoanORM from '@/modules/installment/types/orms/user-loan'
import formatNumber from '@/utils/format-number'
import getLoanStatusColor from '@/utils/get-loan-status-color'
import toDmy from '@/utils/to-dmy'

const DATATABLE_COLUMNS: DatatableProps<UserLoanORM>['columns'] = [
    {
        label: 'uuid',
        name: 'uuid',
        options: {
            display: 'excluded',
            sort: false,
        },
    },
    {
        label: 'Kode',
        name: 'short_uuid',
        options: {
            searchable: false,
            sort: false,
        },
    },
    {
        label: 'Diajukan TGL',
        name: 'proposed_at',
        options: {
            customBodyRender: toDmy,
        },
    },
    {
        label: 'Nama',
        name: 'user.name',
        options: {
            customBodyRenderLite: dataIndex => {
                const user = getRowData<UserLoanORM>(dataIndex)?.user

                if (!user) return ''

                const { id, name } = user

                return `#${id} — ${name}`
            },
        },
    },
    {
        label: 'Jumlah Pengajuan (Rp)',
        name: 'proposed_rp',
        options: {
            customBodyRender: (value: UserLoanORM['proposed_rp']) =>
                formatNumber(value),
            setCellProps: () => ({
                style: {
                    textAlign: 'right',
                    whiteSpace: 'nowrap',
                },
            }),
        },
    },
    {
        label: 'Jenis',
        name: 'type',
        options: {
            customBodyRender: (value: UserLoanORM['type']) => (
                <Chip label={value} size="small" />
            ),
        },
    },

    {
        label: 'Keperluan',
        name: 'purpose',
    },
    {
        label: 'Status',
        name: 'status',
        options: {
            customBodyRender: (value: UserLoanORM['status']) => (
                <Typography
                    color={getLoanStatusColor(value, '.main')}
                    component="span"
                    textTransform="capitalize"
                    variant="body2">
                    {value}
                </Typography>
            ),
            searchable: false,
            sort: false,
        },
    },
]

export default DATATABLE_COLUMNS
