// types
import type LoanType from '@/dataTypes/Loan'
// vendors
import Typography from '@mui/material/Typography'
// components
import SimpleDialog from '@/components/SimpleDialog'
// children components
import UserLoanInstallmentDialogTable from './InstallmentDialog/Table'
// utils
import numberToCurrency from '@/utils/numberToCurrency'

export default function UserLoanInstallmentDialog({
    data: loanValues,
    isProcessing,
}: {
    data: LoanType
    isProcessing: boolean
}) {
    const { proposed_rp, interest_percent, n_term, term_unit } = loanValues

    const hasInstallments = loanValues.installments.length > 0
    const installment_amount = Math.ceil(
        proposed_rp / n_term + (proposed_rp * interest_percent) / 100,
    )

    return (
        <SimpleDialog
            title={
                hasInstallments ? 'Tabel Angsuran' : 'Tabel Simulasi Angsuran'
            }
            maxWidth="md"
            slotProps={{
                buttonProps: {
                    disabled: isProcessing,
                    children: hasInstallments
                        ? 'Tabel Angsuran'
                        : 'Tabel Simulasi Angsuran',
                },
            }}>
            <div
                style={{
                    overflowX: 'auto',
                }}>
                <UserLoanInstallmentDialogTable data={loanValues} />
            </div>

            <div
                style={{
                    marginTop: 16,
                }}>
                <Typography variant="caption">Ringkasan:</Typography>

                <Typography variant="body1" mb={2}>
                    Pinjaman <strong>{numberToCurrency(proposed_rp)}</strong>{' '}
                    dengan biaya jasa <strong>{interest_percent}%</strong> per{' '}
                    {term_unit} selama <strong>{n_term}</strong> {term_unit}{' '}
                    memiliki angsuran per {term_unit}:{' '}
                    <strong>{numberToCurrency(installment_amount)}</strong>
                </Typography>

                <Typography variant="caption">
                    *Nilai rupiah yang berbentuk desimal telah dibulatkan untuk
                    memudahkan proses perhitungan dan pembayaran
                </Typography>
            </div>
        </SimpleDialog>
    )
}
