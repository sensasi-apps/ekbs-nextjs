// vendors

// materials
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableFooter from '@mui/material/TableFooter'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import type { ReactNode } from 'react'
import formatNumber from '@/utils/format-number'

/**
 * AoaTable is a component that renders a table with customizable headers and data rows.
 * The table displays a "Tidak ada data" message in a centered cell if no data rows are provided.
 */
export function AoaTable({
    headers,
    dataRows,
    footers,
}: {
    /**
     * An array of strings representing the column headers.
     */
    headers: string[]

    /**
     * A 2D array containing the table data, where each sub-array represents a row,
     * and each element within the sub-array can be a string, number, null, or ReactNode.
     */
    dataRows: ReactNode[][]

    /**
     * An array of arrays of ReactNode representing the table footers.
     */
    footers?: ReactNode[][]
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
                                <CustomTableCell key={'cell-' + j}>
                                    {cell}
                                </CustomTableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>

                {footers && footers.length > 0 && (
                    <TableFooter>
                        {footers.map((row, i) => (
                            <TableRow key={'row-' + i}>
                                {row.map((cell, j) => (
                                    <CustomTableCell key={'cell-' + j}>
                                        {cell}
                                    </CustomTableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableFooter>
                )}
            </Table>
        </TableContainer>
    )
}

function CustomTableCell({ children }: { children: ReactNode }) {
    if (typeof children === 'number') {
        return <TableCell align="right">{formatNumber(children)}</TableCell>
    }

    return <TableCell>{children}</TableCell>
}
