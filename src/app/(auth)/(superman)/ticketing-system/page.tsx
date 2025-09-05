'use client'

import Datatable, { type DatatableProps } from '@/components/Datatable'
import { type GetRowData } from '@/components/Datatable/@types'
import Fab from '@/components/Fab'
import type User from '@/modules/user/types/orms/user'
import Add from '@mui/icons-material/Add'
import NextLink from 'next/link'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import PageTitle from '@/components/page-title'

let getRowData: GetRowData<Ticket>

export default function Page() {
    return (
        <>
            <PageTitle title="Ticketing System" />

            <Datatable
                title="Daftar Tiket"
                tableId="tickets-datatable"
                apiUrl="ticketing-system/tickets-datatable"
                getRowDataCallback={fn => (getRowData = fn)}
                columns={COLUMNS}
                defaultSortOrder={{ name: 'id', direction: 'desc' }}
            />

            <Fab component={NextLink} href="ticketing-system/create">
                <Add />
            </Fab>
        </>
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
