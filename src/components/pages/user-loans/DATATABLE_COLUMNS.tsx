// types
import type { MUIDataTableColumn } from 'mui-datatables'
import type LoanType from '@/dataTypes/Loan'
// materials
import Typography from '@mui/material/Typography'
// utils
import { getDataRow } from '@/components/Datatable'
import numberToCurrency from '@/utils/numberToCurrency'
import toDmy from '@/utils/toDmy'
import getLoanStatusColor from '@/utils/getLoanStatusColor'

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
        name: 'user.name',
        label: 'Nama',
        options: {
            customBodyRenderLite: dataIndex => {
                const user = getDataRow<LoanType>(dataIndex)?.user

                if (!user) return ''

                const { id, name } = user

                return `#${id} ${name}`
            },
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

export default DATATABLE_COLUMNS
