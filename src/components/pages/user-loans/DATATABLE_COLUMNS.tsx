// types
import type { UserLoanType } from '@/dataTypes/Loan'
// materials
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
// utils
import { type DatatableProps, getRowData } from '@/components/Datatable'
import toDmy from '@/utils/to-dmy'
import getLoanStatusColor from '@/utils/get-loan-status-color'
import formatNumber from '@/utils/format-number'

const DATATABLE_COLUMNS: DatatableProps<UserLoanType>['columns'] = [
    {
        name: 'uuid',
        label: 'uuid',
        options: {
            sort: false,
            display: 'excluded',
        },
    },
    {
        name: 'short_uuid',
        label: 'Kode',
        options: {
            sort: false,
            searchable: false,
        },
    },
    {
        name: 'proposed_at',
        label: 'Diajukan TGL',
        options: {
            customBodyRender: toDmy,
        },
    },
    {
        name: 'user.name',
        label: 'Nama',
        options: {
            customBodyRenderLite: dataIndex => {
                const user = getRowData<UserLoanType>(dataIndex)?.user

                if (!user) return ''

                const { id, name } = user

                return `#${id} — ${name}`
            },
        },
    },
    {
        name: 'proposed_rp',
        label: 'Jumlah Pengajuan (Rp)',
        options: {
            setCellProps: () => ({
                style: {
                    whiteSpace: 'nowrap',
                    textAlign: 'right',
                },
            }),
            customBodyRender: (value: UserLoanType['proposed_rp']) =>
                formatNumber(value),
        },
    },
    {
        name: 'type',
        label: 'Jenis',
        options: {
            customBodyRender: (value: UserLoanType['type']) => (
                <Chip label={value} size="small" />
            ),
        },
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
            customBodyRender: (value: UserLoanType['status']) => (
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

export default DATATABLE_COLUMNS
