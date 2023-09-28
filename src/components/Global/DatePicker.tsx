import { FC } from 'react'

import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import {
    DatePicker as MuiDatePicker,
    DatePickerProps as MuiDatePickerProps,
} from '@mui/x-date-pickers/DatePicker'
import 'moment/locale/id'
import moment, { Moment } from 'moment'

type valueType = Moment | string | null
type defaultValueType = Moment | null | undefined

const valueProcessor = (value?: valueType): defaultValueType => {
    if (typeof value === 'string') {
        return moment(value)
    }

    return value
}

interface DatePickerProps
    extends Omit<MuiDatePickerProps<Moment>, 'value' | 'defaultValue'> {
    value?: valueType
    defaultValue?: valueType
}

const DatePicker: FC<DatePickerProps> = ({ value, defaultValue, ...props }) => {
    return (
        <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="id">
            <MuiDatePicker
                format="DD-MM-YYYY"
                value={valueProcessor(value)}
                defaultValue={valueProcessor(defaultValue)}
                {...props}
            />
        </LocalizationProvider>
    )
}

export default DatePicker
