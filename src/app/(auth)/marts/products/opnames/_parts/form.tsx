// types
import type ProductMovement from '@/modules/mart/types/orms/product-movement'
// vendors
import { type FormikProps } from 'formik'
// formik
import DateField from '@/components/formik-fields/date-field'
import FormikForm from '@/components/formik-form'
import TextField from '@/components/formik-fields/text-field'
// components
import TextFieldDefault from '@/components/TextField'

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
            id="product-opname-form"
            dirty={dirty}
            submitting={isSubmitting}
            processing={isSubmitting}
            isNew={!dataFromDb?.uuid}
            slotProps={{
                submitButton: {
                    disabled: !(dirty || isSubmitting),
                },
            }}>
            {dataFromDb?.short_uuid && (
                <TextFieldDefault
                    label="Kode"
                    disabled
                    required={false}
                    value={dataFromDb.short_uuid}
                />
            )}

            <DateField
                name="at"
                label="Tanggal"
                disabled
                datePickerProps={{
                    format: 'YYYY-MM-DD HH:mm',
                }}
            />

            <TextField
                name="note"
                label="Catatan"
                disabled={isDisabled}
                textFieldProps={{
                    required: false,
                    multiline: true,
                    minRows: 2,
                }}
            />
        </FormikForm>
    )
}

export type CreateFormValues = Partial<{
    at: ProductMovement['at']
    note: ProductMovement['note']
}>
