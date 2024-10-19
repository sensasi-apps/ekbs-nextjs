// vendors
import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
// components
import DatePicker from '@/components/DatePicker'
import IconButton from '@/components/IconButton'
// icons
import BackupTableIcon from '@mui/icons-material/BackupTable'
import RefreshIcon from '@mui/icons-material/Refresh'
import ProductSaleType from '@/dataTypes/ProductSale'
import { aoaToXlsx } from '@/functions/aoaToXlsx'

const MAX_DATE = dayjs().endOf('month')
const MIN_DATE = dayjs('2024-01-01')

export default function FiltersBox({
    data,
    disabled,
    onRefresh,
}: {
    data: ProductSaleType[]
    disabled: boolean
    onRefresh: () => void
}) {
    const {
        query: { from_date, till_date },
        replace,
    } = useRouter()

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
                label="Dari Tanggal"
                minDate={MIN_DATE}
                disableHighlightToday
                maxDate={tillDate ?? MAX_DATE}
                value={fromDate}
                onChange={value => setFromDate(value)}
                slotProps={{
                    textField: {
                        margin: 'none',
                    },
                }}
            />

            <DatePicker
                disabled={disabled}
                label="Hingga Tanggal"
                minDate={fromDate ?? MIN_DATE}
                disableHighlightToday
                maxDate={MAX_DATE}
                value={tillDate}
                onChange={value => setTillDate(value)}
                slotProps={{
                    textField: {
                        margin: 'none',
                    },
                }}
            />

            <IconButton
                title="Segarkan"
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
                        replace({
                            query: newQuery,
                        })
                    } else {
                        onRefresh()
                    }
                }}
            />

            <IconButton
                color="success"
                disabled={disabled || data.length === 0}
                title="Unduh Excel"
                icon={BackupTableIcon}
                onClick={() => {
                    handleDownloadExcel(data)
                }}
            />
        </Box>
    )
}

function handleDownloadExcel(data: ProductSaleType[]) {
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

    aoaToXlsx('Laporan Penjualan SAPRODI', rows, HEADERS)
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
