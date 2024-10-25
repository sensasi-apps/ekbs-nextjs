import Datatable from '@/components/Datatable'
import AuthLayout from '@/components/Layouts/AuthLayout'
import Role from '@/enums/Role'
import { useRoleChecker } from '@/hooks/use-role-checker'
import { Typography } from '@mui/material'
import dayjs from 'dayjs'
import { MUIDataTableColumn, MUISortOptions } from 'mui-datatables'

export default function Page() {
    if (!useRoleChecker(Role.SUPERMAN)) return null

    return (
        <AuthLayout title="Logs">
            <Datatable
                tableId="logs-table"
                apiUrl="_/logs-datatable-data"
                columns={DATATABLE_COLUMNS}
                defaultSortOrder={DEFAULT_SORT_ORDER}
            />
        </AuthLayout>
    )
}

const DEFAULT_SORT_ORDER: MUISortOptions = {
    name: 'at',
    direction: 'desc',
}

const DATATABLE_COLUMNS: MUIDataTableColumn[] = [
    {
        name: 'at',
        label: 'Tanggal',
        options: {
            customBodyRender: value =>
                dayjs(value).format('YYYY-MM-DD HH:mm:ss'),
        },
    },
    {
        name: 'user.name',
        label: 'User',
    },
    {
        name: 'action',
        label: 'Aksi',
    },
    {
        name: 'model_value_changed',
        label: 'Detail',
        options: {
            customBodyRender: (value: object) =>
                Object.entries(value).map(([key, value], i) => (
                    <Typography key={i} variant="body2">
                        <Typography
                            variant="caption"
                            color="gray"
                            component="span">
                            {key}:&nbsp;
                        </Typography>
                        {value as string}
                    </Typography>
                )),
        },
    },
    {
        name: 'model_classname',
        label: 'Nama Model',
    },
]
