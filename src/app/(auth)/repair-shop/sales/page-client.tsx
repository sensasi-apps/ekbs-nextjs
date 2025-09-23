'use client'

// vendors
import { useRouter } from 'next/navigation'
import { useRef } from 'react'
import Datatable, {
    type DatatableProps,
    type GetRowDataType,
} from '@/components/Datatable'

import PrintHandler from '@/components/PrintHandler'
import TextShortener from '@/components/text-shortener'
import Receipt from '@/app/(auth)/repair-shop/sales/_parts/components/receipt'
// utils
import formatNumber from '@/utils/format-number'
import toDmy from '@/utils/to-dmy'
// features
import type { Sale } from '@/modules/repair-shop/types/orms/sale'
import { ChipSmall } from '@/components/ChipSmall/ChipSmall'

let getRowDataRef: {
    current?: GetRowDataType<Sale>
}

export default function PageClient() {
    const { push } = useRouter()
    getRowDataRef = useRef<GetRowDataType<Sale> | undefined>(undefined)
    return (
        <>
            <Datatable<Sale>
                apiUrl="repair-shop/sales/datatable"
                columns={DATATABLE_COLUMNS}
                defaultSortOrder={{ name: 'uuid', direction: 'desc' }}
                getRowDataCallback={fn => {
                    getRowDataRef.current = fn
                }}
                onRowClick={(_, { dataIndex }, event) => {
                    if (event.detail === 2) {
                        const data = getRowDataRef.current?.(dataIndex)

                        if (!data) return

                        push(`/repair-shop/sales/${data.uuid}`)
                    }
                }}
                title="Riwayat"
                tableId="sales-datatable"
            />
        </>
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
    {
        name: 'at',
        label: 'TGL',
        options: {
            customBodyRender(value: string) {
                return toDmy(value)
            },
        },
    },
    {
        name: 'customer.name',
        label: 'Pelanggan',
        options: {
            customBodyRenderLite(dataIndex) {
                const data = getRowDataRef.current?.(dataIndex)

                if (!data?.customer) return

                return (
                    <>
                        <ChipSmall
                            label={data.customer.id}
                            color="info"
                            variant="outlined"
                            sx={{ mr: 1 }}
                        />
                        {data.customer.name}
                    </>
                )
            },
        },
    },
    {
        name: 'final_rp',
        label: 'Total (Rp)',
        options: {
            customBodyRender(value: number) {
                return formatNumber(value)
            },
        },
    },
    {
        name: 'payment_method',
        label: 'Metode Pembayaran',
        options: {
            customBodyRender(value: Sale['payment_method']) {
                if (value === 'cash') return 'Tunai'
                if (value === 'business-unit') return 'Unit Bisnis'
                if (value === 'installment') return 'Angsuran'

                return value
            },
        },
    },
    {
        name: 'note',
        label: 'catatan',
        options: {
            display: 'excluded',
            sort: false,
        },
    },
    {
        name: '',
        label: 'Kwitansi',
        options: {
            searchable: false,
            sort: false,
            customBodyRender(_, rowIndex) {
                const data = getRowDataRef.current?.(rowIndex)

                if (!data) return null

                return (
                    <PrintHandler>
                        <Receipt data={data} />
                    </PrintHandler>
                )
            },
        },
    },
]
