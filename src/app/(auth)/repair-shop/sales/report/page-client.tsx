'use client'

// icons
import BackupTableIcon from '@mui/icons-material/BackupTable'
// materials
import Button from '@mui/material/Button'
import LinearProgress from '@mui/material/LinearProgress'
// vendors
import { useSearchParams } from 'next/navigation'
import useSWR from 'swr'
// components
import { AoaTable } from '@/components/aoa-table'
import LoadingCenter from '@/components/loading-center'
// modules
import type { Sale } from '@/modules/repair-shop/types/orms/sale'
import aoaToXlsx from '@/utils/aoa-to-xlsx'
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
            return [
                i + 1,
                row.tgl,
                row.code,
                row.user_id,
                row.user_name,
                row.layanan,
                row.suku_cadang,
                row.payment_method,
                row.total_biaya_dasar,
                row.subtotal_penjualan,
                row.penyesuaian_jasa,
                row.total_rp,
                row.marjin,
            ]

        if (
            type === 'per-payment-method' &&
            'payment_method' in row &&
            'count' in row
        )
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

            <div>
                <Button
                    onClick={() => {
                        aoaToXlsx(
                            `Laporan Penjualan Belayan Spare Parts — ${type}`,
                            rows,
                            headers,
                        )
                    }}
                    size="small"
                    startIcon={<BackupTableIcon />}
                    variant="outlined">
                    Unduh
                </Button>
            </div>

            <AoaTable dataRows={rows} footers={footers} headers={headers} />
        </>
    )
}

type ApiResponse = ({
    total_rp: Sale['final_rp']
} & (
    | {
          // per-sale
          tgl: string
          code: string
          user_id: string | number
          user_name: string
          payment_method: Sale['payment_method']
          total_biaya_dasar: number
          subtotal_penjualan: number
          penyesuaian_jasa: number
          marjin: number
          suku_cadang: string
          layanan: string
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
    if (type === 'per-sale')
        return [
            '#',
            'TGL',
            'KODE PENJUALAN',
            'ID PENGGUNA',
            'NAMA',
            'LAYANAN',
            'SUKU CADANG',
            'METODE PEMBAYARAN',
            'TOTAL BIAYA DASAR (Rp)',
            'SUBTOTAL PENJUALAN (Rp)',
            'PENYESUAIAN/JASA (Rp)',
            'TOTAL PENJUALAN (Rp)',
            'MARJIN (Rp)',
        ]

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
        const {
            marjin,
            penyesuaian_jasa,
            subtotal_penjualan,
            total_biaya_dasar,
        } = data.reduce(
            (acc, cur) => {
                const marjin = 'marjin' in cur ? cur.marjin : 0
                const penyesuaian_jasa =
                    'penyesuaian_jasa' in cur ? cur.penyesuaian_jasa : 0
                const subtotal_penjualan =
                    'subtotal_penjualan' in cur ? cur.subtotal_penjualan : 0
                const total_biaya_dasar =
                    'total_biaya_dasar' in cur ? cur.total_biaya_dasar : 0

                return {
                    marjin: acc.marjin + marjin,
                    penyesuaian_jasa: acc.penyesuaian_jasa + penyesuaian_jasa,
                    subtotal_penjualan:
                        acc.subtotal_penjualan + subtotal_penjualan,
                    total_biaya_dasar:
                        acc.total_biaya_dasar + total_biaya_dasar,
                }
            },
            {
                marjin: 0,
                penyesuaian_jasa: 0,
                subtotal_penjualan: 0,
                total_biaya_dasar: 0,
            },
        )

        return [
            [
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                'TOTAL',
                total_biaya_dasar,
                subtotal_penjualan,
                penyesuaian_jasa,
                grandTotal,
                marjin,
            ],
        ]
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
