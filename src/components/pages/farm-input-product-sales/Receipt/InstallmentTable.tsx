// types
import type { InstallmentWithTransactionType } from '@/dataTypes/Installment'
import type { ProductSaleInstallmentType } from '@/dataTypes/ProductSale'
// vendors
import { memo } from 'react'
//materials
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableFooter from '@mui/material/TableFooter'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
// utils
import formatNumber from '@/utils/formatNumber'
import toDmy from '@/utils/toDmy'

const ReceiptInstalmentTable = memo(function ReceiptInstalmentTable({
    data: {
        n_term,
        n_term_unit,
        total_base_rp,
        interest_percent,
        at,
        installments,
    },
}: {
    data: ProductSaleInstallmentType
}) {
    let remaining_rp = total_base_rp
    const base_rp = Math.ceil(total_base_rp / n_term)
    const interestRp = Math.ceil((total_base_rp * interest_percent) / 100)
    const installmentAmount = base_rp + interestRp

    return (
        <Table
            size="small"
            padding="none"
            sx={{
                '& td, th': {
                    padding: '0.2em',
                    border: 'none',
                    fontSize: '0.8em',
                },
                '& td': {
                    color: 'grey',
                    textAlign: 'right',
                },
                '& th': {
                    fontWeight: 'bold',
                    color: 'black',
                },
            }}>
            <TableHead>
                <TableRow
                    sx={{
                        '& th': {
                            textTransform: 'capitalize',
                        },
                    }}>
                    <TableCell>{n_term_unit} ke-</TableCell>
                    <TableCell>Tanggal</TableCell>
                    <TableCell>Sisa (Rp)</TableCell>
                    <TableCell>Pokok (Rp)</TableCell>
                    <TableCell>Jasa {interest_percent}% (Rp)</TableCell>
                    <TableCell>Potongan (Rp)</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <TableRow>
                    <TableCell
                        style={{
                            textAlign: 'center',
                        }}>
                        0
                    </TableCell>
                    <TableCell>{toDmy(at)}</TableCell>
                    <TableCell>{formatNumber(total_base_rp)}</TableCell>
                    <TableCell />
                    <TableCell />
                    <TableCell />
                </TableRow>

                {installments.map(installment => {
                    return (
                        <InstallmentTableRow
                            key={installment.n_th}
                            data={installment}
                            remaining_rp={
                                (remaining_rp = remaining_rp - base_rp)
                            }
                            base_rp={base_rp}
                            interest_rp={interestRp}
                        />
                    )
                })}
            </TableBody>
            <TableFooter>
                <TableRow
                    sx={{
                        '& th': {
                            textAlign: 'right',
                        },
                    }}>
                    <TableCell colSpan={3} component="th">
                        TOTAL
                    </TableCell>
                    <TableCell component="th">
                        {formatNumber(total_base_rp)}
                    </TableCell>
                    <TableCell component="th">
                        {formatNumber(interestRp * n_term)}
                    </TableCell>
                    <TableCell component="th">
                        {formatNumber(installmentAmount * n_term)}
                    </TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    )
})

export default ReceiptInstalmentTable

function InstallmentTableRow({
    data,
    remaining_rp,
    base_rp,
    interest_rp,
}: {
    data: InstallmentWithTransactionType
    remaining_rp: number
    base_rp: number
    interest_rp: number
}) {
    const { n_th, should_be_paid_at, amount_rp } = data

    return (
        <TableRow>
            <TableCell
                style={{
                    textAlign: 'center',
                }}>
                {n_th}
            </TableCell>
            <TableCell>{toDmy(should_be_paid_at)}</TableCell>
            <TableCell>
                {formatNumber(remaining_rp < 0 ? 0 : remaining_rp)}
            </TableCell>
            <TableCell>{formatNumber(base_rp)}</TableCell>
            <TableCell>{formatNumber(interest_rp)}</TableCell>
            <TableCell>{formatNumber(amount_rp)}</TableCell>
        </TableRow>
    )
}
