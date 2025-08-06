// vendors
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

export function AoaTable({
    headers,
    dataRows,
}: {
    headers: string[]
    dataRows: (string | number | null | JSX.Element)[][]
}) {
    return (
        <TableContainer>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        {headers.map(header => (
                            <TableCell key={header}>{header}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>

                <TableBody
                    sx={{
                        '& td': {
                            whiteSpace: 'nowrap',
                        },
                    }}>
                    {dataRows.length === 0 && (
                        <TableRow>
                            <TableCell
                                colSpan={headers.length}
                                sx={{
                                    textAlign: 'center',
                                }}>
                                Tidak ada data
                            </TableCell>
                        </TableRow>
                    )}

                    {dataRows.map((row, i) => (
                        <TableRow key={'row-' + i}>
                            {row.map((cell, j) => (
                                <TableCell key={'cell-' + j}>{cell}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
