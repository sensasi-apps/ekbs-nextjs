// vendors
import { Field, type FieldProps } from 'formik'
// materials
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import FormLabel from '@mui/material/FormLabel'
import MuiRadio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'

export default function Radio({
    disabled,
    label,
    name,
    options,
    required,
}: {
    disabled: boolean
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
            }: FieldProps) => (
                <FormControl
                    error={Boolean(error)}
                    disabled={disabled}
                    fullWidth
                    required={required}
                    margin="dense">
                    <FormLabel required={required}>{label}</FormLabel>

                    <RadioGroup
                        row
                        value={value ?? null}
                        name={name}
                        onChange={onChange}>
                        {options.map(option => (
                            <FormControlLabel
                                key={option.value}
                                value={option.value}
                                required
                                control={<MuiRadio />}
                                label={option.label}
                            />
                        ))}
                    </RadioGroup>

                    <FormHelperText>{error}</FormHelperText>
                </FormControl>
            )}
        </Field>
    )
}
