// vendors

// materials
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import FormLabel from '@mui/material/FormLabel'
import MuiRadio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import { Field, type FieldProps } from 'formik'

export default function Radio({
    disabled,
    label,
    name,
    options,
    required,
}: {
    disabled?: boolean
    label: string
    name: string
    required?: boolean
    options: {
        label: string
        value: string
    }[]
}) {
    return (
        <Field name={name} required={required}>
            {({
                field: { value, onChange, name },
                meta: { error },
                form: { isSubmitting },
            }: FieldProps) => (
                <FormControl
                    disabled={disabled || isSubmitting}
                    error={Boolean(error)}
                    fullWidth
                    margin="dense"
                    required={required}>
                    <FormLabel required={required}>{label}</FormLabel>

                    <RadioGroup
                        name={name}
                        onChange={onChange}
                        row
                        value={value ?? null}>
                        {options.map(option => (
                            <FormControlLabel
                                control={<MuiRadio />}
                                key={option.value}
                                label={option.label}
                                required={required}
                                value={option.value}
                            />
                        ))}
                    </RadioGroup>

                    <FormHelperText>{error}</FormHelperText>
                </FormControl>
            )}
        </Field>
    )
}
