// types
import type ProductType from '@/dataTypes/Product'
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
import formatNumber from '@/utils/formatNumber'
import numberToCurrency from '@/utils/numberToCurrency'

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
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell rowSpan={3}>#</TableCell>
                        <TableCell rowSpan={3}>Kategori</TableCell>
                        <TableCell rowSpan={3}>Kode</TableCell>
                        <TableCell rowSpan={3}>Produk</TableCell>
                        <TableCell rowSpan={3}>Satuan</TableCell>
                        <TableCell rowSpan={3}>Stok Awal</TableCell>
                        <TableCell colSpan={monthLabels.length * 2}>
                            Bulan
                        </TableCell>
                        <TableCell rowSpan={2} colSpan={3}>
                            Stok Akhir
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        {monthLabels.map(({ label, label_value }) => (
                            <TableCell colSpan={2} key={label_value}>
                                {label}
                            </TableCell>
                        ))}
                    </TableRow>
                    <TableRow>
                        {monthLabels.map((_, i) => (
                            <MasukKeluarCell key={i} in="Masuk" out="Keluar" />
                        ))}
                        <TableCell>Jumlah</TableCell>
                        <TableCell>Biaya Dasar</TableCell>
                        <TableCell>Nilai</TableCell>
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
                            <TableCell>
                                {formatNumber(row.initial_qty)}
                            </TableCell>

                            {monthLabels.map(({ label_value }) => {
                                const movement = row.movements.find(
                                    item => item.label_value === label_value,
                                )

                                return (
                                    <MasukKeluarCell
                                        key={label_value}
                                        in={movement?.in ?? 0}
                                        out={movement?.out ?? 0}
                                    />
                                )
                            })}

                            <TableCell>{formatNumber(row.final_qty)}</TableCell>
                            <TableCell>
                                {numberToCurrency(
                                    row.base_cost_rp_per_unit ?? 0,
                                )}
                            </TableCell>
                            <TableCell>
                                {numberToCurrency(
                                    (row.final_qty ?? 0) *
                                        (row.base_cost_rp_per_unit ?? 0),
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
                            {numberToCurrency(
                                data?.reduce(
                                    (a, b) =>
                                        a +
                                        (b.final_qty ?? 0) *
                                            (b.base_cost_rp_per_unit ?? 0),
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
        id: ProductType['id']
        category_name: ProductType['category_name']
        base_cost_rp_per_unit: ProductType['base_cost_rp_per_unit']
        name: ProductType['name']
        code: ProductType['code']
        initial_qty: number
        movements: {
            in: number
            out: number
            label: string
            label_value: string
        }[]
        final_qty: number
        unit: string
    }[]
}

function MasukKeluarCell({
    in: inProp,
    out,
}: {
    in: number | string
    out: number | string
}) {
    return (
        <>
            <TableCell>{inProp}</TableCell>
            <TableCell>{out}</TableCell>
        </>
    )
}
