import { forwardRef } from 'react'

import {
    NumericFormat as MainFormatter,
    NumericFormatProps,
} from 'react-number-format'

const NumericFormat = (
    {
        decimalSeparator = ',',
        thousandSeparator = '.',
        valueIsNumericString = true,
        decimalScale = 4,
        ...props
    }: NumericFormatProps,
    ref: any,
) => {
    const defaultProps = {
        decimalSeparator,
        thousandSeparator,
        valueIsNumericString,
        decimalScale,
    }

    return <MainFormatter getInputRef={ref} {...defaultProps} {...props} />
}

export default forwardRef(NumericFormat)
