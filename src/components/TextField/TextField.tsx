// types
import type { TextFieldProps } from '@mui/material/TextField'
// vendors
import MuiTextField from '@mui/material/TextField'

/**
 * A custom text field component that wraps Material UI's TextField component.
 * @param required Default is true.
 * @param fullWidth Default is true.
 * @param size Default is 'small'.
 * @param margin Default is 'dense'.
 * @param props TextFieldProps.
 */
export default function TextField({
    required = true,
    fullWidth = true,
    size = 'small',
    margin = 'dense',
    ...props
}: TextFieldProps) {
    return (
        <MuiTextField
            required={required}
            fullWidth={fullWidth}
            size={size}
            margin={margin}
            {...props}
        />
    )
}
