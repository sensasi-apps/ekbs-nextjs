// vendors
import { Field, type FieldProps } from 'formik'
// materials
import FormGroup from '@mui/material/FormGroup'
import FormLabel from '@mui/material/FormLabel'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import MuiCheckbox from '@mui/material/Checkbox'

export default function Checkbox({
    label,
    innerLabel,
    name,
    required,
}: {
    disabled?: boolean
    label?: string
    innerLabel?: string
    name: string
    required?: boolean
}) {
    return (
        <Field name={name} required={required}>
            {({
                field: { onChange, name, value },
                meta: { error },
            }: FieldProps<boolean>) => (
                <FormGroup>
                    {label && (
                        <FormLabel required={required}>{label}</FormLabel>
                    )}

                    <FormControlLabel
                        id={name + '-checkbox'}
                        name={name}
                        checked={Boolean(value)}
                        control={<MuiCheckbox />}
                        onChange={onChange}
                        label={innerLabel}
                        slotProps={{
                            typography: {
                                color: value ? undefined : 'text.disabled',
                            },
                        }}
                    />

                    {error && <FormHelperText error>{error}</FormHelperText>}
                </FormGroup>
            )}
        </Field>
    )
}
