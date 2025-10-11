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
import FilterInputs from './filter-inputs'

export default function PageClient() {
    const searchParams = useSearchParams()

    const type = searchParams.get('type') ?? 'per-sale'
    const from_date = searchParams.get('from_date')
    const till_date = searchParams.get('till_date')

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

    const headers =
        type === 'per-sale'
            ? ['KODE', 'SUBTOTAL']
            : ['METODE PEMBAYARAN', 'JUMLAH', 'SUBTOTAL']

    const rows = data.map(row => {
        if (type === 'per-sale' && 'code' in row)
            return [row.code, row.total_rp]

        if (type === 'per-payment-method' && 'payment_method' in row)
            return [row.payment_method, row.count, row.total_rp]

        return []
    })

    const grandTotal = data.reduce((acc, cur) => acc + cur.total_rp, 0)

    const footers = [
        type === 'per-sale'
            ? ['TOTAL', grandTotal]
            : [
                  'TOTAL',
                  data.reduce(
                      (acc, cur) => acc + ('count' in cur ? cur.count : 0),
                      0,
                  ),
                  grandTotal,
              ],
    ]

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
))[]
