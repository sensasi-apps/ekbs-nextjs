'use client'

// vendors
import { useRef, useState } from 'react'
import ServiceFormDialog from '@/app/(auth)/repair-shop/services/_parts/components/form-dialog'
//
import Datatable, {
    type DataTableProps,
    type GetRowDataType,
    type MutateType,
} from '@/components/data-table'
import Fab from '@/components/fab'
import PageTitle from '@/components/page-title'
// features
import type Service from '@/modules/repair-shop/types/orms/service'
// utils
import formatNumber from '@/utils/format-number'

export default function Page() {
    const mutateRef = useRef<MutateType<Service> | undefined>(undefined)
    const getRowDataRef = useRef<GetRowDataType<Service> | undefined>(undefined)
    const [formData, setFormData] = useState<Partial<Service>>()

    return (
        <>
            <PageTitle title="Data Layanan" />

            <Fab in={!formData} onClick={() => setFormData({})} />

            <ServiceFormDialog
                formData={formData}
                handleClose={() => {
                    setFormData(undefined)
                    mutateRef.current?.()
                }}
            />

            <Datatable<Service>
                apiUrl="repair-shop/services/datatable"
                columns={DATATABLE_COLUMNS}
                defaultSortOrder={{ direction: 'desc', name: 'id' }}
                getRowDataCallback={fn => {
                    getRowDataRef.current = fn
                }}
                mutateCallback={mutate => (mutateRef.current = mutate)}
                onRowClick={(_, { dataIndex }, event) => {
                    if (event.detail === 2) {
                        const data = getRowDataRef.current?.(dataIndex)

                        if (data) {
                            setFormData(data)
                        }
                    }
                }}
                setRowProps={(_, dataIndex) => {
                    const isDeleted =
                        getRowDataRef.current?.(dataIndex)?.deleted_at

                    if (!isDeleted) return {}

                    return {
                        sx: {
                            '& td': {
                                color: 'gray',
                                textDecoration: 'line-through',
                            },
                        },
                    }
                }}
                tableId="services-datatable"
                title="Daftar Layanan"
            />
        </>
    )
}

const DATATABLE_COLUMNS: DataTableProps<Service>['columns'] = [
    {
        label: 'ID',
        name: 'id',
    },
    {
        label: 'Nama',
        name: 'name',
    },
    {
        label: 'Harga (Rp)',
        name: 'default_price',
        options: {
            customBodyRender: value => formatNumber(value),
        },
    },
]
