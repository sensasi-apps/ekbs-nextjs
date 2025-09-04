// vendors
import { Field, type FieldProps } from 'formik'
import Autocomplete from '@mui/material/Autocomplete'
// components
import txAccounts from '@/modules/transaction/statics/tx-accounts'
import TextField from '@/components/TextField'
// utils
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'

export default function TxTagField({
    name,
    label,
    disabled,
    type,
}: {
    name: string
    label: string
    disabled: boolean
    type: 'income' | 'expense'
}) {
    return (
        <Field name={name}>
            {({
                field: { name, value },
                meta: { error },
                form: { setFieldValue },
            }: FieldProps<string>) => (
                <Autocomplete
                    id={name}
                    options={txAccounts[type]}
                    value={value ?? null}
                    disabled={disabled}
                    onChange={(_, newValue) => setFieldValue(name, newValue)}
                    renderInput={params => (
                        <TextField
                            {...params}
                            label={label}
                            name={name}
                            {...errorsToHelperTextObj(error)}
                        />
                    )}
                />
            )}
        </Field>
    )
}
