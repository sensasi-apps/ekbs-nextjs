'use client'

import Add from '@mui/icons-material/Add'
import NextLink from 'next/link'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Datatable, { type DatatableProps } from '@/components/Datatable'
import { type GetRowData } from '@/components/Datatable/@types'
import Fab from '@/components/Fab'
import PageTitle from '@/components/page-title'
import type User from '@/modules/user/types/orms/user'

let getRowData: GetRowData<Ticket>

export default function Page() {
    return (
        <>
            <PageTitle title="Ticketing System" />

            <Datatable
                apiUrl="ticketing-system/tickets-datatable"
                columns={COLUMNS}
                defaultSortOrder={{ direction: 'desc', name: 'id' }}
                getRowDataCallback={fn => (getRowData = fn)}
                tableId="tickets-datatable"
                title="Daftar Tiket"
            />

            <Fab component={NextLink} href="ticketing-system/create">
                <Add />
            </Fab>
        </>
    )
}

const COLUMNS: DatatableProps<Ticket>['columns'] = [
    {
        label: 'ID',
        name: 'id',
    },
    {
        label: 'ID Pengguna',
        name: 'user.id',
        options: {
            customBodyRenderLite: dataIndex => getRowData(dataIndex)?.user?.id,
        },
    },
    {
        label: 'Label',
        name: 'labels',
    },
    {
        label: 'Judul',
        name: 'title',
    },
    {
        label: 'Pesan',
        name: 'message',
        options: {
            customBodyRender: value => (
                <Markdown remarkPlugins={[remarkGfm]}>
                    {value as string}
                </Markdown>
            ),
        },
    },
    {
        label: 'Balasan',
        name: 'messages',
    },
]

export interface Ticket {
    id: number
    title: string
    message: string
    user: User
}
