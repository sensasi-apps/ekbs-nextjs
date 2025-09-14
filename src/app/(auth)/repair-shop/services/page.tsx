'use client'

// vendors
import { useRef, useState } from 'react'
//
import Datatable, {
    type DatatableProps,
    type GetRowDataType,
    type MutateType,
} from '@/components/Datatable'
import Fab from '@/components/Fab'
// utils
import formatNumber from '@/utils/format-number'
// features
import type Service from '@/modules/repair-shop/types/orms/service'
import ServiceFormDialog from '@/app/(auth)/repair-shop/services/_parts/components/form-dialog'
import PageTitle from '@/components/page-title'

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
                defaultSortOrder={{ name: 'id', direction: 'desc' }}
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
                                textDecoration: 'line-through',
                                color: 'gray',
                            },
                        },
                    }
                }}
                title="Daftar Layanan"
                tableId="services-datatable"
            />
        </>
    )
}

const DATATABLE_COLUMNS: DatatableProps<Service>['columns'] = [
    {
        name: 'id',
        label: 'ID',
    },
    {
        name: 'name',
        label: 'Nama',
    },
    {
        name: 'default_price',
        label: 'Harga (Rp)',
        options: {
            customBodyRender: value => formatNumber(value),
        },
    },
]
