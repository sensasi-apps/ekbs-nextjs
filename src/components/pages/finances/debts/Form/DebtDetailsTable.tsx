// types
import type { Dispatch, SetStateAction } from 'react'
import type Debt from '@/types/orms/debt'
import type DebtDetail from '@/types/orms/debt-detail'
// materials
import Button from '@mui/material/Button'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableFooter from '@mui/material/TableFooter'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
// utils
import numberToCurrency from '@/utils/number-to-currency'
import toDmy from '@/utils/to-dmy'
import shortUuid from '@/utils/short-uuid'

type RowType = {
    uuid?: Debt['details'][0]['uuid']
    paid?: Debt['details'][0]['paid']
    due: Debt['details'][0]['due']
    rp: Debt['details'][0]['rp']
}

export default function DebtDetailsTable({
    rows,
    setDebtDetail,
}: {
    rows: RowType[]
    setDebtDetail: Dispatch<SetStateAction<DebtDetail | undefined>>
}) {
    return (
        <TableContainer>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Kode</TableCell>
                        <TableCell>Jatuh Tempo</TableCell>
                        <TableCell>Nilai</TableCell>
                        <TableCell>TGL. Lunas</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody
                    sx={{
                        td: {
                            whiteSpace: 'nowrap',
                        },
                    }}>
                    {rows.map(({ uuid, due, paid, rp }, i) => (
                        <TableRow key={i}>
                            <TableCell component="th" scope="row">
                                {i + 1}
                            </TableCell>
                            <TableCell>{uuid ? shortUuid(uuid) : ''}</TableCell>
                            <TableCell align="right">{toDmy(due)}</TableCell>
                            <TableCell align="right">
                                {numberToCurrency(rp)}
                            </TableCell>
                            <TableCell
                                align="right"
                                sx={{
                                    color: 'success.main',
                                }}>
                                {paid ? (
                                    toDmy(paid)
                                ) : uuid ? (
                                    <Button
                                        size="small"
                                        onClick={() =>
                                            setDebtDetail({
                                                uuid,
                                                due,
                                                paid: null,
                                                rp,
                                            })
                                        }>
                                        Lunasi
                                    </Button>
                                ) : (
                                    ''
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={3} align="right">
                            Total
                        </TableCell>
                        <TableCell align="right">
                            {numberToCurrency(
                                rows.reduce((total, row) => row.rp + total, 0),
                            )}
                        </TableCell>
                        <TableCell />
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    )
}
