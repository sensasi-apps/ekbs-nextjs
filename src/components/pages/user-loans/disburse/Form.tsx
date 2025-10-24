// types

import Box from '@mui/material/Box'
import type { UUID } from 'crypto'
import type { FastFieldProps, FormikContextType } from 'formik'
import { FastField } from 'formik'
// vendors
import { memo } from 'react'
import FormikForm from '@/components/formik-form'
import SelectFromApi from '@/components/Global/SelectFromApi'
import type UserLoanORM from '@/modules/installment/types/orms/user-loan'
// components
import CrediturCard from '../creditor-card'
import UserLoanSummaryBoxProposedAt from '../SummaryBox/ProposedAt'
// local components
import UserLoanSummaryBoxProposedRp from '../SummaryBox/ProposedRp'
import UserLoanSummaryBoxReviewers from '../SummaryBox/Reviewers'
import TypographyWithLabel from '../SummaryBox/TypographyWithLabel'

export default function UserLoanDisburseForm({
    isSubmitting,
    status,
}: FormikContextType<FormValuesType>) {
    const userLoan = status?.userLoan as UserLoanORM
    const isDisbursed = Boolean(userLoan.transaction)
    const hasResponses = (userLoan.responses?.length ?? 0) > 0
    const isProcessing = isSubmitting
    const isDisabled =
        isProcessing || isDisbursed || !hasResponses || !userLoan.is_approved

    return (
        <FormikForm
            dirty={true}
            id="user-loan-disburse-form"
            isNew={false}
            processing={isProcessing}
            slotProps={{
                submitButton: {
                    disabled: isDisabled,
                },
            }}
            submitting={isSubmitting}>
            <CrediturCard data={userLoan.user} />

            <SummaryBox data={userLoan} />

            <FastField name="cashable_uuid">
                {({
                    field: { name, value, onChange },
                    meta: { error },
                }: FastFieldProps) => (
                    <SelectFromApi
                        disabled={isDisabled}
                        endpoint="/data/cashes"
                        error={Boolean(error)}
                        helperText={error}
                        label="Telah dicairkan dari Kas"
                        onChange={onChange}
                        required
                        selectProps={{
                            name: name,
                            value: value ?? '',
                        }}
                        size="small"
                    />
                )}
            </FastField>
        </FormikForm>
    )
}

export type FormValuesType = Partial<{
    cashable_uuid: UUID
}>

const SummaryBox = memo(function SummaryBox({
    data: { proposed_rp, proposed_at, type, responses },
}: {
    data: UserLoanORM
}) {
    return (
        <Box display="flex" flexDirection="column" gap={1} my={3}>
            <UserLoanSummaryBoxProposedRp proposedRp={proposed_rp} />

            <UserLoanSummaryBoxProposedAt proposedAt={proposed_at} />

            <TypographyWithLabel label="Jenis:">{type}</TypographyWithLabel>

            <UserLoanSummaryBoxReviewers responses={responses ?? []} />
        </Box>
    )
})
