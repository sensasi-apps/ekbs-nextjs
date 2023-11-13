// types
import type InstallmentType from '@/dataTypes/Installment'
import type { InstallmentWithRelationType } from '@/dataTypes/Installment'
import type LoanType from '@/dataTypes/Loan'
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
    data: LoanType
}) {
    const { proposed_rp, interest_percent, n_term, term_unit, transaction } =
        loan

    if (
        !proposed_rp ||
        (!interest_percent && interest_percent !== 0) ||
        !n_term
    )
        return <i>Silahkan melengkapi data terlebih dahulu</i>

    const isActiveLoan = loan.installments.length > 0

    const base_rp = Math.ceil(proposed_rp / n_term)
    const interest_rp = Math.ceil((proposed_rp * interest_percent) / 100)

    const installments = isActiveLoan
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

    const installment_amount = installments[0].amount_rp

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>{term_unit} ke-</TableCell>
                    {isActiveLoan && <TableCell>Tanggal</TableCell>}
                    <TableCell>Sisa</TableCell>
                    <TableCell>Pokok</TableCell>
                    <TableCell>Jasa ({loan.interest_percent}%)</TableCell>
                    <TableCell>Angsuran</TableCell>
                    {isActiveLoan && <TableCell>Lunas Tanggal</TableCell>}
                </TableRow>
            </TableHead>
            <TableBody>
                <TableRow>
                    <TableCell>0</TableCell>
                    {isActiveLoan && (
                        <TableCell>
                            {transaction?.at ? toDmy(transaction.at) : ''}
                        </TableCell>
                    )}
                    <TableCell>{numberToCurrency(proposed_rp)}</TableCell>
                    <TableCell />
                    <TableCell />
                    <TableCell />
                    {isActiveLoan && <TableCell />}
                </TableRow>

                {installments.map(installment => {
                    return (
                        <InstallmentTableRow
                            key={installment.n_th}
                            data={installment}
                            remaining_rp={0}
                            base_rp={base_rp}
                            interest_rp={interest_rp}
                            isActiveLoan={isActiveLoan}
                        />
                    )
                })}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell
                        colSpan={isActiveLoan ? 3 : 2}
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
                    {isActiveLoan && <TableCell />}
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
    isActiveLoan = false,
}: {
    data: InstallmentWithRelationType
    remaining_rp: number
    base_rp: number
    interest_rp: number
    isActiveLoan: boolean
}) {
    const { n_th, should_be_paid_at, transaction, amount_rp } = data

    return (
        <TableRow>
            <TableCell>{n_th}</TableCell>
            {isActiveLoan && <TableCell>{toDmy(should_be_paid_at)}</TableCell>}
            <TableCell>
                {numberToCurrency(remaining_rp < 0 ? 0 : remaining_rp)}
            </TableCell>
            <TableCell>{numberToCurrency(base_rp)}</TableCell>
            <TableCell>{numberToCurrency(interest_rp)}</TableCell>
            <TableCell>{numberToCurrency(amount_rp)}</TableCell>
            {isActiveLoan && (
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
