// types
import type { UUID } from 'crypto'
// vendors
import { Field, type FieldProps, type FormikProps } from 'formik'
import DateField from '@/components/formik-fields/date-field'
import NumericField from '@/components/formik-fields/numeric-field'
import TextField from '@/components/formik-fields/text-field'
import TxTagField from '@/components/formik-fields/tx-tag-field'
// formik
import FormikForm from '@/components/formik-form'
import SelectFromApi from '@/components/Global/SelectFromApi'
import type TransactionORM from '@/modules/transaction/types/orms/transaction'
import type DebtDetailORM from '@/types/orms/debt-detail'
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'
// utils
import shortUuid from '@/utils/short-uuid'

export default function SettlementForm({
    dirty,
    status,
    isSubmitting,
}: FormikProps<FormValuesType>) {
    if (!status) {
        throw new Error('status is required')
    }

    const typedStatus = status as DebtDetailORM

    const isNew = Boolean(typedStatus.uuid)
    const isDisabled = isSubmitting

    return (
        <FormikForm
            autoComplete="off"
            dirty={dirty}
            id="debt-settlement-form"
            isNew={isNew}
            processing={isSubmitting}
            slotProps={{
                submitButton: {
                    disabled: isDisabled,
                },
            }}
            submitting={isSubmitting}>
            <TextField
                disabled
                label="Kode"
                name="uuid"
                textFieldProps={{
                    margin: 'normal',
                    required: false,
                    variant: 'filled',
                }}
                value={shortUuid(typedStatus.uuid as UUID)}
            />

            <Field name="cashable_uuid">
                {({
                    field: { name, onChange, value },
                    meta: { error },
                }: FieldProps<UUID>) => (
                    <SelectFromApi
                        disabled={isDisabled}
                        endpoint="/data/cashes"
                        label="Kas"
                        margin="dense"
                        onChange={onChange}
                        required
                        selectProps={{
                            name: name,
                            value: value ?? '',
                        }}
                        size="small"
                        {...errorsToHelperTextObj(error)}
                    />
                )}
            </Field>

            <DateField disabled={isDisabled} label="Tanggal" name="paid" />
            <NumericField disabled={isDisabled} label="Total Bayar" name="rp" />

            <TxTagField
                disabled={isDisabled}
                label="Akun"
                name="tag"
                type="expense"
            />
        </FormikForm>
    )
}

interface FormValuesType {
    paid?: DebtDetailORM['paid']
    rp: DebtDetailORM['rp']
    cashable_uuid?: TransactionORM['cashable_uuid']
    tag?: TransactionORM['tags'][number]
}
