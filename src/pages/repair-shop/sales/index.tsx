// vendors
import { useRouter } from 'next/router'
import { useRef } from 'react'
import Link from 'next/link'
// components
import Datatable, {
    type DatatableProps,
    type GetRowDataType,
} from '@/components/Datatable'
import Fab from '@/components/Fab'
import AuthLayout from '@/components/Layouts/AuthLayout'
// features
import type { Sale } from '@/features/repair-shop--sale/types/sale'
import TextShortener from '@/components/text-shortener'
import formatNumber from '@/utils/formatNumber'
import toDmy from '@/utils/toDmy'
import PrintHandler from '@/components/PrintHandler'
import Receipt from '@/features/repair-shop--sale/components/receipt'

let getRowDataRef: {
    current?: GetRowDataType<Sale>
}

export default function Page() {
    const { replace } = useRouter()
    getRowDataRef = useRef<GetRowDataType<Sale> | undefined>(undefined)

    return (
        <AuthLayout title="Penjualan">
            <Fab href="sales/create" component={Link} />

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

                        replace(`sales/${data?.uuid}`)
                    }
                }}
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
            searchable: false,
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
