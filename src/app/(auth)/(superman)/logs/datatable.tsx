'use client'

import DataTableV2, { type DataTableV2Props } from '@/components/datatable-v2'
import dayjs from 'dayjs'
import Typography from '@mui/material/Typography'

export default function LogsDataTable() {
    return (
        <DataTableV2
            id="logs-datatable"
            columns={COLUMNS}
            url="/api/_/logs-datatable-data"
            slots={{
                0: (data: string) => dayjs(data).format('YYYY-MM-DD HH:mm:ss'),
                3: (data: object) => (
                    <>
                        {Object.entries(data).map(([key, value], i) => (
                            <Typography key={i} variant="body2" component="div">
                                <Typography
                                    variant="caption"
                                    color="gray"
                                    component="span">
                                    {key}:&nbsp;
                                </Typography>
                                {value}
                            </Typography>
                        ))}
                    </>
                ),
            }}
        />
    )
}

const COLUMNS: DataTableV2Props['columns'] = [
    {
        data: 'at',
        title: 'TGL',
        orderable: true,
    },
    { data: 'user.name', title: 'Nama' },
    { data: 'action', title: 'Aksi' },
    {
        data: 'model_value_changed',
        title: 'Detail',
    },
    { data: 'model_classname', title: 'Nama Model' },
]
