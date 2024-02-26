// types
import type ProductType from '@/dataTypes/Product'
// materials
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import formatNumber from '@/utils/formatNumber'

export default function ProductMovementTable({
    data,
}: ProductMovementTableProp) {
    const labels =
        data?.flatMap(row =>
            row.movements.map(m => ({
                label: m.label,
                label_value: m.label_value,
            })),
        ) ?? []

    const monthLabels = labels.filter((item, index) => {
        return (
            index === labels.findIndex(o => item.label_value === o.label_value)
        )
    })

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell rowSpan={3}>#</TableCell>
                        <TableCell rowSpan={3}>Kategori</TableCell>
                        <TableCell rowSpan={3}>Kode</TableCell>
                        <TableCell rowSpan={3}>Produk</TableCell>
                        <TableCell rowSpan={3}>Stok Awal</TableCell>
                        <TableCell colSpan={monthLabels.length * 2}>
                            Bulan
                        </TableCell>
                        <TableCell rowSpan={3}>Stok Akhir</TableCell>
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
                            <>
                                <TableCell key={i}>Masuk</TableCell>
                                <TableCell key={i}>Keluar</TableCell>
                            </>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {!data && (
                        <TableRow>
                            <TableCell colSpan={4} align="center">
                                <i>Tidak ada data</i>
                            </TableCell>
                        </TableRow>
                    )}

                    {data?.map((row, i) => (
                        <TableRow key={row.id}>
                            <TableCell>{i + 1}</TableCell>
                            <TableCell>{row.category_name}</TableCell>
                            <TableCell>{row.code}</TableCell>
                            <TableCell>
                                {row.name} ({row.unit})
                            </TableCell>
                            <TableCell>
                                {formatNumber(row.initial_qty)}
                            </TableCell>

                            {monthLabels.map(({ label_value }) => {
                                const movement = row.movements.find(
                                    item => item.label_value === label_value,
                                )

                                return (
                                    <>
                                        <TableCell>
                                            {movement?.in ?? 0}
                                        </TableCell>
                                        <TableCell>
                                            {movement?.out ?? 0}
                                        </TableCell>
                                    </>
                                )
                            })}

                            <TableCell>{formatNumber(row.final_qty)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export type ProductMovementTableProp = {
    data?: {
        id: ProductType['id']
        category_name: ProductType['category_name']
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
