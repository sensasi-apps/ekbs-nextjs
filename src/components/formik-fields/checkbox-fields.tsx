// vendors
import { Field, type FieldProps } from 'formik'
// materials
import FormGroup from '@mui/material/FormGroup'
import FormLabel from '@mui/material/FormLabel'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import MuiCheckbox from '@mui/material/Checkbox'

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
                    type="checkbox"
                    name={name}
                    required={required}
                    value={value}>
                    {({ field, meta: { error } }: FieldProps) => {
                        return (
                            <>
                                <FormControlLabel
                                    disabled={disabled}
                                    id={name + '-checkbox'}
                                    control={<MuiCheckbox size="small" />}
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
