// vendors
// import { useRef, useState } from 'react'
import Link from 'next/link'
// components
import Datatable, {
    type DatatableProps,
    // type GetRowDataType,
    // type MutateType,
} from '@/components/Datatable'
import Fab from '@/components/Fab'
import AuthLayout from '@/components/Layouts/AuthLayout'
// utils
// import formatNumber from '@/utils/formatNumber'
// features
import type Sale from '@/features/repair-shop--sale/types/sale'
import Endpoint from '@/features/repair-shop--sale/enums/endpoint'
import TextShortener from '@/components/text-shortener'

export default function Page() {
    return (
        <AuthLayout title="Penjualan">
            <Fab href="sales/create" component={Link} />

            <Datatable<Sale>
                apiUrl={Endpoint.DATATABLE}
                columns={DATATABLE_COLUMNS}
                defaultSortOrder={{ name: 'uuid', direction: 'desc' }}
                // getRowDataCallback={fn => {
                //     getRowDataRef.current = fn
                // }}
                // mutateCallback={mutate => (mutateRef.current = mutate)}
                // onRowClick={(_, { dataIndex }, event) => {
                //     if (event.detail === 2) {
                //         const data = getRowDataRef.current?.(dataIndex)

                //         if (data) {
                //             setFormData(data)
                //         }
                //     }
                // }}
                // setRowProps={(_, dataIndex) => {
                //     const isDeleted =
                //         getRowDataRef.current?.(dataIndex)?.deleted_at

                //     if (!isDeleted) return {}

                //     return {
                //         sx: {
                //             '& td': {
                //                 textDecoration: 'line-through',
                //                 color: 'gray',
                //             },
                //         },
                //     }
                // }}
                title="Riwayat"
                tableId="sales-datatable"
            />
        </AuthLayout>
    )
}

const DATATABLE_COLUMNS: DatatableProps<Sale>['columns'] = [
    {
        name: 'uuid',
        label: 'kode',
        options: {
            customBodyRender(value: string) {
                return <TextShortener text={value} />
            },
        },
    },
]
