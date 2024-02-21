// vendors
import { FastField, FastFieldProps, FormikProps } from 'formik'
// components
import FormikForm from '@/components/FormikForm'
import Payroll from '@/dataTypes/Payroll'
import TextFieldFastableComponent from '@/components/TextField/FastableComponent'
import DatePicker from '@/components/DatePicker'
// utils
import errorsToHelperTextObj from '@/utils/errorsToHelperTextObj'
import dayjs from 'dayjs'

export default function FinancesPayrollsForm({
    dirty,
    isSubmitting,
}: FormikProps<FormValues>) {
    const isNew = false
    const isDisabled = isSubmitting
    return (
        <FormikForm
            id="product-purchase-form"
            autoComplete="off"
            isNew={isNew}
            dirty={dirty}
            processing={isSubmitting}
            submitting={isSubmitting}
            slotProps={{
                submitButton: {
                    disabled: isSubmitting || isDisabled,
                },
            }}>
            <FastField name="at" label="Tanggal">
                {({
                    meta: { error, value },
                    form: { setFieldValue },
                }: FastFieldProps) => (
                    <DatePicker
                        value={value ? dayjs(value) : null}
                        disabled={isDisabled}
                        label="Tanggal"
                        onChange={date =>
                            setFieldValue(
                                'at',
                                date?.format('YYYY-MM-DD') || null,
                            )
                        }
                        slotProps={{
                            textField: {
                                ...errorsToHelperTextObj(error),
                            },
                        }}
                    />
                )}
            </FastField>

            <FastField
                name="note"
                label="Nama/Catatan"
                disabled={isDisabled}
                multiline
                rows={3}
                component={TextFieldFastableComponent}
            />
        </FormikForm>
    )
}

type FormValues = Partial<Omit<Payroll, 'uuid'>>
