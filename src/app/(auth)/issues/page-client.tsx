'use client'

import { useRouter } from 'next/navigation'
import Datatable, {
    type DataTableProps,
    type GetRowDataType,
} from '@/components/data-table'
import UserDisplay from '@/components/user-display'
import type TicketORM from './_types/orms/ticket'

let getRowData: GetRowDataType<TicketORM>

export default function PageClient() {
    const { push } = useRouter()

    return (
        <>
            <Datatable
                apiUrl="issues/tickets/datatable"
                columns={COLUMNS}
                defaultSortOrder={{ direction: 'desc', name: 'id' }}
                getRowDataCallback={fn => (getRowData = fn)}
                onRowClick={row => push(`/issues/${row[0]}`)}
                tableId="issue-table"
                title="Daftar Laporan"
            />
        </>
    )
}

const COLUMNS: DataTableProps<TicketORM>['columns'] = [
    {
        label: 'ID',
        name: 'id',
    },
    {
        label: 'ID Pengguna',
        name: 'user.id',
        options: {
            customBodyRenderLite: dataIndex => getRowData(dataIndex)?.user?.id,
            display: 'excluded',
        },
    },
    {
        label: 'Oleh',
        name: 'user.name',
        options: {
            customBodyRenderLite: dataIndex => {
                const data = getRowData(dataIndex)

                if (!data || !data.user) return

                return <UserDisplay data={data.user} />
            },
        },
    },
    {
        label: 'Judul',
        name: 'title',
    },
    {
        label: 'Pesan',
        name: 'message',
        options: {
            setCellProps: () => ({
                style: {
                    whiteSpace: 'pre-wrap',
                },
            }),
        },
    },
]
