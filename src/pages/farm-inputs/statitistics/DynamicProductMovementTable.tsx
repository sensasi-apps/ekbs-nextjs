// types
import type ProductType from '@/dataTypes/Product'
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
import { memo } from 'react'

const DynamicProductMovementTable = memo(function DynamicProductMovementTable({
    data,
}: DynamicProductMovementTableProp) {
    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell rowSpan={2}>#</TableCell>
                        <TableCell rowSpan={2}>Kategori</TableCell>
                        <TableCell rowSpan={2}>Kode</TableCell>
                        <TableCell rowSpan={2}>Produk</TableCell>
                        <TableCell rowSpan={2}>Satuan</TableCell>
                        <TableCell colSpan={3}>Stok Awal</TableCell>
                        <TableCell colSpan={3}>Stok Masuk</TableCell>
                        <TableCell colSpan={3}>Stok Keluar</TableCell>
                        <TableCell colSpan={3}>Stok Akhir</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Jumlah</TableCell>
                        <TableCell>Biaya Dasar</TableCell>
                        <TableCell>Nilai</TableCell>
                        <TableCell>Jumlah</TableCell>
                        <TableCell>Biaya Dasar</TableCell>
                        <TableCell>Nilai</TableCell>
                        <TableCell>Jumlah</TableCell>
                        <TableCell>Biaya Dasar</TableCell>
                        <TableCell>Nilai</TableCell>
                        <TableCell>Jumlah</TableCell>
                        <TableCell>Biaya Dasar</TableCell>
                        <TableCell>Nilai</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {!data && (
                        <TableRow>
                            <TableCell colSpan={17} align="center">
                                <i>Tidak ada data</i>
                            </TableCell>
                        </TableRow>
                    )}

                    {data?.map(
                        (
                            {
                                category_name,
                                code,
                                name,
                                unit,

                                initial_qty,
                                initial_rp,
                                initial_value,

                                in_qty,
                                in_rp,
                                in_value,

                                out_qty,
                                out_rp,
                                out_value,

                                final_qty,
                                final_rp,
                                final_value,
                            },
                            i,
                        ) => (
                            <TableRow key={i}>
                                <TableCell>{i + 1}</TableCell>
                                <TableCell>{category_name}</TableCell>
                                <TableCell>{code}</TableCell>
                                <TableCell>{name}</TableCell>
                                <TableCell>{unit}</TableCell>

                                <TableCell>
                                    {formatNumber(initial_qty)}
                                </TableCell>
                                <TableCell>
                                    {numberToCurrency(initial_rp ?? 0)}
                                </TableCell>
                                <TableCell>
                                    {numberToCurrency(initial_value ?? 0)}
                                </TableCell>

                                <TableCell>{formatNumber(in_qty)}</TableCell>
                                <TableCell>
                                    {numberToCurrency(in_rp ?? 0)}
                                </TableCell>
                                <TableCell>
                                    {numberToCurrency(in_value ?? 0)}
                                </TableCell>

                                <TableCell>{formatNumber(out_qty)}</TableCell>
                                <TableCell>
                                    {numberToCurrency(out_rp ?? 0)}
                                </TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                    {numberToCurrency(out_value)}
                                </TableCell>

                                <TableCell>{formatNumber(final_qty)}</TableCell>
                                <TableCell>
                                    {numberToCurrency(final_rp ?? 0)}
                                </TableCell>
                                <TableCell>
                                    {numberToCurrency(final_value ?? 0)}
                                </TableCell>
                            </TableRow>
                        ),
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={7}>Total</TableCell>
                        <TableCell>
                            {numberToCurrency(
                                data?.reduce(
                                    (a, b) => a + (b.initial_value ?? 0),
                                    0,
                                ) ?? 0,
                            )}
                        </TableCell>
                        <TableCell colSpan={2} />
                        <TableCell>
                            {numberToCurrency(
                                data?.reduce(
                                    (a, b) => a + (b.in_value ?? 0),
                                    0,
                                ) ?? 0,
                            )}
                        </TableCell>
                        <TableCell colSpan={2} />
                        <TableCell>
                            {numberToCurrency(
                                data?.reduce(
                                    (a, b) => a + (b.out_value ?? 0),
                                    0,
                                ) ?? 0,
                            )}
                        </TableCell>
                        <TableCell colSpan={2} />
                        <TableCell>
                            {numberToCurrency(
                                data?.reduce(
                                    (a, b) => a + (b.final_value ?? 0),
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

export default DynamicProductMovementTable

export type DynamicProductMovementTableProp = {
    data?: {
        id: ProductType['id']
        category_name: ProductType['category_name']
        base_cost_rp_per_unit: ProductType['base_cost_rp_per_unit']
        name: ProductType['name']
        code: ProductType['code']
        unit: ProductType['unit']

        initial_qty: number
        initial_rp: number
        initial_value: number

        in_qty: number
        in_rp: number
        in_value: number

        out_qty: number
        out_rp: number
        out_value: number

        final_qty: number
        final_rp: number
        final_value: number
    }[]
}
