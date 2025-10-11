// vendors

import MuiCheckbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
// materials
import FormGroup from '@mui/material/FormGroup'
import FormHelperText from '@mui/material/FormHelperText'
import FormLabel from '@mui/material/FormLabel'
import { Field, type FieldProps } from 'formik'

export default function CheckboxFields({
    disabled,
    label,
    name,
    required,
    options,
}: {
    disabled?: boolean
    label?: string
    name: string
    required?: boolean
    options: {
        label: string
        value?: string
    }[]
}) {
    return (
        <FormGroup
            sx={{
                mb: 1,
            }}>
            {label && <FormLabel required={required}>{label}</FormLabel>}

            {options.map(({ label, value }) => (
                <Field
                    key={label}
                    name={name}
                    required={required}
                    type="checkbox"
                    value={value}>
                    {({ field, meta: { error } }: FieldProps) => {
                        return (
                            <>
                                <FormControlLabel
                                    control={<MuiCheckbox size="small" />}
                                    disabled={disabled}
                                    id={name + '-checkbox'}
                                    label={label}
                                    {...field}
                                />

                                {error && (
                                    <FormHelperText error>
                                        {error}
                                    </FormHelperText>
                                )}
                            </>
                        )
                    }}
                </Field>
            ))}
        </FormGroup>
    )
}
