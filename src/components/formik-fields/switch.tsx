// vendors
import { Field, type FieldProps } from 'formik'
// materials
import FormGroup from '@mui/material/FormGroup'
import FormLabel from '@mui/material/FormLabel'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import MuiSwitch from '@mui/material/Switch'

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
                        id={name + '-switch'}
                        name={name}
                        checked={value}
                        disabled={disabled || isSubmitting}
                        control={<MuiSwitch />}
                        onChange={onChange}
                        label={switchLabel}
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
