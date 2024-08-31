// types
import type ProductMovement from '@/dataTypes/mart/ProductMovement'
// vendors
import { type FormikProps } from 'formik'
// components
import FormikForm, { DateField, TextField } from '@/components/FormikForm'
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

            <DateField name="at" label="Tanggal" disabled={true} />

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
