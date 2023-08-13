import Loan from '@/classes/loan'
import numberFormat from '@/lib/numberFormat'
import PropTypes from 'prop-types'

import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material'
import moment from 'moment'

const LoanInstallmentTable = ({ data: loan }) => {
    const { proposed_rp, interest_percent, n_term, term_unit, installments } =
        loan

    if (
        !proposed_rp ||
        (!interest_percent && interest_percent !== 0) ||
        !n_term
    )
        return <i>Silahkan melengkapi data terlebih dahulu</i>

    const interest_rp = Math.ceil((proposed_rp * interest_percent) / 100)
    const base = Math.ceil(proposed_rp / n_term)
    const installment_amount = installments?.amount || base + interest_rp

    const Rows = () => {
        const rows = [
            <TableRow key="0">
                <TableCell>0</TableCell>
                {loan.hasInstallments && (
                    <TableCell>
                        {moment(loan.transaction?.at).format('DD-MM-YYYY')}
                    </TableCell>
                )}
                <TableCell>{numberFormat(proposed_rp)}</TableCell>
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
            </TableRow>,
        ]

        let remaining = proposed_rp

        for (let i = 1; i <= n_term; i++) {
            const transactionAt = loan.installments[i - 1]?.transaction?.at
            remaining -= base
            rows.push(
                <TableRow key={i}>
                    <TableCell>{i}</TableCell>
                    {loan.hasInstallments && (
                        <TableCell>
                            {loan.installments[i - 1]?.should_be_paid_at.format(
                                'DD-MM-YYYY',
                            )}
                        </TableCell>
                    )}
                    <TableCell>
                        {numberFormat(remaining < 0 ? 0 : remaining)}
                    </TableCell>
                    <TableCell>{numberFormat(base)}</TableCell>
                    <TableCell>{numberFormat(interest_rp)}</TableCell>
                    <TableCell>{numberFormat(installment_amount)}</TableCell>
                    {loan.hasInstallments && (
                        <TableCell
                            sx={{
                                color: transactionAt
                                    ? 'success.main'
                                    : 'error.main',
                            }}>
                            {transactionAt
                                ? moment(transactionAt).format('DD-MM-YYYY')
                                : '-'}
                        </TableCell>
                    )}
                </TableRow>,
            )
        }

        return rows
    }

    return (
        <Table>
            <caption>
                <Typography variant="caption">Ringkasan:</Typography>

                <Typography variant="body1" mb={2}>
                    Pinjaman <strong>{numberFormat(proposed_rp)}</strong> dengan
                    biaya jasa <strong>{interest_percent}%</strong> per{' '}
                    {term_unit} selama <strong>{n_term}</strong> {term_unit}{' '}
                    memiliki angsuran per {term_unit}:
                    <strong>{numberFormat(installment_amount)}</strong>
                </Typography>

                <Typography variant="caption">
                    *Nilai rupiah yang berbentuk desimal telah dibulatkan untuk
                    memudahkan proses perhitungan dan pembayaran
                </Typography>
            </caption>
            <TableHead>
                <TableRow>
                    <TableCell>{term_unit} ke-</TableCell>
                    {loan.hasInstallments && <TableCell>Tanggal</TableCell>}
                    <TableCell>Sisa</TableCell>
                    <TableCell>Pokok</TableCell>
                    <TableCell>Jasa ({loan?.interest_percent}%)</TableCell>
                    <TableCell>Angsuran</TableCell>
                    {loan.hasInstallments && (
                        <TableCell>Lunas Tanggal</TableCell>
                    )}
                </TableRow>
            </TableHead>
            <TableBody>
                <Rows />
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell
                        colSpan={loan.hasInstallments ? 3 : 2}
                        align="center"
                        component="th">
                        TOTAL
                    </TableCell>
                    <TableCell component="th">
                        {numberFormat(base * n_term)}
                    </TableCell>
                    <TableCell component="th">
                        {numberFormat(interest_rp * n_term)}
                    </TableCell>
                    <TableCell component="th">
                        {numberFormat(installment_amount * n_term)}
                    </TableCell>
                    {loan.hasInstallments && <TableCell />}
                </TableRow>
            </TableFooter>
        </Table>
    )
}

LoanInstallmentTable.propTypes = {
    data: PropTypes.instanceOf(Loan).isRequired,
}

export default LoanInstallmentTable
