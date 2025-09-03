// materials
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableFooter from '@mui/material/TableFooter'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
//
import type ProductMovementDetail from '@/modules/mart/types/orms/product-movement-detail'
import formatNumber from '@/utils/format-number'

export function PmdsTable({ data }: { data: ProductMovementDetail[] }) {
    return (
        <>
            <Typography mt={3} gutterBottom fontWeight="bold" fontSize="1.3em">
                Daftar Barang
            </Typography>

            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Produk</TableCell>
                        <TableCell align="right">Harga Satuan (Rp)</TableCell>
                        <TableCell align="right">Biaya Satuan (Rp)</TableCell>
                        <TableCell align="right">Qty</TableCell>
                        <TableCell align="right">Subtotal (Rp)</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {data.map((pmd, index) => (
                        <TableRow key={index}>
                            <TableCell>{pmd.product_state?.name}</TableCell>
                            <TableCell align="right">
                                {formatNumber(pmd.rp_per_unit)}
                            </TableCell>
                            <TableCell align="right">
                                {formatNumber(pmd.cost_rp_per_unit)}
                            </TableCell>
                            <TableCell align="right">
                                {formatNumber(pmd.qty)}
                            </TableCell>
                            <TableCell align="right">
                                {formatNumber(
                                    (pmd.rp_per_unit + pmd.cost_rp_per_unit) *
                                        pmd.qty,
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={3} align="right">
                            TOTAL
                        </TableCell>
                        <TableCell align="right">
                            {formatNumber(
                                data.reduce((acc, pmd) => acc + pmd.qty, 0),
                            )}
                        </TableCell>
                        <TableCell align="right">
                            {formatNumber(
                                data.reduce(
                                    (acc, pmd) =>
                                        acc +
                                        (pmd.rp_per_unit +
                                            pmd.cost_rp_per_unit) *
                                            pmd.qty,
                                    0,
                                ),
                            )}
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </>
    )
}
