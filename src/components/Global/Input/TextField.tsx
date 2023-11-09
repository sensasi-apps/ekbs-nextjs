// types
import type { TextFieldProps } from '@mui/material/TextField'
// vendors
import MuiTextField from '@mui/material/TextField'

/**
 * A custom text field component that wraps around MuiTextField.
 * default props:
 * - required
 * - fullWidth
 * - size="small"
 * - margin="dense"
 * @param props The TextFieldProps object containing the properties for the text field.
 * @returns A JSX element representing the text field.
 */
export default function TextField(props: TextFieldProps) {
    return (
        <MuiTextField
            required
            fullWidth
            size="small"
            margin="dense"
            {...props}
        />
    )
}
