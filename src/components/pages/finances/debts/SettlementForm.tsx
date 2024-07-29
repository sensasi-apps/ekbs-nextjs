// types
import type { UUID } from 'crypto'
import type DebtDetail from '@/dataTypes/DebtDetail'
import type Transaction from '@/dataTypes/Transaction'
// vendors
import { Field, FieldProps, FormikProps } from 'formik'
// components
import FormikForm, {
    DateField,
    NumericField,
    TextField,
    TxTagField,
} from '@/components/FormikForm'
import SelectFromApi from '@/components/Global/SelectFromApi'
// utils
import shortUuid from '@/utils/uuidToShort'
import errorsToHelperTextObj from '@/utils/errorsToHelperTextObj'

export default function SettlementForm({
    dirty,
    status,
    isSubmitting,
}: FormikProps<FormValuesType>) {
    if (!status) {
        throw new Error('status is required')
    }

    const typedStatus = status as DebtDetail

    const isNew = Boolean(typedStatus.uuid)
    const isDisabled = isSubmitting

    return (
        <FormikForm
            id="debt-settlement-form"
            autoComplete="off"
            isNew={isNew}
            dirty={dirty}
            processing={isSubmitting}
            submitting={isSubmitting}
            slotProps={{
                submitButton: {
                    disabled: isDisabled,
                },
            }}>
            <TextField
                name="uuid"
                label="Kode"
                disabled
                value={shortUuid(typedStatus.uuid as UUID)}
                textFieldProps={{
                    margin: 'normal',
                    variant: 'filled',
                    required: false,
                }}
            />

            <Field name="cashable_uuid">
                {({
                    field: { name, onChange, value },
                    meta: { error },
                }: FieldProps<UUID>) => (
                    <SelectFromApi
                        required
                        endpoint="/data/cashes"
                        label="Kas"
                        size="small"
                        margin="dense"
                        disabled={isDisabled}
                        selectProps={{
                            value: value ?? '',
                            name: name,
                        }}
                        onChange={onChange}
                        {...errorsToHelperTextObj(error)}
                    />
                )}
            </Field>

            <DateField name="paid" label="Tanggal" disabled={isDisabled} />
            <NumericField name="rp" label="Total Bayar" disabled={isDisabled} />

            <TxTagField
                name="tag"
                label="Akun"
                disabled={isDisabled}
                type="expense"
            />
        </FormikForm>
    )
}

export type FormValuesType = {
    paid?: DebtDetail['paid']
    rp: DebtDetail['rp']
    cashable_uuid?: Transaction['cashable_uuid']
    tag?: Transaction['tags'][0]
}
