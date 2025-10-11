'use client'

// materials
import Typography from '@mui/material/Typography'
// vendors
import dayjs from 'dayjs'
// components
import Datatable, { type DatatableProps } from '@/components/Datatable'

export default function LogsDataTable() {
    return (
        <Datatable
            apiUrl="_/logs-datatable-data"
            columns={DATATABLE_COLUMNS}
            defaultSortOrder={{
                direction: 'desc',
                name: 'at',
            }}
            tableId="logs-table"
        />
    )
}

const DATATABLE_COLUMNS: DatatableProps['columns'] = [
    {
        label: 'TGL',
        name: 'at',
        options: {
            customBodyRender: value =>
                dayjs(value).format('YYYY-MM-DD HH:mm:ss'),
        },
    },
    {
        label: 'User',
        name: 'user.name',
    },
    {
        label: 'Aksi',
        name: 'action',
    },
    {
        label: 'Detail',
        name: 'model_value_changed',
        options: {
            customBodyRender: (value: object) =>
                Object.entries(value).map(([key, value], i) => (
                    <Typography key={i} variant="body2">
                        <Typography
                            color="gray"
                            component="span"
                            variant="caption">
                            {key}:&nbsp;
                        </Typography>
                        {value as string}
                    </Typography>
                )),
        },
    },
    {
        label: 'Nama Model',
        name: 'model_classname',
    },
]
