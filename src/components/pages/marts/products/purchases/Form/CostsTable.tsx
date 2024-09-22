import type ProductMovementCost from '@/dataTypes/mart/ProductMovementCost'
import formatNumber from '@/utils/formatNumber'
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material'

export function CostsTable({ data }: { data: ProductMovementCost[] }) {
    return (
        <>
            <Typography gutterBottom fontWeight="bold" fontSize="1.3em">
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
                    {data.map(({ name, rp }, index) => (
                        <TableRow key={index}>
                            <TableCell>{name}</TableCell>
                            <TableCell align="right">
                                {formatNumber(rp)}
                            </TableCell>
                        </TableRow>
                    ))}
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
