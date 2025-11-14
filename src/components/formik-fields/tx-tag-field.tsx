// vendors

import Autocomplete from '@mui/material/Autocomplete'
import { Field, type FieldProps } from 'formik'
import TextField from '@/components/text-field'
// components
import txAccounts from '@/modules/transaction/statics/tx-accounts'
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
                    disabled={disabled}
                    id={name}
                    onChange={(_, newValue) => setFieldValue(name, newValue)}
                    options={txAccounts[type]}
                    renderInput={params => (
                        <TextField
                            {...params}
                            label={label}
                            name={name}
                            {...errorsToHelperTextObj(error)}
                        />
                    )}
                    value={value ?? null}
                />
            )}
        </Field>
    )
}
