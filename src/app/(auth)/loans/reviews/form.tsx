// types

import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import type { UUID } from 'crypto'
import type { FastFieldProps, FormikContextType } from 'formik'
// vendors
import { FastField, Form } from 'formik'
import FormLoadingBar from '@/components/Dialog/LoadingBar'
import FormResetButton from '@/components/form/ResetButton'
import FormSubmitButton from '@/components/form/SubmitButton'
// components
import CrediturCard from '@/components/pages/user-loans/creditor-card'
import UserLoanSummaryBox from '@/components/pages/user-loans/SummaryBox'
import type UserLoanORM from '@/modules/installment/types/orms/user-loan'

export default function UserLoanReviewForm({
    values,
    dirty,
    isSubmitting,
    status,
}: FormikContextType<FormDataType>) {
    const userLoan = status?.userLoan as UserLoanORM
    const isNew = !values.uuid
    const isDisbursed = Boolean(userLoan.transaction)
    const isProcessing = isSubmitting
    const isDisabled = isProcessing || isDisbursed
    const isOldDirty = !isNew && dirty

    return (
        <>
            <FormLoadingBar in={isProcessing} />
            <Form autoComplete="off" id="user-loan-review-form">
                <CrediturCard data={userLoan.user} />

                <UserLoanSummaryBox data={userLoan} />

                <FastField name="is_approved">
                    {({ field, form: { setFieldValue } }: FastFieldProps) => (
                        <FormControl
                            disabled={isDisabled}
                            margin="dense"
                            required>
                            <FormLabel id="is_approved">
                                Persetujuan Anda
                            </FormLabel>
                            <RadioGroup
                                aria-labelledby="is_approved"
                                row
                                {...field}
                                onChange={e =>
                                    setFieldValue(
                                        field.name,
                                        e.currentTarget.value === 'true',
                                    )
                                }>
                                <FormControlLabel
                                    control={<Radio required />}
                                    label="Diterima"
                                    value={true}
                                />
                                <FormControlLabel
                                    control={<Radio />}
                                    label="Ditolak"
                                    value={false}
                                />
                            </RadioGroup>
                        </FormControl>
                    )}
                </FastField>

                <div
                    style={{
                        display: 'flex',
                        gap: '0.5em',
                        justifyContent: 'end',
                        marginTop: '2em',
                    }}>
                    <FormResetButton
                        dirty={dirty}
                        disabled={isProcessing}
                        form="user-loan-review-form"
                    />

                    <FormSubmitButton
                        disabled={isDisabled || !dirty}
                        form="user-loan-review-form"
                        loading={isSubmitting}
                        oldDirty={isOldDirty}
                    />
                </div>
            </Form>
        </>
    )
}

export type FormDataType = {
    uuid: UUID | ''
    user_loan_uuid: UUID
    is_approved: boolean | ''
}
