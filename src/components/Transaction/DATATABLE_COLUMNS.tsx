// types
import { MUIDataTableColumn } from 'mui-datatables'
import TransactionType from '@/dataTypes/Transaction'
// materials
import { green } from '@mui/material/colors'
// components
import { getDataRow } from '@/components/Global/Datatable'
// utils
import toDmy from '@/utils/toDmy'
import numberToCurrency from '@/utils/numberToCurrency'

const DATATABLE_COLUMNS: MUIDataTableColumn[] = [
    {
        name: 'uuid',
        label: 'uuid',
        options: {
            display: false,
        },
    },
    {
        name: 'at',
        label: 'Tanggal',
        options: {
            customBodyRender: toDmy,
        },
    },
    {
        name: 'cash.code',
        label: 'Kode Kas',
        options: {
            customBodyRenderLite: dataIndex =>
                getDataRow<TransactionType>(dataIndex)?.cash.code,
        },
    },
    {
        name: 'amount',
        label: 'Nilai',
        options: {
            customBodyRender: (value: number) => (
                <span
                    style={{
                        whiteSpace: 'nowrap',
                        color: value <= 0 ? 'inherit' : green[500],
                    }}>
                    {numberToCurrency(value)}
                </span>
            ),
        },
    },
    {
        name: 'desc',
        label: 'Perihal',
    },

    {
        name: 'userActivityLogs.user.name',
        label: 'Oleh',
        options: {
            customBodyRenderLite: dataIndex =>
                getDataRow<TransactionType>(dataIndex)?.user_activity_logs[0]
                    ?.user.name,
        },
    },
]

export default DATATABLE_COLUMNS
