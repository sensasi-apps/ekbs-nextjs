// types
import type { UUID } from 'crypto'
import type { FormikContextType, FastFieldProps } from 'formik'
import type { UserLoanType } from '@/dataTypes/Loan'
// vendors
import { memo } from 'react'
import { FastField } from 'formik'
import Box from '@mui/material/Box'
// components
import CrediturCard from '../creditor-card'
import SelectFromApi from '@/components/Global/SelectFromApi'
import FormikForm from '@/components/FormikForm'
// local components
import UserLoanSummaryBoxProposedRp from '../SummaryBox/ProposedRp'
import UserLoanSummaryBoxProposedAt from '../SummaryBox/ProposedAt'
import TypographyWithLabel from '../SummaryBox/TypographyWithLabel'
import UserLoanSummaryBoxReviewers from '../SummaryBox/Reviewers'

export default function UserLoanDisburseForm({
    isSubmitting,
    status,
}: FormikContextType<FormValuesType>) {
    const userLoan = status?.userLoan as UserLoanType
    const isDisbursed = Boolean(userLoan.transaction)
    const hasResponses = userLoan.responses.length > 0
    const isProcessing = isSubmitting
    const isDisabled =
        isProcessing || isDisbursed || !hasResponses || !userLoan.is_approved

    return (
        <FormikForm
            id="user-loan-disburse-form"
            dirty={true}
            submitting={isSubmitting}
            processing={isProcessing}
            isNew={false}
            slotProps={{
                submitButton: {
                    disabled: isDisabled,
                },
            }}>
            <CrediturCard data={userLoan.user} />

            <SummaryBox data={userLoan} />

            <FastField name="cashable_uuid">
                {({
                    field: { name, value, onChange },
                    meta: { error },
                }: FastFieldProps) => (
                    <SelectFromApi
                        required
                        endpoint="/data/cashes"
                        label="Telah dicairkan dari Kas"
                        size="small"
                        disabled={isDisabled}
                        selectProps={{
                            value: value ?? '',
                            name: name,
                            margin: 'dense',
                        }}
                        error={Boolean(error)}
                        helperText={error}
                        onChange={onChange}
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
    data: UserLoanType
}) {
    return (
        <Box display="flex" flexDirection="column" gap={1} my={3}>
            <UserLoanSummaryBoxProposedRp proposedRp={proposed_rp} />

            <UserLoanSummaryBoxProposedAt proposedAt={proposed_at} />

            <TypographyWithLabel label="Jenis:">{type}</TypographyWithLabel>

            <UserLoanSummaryBoxReviewers responses={responses} />
        </Box>
    )
})
