// vendors
import dayjs from 'dayjs'
// materials
import Typography from '@mui/material/Typography'
//
import Datatable, { type DatatableProps } from '@/components/Datatable'
import AuthLayout from '@/components/Layouts/AuthLayout'
import Role from '@/enums/Role'
import { useRoleChecker } from '@/hooks/use-role-checker'

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

const DEFAULT_SORT_ORDER = {
    name: 'at',
    direction: 'desc' as const,
}

const DATATABLE_COLUMNS: DatatableProps['columns'] = [
    {
        name: 'at',
        label: 'TGL',
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
