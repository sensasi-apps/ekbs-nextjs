// types
import type InstallmentType from '@/dataTypes/Installment'
import type { InstallmentWithTransactionType } from '@/dataTypes/Installment'
import type LoanType from '@/dataTypes/Loan'
import type { UserLoanFormDataType } from '../Form/types'
// materials
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableFooter from '@mui/material/TableFooter'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
// utils
import numberToCurrency from '@/utils/numberToCurrency'
import toDmy from '@/utils/toDmy'

export default function UserLoanInstallmentDialogTable({
    data: loan,
}: {
    data: UserLoanFormDataType | LoanType
}) {
    const { proposed_rp, interest_percent, n_term, term_unit } = loan

    if (!proposed_rp || interest_percent === '' || !n_term) return null

    const transaction = 'transaction' in loan ? loan.transaction : null
    const base_rp = Math.ceil(proposed_rp / n_term)
    const interest_rp = Math.ceil((proposed_rp * interest_percent) / 100)

    const hasInstallments =
        'installments' in loan && loan.installments.length > 0
    const installments = hasInstallments
        ? loan.installments
        : (() => {
              const installments: InstallmentType[] = []

              for (let index = 0; index < n_term; index++) {
                  installments.push({
                      n_th: index + 1,
                      amount_rp: base_rp + interest_rp,
                  } as any)
              }

              return installments
          })()

    const isDisbursed = Boolean(transaction)
    const installment_amount = installments[0].amount_rp
    let remaining_rp = proposed_rp

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>{term_unit} ke-</TableCell>
                    {isDisbursed && <TableCell>Tanggal</TableCell>}
                    <TableCell>Sisa</TableCell>
                    <TableCell>Pokok</TableCell>
                    <TableCell>Jasa ({loan.interest_percent}%)</TableCell>
                    <TableCell>Angsuran</TableCell>
                    {isDisbursed && <TableCell>Lunas Tanggal</TableCell>}
                </TableRow>
            </TableHead>
            <TableBody>
                <TableRow>
                    <TableCell>0</TableCell>
                    {isDisbursed && transaction && (
                        <TableCell>{toDmy(transaction.at)}</TableCell>
                    )}
                    <TableCell>{numberToCurrency(proposed_rp)}</TableCell>
                    <TableCell />
                    <TableCell />
                    <TableCell />
                    {isDisbursed && <TableCell />}
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
                            interest_rp={interest_rp}
                            isDisbursed={isDisbursed}
                        />
                    )
                })}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell
                        colSpan={isDisbursed ? 3 : 2}
                        align="center"
                        component="th">
                        TOTAL
                    </TableCell>
                    <TableCell component="th">
                        {numberToCurrency(base_rp * n_term)}
                    </TableCell>
                    <TableCell component="th">
                        {numberToCurrency(interest_rp * n_term)}
                    </TableCell>
                    <TableCell component="th">
                        {numberToCurrency(installment_amount * n_term)}
                    </TableCell>
                    {isDisbursed && <TableCell />}
                </TableRow>
            </TableFooter>
        </Table>
    )
}

function InstallmentTableRow({
    data,
    remaining_rp,
    base_rp,
    interest_rp,
    isDisbursed = false,
}: {
    data: InstallmentWithTransactionType
    remaining_rp: number
    base_rp: number
    interest_rp: number
    isDisbursed: boolean
}) {
    const { n_th, should_be_paid_at, transaction, amount_rp } = data

    return (
        <TableRow>
            <TableCell>{n_th}</TableCell>
            {isDisbursed && <TableCell>{toDmy(should_be_paid_at)}</TableCell>}
            <TableCell>
                {numberToCurrency(remaining_rp < 0 ? 0 : remaining_rp)}
            </TableCell>
            <TableCell>{numberToCurrency(base_rp)}</TableCell>
            <TableCell>{numberToCurrency(interest_rp)}</TableCell>
            <TableCell>{numberToCurrency(amount_rp)}</TableCell>
            {isDisbursed && (
                <TableCell
                    sx={{
                        color: transaction?.at ? 'success.main' : 'error.main',
                    }}>
                    {transaction?.at ? toDmy(transaction.at) : '-'}
                </TableCell>
            )}
        </TableRow>
    )
}
