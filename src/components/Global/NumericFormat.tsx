import type { InputBaseComponentProps } from '@mui/material/InputBase'
import type { NumericFormatProps } from 'react-number-format'

import { forwardRef } from 'react'

import { NumericFormat as MainFormatter } from 'react-number-format'

export default forwardRef<NumericFormatProps, InputBaseComponentProps>(
    function NumericFormat(props, ref) {
        return (
            <MainFormatter
                getInputRef={ref}
                decimalSeparator=","
                thousandSeparator="."
                valueIsNumericString={true}
                decimalScale={4}
                {...(props as NumericFormatProps)}
            />
        )
    },
)
