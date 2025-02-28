import Datatable, { type DatatableProps } from '@/components/Datatable'
import { type GetRowData } from '@/components/Datatable/@types'
import Fab from '@/components/Fab'
import AuthLayout from '@/components/Layouts/AuthLayout'
import type User from '@/dataTypes/User'
import Role from '@/enums/Role'
import { useRoleChecker } from '@/hooks/use-role-checker'
import Add from '@mui/icons-material/Add'
import Link from 'next/link'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

let getRowData: GetRowData<Ticket>

export default function TicketingSystemPage() {
    if (!useRoleChecker(Role.SUPERMAN)) return null

    return (
        <AuthLayout title="Tiket">
            <Datatable
                title="Daftar Tiket"
                tableId="tickets-datatable"
                apiUrl="ticketing-system/tickets-datatable"
                getRowDataCallback={fn => (getRowData = fn)}
                columns={COLUMNS}
                defaultSortOrder={{ name: 'id', direction: 'desc' }}
            />

            <Fab component={Link} href="ticketing-system/create">
                <Add />
            </Fab>
        </AuthLayout>
    )
}

const COLUMNS: DatatableProps<Ticket>['columns'] = [
    {
        name: 'id',
        label: 'ID',
    },
    {
        name: 'user.id',
        label: 'ID Pengguna',
        options: {
            customBodyRenderLite: dataIndex => getRowData(dataIndex)?.user?.id,
        },
    },
    {
        name: 'labels',
        label: 'Label',
    },
    {
        name: 'title',
        label: 'Judul',
    },
    {
        name: 'message',
        label: 'Pesan',
        options: {
            customBodyRender: value => (
                <Markdown remarkPlugins={[remarkGfm]}>
                    {value as string}
                </Markdown>
            ),
        },
    },
    {
        name: 'messages',
        label: 'Balasan',
    },
]

export interface Ticket {
    id: number
    title: string
    message: string
    user: User
}
