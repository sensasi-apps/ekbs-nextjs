import type { NumericFormatProps } from 'react-number-format'

const numericFormatDefaultProps: {
    decimalSeparator: NumericFormatProps['decimalSeparator']
    thousandSeparator: NumericFormatProps['thousandSeparator']
    allowNegative: NumericFormatProps['allowNegative']
} = {
    decimalSeparator: ',',
    thousandSeparator: '.',
    allowNegative: false,
}

export default numericFormatDefaultProps
