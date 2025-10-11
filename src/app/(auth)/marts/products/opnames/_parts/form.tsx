// types

// vendors
import { type FormikProps } from 'formik'
// formik
import DateField from '@/components/formik-fields/date-field'
import TextField from '@/components/formik-fields/text-field'
import FormikForm from '@/components/formik-form'
// components
import TextFieldDefault from '@/components/TextField'
import type ProductMovement from '@/modules/mart/types/orms/product-movement'

export default function Form({
    isSubmitting,
    dirty,
    status,
}: FormikProps<CreateFormValues>) {
    const dataFromDb: ProductMovement = status

    const isDisabled =
        isSubmitting ||
        !!dataFromDb?.purchase?.received ||
        !!dataFromDb?.purchase?.paid

    return (
        <FormikForm
            dirty={dirty}
            id="product-opname-form"
            isNew={!dataFromDb?.uuid}
            processing={isSubmitting}
            slotProps={{
                submitButton: {
                    disabled: !(dirty || isSubmitting),
                },
            }}
            submitting={isSubmitting}>
            {dataFromDb?.short_uuid && (
                <TextFieldDefault
                    disabled
                    label="Kode"
                    required={false}
                    value={dataFromDb.short_uuid}
                />
            )}

            <DateField
                datePickerProps={{
                    format: 'YYYY-MM-DD HH:mm',
                }}
                disabled
                label="Tanggal"
                name="at"
            />

            <TextField
                disabled={isDisabled}
                label="Catatan"
                name="note"
                textFieldProps={{
                    minRows: 2,
                    multiline: true,
                    required: false,
                }}
            />
        </FormikForm>
    )
}

export type CreateFormValues = Partial<{
    at: ProductMovement['at']
    note: ProductMovement['note']
}>
