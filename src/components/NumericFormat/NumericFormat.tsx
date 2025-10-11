// types
import type { TextFieldProps } from '@mui/material/TextField'
// vendors
import { memo } from 'react'
import {
    NumericFormat as VendorNumericFormat,
    type NumericFormatProps as VendorNumericFormatProps,
} from 'react-number-format'
// components
import TextField from '@/components/TextField'

export type NumericFormatProps = VendorNumericFormatProps<TextFieldProps>

/**
 * A component that formats numeric input with options for negative values, thousand separator, decimal separator, and custom input component.
 * @param allowNegative - Whether to allow negative values. Default is false.
 * @param thousandSeparator - The character used as thousand separator. Default is '.'.
 * @param decimalSeparator - The character used as decimal separator. Default is ','.
 * @param customInput - The custom input component to use. Default is TextField.
 * @param inputProps - The input props to pass to the custom input component. Default is { minLength: 1, maxLength: 19 }.
 * @returns A formatted numeric input component.
 */
const NumericFormat = memo(function NumericFormat({
    allowNegative = false,
    thousandSeparator = '.',
    decimalSeparator = ',',
    customInput = TextField,
    inputProps = {
        maxLength: 19,
        minLength: 1,
    },
    ...props
}: NumericFormatProps) {
    return (
        <VendorNumericFormat
            allowNegative={allowNegative}
            customInput={customInput}
            decimalSeparator={decimalSeparator}
            inputProps={inputProps}
            thousandSeparator={thousandSeparator}
            {...props}
        />
    )
})

export default NumericFormat
