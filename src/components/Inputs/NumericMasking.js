import PropTypes from 'prop-types'

import { forwardRef } from 'react'
import { NumericFormat } from 'react-number-format'

const MainComponent = (props, ref) => {
    const { onChange, ...other } = props

    return (
        <NumericFormat
            getInputRef={ref}
            onValueChange={values => {
                if (onChange) {
                    onChange({
                        target: {
                            name: props.name,
                            value: values.value,
                        },
                    })
                }
            }}
            decimalSeparator=","
            thousandSeparator="."
            valueIsNumericString
            allowNegative={false}
            {...other}
        />
    )
}

const NumericMasking = forwardRef(MainComponent)

NumericMasking.propTypes = {
    name: PropTypes.string,
    onChange: PropTypes.func,
}

export default NumericMasking
