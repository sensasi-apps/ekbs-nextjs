import type { InputBaseComponentProps } from '@mui/material/InputBase'
import { forwardRef } from 'react'
import type { NumericFormatProps } from 'react-number-format'

import { NumericFormat as MainFormatter } from 'react-number-format'

export default forwardRef<NumericFormatProps, InputBaseComponentProps>(
    function NumericFormat(props, ref) {
        return (
            <MainFormatter
                decimalScale={4}
                decimalSeparator=","
                getInputRef={ref}
                thousandSeparator="."
                valueIsNumericString={true}
                {...(props as NumericFormatProps)}
            />
        )
    },
)
