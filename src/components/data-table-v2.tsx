'use client'

// vendors
import DataTable, {
    type DataTableProps as DataTablePropsVendor,
} from 'datatables.net-react'
// datatables
import DT, { type Config } from 'datatables.net-dt'
import languageID from 'datatables.net-plugins/i18n/id.json'
import 'datatables.net-dt/css/dataTables.dataTables.css'
// utils
import { getCurrentAuthToken } from '@/lib/axios/getCurrentAuthToken'

// eslint-disable-next-line
DataTable.use(DT)

export type DataTableV2Props = Omit<
    DataTablePropsVendor,
    'options' | 'ajax'
> & {
    id: string
    url: string
    order?: Config['order']
}

export default function DataTableV2({
    order,
    url,
    ...props
}: DataTableV2Props) {
    return (
        <div style={{ overflowX: 'auto', width: '100%' }}>
            <DataTable
                {...props}
                className="display dataTable"
                ajax={{
                    url: process.env.NEXT_PUBLIC_BACKEND_URL + '/api' + url,
                    headers: {
                        Authorization: `Bearer ${getCurrentAuthToken()}`,
                    },
                }}
                options={{
                    destroy: true,
                    deferRender: true,
                    serverSide: true,
                    processing: true,
                    order: order,
                    language: languageID,
                }}
            />
        </div>
    )
}
