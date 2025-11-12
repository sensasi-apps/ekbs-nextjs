// materials
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableFooter from '@mui/material/TableFooter'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
//
import type ProductMovementCost from '@/modules/mart/types/orms/product-movement-cost'
import formatNumber from '@/utils/format-number'

export function CostsTable({ data }: { data: ProductMovementCost[] }) {
    return (
        <>
            <Typography fontSize="1.3em" fontWeight="bold" gutterBottom>
                Biaya
            </Typography>

            <Table
                size="small"
                sx={{
                    width: 'max-content',
                }}>
                <TableHead>
                    <TableRow>
                        <TableCell>Nama</TableCell>
                        <TableCell align="right">Nilai (Rp)</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {data.map(({ name, rp }) => (
                        <TableRow key={name}>
                            <TableCell>{name}</TableCell>
                            <TableCell align="right">
                                {formatNumber(rp)}
                            </TableCell>
                        </TableRow>
                    ))}

                    {data.length === 0 && (
                        <TableRow>
                            <TableCell align="center" colSpan={2}>
                                <Typography
                                    color="textSecondary"
                                    fontStyle="italic"
                                    variant="body2">
                                    Tidak ada biaya
                                </Typography>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>

                <TableFooter>
                    <TableRow>
                        <TableCell align="right">TOTAL</TableCell>
                        <TableCell align="right">
                            {formatNumber(
                                data.reduce((acc, { rp }) => acc + rp, 0),
                            )}
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </>
    )
}
