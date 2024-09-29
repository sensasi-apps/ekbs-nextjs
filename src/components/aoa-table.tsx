// vendors
import type { AoaRows } from '@/functions/aoaToXlsx'

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material'

export function AoaTable({
    headers,
    dataRows,
}: {
    headers: string[]
    dataRows: AoaRows
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
                    {dataRows.map((row, index) => (
                        <TableRow key={index}>
                            {row.map((cell, index) => (
                                <TableCell key={index}>{cell}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
