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
import formatNumber from '@/utils/formatNumber'
import numberToCurrency from '@/utils/numberToCurrency'

function roundedCurrencyFormat(value: number) {
    return numberToCurrency(value, { maximumFractionDigits: 0 })
}

const LEFT_BORDER_STYLE = {
    borderLeft: '1px solid var(--mui-palette-TableCell-border)',
}

const DynamicProductMovementTable = memo(function DynamicProductMovementTable({
    data,
}: DynamicProductMovementTableProp) {
    return (
        <TableContainer sx={{ mt: 2 }}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell rowSpan={2}>#</TableCell>
                        <TableCell rowSpan={2}>Kategori</TableCell>
                        <TableCell rowSpan={2}>Kode</TableCell>
                        <TableCell rowSpan={2}>Produk</TableCell>
                        <TableCell rowSpan={2}>Satuan</TableCell>
                        <TableCell colSpan={3} sx={LEFT_BORDER_STYLE}>
                            Stok Awal
                        </TableCell>
                        <TableCell colSpan={3} sx={LEFT_BORDER_STYLE}>
                            Stok Masuk
                        </TableCell>
                        <TableCell colSpan={3} sx={LEFT_BORDER_STYLE}>
                            Stok Keluar
                        </TableCell>
                        <TableCell colSpan={5} sx={LEFT_BORDER_STYLE}>
                            Stok Akhir
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={LEFT_BORDER_STYLE}>Jumlah</TableCell>
                        <TableCell>Biaya Dasar</TableCell>
                        <TableCell>Nilai</TableCell>

                        <TableCell sx={LEFT_BORDER_STYLE}>Jumlah</TableCell>
                        <TableCell>Biaya Dasar</TableCell>
                        <TableCell>Nilai</TableCell>

                        <TableCell sx={LEFT_BORDER_STYLE}>Jumlah</TableCell>
                        <TableCell>Biaya Dasar</TableCell>
                        <TableCell>Nilai</TableCell>

                        <TableCell sx={LEFT_BORDER_STYLE}>Jumlah</TableCell>
                        <TableCell>Biaya Dasar</TableCell>
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
                                initial_worth,

                                in_qty,
                                in_rp,
                                in_worth,

                                out_qty,
                                out_rp,
                                out_worth,

                                final_qty,
                                final_rp,
                                final_worth,

                                default_sell_price,
                                final_sell_worth,
                            },
                            i,
                        ) => (
                            <TableRow key={i}>
                                <TableCell>{i + 1}</TableCell>
                                <TableCell>{category_name}</TableCell>
                                <TableCell>{code}</TableCell>
                                <TableCell>{name}</TableCell>
                                <TableCell>{unit}</TableCell>

                                <TableCell sx={LEFT_BORDER_STYLE} align="right">
                                    {formatNumber(initial_qty)}
                                </TableCell>
                                <TableCell align="right">
                                    {roundedCurrencyFormat(initial_rp ?? 0)}
                                </TableCell>
                                <TableCell align="right">
                                    {roundedCurrencyFormat(initial_worth ?? 0)}
                                </TableCell>

                                <TableCell sx={LEFT_BORDER_STYLE} align="right">
                                    {formatNumber(in_qty)}
                                </TableCell>
                                <TableCell align="right">
                                    {roundedCurrencyFormat(in_rp ?? 0)}
                                </TableCell>
                                <TableCell align="right">
                                    {roundedCurrencyFormat(in_worth ?? 0)}
                                </TableCell>

                                <TableCell sx={LEFT_BORDER_STYLE} align="right">
                                    {formatNumber(out_qty)}
                                </TableCell>
                                <TableCell align="right">
                                    {roundedCurrencyFormat(out_rp ?? 0)}
                                </TableCell>
                                <TableCell align="right">
                                    {roundedCurrencyFormat(out_worth)}
                                </TableCell>

                                <TableCell sx={LEFT_BORDER_STYLE} align="right">
                                    {formatNumber(final_qty)}
                                </TableCell>
                                <TableCell align="right">
                                    {roundedCurrencyFormat(final_rp ?? 0)}
                                </TableCell>
                                <TableCell align="right">
                                    {roundedCurrencyFormat(final_worth ?? 0)}
                                </TableCell>

                                <TableCell sx={LEFT_BORDER_STYLE} align="right">
                                    {roundedCurrencyFormat(default_sell_price)}
                                </TableCell>
                                <TableCell align="right">
                                    {roundedCurrencyFormat(final_sell_worth)}
                                </TableCell>
                            </TableRow>
                        ),
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={5}>Total</TableCell>

                        <TableCell sx={LEFT_BORDER_STYLE} colSpan={2} />
                        <TableCell align="right">
                            {roundedCurrencyFormat(
                                data?.reduce(
                                    (a, b) => a + (b.initial_worth ?? 0),
                                    0,
                                ) ?? 0,
                            )}
                        </TableCell>

                        <TableCell colSpan={2} sx={LEFT_BORDER_STYLE} />
                        <TableCell align="right">
                            {roundedCurrencyFormat(
                                data?.reduce(
                                    (a, b) => a + (b.in_worth ?? 0),
                                    0,
                                ) ?? 0,
                            )}
                        </TableCell>

                        <TableCell colSpan={2} sx={LEFT_BORDER_STYLE} />
                        <TableCell align="right">
                            {roundedCurrencyFormat(
                                data?.reduce(
                                    (a, b) => a + (b.out_worth ?? 0),
                                    0,
                                ) ?? 0,
                            )}
                        </TableCell>

                        <TableCell colSpan={2} sx={LEFT_BORDER_STYLE} />
                        <TableCell align="right">
                            {roundedCurrencyFormat(
                                data?.reduce(
                                    (a, b) => a + (b.final_worth ?? 0),
                                    0,
                                ) ?? 0,
                            )}
                        </TableCell>

                        <TableCell sx={LEFT_BORDER_STYLE} />
                        <TableCell align="right">
                            {roundedCurrencyFormat(
                                data?.reduce(
                                    (a, b) => a + (b.final_sell_worth ?? 0),
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
        id: Product['id']
        category_name: Product['category_name']
        name: Product['name']
        code: Product['code']
        unit: Product['unit']

        initial_qty: number
        initial_rp: number
        initial_worth: number

        in_qty: number
        in_rp: number
        in_worth: number

        out_qty: number
        out_rp: number
        out_worth: number

        final_qty: number
        final_rp: number
        final_worth: number

        default_sell_price: number
        final_sell_worth: number
    }[]
}
