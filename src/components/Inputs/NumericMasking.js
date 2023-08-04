import PropTypes from 'prop-types'

import { forwardRef } from 'react'
import { NumericFormat } from 'react-number-format'

const NumericMasking = forwardRef(function NumericMasking(props, ref) {
    const { onChange, ...other } = props

    return (
        <NumericFormat
            getInputRef={ref}
            onValueChange={values => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value,
                    },
                })
            }}
            decimalSeparator=","
            thousandSeparator="."
            valueIsNumericString
            allowNegative={false}
            {...other}
        />
    )
})

NumericMasking.propTypes = {
    name: PropTypes.string,
    onChange: PropTypes.func,
}

export default NumericMasking
