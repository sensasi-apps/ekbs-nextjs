// vendors

import FormControlLabel from '@mui/material/FormControlLabel'
// materials
import FormGroup from '@mui/material/FormGroup'
import FormHelperText from '@mui/material/FormHelperText'
import FormLabel from '@mui/material/FormLabel'
import MuiSwitch from '@mui/material/Switch'
import { Field, type FieldProps } from 'formik'

export default function Switch({
    disabled,
    label,
    switchLabel,
    name,
    required,
}: {
    disabled?: boolean
    label?: string
    switchLabel?: string
    name: string
    required?: boolean
}) {
    return (
        <Field name={name} required={required}>
            {({
                field: { onChange, name, value },
                meta: { error },
                form: { isSubmitting },
            }: FieldProps<boolean>) => (
                <FormGroup>
                    {label && (
                        <FormLabel required={required}>{label}</FormLabel>
                    )}

                    <FormControlLabel
                        checked={value}
                        control={<MuiSwitch />}
                        disabled={disabled || isSubmitting}
                        id={name + '-switch'}
                        label={switchLabel}
                        name={name}
                        onChange={onChange}
                        slotProps={{
                            typography: {
                                color: value ? undefined : 'text.disabled',
                            },
                        }}
                    />

                    {error && <FormHelperText>{error}</FormHelperText>}
                </FormGroup>
            )}
        </Field>
    )
}
