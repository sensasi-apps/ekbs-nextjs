import { useEffect, useState } from 'react'

import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker as DatePickerMui } from '@mui/x-date-pickers/DatePicker'
import 'moment/locale/id'

import PropTypes from 'prop-types'
import moment from 'moment'

function DatePicker({
    name,
    required,
    fullWidth,
    margin,
    size,
    error: extError,
    helperText,
    value,
    defaultValue,
    ...props
}) {
    const [error, setError] = useState(null)

    useEffect(() => {
        if (extError) {
            setError('Ekternal error')
        } else {
            setError(null)
        }
    }, [extError])

    return (
        <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="id">
            <DatePickerMui
                format="DD-MM-YYYY"
                value={value ? moment(value) : undefined}
                defaultValue={defaultValue ? moment(defaultValue) : undefined}
                onError={err => setError(err)}
                slotProps={{
                    textField: {
                        error: Boolean(error),
                        helperText: helperText,
                        required,
                        fullWidth,
                        size,
                        margin,
                        name,
                    },
                }}
                {...props}
            />
        </LocalizationProvider>
    )
}

DatePicker.propTypes = {
    name: PropTypes.string,
    required: PropTypes.bool,
    fullWidth: PropTypes.bool,
    margin: PropTypes.number,
    size: PropTypes.PropTypes.oneOf(['small', 'medium']),
    error: PropTypes.bool,
    helperText: PropTypes.string,
    value: PropTypes.string,
    defaultValue: PropTypes.string,
}

export default DatePicker
