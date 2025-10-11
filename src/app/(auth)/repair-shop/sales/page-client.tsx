'use client'

// vendors
import { useRouter } from 'next/navigation'
import { useRef } from 'react'
import Receipt from '@/app/(auth)/repair-shop/sales/_parts/components/receipt'
import { ChipSmall } from '@/components/ChipSmall/ChipSmall'
import Datatable, {
    type DatatableProps,
    type GetRowDataType,
} from '@/components/Datatable'
import PrintHandler from '@/components/PrintHandler'
import TextShortener from '@/components/text-shortener'
// features
import type { Sale } from '@/modules/repair-shop/types/orms/sale'
// utils
import formatNumber from '@/utils/format-number'
import toDmy from '@/utils/to-dmy'

let getRowDataRef: {
    current?: GetRowDataType<Sale>
}

export default function PageClient() {
    const { push } = useRouter()
    getRowDataRef = useRef<GetRowDataType<Sale> | undefined>(undefined)
    return (
        <Datatable<Sale>
            apiUrl="repair-shop/sales/datatable"
            columns={DATATABLE_COLUMNS}
            defaultSortOrder={{ direction: 'desc', name: 'uuid' }}
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
            tableId="sales-datatable"
            title="Riwayat"
        />
    )
}

const DATATABLE_COLUMNS: DatatableProps<Sale>['columns'] = [
    {
        label: 'Kode',
        name: 'uuid',
        options: {
            customBodyRender(value: string) {
                return <TextShortener text={value} />
            },
        },
    },
    {
        label: 'TGL',
        name: 'at',
        options: {
            customBodyRender(value: string) {
                return toDmy(value)
            },
        },
    },
    {
        label: 'Pelanggan',
        name: 'customer.name',
        options: {
            customBodyRenderLite(dataIndex) {
                const data = getRowDataRef.current?.(dataIndex)

                if (!data?.customer) return

                return (
                    <>
                        <ChipSmall
                            color="info"
                            label={data.customer.id}
                            sx={{ mr: 1 }}
                            variant="outlined"
                        />
                        {data.customer.name}
                    </>
                )
            },
        },
    },
    {
        label: 'Total (Rp)',
        name: 'final_rp',
        options: {
            customBodyRender(value: number) {
                return formatNumber(value)
            },
        },
    },
    {
        label: 'Metode Pembayaran',
        name: 'payment_method',
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
        label: 'catatan',
        name: 'note',
        options: {
            display: 'excluded',
            sort: false,
        },
    },
    {
        label: 'Kwitansi',
        name: '',
        options: {
            customBodyRender(_, rowIndex) {
                const data = getRowDataRef.current?.(rowIndex)

                if (!data) return null

                return (
                    <PrintHandler>
                        <Receipt data={data} />
                    </PrintHandler>
                )
            },
            searchable: false,
            sort: false,
        },
    },
]
