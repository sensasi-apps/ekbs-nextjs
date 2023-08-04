import { forwardRef } from 'react'
import { NumericFormat } from 'react-number-format'
import PropTypes from 'prop-types'

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
            {...other}
        />
    )
})

NumericMasking.propTypes = {
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
}

export default NumericMasking
