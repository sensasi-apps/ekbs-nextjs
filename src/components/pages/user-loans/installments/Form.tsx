// types

import type { UUID } from 'node:crypto'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import dayjs, { extend } from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import type { FormikContextType } from 'formik'
// vendors
import { memo } from 'react'
import FormikForm from '@/components/formik-form'
import SelectFromApi from '@/components/Global/SelectFromApi'
import LoadingCenter from '@/components/loading-center'
import type InstallmentORM from '@/modules/installment/types/orms/installment'
import { CashableClassname } from '@/modules/transaction/types/orms/transaction'
import type { Ymd } from '@/types/date-string'
import numberToCurrency from '@/utils/number-to-currency'
// utils
import toDmy from '@/utils/to-dmy'
// components
import CrediturCard from '../creditor-card'
// local components
import TypographyWithLabel from '../SummaryBox/TypographyWithLabel'

extend(relativeTime)

export default function UserLoanInstallmentForm({
    values,
    isSubmitting,
    status,
    setFieldValue,
    errors,
}: FormikContextType<UserLoanInstallmentFormDataType>) {
    const installment = status?.userLoanInstallment as InstallmentORM
    const user = installment.user_loan?.user
    const isProcessing = isSubmitting
    const isPaid = Boolean(installment?.transaction)
    const isDisabled = isProcessing || isPaid

    const isPaidWithWallet =
        CashableClassname.UserCash ===
        installment?.transaction?.cashable_classname

    if (!user) return <LoadingCenter />

    return (
        <FormikForm
            dirty={!isPaid}
            id="user-loan-installment-form"
            isNew={false}
            processing={isProcessing}
            slotProps={{
                submitButton: {
                    disabled: isDisabled,
                },
            }}
            submitting={isSubmitting}>
            <CrediturCard data={user} />

            <Box display="flex" flexDirection="column" gap={1} my={3}>
                <DueInfo
                    isPaid={isPaid}
                    shouldBePaidAt={installment.should_be_paid_at}
                />

                <TypographyWithLabel
                    component="div"
                    label="Tagihan:"
                    variant="h4">
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
                    disabled={isDisabled}
                    endpoint="/data/cashes"
                    error={Boolean(errors.cashable_cash_uuid)}
                    helperText={errors.cashable_cash_uuid as string}
                    label="Telah dibayar ke Kas"
                    margin="dense"
                    onChange={event =>
                        setFieldValue(
                            'cashable_cash_uuid',
                            'value' in event.target ? event.target.value : '',
                        )
                    }
                    required
                    selectProps={{
                        name: 'cashable_cash_uuid',
                        value: values.cashable_cash_uuid,
                    }}
                    size="small"
                />
            )}

            {isPaid && (
                <Box mt={2}>
                    <TypographyWithLabel
                        color="success.main"
                        label="Pada tanggal">
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
                    color={unpaidFromNowColor}
                    component="div"
                    variant="caption">
                    {dayjs(shouldBePaidAt).fromNow()}
                </Typography>
            )}
        </TypographyWithLabel>
    )
})
