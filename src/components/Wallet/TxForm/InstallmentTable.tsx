// types
import type { Installment } from '@/dataTypes/Installment'
// materials
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableFooter from '@mui/material/TableFooter'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Tooltip from '@mui/material/Tooltip'
// utils
import getInstallmentColor from '@/utils/getInstallmentColor'
import getInstallmentType from '@/utils/getInstallmentType'
import numberToCurrency from '@/utils/numberToCurrency'
import toDmy from '@/utils/toDmy'

export default function InstallmentTable({ data }: { data: Installment[] }) {
    return (
        <Table
            sx={{
                whiteSpace: 'nowrap',
            }}
            size="small">
            <TableHead>
                <TableRow>
                    <TableCell>Jatuh Tempo</TableCell>
                    <TableCell>Jenis</TableCell>
                    <TableCell>Tagihan</TableCell>
                </TableRow>
            </TableHead>

            <TableBody>
                {data.map((installment, index) => {
                    const { amount_rp, should_be_paid_at, state } = installment

                    return (
                        <Tooltip
                            title={state}
                            key={index}
                            arrow
                            placement="top">
                            <TableRow
                                sx={{
                                    '& > td': {
                                        color: getInstallmentColor(installment),
                                    },
                                }}>
                                <TableCell>
                                    {toDmy(should_be_paid_at)}
                                </TableCell>
                                <TableCell>
                                    {getInstallmentType(installment)}
                                </TableCell>
                                <TableCell>
                                    {numberToCurrency(amount_rp)}
                                </TableCell>
                            </TableRow>
                        </Tooltip>
                    )
                })}
            </TableBody>

            <TableFooter>
                <TableRow>
                    <TableCell colSpan={2}>Total</TableCell>
                    <TableCell>
                        {numberToCurrency(
                            data.reduce((acc, curr) => acc + curr.amount_rp, 0),
                        )}
                    </TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    )
}
