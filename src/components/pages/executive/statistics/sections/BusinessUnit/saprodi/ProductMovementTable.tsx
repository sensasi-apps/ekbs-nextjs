// types
import type Product from '@/dataTypes/Product'
// vendors
import { memo } from 'react'
// materials
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableFooter from '@mui/material/TableFooter'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
// utils
import formatNumber from '@/utils/format-number'
import numberToCurrency from '@/utils/number-to-currency'

function roundedCurrencyFormat(value: number) {
    return numberToCurrency(value, { maximumFractionDigits: 0 })
}

const LEFT_BORDER_STYLE = {
    borderLeft: '1px solid var(--mui-palette-TableCell-border)',
}

const ProductMovementTable = memo(function ProductMovementTable({
    data,
}: ProductMovementTableProp) {
    const labels =
        data?.flatMap(row =>
            row.movements.map(m => ({
                label: m.label,
                label_value: m.label_value,
            })),
        ) ?? []

    const monthLabels = labels.filter(
        (item, index) =>
            index === labels.findIndex(o => item.label_value === o.label_value),
    )

    return (
        <TableContainer>
            <Table size="small" sx={{ mt: 2 }}>
                <TableHead>
                    <TableRow>
                        <TableCell rowSpan={3}>#</TableCell>
                        <TableCell rowSpan={3}>Kategori</TableCell>
                        <TableCell rowSpan={3}>Kode</TableCell>
                        <TableCell rowSpan={3}>Produk</TableCell>
                        <TableCell rowSpan={3}>Satuan</TableCell>
                        <TableCell rowSpan={3}>Stok Awal</TableCell>
                        <TableCell
                            colSpan={monthLabels.length * 2}
                            sx={LEFT_BORDER_STYLE}>
                            Bulan
                        </TableCell>
                        <TableCell
                            rowSpan={2}
                            colSpan={5}
                            sx={LEFT_BORDER_STYLE}>
                            Stok Akhir
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        {monthLabels.map(({ label, label_value }, i) => (
                            <TableCell
                                colSpan={2}
                                key={label_value}
                                sx={i === 0 ? LEFT_BORDER_STYLE : null}>
                                {label}
                            </TableCell>
                        ))}
                    </TableRow>
                    <TableRow>
                        {monthLabels.map((_, i) => (
                            <MasukKeluarCell
                                key={i}
                                in="Masuk"
                                out="Keluar"
                                leftBorder={i === 0}
                            />
                        ))}
                        <TableCell sx={LEFT_BORDER_STYLE}>Jumlah</TableCell>
                        <TableCell sx={LEFT_BORDER_STYLE}>
                            Biaya Dasar
                        </TableCell>
                        <TableCell>Nilai</TableCell>
                        <TableCell sx={LEFT_BORDER_STYLE}>
                            Harga Tunai
                        </TableCell>
                        <TableCell>Total Nilai Tunai</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {!data && (
                        <TableRow>
                            <TableCell colSpan={7} align="center">
                                <i>Tidak ada data</i>
                            </TableCell>
                        </TableRow>
                    )}

                    {data?.map((row, i) => (
                        <TableRow key={i}>
                            <TableCell>{i + 1}</TableCell>
                            <TableCell>{row.category_name}</TableCell>
                            <TableCell>{row.code}</TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.unit}</TableCell>
                            <TableCell align="right">
                                {formatNumber(row.initial_qty)}
                            </TableCell>

                            {monthLabels.map(({ label_value }, i) => {
                                const movement = row.movements.find(
                                    item => item.label_value === label_value,
                                )

                                return (
                                    <MasukKeluarCell
                                        key={label_value}
                                        leftBorder={i === 0}
                                        in={movement?.in ?? 0}
                                        out={movement?.out ?? 0}
                                    />
                                )
                            })}

                            <TableCell align="right" sx={LEFT_BORDER_STYLE}>
                                {formatNumber(row.final_qty)}
                            </TableCell>
                            <TableCell align="right" sx={LEFT_BORDER_STYLE}>
                                {roundedCurrencyFormat(
                                    row.base_cost_rp_per_unit ?? 0,
                                )}
                            </TableCell>
                            <TableCell align="right">
                                {roundedCurrencyFormat(
                                    (row.final_qty ?? 0) *
                                        (row.base_cost_rp_per_unit ?? 0),
                                )}
                            </TableCell>
                            <TableCell sx={LEFT_BORDER_STYLE} align="right">
                                {roundedCurrencyFormat(row.default_sell_price)}
                            </TableCell>
                            <TableCell align="right">
                                {roundedCurrencyFormat(
                                    (row.final_qty ?? 0) *
                                        row.default_sell_price,
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={8 + monthLabels.length * 2}>
                            Total
                        </TableCell>
                        <TableCell>
                            {roundedCurrencyFormat(
                                data?.reduce(
                                    (a, b) =>
                                        a +
                                        (b.final_qty ?? 0) *
                                            (b.base_cost_rp_per_unit ?? 0),
                                    0,
                                ) ?? 0,
                            )}
                        </TableCell>
                        <TableCell
                            colSpan={2}
                            sx={LEFT_BORDER_STYLE}
                            align="right">
                            {roundedCurrencyFormat(
                                data?.reduce(
                                    (a, b) =>
                                        a +
                                        (b.final_qty ?? 0) *
                                            (b.default_sell_price ?? 0),
                                    0,
                                ) ?? 0,
                            )}
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    )
})

export default ProductMovementTable

export type ProductMovementTableProp = {
    data?: {
        id: Product['id']
        category_name: Product['category_name']
        base_cost_rp_per_unit: Product['warehouses'][0]['base_cost_rp_per_unit']
        name: Product['name']
        code: Product['code']
        initial_qty: number
        movements: {
            in: number
            out: number
            label: string
            label_value: string
        }[]
        final_qty: number
        unit: string
        default_sell_price: number
    }[]
}

function MasukKeluarCell({
    in: inProp,
    out,
    leftBorder,
}: {
    in: number | string
    out: number | string
    leftBorder?: boolean
}) {
    return (
        <>
            <TableCell align="right" sx={leftBorder ? LEFT_BORDER_STYLE : null}>
                {inProp}
            </TableCell>
            <TableCell align="right">{out}</TableCell>
        </>
    )
}
