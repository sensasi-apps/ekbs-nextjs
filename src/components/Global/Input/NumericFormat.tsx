// types
import type { NumericFormatProps } from 'react-number-format'
import type { TextFieldProps } from '@mui/material/TextField'
// vendors
import { NumericFormat as VendorNumericFormat } from 'react-number-format'
// components
import TextField from './TextField'

/**
 * A component that formats numeric input using react-number-format library.
 * default props:
 * - allowNegative: false
 * - thousandSeparator: '.'
 * - decimalSeparator: ','
 * - customInput: TextField
 * - inputProps: { minLength: 1, maxLength: 19 }
 * @param props - The props for the NumericFormat component.
 * @returns A NumericFormat component.
 */
export default function NumericFormat<BaseType = TextFieldProps>(
    props: NumericFormatProps<BaseType>,
) {
    return (
        <VendorNumericFormat
            allowNegative={false}
            thousandSeparator="."
            decimalSeparator=","
            customInput={TextField}
            inputProps={{
                minLength: 1,
                maxLength: 19,
            }}
            {...props}
        />
    )
}
