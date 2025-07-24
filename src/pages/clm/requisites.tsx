import Datatable, { type DatatableProps } from '@/components/Datatable'
import AuthLayout from '@/components/Layouts/AuthLayout'
import Grid from '@mui/material/Grid2'

export default function page() {
    return (
        <AuthLayout
            title="Syarat Sertifikasi"
            subtitle="Pengaturan syarat yang akan berlaku untuk semua anggota dan lahan">
            <Grid container spacing={2} mt={2}>
                <Grid
                    size={{
                        xs: 12,
                        sm: 12,
                        md: 6,
                    }}>
                    <Datatable
                        tableId="clm-user-requisites-datatable"
                        title="Syarat Perorangan"
                        apiUrl="/clm/requisites/get-datatable-data"
                        apiUrlParams={{
                            type: 'user',
                        }}
                        columns={DATATABLE_COLUMNS}
                        defaultSortOrder={{ name: 'name', direction: 'asc' }}
                        // onRowClick={(_, { dataIndex }, event) => {
                        // if (event.detail === 2) {
                        // console.log(data)
                        // const member = getRowDataRef.current?.(dataIndex)
                        // if (member) {
                        //     replace('/clm/members/' + member.user_uuid)
                        // }
                        // }
                        // }}
                        // mutateCallback={fn => (mutateRef.current = fn)}
                        // getRowDataCallback={fn => (getRowDataRef.current = fn)}
                    />
                </Grid>

                <Grid
                    size={{
                        xs: 12,
                        sm: 12,
                        md: 6,
                    }}>
                    <Datatable
                        tableId="clm-user-requisites-datatable"
                        title="Syarat per Lahan"
                        apiUrl="/clm/requisites/get-datatable-data"
                        apiUrlParams={{
                            type: 'land',
                        }}
                        columns={DATATABLE_COLUMNS}
                        defaultSortOrder={{ name: 'name', direction: 'asc' }}
                        // onRowClick={(_, { dataIndex }, event) => {
                        // if (event.detail === 2) {
                        // console.log(data)
                        // const member = getRowDataRef.current?.(dataIndex)
                        // if (member) {
                        //     replace('/clm/members/' + member.user_uuid)
                        // }
                        // }
                        // }}
                        // mutateCallback={fn => (mutateRef.current = fn)}
                        // getRowDataCallback={fn => (getRowDataRef.current = fn)}
                    />
                </Grid>
            </Grid>
        </AuthLayout>
    )
}

const DATATABLE_COLUMNS: DatatableProps['columns'] = [
    {
        name: 'id',
        label: 'ID',
    },
    {
        name: 'name',
        label: 'Nama',
    },
    {
        name: 'description',
        label: 'Keterangan',
    },
    {
        name: 'is_optional',
        label: 'Opsional',
    },

    // {
    //     name: 'status',
    //     label: 'Status',
    //     options: {
    //         searchable: false,
    //         sort: false,
    //     },
    // },

    // {
    //     name: 'created_at',
    //     options: {
    //         display: 'excluded',
    //     },
    // },
]
