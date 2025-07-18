// components
import Datatable, { type DatatableProps } from '@/components/Datatable'
import Fab from '@/components/Fab'
import AuthLayout from '@/components/Layouts/AuthLayout'

export default function Members() {
    return (
        <AuthLayout title="Anggota Sertifikasi">
            <Datatable
                apiUrl="/clm/members/get-datatable-data"
                columns={DATATABLE_COLUMNS}
                defaultSortOrder={{ name: 'created_at', direction: 'desc' }}
                // onRowClick={(_, { dataIndex }, event) => {
                //     if (event.detail === 2) {
                //         const data =
                //             getRowData<PalmBunchDeliveryRateValidDateType>(
                //                 dataIndex,
                //             )

                //         if (data) {
                //             handleEdit(data)
                //         }
                //     }
                // }}
                tableId="clm-members-datatable"
                title="Daftar Anggota"
            />

            <Fab />
        </AuthLayout>
    )
}

const DATATABLE_COLUMNS: DatatableProps['columns'] = [
    {
        name: 'user.id',
        label: 'ID',
    },
    {
        name: 'user.name',
        label: 'Nama',
    },
    {
        name: 'created_at',
        options: {
            display: 'excluded',
        },
    },
]
