// types
import type { ApiResponseType } from '../AlatBerat'
// materials
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
// components
import StatCard from '@/components/StatCard'
// utils
import formatNumber from '@/utils/formatNumber'

export default function HmTableCard({
    data,
    isLoading,
}: {
    data: ApiResponseType['unit_current_hms'] | undefined
    isLoading: boolean | undefined
}) {
    return (
        <StatCard title="HM Unit — Saat Ini" isLoading={isLoading}>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Unit</TableCell>
                            <TableCell align="right">HM</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data?.map(row => (
                            <TableRow key={row.name}>
                                <TableCell scope="row">{row.name}</TableCell>
                                <TableCell align="right">
                                    {formatNumber(row.hm)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </StatCard>
    )
}
