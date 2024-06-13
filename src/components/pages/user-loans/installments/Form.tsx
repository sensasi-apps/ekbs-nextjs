// types
import { CashableClassname } from '@/dataTypes/Transaction'
import type { UUID } from 'crypto'
import type { FormikContextType } from 'formik'
import type {
    InstallmentUserLoan,
    InstallmentWithTransactionType,
} from '@/dataTypes/Installment'
import type { Ymd } from '@/types/DateString'
// vendors
import { memo } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
// components
import CrediturCard from '../CrediturCard'
import SelectFromApi from '@/components/Global/SelectFromApi'
import FormikForm from '@/components/FormikForm'
// local components
import TypographyWithLabel from '../SummaryBox/TypographyWithLabel'
// utils
import toDmy from '@/utils/toDmy'
import numberToCurrency from '@/utils/numberToCurrency'
import dayjs, { extend } from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

extend(relativeTime)

export default function UserLoanInstallmentForm({
    values,
    isSubmitting,
    status,
    setFieldValue,
    errors,
}: FormikContextType<UserLoanInstallmentFormDataType>) {
    const installment = status?.userLoanInstallment as InstallmentUserLoan &
        InstallmentWithTransactionType
    const user = installment.user_loan.user
    const isProcessing = isSubmitting
    const isPaid = Boolean(installment?.transaction)
    const isDisabled = isProcessing || isPaid

    const isPaidWithWallet =
        CashableClassname.UserCash ===
        installment?.transaction?.cashable_classname

    return (
        <FormikForm
            id="user-loan-installment-form"
            dirty={true && !isPaid}
            submitting={isSubmitting}
            processing={isProcessing}
            isNew={false}
            slotProps={{
                submitButton: {
                    disabled: isDisabled,
                },
            }}>
            <CrediturCard data={user} />

            <Box display="flex" flexDirection="column" gap={1} my={3}>
                <DueInfo
                    shouldBePaidAt={installment.should_be_paid_at}
                    isPaid={isPaid}
                />

                <TypographyWithLabel
                    label="Tagihan:"
                    variant="h4"
                    component="div">
                    {numberToCurrency(installment.amount_rp)}
                </TypographyWithLabel>

                <TypographyWithLabel label="Angsuran ke-">
                    {installment.n_th}
                </TypographyWithLabel>
            </Box>

            {isPaidWithWallet ? (
                <TypographyWithLabel label="Telah dibayar melaui:">
                    e-KBS Wallet
                </TypographyWithLabel>
            ) : (
                <SelectFromApi
                    required
                    endpoint="/data/cashes"
                    label="Telah dibayar ke Kas"
                    size="small"
                    margin="dense"
                    disabled={isDisabled}
                    selectProps={{
                        value: values.cashable_cash_uuid,
                        name: 'cashable_cash_uuid',
                    }}
                    error={Boolean(errors.cashable_cash_uuid)}
                    helperText={errors.cashable_cash_uuid as string}
                    onChange={event =>
                        setFieldValue(
                            'cashable_cash_uuid',
                            'value' in event.target ? event.target.value : '',
                        )
                    }
                />
            )}

            {isPaid && (
                <Box mt={2}>
                    <TypographyWithLabel
                        label="Pada tanggal"
                        color="success.main">
                        {installment?.transaction?.at
                            ? toDmy(installment?.transaction?.at)
                            : ''}
                    </TypographyWithLabel>
                </Box>
            )}
        </FormikForm>
    )
}

type UserLoanInstallmentFormDataType = {
    cashable_cash_uuid: UUID | ''
}

export const UserLoanInstallmentFormInitialValues: UserLoanInstallmentFormDataType =
    {
        cashable_cash_uuid: '',
    }

const DueInfo = memo(function DueInfo({
    shouldBePaidAt,
    isPaid,
}: {
    shouldBePaidAt: Ymd
    isPaid: boolean
}) {
    const dueDiffMs = dayjs(shouldBePaidAt).diff()
    const isOverdue = dueDiffMs < 0
    const isInAWeek = dueDiffMs < 7 * 24 * 60 * 60 * 1000 && !isOverdue
    const unpaidFromNowColor = isOverdue
        ? 'error.main'
        : isInAWeek
          ? 'warning.main'
          : undefined

    return (
        <TypographyWithLabel label="Jatuh Tempo:">
            {toDmy(shouldBePaidAt)}

            {!isPaid && (
                <Typography
                    variant="caption"
                    component="div"
                    color={unpaidFromNowColor}>
                    {dayjs(shouldBePaidAt).fromNow()}
                </Typography>
            )}
        </TypographyWithLabel>
    )
})
