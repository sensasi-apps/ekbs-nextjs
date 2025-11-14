// types

// vendors
import Typography from '@mui/material/Typography'
// components
import SimpleDialog from '@/components/simple-dialog'
import type UserLoanORM from '@/modules/installment/types/orms/user-loan'
// utils
import numberToCurrency from '@/utils/number-to-currency'
import type { UserLoanFormDataType } from './Form/types'
// children components
import UserLoanInstallmentDialogTable from './InstallmentDialog/Table'

export default function UserLoanInstallmentDialog({
    data: loanValues,
    isProcessing,
}: {
    data: UserLoanORM | UserLoanFormDataType
    isProcessing: boolean
}) {
    const { proposed_rp, interest_percent, n_term, term_unit } = loanValues

    const isRequiredDataNotFilled =
        !proposed_rp || interest_percent === '' || !n_term

    // if (isRequiredDataNotFilled) return null

    const hasInstallments =
        'installments' in loanValues &&
        (loanValues.installments?.length ?? 0) > 0
    const installment_amount = isRequiredDataNotFilled
        ? 0
        : Math.ceil(
              proposed_rp / n_term + (proposed_rp * interest_percent) / 100,
          )

    return (
        <SimpleDialog
            maxWidth="md"
            slotProps={{
                buttonProps: {
                    children: hasInstallments
                        ? 'Tabel Angsuran'
                        : 'Tabel Simulasi Angsuran',
                    disabled: isProcessing || isRequiredDataNotFilled,
                },
            }}
            title={
                hasInstallments ? 'Tabel Angsuran' : 'Tabel Simulasi Angsuran'
            }>
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

                <Typography mb={2} variant="body1">
                    Pinjaman{' '}
                    <strong>{numberToCurrency(proposed_rp || 0)}</strong> dengan
                    biaya jasa <strong>{interest_percent}%</strong> selama{' '}
                    <strong>{n_term}</strong> {term_unit} memiliki angsuran:{' '}
                    <strong>{numberToCurrency(installment_amount)}</strong>/
                    {term_unit}
                </Typography>

                <Typography variant="caption">
                    *Nilai rupiah yang berbentuk desimal telah dibulatkan untuk
                    memudahkan proses perhitungan dan pembayaran
                </Typography>
            </div>
        </SimpleDialog>
    )
}
