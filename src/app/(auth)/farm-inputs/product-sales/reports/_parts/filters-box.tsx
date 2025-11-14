// vendors

// icons
import BackupTableIcon from '@mui/icons-material/BackupTable'
import RefreshIcon from '@mui/icons-material/Refresh'
import Box from '@mui/material/Box'
import dayjs, { Dayjs } from 'dayjs'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
// components
import DatePicker from '@/components/date-picker'
import IconButton from '@/components/icon-button'
import type ProductSaleORM from '@/modules/farm-inputs/types/orms/product-sale'
import aoaToXlsx from '@/utils/aoa-to-xlsx'

const MAX_DATE = dayjs().endOf('month')
const MIN_DATE = dayjs('2024-01-01')

export default function FiltersBox({
    data,
    disabled,
    onRefresh,
}: {
    data: ProductSaleORM[]
    disabled: boolean
    onRefresh: () => void
}) {
    const { replace } = useRouter()

    const searchParams = useSearchParams()
    const from_date = searchParams?.get('from_date')
    const till_date = searchParams?.get('till_date')

    const [fromDate, setFromDate] = useState<Dayjs | null>(
        from_date ? dayjs(from_date as string) : null,
    )
    const [tillDate, setTillDate] = useState<Dayjs | null>(
        till_date ? dayjs(till_date as string) : null,
    )

    useEffect(() => {
        if (from_date) {
            setFromDate(dayjs(from_date as string))
        }

        if (till_date) {
            setTillDate(dayjs(till_date as string))
        }
    }, [from_date, till_date])

    return (
        <Box display="flex" gap={2}>
            <DatePicker
                disabled={disabled}
                disableHighlightToday
                label="Dari Tanggal"
                maxDate={tillDate ?? MAX_DATE}
                minDate={MIN_DATE}
                onChange={value => setFromDate(value)}
                slotProps={{
                    textField: {
                        margin: 'none',
                    },
                }}
                value={fromDate}
            />

            <DatePicker
                disabled={disabled}
                disableHighlightToday
                label="Hingga Tanggal"
                maxDate={MAX_DATE}
                minDate={fromDate ?? MIN_DATE}
                onChange={value => setTillDate(value)}
                slotProps={{
                    textField: {
                        margin: 'none',
                    },
                }}
                value={tillDate}
            />

            <IconButton
                disabled={!(fromDate || tillDate || disabled)}
                icon={RefreshIcon}
                onClick={() => {
                    const newQuery = {
                        from_date: fromDate?.format('YYYY-MM-DD'),
                        till_date: tillDate?.format('YYYY-MM-DD'),
                    }

                    const isQueryChanged =
                        JSON.stringify(newQuery) !==
                        JSON.stringify({ from_date, till_date })

                    if (isQueryChanged) {
                        const searchParams = new URLSearchParams()

                        if (newQuery.from_date) {
                            searchParams.set('from_date', newQuery.from_date)
                        }

                        if (newQuery.till_date) {
                            searchParams.set('till_date', newQuery.till_date)
                        }

                        const finalQuery = searchParams.toString()

                        replace(`?${finalQuery}`)
                    } else {
                        onRefresh()
                    }
                }}
                title="Segarkan"
            />

            <IconButton
                color="success"
                disabled={disabled || data.length === 0}
                icon={BackupTableIcon}
                onClick={() => {
                    handleDownloadExcel(
                        data,
                        `Laporan Penjualan SAPRODI ${from_date} s.d. ${till_date}`,
                    )
                }}
                title="Unduh Excel"
            />
        </Box>
    )
}

function handleDownloadExcel(data: ProductSaleORM[], fileName: string) {
    const rows = data.flatMap(item => {
        const adjustedTotalRp = item.total_rp - item.total_base_rp

        return item.product_movement_details.map(detail => {
            const finalTotalRp =
                -detail.qty * detail.rp_per_unit +
                adjustedTotalRp / item.product_movement_details.length

            const marginRp =
                detail.qty *
                    detail.product_warehouse_state.base_cost_rp_per_unit +
                finalTotalRp

            return [
                item.at,
                item.short_uuid,
                item.product_movement.warehouse,

                item.buyer_user?.id ?? null,
                item.buyer_user?.name ?? null,
                item.payment_method_id,

                detail.product_state.name,
                -detail.qty,
                detail.product_state.unit,

                detail.product_warehouse_state.base_cost_rp_per_unit,
                -detail.qty *
                    detail.product_warehouse_state.base_cost_rp_per_unit,

                detail.rp_per_unit,
                -detail.qty * detail.rp_per_unit,
                adjustedTotalRp / item.product_movement_details.length,

                finalTotalRp,
                marginRp,
            ]
        })
    })

    aoaToXlsx(fileName, rows, HEADERS)
}

const HEADERS = [
    'Tanggal',
    'Kode',
    'Gudang',

    'ID',
    'Pengguna',
    'Metode Pembayaran',

    'Barang',
    'QTY',
    'Satuan',

    'Biaya Dasar (Rp)',
    'Total Biaya Dasar (Rp)',

    'Harga Jual (Rp)',
    'Subtotal Penjualan (Rp)',
    'Penyesuaian/Jasa (Rp)',

    'Total Penjualan (Rp)',
    'Marjin (Rp)',
]
