// types
import type { UUID } from 'crypto'
import type { FormikContextType, FastFieldProps } from 'formik'
import type { UserLoanType } from '@/dataTypes/Loan'
// vendors
import { FastField, Form } from 'formik'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
// components
import CrediturCard from '../CrediturCard'
import UserLoanSummaryBox from '../SummaryBox'
import FormResetButton from '@/components/form/ResetButton'
import FormSubmitButton from '@/components/form/SubmitButton'
import FormLoadingBar from '@/components/Dialog/LoadingBar'

export default function UserLoanReviewForm({
    values,
    dirty,
    isSubmitting,
    status,
}: FormikContextType<FormDataType>) {
    const userLoan = status?.userLoan as UserLoanType
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
                            margin="dense"
                            required
                            disabled={isDisabled}>
                            <FormLabel id="is_approved">
                                Persetujuan Anda
                            </FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="is_approved"
                                {...field}
                                onChange={e =>
                                    setFieldValue(
                                        field.name,
                                        e.currentTarget.value === 'true',
                                    )
                                }>
                                <FormControlLabel
                                    value={true}
                                    control={<Radio required />}
                                    label="Diterima"
                                />
                                <FormControlLabel
                                    value={false}
                                    control={<Radio />}
                                    label="Ditolak"
                                />
                            </RadioGroup>
                        </FormControl>
                    )}
                </FastField>

                <div
                    style={{
                        display: 'flex',
                        gap: '0.5em',
                        marginTop: '2em',
                        justifyContent: 'end',
                    }}>
                    <FormResetButton
                        dirty={dirty}
                        disabled={isProcessing}
                        form="user-loan-review-form"
                    />

                    <FormSubmitButton
                        oldDirty={isOldDirty}
                        disabled={isDisabled || !dirty}
                        loading={isSubmitting}
                        form="user-loan-review-form"
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
