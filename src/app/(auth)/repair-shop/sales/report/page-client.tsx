'use client'

// materials
import LinearProgress from '@mui/material/LinearProgress'
// vendors
import { useSearchParams } from 'next/navigation'
import useSWR from 'swr'
// components
import { AoaTable } from '@/components/aoa-table'
import LoadingCenter from '@/components/loading-center'
// modules
import type { Sale } from '@/modules/repair-shop/types/orms/sale'
import FilterInputs, {
    DEFAULT_FROM_DATE,
    DEFAULT_TILL_DATE,
} from './filter-inputs'

export default function PageClient() {
    const searchParams = useSearchParams()

    const type = (searchParams.get('type') ?? 'per-sale') as
        | 'per-sale'
        | 'per-payment-method'
        | 'per-spare-part'
    const from_date = searchParams.get('from_date') ?? DEFAULT_FROM_DATE
    const till_date = searchParams.get('till_date') ?? DEFAULT_TILL_DATE

    const { data, isValidating } = useSWR<ApiResponse>([
        '/repair-shop/sales/get-sales-report-data',
        {
            from_date,
            till_date,
            type,
        },
    ])

    if (!data) {
        return <LoadingCenter />
    }

    const headers = getHeader(type)

    const rows = data.map((row, i) => {
        if (type === 'per-sale' && 'code' in row)
            return [i + 1, row.code, row.total_rp]

        if (type === 'per-payment-method' && 'payment_method' in row)
            return [i + 1, row.payment_method, row.count, row.total_rp]

        if (type === 'per-spare-part' && 'spare_part_name' in row)
            return [
                i + 1,
                row.spare_part_id,
                row.spare_part_name,
                row.count,
                row.total_rp,
            ]

        return []
    })

    const footers = buildFooters(data, type)

    return (
        <>
            <div
                style={{
                    marginBottom: '2rem',
                }}>
                <FilterInputs />
            </div>

            {isValidating && <LinearProgress />}

            <AoaTable dataRows={rows} footers={footers} headers={headers} />
        </>
    )
}

type ApiResponse = ({
    total_rp: Sale['final_rp']
} & (
    | {
          // per-sale
          code: string
      }
    | {
          // per-payment-method
          payment_method: Sale['payment_method']
          count: number
      }
    | {
          // per-spare-part
          spare_part_id: number
          spare_part_name: string
          count: number
      }
))[]

function getHeader(type: 'per-sale' | 'per-payment-method' | 'per-spare-part') {
    if (type === 'per-sale') return ['#', 'KODE PENJUALAN', 'SUBTOTAL (Rp)']

    if (type === 'per-payment-method')
        return ['#', 'METODE PEMBAYARAN', 'JUMLAH', 'SUBTOTAL (Rp)']

    if (type === 'per-spare-part')
        return [
            '#',
            'ID SUKU CADANG',
            'NAMA SUKU CADANG',
            'JUMLAH',
            'SUBTOTAL (Rp)',
        ]

    throw new Error('Invalid type')
}

function buildFooters(
    data: ApiResponse,
    type: 'per-sale' | 'per-payment-method' | 'per-spare-part',
): (number | null | string)[][] {
    const grandTotal = data.reduce((acc, cur) => acc + cur.total_rp, 0)

    if (type === 'per-sale') {
        return [[null, 'TOTAL', grandTotal]]
    }

    const totalQty = data.reduce(
        (acc, cur) => acc + ('count' in cur ? cur.count : 0),
        0,
    )

    if (type === 'per-payment-method') {
        return [[null, 'TOTAL', totalQty, grandTotal]]
    }

    return [[null, null, 'TOTAL', totalQty, grandTotal]]
}
